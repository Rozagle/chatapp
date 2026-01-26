import Navbar from "../Components/Navbar";
import { Search, MessageCircle, UserMinus, MoreHorizontal } from "lucide-react";
import { useState } from "react";

// Mock data
const DUMMY_FRIENDS = [
  { id: 1, name: "Grizzly Bear", username: "@grizzly", status: "online", avatar: "🐻" },
  { id: 2, name: "Panda", username: "@panpan", status: "offline", avatar: "🐼" },
  { id: 3, name: "Ice Bear", username: "@iceice", status: "online", avatar: "🐻‍❄️" },
  { id: 4, name: "Chloe Park", username: "@chloe_p", status: "online", avatar: "👩🏻‍🏫" },
  { id: 5, name: "Nom Nom", username: "@nomnom_official", status: "offline", avatar: "🐨" },
];

const FriendsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Arama filtresi
  const filteredFriends = DUMMY_FRIENDS.filter(friend => 
    friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    friend.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col bg-[#f8f9fa] overflow-hidden">
      
      <Navbar />

      <div className="flex-1 overflow-y-auto p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Header*/}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-black italic uppercase tracking-tighter">My Friends</h1>
              <p className="text-gray-500 font-bold text-sm">You have {DUMMY_FRIENDS.length} friends</p>
            </div>

            {/* Arama Kutusu */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search friends..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border-2 border-black rounded-xl font-bold text-sm focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all outline-none"
              />
            </div>
          </div>

          {/* Arkadaşlarım Listesi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFriends.map((friend) => (
              <div 
                key={friend.id} 
                className="bg-white border-2 border-black rounded-2xl p-4 flex items-center gap-4 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-200 group"
              >
                <div className="relative">
                  <div className="w-16 h-16 bg-gray-100 rounded-full border-2 border-black flex items-center justify-center text-3xl">
                    {friend.avatar}
                  </div>
                  {/* Online Durumu */}
                  <span className={`absolute bottom-0 right-0 w-4 h-4 border-2 border-white rounded-full ${friend.status === 'online' ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                </div>

                {/* Bilgileri */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-lg truncate">{friend.name}</h3>
                  <p className="text-gray-500 text-sm font-bold truncate">{friend.username}</p>
                  <p className={`text-xs font-bold uppercase mt-1 ${friend.status === 'online' ? 'text-green-600' : 'text-gray-400'}`}>
                    {friend.status}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    className="p-2 bg-black text-[#F4C724] rounded-lg hover:bg-[#F4C724] hover:text-black border-2 border-transparent hover:border-black transition-all"
                    title="Send Message"
                  >
                    <MessageCircle size={20} />
                  </button>
                  
                  <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreHorizontal size={20} />
                    </div>
                    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white border-2 border-black rounded-box w-40 mt-2">
                        <li>
                            <a className="font-bold text-red-500 hover:bg-red-50 hover:text-red-600 flex gap-2">
                                <UserMinus size={16} /> Unfriend
                            </a>
                        </li>
                    </ul>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {filteredFriends.length === 0 && (
            <div className="text-center py-20 opacity-50">
                <div className="text-6xl mb-4">🤔</div>
                <h3 className="text-xl font-black italic">No friends found</h3>
                <p>Try searching for a different name.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default FriendsPage;