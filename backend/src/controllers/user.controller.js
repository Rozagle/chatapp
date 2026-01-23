export async function getRecomendedUsers(req, res) {
  try {
    const currentUserId = req.user._id; // middleware'den gelen kullanıcı ID'si
    const currentUser = await User.findById(currentUserId);

    // Mevcut kullanıcının kontakları ve kendisi hariç tüm kullanıcıları al
    const recomendedUsers = await User.find({
      _id: { $nin: [currentUserId, ...currentUser.contact] }
    }).select('-password'); // Şifre alanını hariç tut                          
    res.status(200).json(recomendedUsers);
    } catch (error) {

    res.status(500).json({ message: 'Server error', error: error.message });
    }
}
export async function getMyContacts(req, res) {
    try {
        const currentUserId = req.user._id; // middleware'den gelen kullanıcı ID'si
        const currentUser = await User.findById(currentUserId).populate('contact', '-password'); // kontakları şifre hariç doldur

        res.status(200).json(currentUser.contact);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }           
}

