import { useState } from "react";
import Navbar from "../Components/Navbar.jsx";
import Sidebar from "../Components/Sidebar.jsx";
import ChatPage from "./ChatPage.jsx";

const HomePage = () => {

  // Mock Data
  const [chats, setChats] = useState([
    {
      id: 1,
      name: "Grizzly Bear",
      lastMessage: "Hey! Want to get tacos?",
      timestamp: "2026-01-26T10:30:00",
      avatarEmoji: "🐻",
      unreadCount: 2,
      messages: [
        {
          id: 1,
          sender: "other",
          text: "Are you hungry?",
          timestamp: "2024-05-20T10:25:00",
        },
        {
          id: 2,
          sender: "other",
          text: "Hey! Want to get tacos?",
          timestamp: "2024-05-20T10:30:00",
        },
      ],
    },
    {
      id: 2,
      name: "Panda",
      lastMessage: "I dropped my phone again...",
      timestamp: "2026-01-25T09:15:00",
      avatarEmoji: "🐼",
      unreadCount: 0,
      messages: [
        {
          id: 1,
          sender: "other",
          text: "I dropped my phone again...",
          timestamp: "2026-01-25T09:15:00",
        },
      ],
    },
    {
      id: 3,
      name: "Ice Bear",
      lastMessage: "Ice Bear is ready.",
      timestamp: "2024-06-20T09:15:00",
      avatarEmoji: "🐻‍❄️",
      unreadCount: 3,
      messages: [],
    },
    {
      id: 4,
      name: "Chloe Park",
      lastMessage: "language barriers are so frustrating...",
      timestamp: "2024-05-20T09:15:00",
      avatarEmoji: "👩🏻‍🏫",
      unreadCount: 7,
      messages: [],
    },
  ]);

  const [selectedChat, setSelectedChat] = useState(null);
  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    // Unread count'u sıfırla ve state'i güncelle
    if (chat.unreadCount > 0) {
      setChats((prev) =>
        prev.map((c) => (c.id === chat.id ? { ...c, unreadCount: 0 } : c)),
      );
    }
  };

  const handleSendMessage = (messageData) => {
    if (!selectedChat) return;

    // Metin ve Dosyaları Tek Kalıba Alıyoruz Sonra Ayırıyoruz
    const { text, attachments } = messageData; 

    const newMessage = {
      id: Date.now(),
      sender: "me",
      text: text,
      attachments: attachments || [],
      timestamp: new Date().toISOString(),
    };

    setChats((prev) =>
      prev.map((c) => {
        if (c.id === selectedChat.id) {
          const updatedChat = {
            ...c,
            messages: [...(c.messages || []), newMessage],
            lastMessage:
              text || (attachments?.length > 0 ? "Sent an attachment" : ""),
            timestamp: new Date().toISOString(),
          };
          setSelectedChat(updatedChat);
          return updatedChat;
        }
        return c;
      }),
    );
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-base-100">
      <Navbar />

      <div className="flex flex-1 overflow-hidden relative">
        <div
          className={`w-full md:w-80 lg:w-96 border-r-4 border-base-content flex flex-col z-10 
          ${selectedChat ? "hidden md:flex" : "flex"}
        `}
        >
          <Sidebar
            chats={chats}
            selectedChat={selectedChat}
            setSelectedChat={handleChatSelect}
          />
        </div>

        <main
          className={`flex-1 flex flex-col bg-[#f8f9fa] relative
           ${!selectedChat ? "hidden md:flex" : "flex"}
        `}
        >
          {selectedChat ? (
            <ChatPage
              chat={selectedChat}
              onSendMessage={handleSendMessage}
              onBack={() => setSelectedChat(null)} // Mobilde geri dönmek için
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <span className="text-6xl mb-4">💬</span>
              <p className="text-xl font-bold">
                Select a chat to start messaging
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default HomePage;