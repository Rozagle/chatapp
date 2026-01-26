import { Search } from "lucide-react";
import { useState, useMemo } from "react";

const Sidebar = ({ chats, selectedChat, setSelectedChat }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Bu kısım her render'da (veya chats/searchQuery değiştiğinde) çalışır.
  const processedChats = useMemo(() => {
    // A) Önce Arama Filtresi (İsim veya Mesaj İçeriği)
    const filtered = chats.filter(
      (chat) =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    // B) Sonra Sıralama (En yeni tarih en üstte)
    // Not: Tarih formatının karşılaştırılabilir olması gerekir (ISO string veya Date objesi)
    return filtered.sort((a, b) => {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
  }, [chats, searchQuery]);

  return (
    <aside className="w-full md:w-80 lg:w-96 bg-base-100 border-r-4 border-base-content flex flex-col h-full z-10">
      <div className="p-5 border-b-2 border-base-200 shrink-0">
        <h2 className="text-2xl font-black uppercase italic mb-4 tracking-tighter">
          MESSAGES
        </h2>
        <div className="relative group">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-800 group-focus-within:text-black transition-colors"
            size={20}
          />
          <input
            type="text"
            placeholder="Search or start new chat"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-base-200 border-2 border-base-content rounded-xl font-bold text-sm focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all outline-none placeholder-gray-800"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        {processedChats.length === 0 ? (
          <div className="text-center text-gray-400 font-bold mt-10 italic">
            No chats found...
          </div>
        ) : (
          processedChats.map((chat) => {
            const isSelected = selectedChat?.id === chat.id;

            return (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`relative flex items-center gap-4 p-4 rounded-2xl cursor-pointer border-2 transition-all duration-200 group
                  ${
                    isSelected
                      ? "bg-[#F4C724] border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] -translate-y-1 z-10"
                      : "bg-white border-transparent hover:bg-gray-50 hover:border-gray-200"
                  }
                `}
              >
                {/* Avatar */}
                <div
                  className={`w-12 h-12 rounded-full border-2 border-black flex items-center justify-center text-2xl bg-white shrink-0 overflow-hidden`}
                >
                  {/* Eğer resim varsa img, yoksa emoji/text */}
                  {chat.avatarUrl ? (
                    <img
                      src={chat.avatarUrl}
                      alt={chat.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{chat.avatarEmoji || chat.name[0]}</span>
                  )}
                </div>

                {/* Info Area */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3
                      className={`font-black text-base truncate ${isSelected ? "text-black" : "text-gray-900"}`}
                    >
                      {chat.name}
                    </h3>
                    <span
                      className={`text-xs font-bold ${isSelected ? "text-black/70" : "text-gray-400"}`}
                    >
                      {formatTime(chat.timestamp)}
                    </span>
                  </div>

                  <p
                    className={`text-sm font-semibold truncate ${isSelected ? "text-black/80" : "text-gray-500"}`}
                  >
                    {/* Arama yapılıyorsa ve mesajda geçiyorsa highlight yapılabilir, şimdilik düz gösteriyoruz */}
                    {chat.lastMessage}
                  </p>
                </div>

                {/* Unread Badge*/}
                {chat.unreadCount > 0 && (
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-sm
                    ${isSelected ? "bg-black text-[#F4C724]" : "bg-black text-[#F4C724]"}
                  `}
                  >
                    {chat.unreadCount}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};

//Zaman formatla (10:30 AM, Yesterday, vb.)
function formatTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();

  // Bugün mü?
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  // Dün mü?
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  // Daha eski
  return date.toLocaleDateString();
}

export default Sidebar;
