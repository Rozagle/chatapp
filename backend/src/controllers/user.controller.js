import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";
import { upsertUser } from "../lib/stream.js";

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      fullname,
      bio,
      language,
      learningLanguages,
      location,
      profilePicture,
    } = req.body;

    const updateData = {
      fullname,
      bio,
      language: language, 
      learningLanguages: learningLanguages,
      location,
      profilePicture,
      isOnboarding: true,
    };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    // Stream Güncelleme
    try {
      await upsertUser({
        id: updatedUser._id,
        name: updatedUser.fullname,
        image: updatedUser.profilePicture,
      });
    } catch (err) {
      console.error("Stream error:", err);
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ message: "Fullname already exists" });
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export async function getRecomendedUsers(req, res) {
  try {
    const currentUserId = req.user._id; // middleware'den gelen kullanıcı ID'si

    // Tüm arkadaşlık isteklerini bul (Gelen veya Giden)
    const existingRequests = await FriendRequest.find({
      $or: [{ requester: currentUserId }, { recipient: currentUserId }]
    });

    // Bu kişilerin ID'lerini topla
    const relatedUserIds = existingRequests.map(req => 
      req.requester.toString() === currentUserId.toString() ? req.recipient : req.requester
    );

    const currentUser = await User.findById(currentUserId);

    // Kendini + Arkadaşlarini + İstekleştiğin Kişileri listeden çıkar
    const excludeIds = [currentUserId, ...currentUser.friends, ...relatedUserIds];

    const recomendedUsers = await User.find({
      _id: { $nin: excludeIds },  // Kendini + Arkadaşlarini + İstekleştiğin Kişiler Hariç
      isOnboarding: true, // sadece onboarding'i tamamlamış kullanıcılar
    }).select("fullname profilePicture location");
    res.status(200).json(recomendedUsers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function getMyfriends(req, res) {
  try {
    const currentUserId = req.user._id; // middleware'den gelen kullanıcı ID'si
    const currentUser = await User.findById(currentUserId)
      .select("friends")
      .populate("friends", "fullname profilePicture location ");

    res.status(200).json(currentUser.friends || []);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function sendFriendRequest(req, res) {
  try {
    const currentUserId = req.user._id;
    const { id: recipientId } = req.params;

    if (currentUserId.toString() === recipientId) {
      return res.status(400).json({ message: "You cannot send a friend request to yourself." });
    }

    const recipientUser = await User.findById(recipientId);
    if (!recipientUser) return res.status(404).json({ message: "User not found." });
        // user cannot send friend request to themselves
    if (recipientUser.friends.includes(currentUserId)) {
      return res.status(400).json({ message: "This user is already in your friends." });
    }
        // Check if a friend request already exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { requester: currentUserId, recipient: recipientId },
        { requester: recipientId, recipient: currentUserId },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already sent or exists." });
    }

            // Create a new friend request
    const newFriendRequest = new FriendRequest({
      requester: currentUserId,
      recipient: recipientId,
    });

    await newFriendRequest.save();
    res.status(201).json({ message: "Friend request sent successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function acceptFriendRequest(req, res) {
  try {
    const currentUserId = req.user._id;
    const { id: requesterId } = req.params;

    // İstek var mı ve bana mı gelmiş kontrol et
    const friendRequest = await FriendRequest.findOne({
      requester: requesterId,
      recipient: currentUserId,
      status: "pending"
    });

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found." });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    // İki kullanıcıyı da birbirine ekle ($addToSet mükerrer kaydı önler)
    await User.findByIdAndUpdate(currentUserId, { $addToSet: { friends: requesterId } });
    await User.findByIdAndUpdate(requesterId, { $addToSet: { friends: currentUserId } });

    res.status(200).json({ message: "Friend request accepted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function getFriendRequest(req, res) {
  try {
    const currentUserId = req.user._id;
    const incommingFriendRequests = await FriendRequest.find({
      recipient: currentUserId,
      status: "pending",
    }).populate("requester", "fullname profilePicture location ");

    res.status(200).json(incommingFriendRequests);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function outgoingFriendRequest(req, res) {
  try {
    const currentUserId = req.user._id;
    const outgoingFriendRequests = await FriendRequest.find({
      requester: currentUserId,
      status: "pending",
    }).populate("recipient", "fullname profilePicture location ");
    res.status(200).json(outgoingFriendRequests);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function rejectFriendRequest(req, res) {
  try {
    const currentUserId = req.user._id;
    const { id: requesterId } = req.params;
        // Find the friend request
    const friendRequest = await FriendRequest.findOneAndDelete({
      requester: requesterId,
      recipient: currentUserId,
      status: "pending",
    });

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found." });
    }
        // Update the friend request to be rejected
        friendRequest.status = 'rejected';
        await friendRequest.save();  
        res.status(200).json({ message: "Friend request rejected and deleted." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}