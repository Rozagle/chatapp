import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axiosINSTANCE from "../lib/axios.js";
import toast from "react-hot-toast";
import { 
  Bell, 
  LogOut, 
  Menu, 
  Moon, 
  Search, 
  Send, 
  Settings, 
  User, 
  Phone, 
  Video, 
  MoreVertical,
  Paperclip,
  Smile
} from "lucide-react";

// Örnek Dummy Veriler (API bağlanana kadar görüntü için)
const DUMMY_USERS = [
  { id: 1, name: "Grizzly Bear", msg: "Hey! Want to get tacos?", time: "10:30 AM", avatar: "🐻", unread: 2 },
  { id: 2, name: "Panda", msg: "I dropped my phone again...", time: "09:15 AM", avatar: "🐼", unread: 0 },
  { id: 3, name: "Ice Bear", msg: "Ice Bear is ready.", time: "Yesterday", avatar: "🐻‍❄️", unread: 0 },
  { id: 4, name: "Chloe Park", msg: "Did you study for the test?", time: "Mon", avatar: "👩🏻‍🏫", unread: 5 },
];

const DUMMY_MESSAGES = [
  { id: 1, sender: "other", text: "Hey! Are we still on for tonight?", time: "10:30 AM" },
  { id: 2, sender: "me", text: "Absolutely! Can't wait.", time: "10:31 AM" },
  { id: 3, sender: "other", text: "Great, bring the games!", time: "10:32 AM" },
  { id: 4, sender: "me", text: "Ice Bear will bring the snacks.", time: "10:33 AM" },
  { id: 5, sender: "me", text: "Just kidding, I'll bring them.", time: "10:33 AM" },
];

const HomePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedChat, setSelectedChat] = useState(DUMMY_USERS[0]); // Varsayılan seçili kişi
  const [isDarkMode, setIsDarkMode] = useState(false); // Tema state'i (sadece UI için)

  // LOGOUT İŞLEMİ
  const { mutate: logout } = useMutation({
    mutationFn: async () => await axiosINSTANCE.post("/auth/logout"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate("/login");
      toast.success("Çıkış yapıldı 👋");
    },
    onError: () => toast.error("Çıkış yapılırken hata oluştu"),
  });

  return (
    <div className={`h-screen flex flex-col overflow-hidden ${isDarkMode ? "bg-gray-900" : "bg-[#f3f4f6]"}`}>
      
      {/* ---------------- NAVBAR ---------------- */}
      <nav className="h-20 bg-white border-b-4 border-black flex items-center justify-between px-6 z-20 shadow-sm shrink-0">
        
        {/* Logo Area */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black text-[#F4C724] rounded-lg flex items-center justify-center font-black text-xl transform hover:rotate-6 transition-transform cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)]">
            T
          </div>
          <span className="text-2xl font-black italic tracking-tighter hidden sm:block">TALKO</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          
          {/* Notification */}
          <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors group">
            <Bell size={24} className="stroke-2 group-hover:stroke-black" />
            <span className="absolute top-2 right-2 w-3 h-3 bg-[#F4C724] border-2 border-white rounded-full"></span>
          </button>

          {/* Theme Toggle */}
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <Moon size={24} className="stroke-2" />
          </button>

          {/* Profile */}
          <button className="flex items-center gap-2 pl-2 pr-4 py-1.5 bg-black text-white rounded-full hover:bg-[#F4C724] hover:text-black border-2 border-transparent hover:border-black transition-all">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-black border border-white">
              <User size={18} />
            </div>
            <span className="text-sm font-bold hidden md:block">Profile</span>
          </button>

          {/* Logout */}
          <button 
            onClick={logout}
            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors border-2 border-transparent hover:border-red-100"
            title="Log Out"
          >
            <LogOut size={24} className="stroke-2" />
          </button>
        </div>
      </nav>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* ---------------- SIDEBAR (CHAT LIST) ---------------- */}
        <aside className="w-full md:w-80 lg:w-96 bg-white border-r-4 border-black flex flex-col z-10">
          
          {/* Search Header */}
          <div className="p-5 border-b-2 border-gray-100">
            <h2 className="text-xl font-black uppercase italic mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search friends..." 
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-black rounded-xl font-bold text-sm focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all outline-none"
              />
            </div>
          </div>

          {/* User List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {DUMMY_USERS.map((user) => (
              <div 
                key={user.id}
                onClick={() => setSelectedChat(user)}
                className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer border-2 transition-all ${
                  selectedChat.id === user.id 
                    ? "bg-[#F4C724] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1" 
                    : "bg-white border-transparent hover:bg-gray-50 hover:border-gray-200"
                }`}
              >
                {/* Avatar */}
                <div className="w-12 h-12 bg-white border-2 border-black rounded-full flex items-center justify-center text-2xl shrink-0">
                  {user.avatar}
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-gray-900 truncate">{user.name}</h3>
                    <span className="text-xs font-bold text-gray-500">{user.time}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-500 truncate">{user.msg}</p>
                </div>

                {/* Unread Badge */}
                {user.unread > 0 && (
                  <div className="w-6 h-6 bg-black text-[#F4C724] rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                    {user.unread}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* ---------------- CHAT AREA (RIGHT) ---------------- */}
        <main className="flex-1 flex flex-col bg-[#f8f9fa] relative">
          
          {/* Chat Header */}
          <header className="h-20 bg-white border-b-2 border-gray-200 flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#F4C724] border-2 border-black rounded-full flex items-center justify-center text-2xl">
                {selectedChat.avatar}
              </div>
              <div>
                <h3 className="font-black text-lg leading-tight">{selectedChat.name}</h3>
                <span className="text-xs font-bold text-green-500 uppercase tracking-wider flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Online
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-500">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Phone size={20} /></button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Video size={20} /></button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><MoreVertical size={20} /></button>
            </div>
          </header>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {DUMMY_MESSAGES.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                <div 
                  className={`max-w-[70%] px-6 py-4 rounded-2xl border-2 font-medium shadow-sm relative ${
                    msg.sender === "me" 
                      ? "bg-black text-[#F4C724] border-black rounded-tr-none" 
                      : "bg-white text-gray-800 border-gray-200 rounded-tl-none"
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className={`text-[10px] absolute bottom-1 ${msg.sender === "me" ? "left-2 text-gray-500" : "right-2 text-gray-400"}`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white border-t-2 border-gray-200">
            <div className="flex items-center gap-2">
              <button className="p-3 text-gray-400 hover:text-black hover:bg-gray-100 rounded-xl transition-colors">
                <Paperclip size={20} />
              </button>
              
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  className="w-full pl-4 pr-10 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-black focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all outline-none font-medium"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#F4C724]">
                  <Smile size={20} />
                </button>
              </div>

              <button className="p-4 bg-black text-[#F4C724] rounded-xl hover:bg-[#F4C724] hover:text-black border-2 border-transparent hover:border-black transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none">
                <Send size={20} className="stroke-2" />
              </button>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default HomePage;