import User from '../models/User.js';
import FriendRequest from '../models/FriendRequest.js';



export async function getRecomendedUsers(req, res) {
  try {
    const currentUserId = req.user._id; // middleware'den gelen kullanıcı ID'si
    const currentUser = await User.findById(currentUserId);

    // Mevcut kullanıcının kontakları ve kendisi hariç tüm kullanıcıları al
    const recomendedUsers = await User.find({
        $and: [
            { _id: { $ne: currentUserId } }, // kendisi hariç
            { _id: { $nin: currentUser.contact } }, // kontakları hariç
            {isOnboarding: true} // sadece onboarding'i tamamlamış kullanıcılar
        ]
    });                        
    res.status(200).json(recomendedUsers);
    } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export async function getMyContacts(req, res) {
    try {
        const currentUserId = req.user._id; // middleware'den gelen kullanıcı ID'si
        const currentUser = await User.findById(currentUserId).select('contact').populate('contact', 'fullname profilePicture location '); 

        res.status(200).json(currentUser.contact);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }           
}

export async function sendFriendRequest(req, res) {

    try{
        const currentUserId = req.user._id;
        const { id : recipientId } = req.params;

        if (!recipientId) {
            return res.status(400).json({ message: 'Recipient ID is required.' });
        }

        if(recipientId.contact.includes(currentUserId)){
            return res.status(400).json({ message: 'This user is already in your contacts.' });
        }

        // user cannot send friend request to themselves
        if (currentUserId.toString() === recipientId) {
            return res.status(400).json({ message: 'You cannot send a friend request to yourself.' });
        }

        // Check if a friend request already exists
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { requester: currentUserId, recipient: recipientId },
                { requester: recipientId, recipient: currentUserId }
            ]
        });

        if (existingRequest) {
            return res.status(400).json({ message: 'Friend request already sent.' });
        }

        // Create a new friend request
        const newFriendRequest = await FriendRequest({
            requester: currentUserId,
            recipient: recipientId
        });

        await newFriendRequest.save();

        res.status(201).json({ message: 'Friend request sent successfully.', friendRequest: newFriendRequest });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export async function acceptFriendRequest(req, res) {
    try {
        const currentUserId = req.user._id;
        const { id : requesterId } = req.params;
        // Find the friend request
        const friendRequest = await FriendRequest.findOne(requesterId);

        if (!friendRequest) {
            return res.status(404).json({ message: 'Friend request not found.' });
        }

        // Update the friend request to be accepted
        friendRequest.status = 'accepted';
        await friendRequest.save();

        // Add both users to each other's contacts
        const currentUser = await User.findById(currentUserId);
        const requesterUser = await User.findById(requesterId);

        if (!currentUser.contact.includes(requesterId)) {
            currentUser.contact.push(requesterId);
            await currentUser.save();
        }

        if (!requesterUser.contact.includes(currentUserId)) {
            requesterUser.contact.push(currentUserId);
            await requesterUser.save();
        }

        res.status(200).json({ message: 'Friend request accepted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export async function getFriendRequest(req, res) {
    try {
        const currentUserId = req.user._id; 
        const incommingFriendRequests = await FriendRequest.find({ recipient: currentUserId, status: 'pending' })
            .populate('requester', 'fullname profilePicture location ');

        const acceptedFriendRequests = await FriendRequest.find({ recipient: currentUserId, status: 'accepted' })
            .populate('requester', 'fullname profilePicture location ');
        res.status(200).json({ incommingFriendRequests, acceptedFriendRequests });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export async function outgoingFriendRequest(req, res) {
    try {
        const currentUserId = req.user._id; 
        const outgoingFriendRequests = await FriendRequest.find({ requester: currentUserId, status: 'pending' })
            .populate('recipient', 'fullname profilePicture location ');        
        res.status(200).json(outgoingFriendRequests);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}