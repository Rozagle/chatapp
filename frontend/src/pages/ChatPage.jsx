import { useEffect, useRef, useState } from "react";
import {
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Send,
  ArrowLeft,
  X,
  File,
  Download,
  PlayCircle,
  Music,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import EmojiPicker from "emoji-picker-react";

// URL Ayıklama
const extractUrl = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const match = text.match(urlRegex);
  return match ? match[0] : null;
};

// Linkleri Tıklanabilir Yapma
const Linkify = ({ text }) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return (
    <span>
      {parts.map((part, i) =>
        urlRegex.test(part) ? (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800 break-all cursor-pointer z-10 relative"
          >
            {part}
          </a>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </span>
  );
};

// Tarihi formatla 
const formatDateLabel = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();

  // Saatleri sıfırla, sadece günleri kıyasla
  const d1 = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const d2 = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Bugün";
  if (diffDays === 1) return "Dün";
  if (diffDays <= 7) {
    return date.toLocaleDateString("tr-TR", { weekday: "long" });
  }
  return date.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// lightbox bileşeni
const Lightbox = ({ images, startIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  const handleNext = (e) => {
    e?.stopPropagation();
    if (currentIndex < images.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = (e) => {
    e?.stopPropagation();
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  if (!images || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-50"
      >
        <X size={32} />
      </button>

      {currentIndex > 0 && (
        <button
          onClick={handlePrev}
          className="absolute left-2 md:left-8 text-white p-3 rounded-full bg-white/10 hover:bg-white/20 hover:scale-110 transition-all z-50 backdrop-blur-sm"
        >
          <ChevronLeft size={40} />
        </button>
      )}

      <div
        className="relative max-w-[95vw] max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={currentImage.url}
          alt="Full view"
          className="max-w-full max-h-[85vh] object-contain rounded-md shadow-2xl"
        />

        <div className="absolute -bottom-12 left-0 right-0 flex justify-between items-center text-white px-2">
          <span className="text-sm font-medium text-gray-400">
            {currentIndex + 1} / {images.length}
          </span>
          <a
            href={currentImage.url}
            download={currentImage.name} //Dosyayı Açıklama olduğu gibi indirsin
            className="flex items-center gap-2 hover:text-[#F4C724] font-bold transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Download size={20} /> Download
          </a>
        </div>
      </div>

      {currentIndex < images.length - 1 && (
        <button
          onClick={handleNext}
          className="absolute right-2 md:right-8 text-white p-3 rounded-full bg-white/10 hover:bg-white/20 hover:scale-110 transition-all z-50 backdrop-blur-sm"
        >
          <ChevronRight size={40} />
        </button>
      )}
    </div>
  );
};


const ChatPage = ({ chat, onSendMessage, onBack }) => {
  const [messageInput, setMessageInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [lightboxData, setLightboxData] = useState({
    isOpen: false,
    images: [],
    startIndex: 0,
  });

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages, selectedFiles]);

  const handleEmojiClick = (emojiObject) => {
    setMessageInput((prev) => prev + emojiObject.emoji);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newFiles = files.map((file) => ({
        file,
        type: file.type.split("/")[0],
        url: URL.createObjectURL(file),
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + " MB",
      }));
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
    e.target.value = "";
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!messageInput.trim() && selectedFiles.length === 0) return;

    onSendMessage({
      text: messageInput,
      attachments: selectedFiles,
    });

    setMessageInput("");
    setShowEmojiPicker(false);
    setSelectedFiles([]);
  };

  const renderMessageContent = (msg) => {
    const hasAttachments = msg.attachments && msg.attachments.length > 0;
    const images = hasAttachments
      ? msg.attachments.filter((a) => a.type === "image")
      : [];
    const others = hasAttachments
      ? msg.attachments.filter((a) => a.type !== "image")
      : [];
    const urlInText = msg.text ? extractUrl(msg.text) : null;

    return (
      <div className="space-y-2 max-w-full">
        {/* Resim Gridi */}
        {images.length > 0 && (
          <div
            className={`grid gap-1 rounded-lg overflow-hidden ${
              images.length === 1 ? "grid-cols-1" : "grid-cols-2"
            }`}
          >
            {images.slice(0, 4).map((img, idx) => (
              <div
                key={idx}
                className="relative aspect-square cursor-pointer group bg-gray-100"
                onClick={() =>
                  setLightboxData({
                    isOpen: true,
                    images: images,
                    startIndex: idx,
                  })
                }
              >
                <img
                  src={img.url}
                  alt="attachment"
                  className="w-full h-full object-cover"
                />

                {idx === 3 && images.length > 4 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-black text-xl z-10">
                    +{images.length - 3}
                  </div>
                )}

                <a
                  href={img.url}
                  download={img.name}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 z-10"
                >
                  <Download className="text-white drop-shadow-md" />
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Diğer Kısımlar */}
        {others.length > 0 && (
          <div className="space-y-1">
            {others.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg border border-black/10"
              >
                <div className="w-10 h-10 bg-gray-800 text-white rounded flex items-center justify-center shrink-0">
                  {file.type === "video" ? (
                    <PlayCircle size={24} />
                  ) : file.type === "audio" ? (
                    <Music size={24} />
                  ) : (
                    <FileText size={24} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate text-gray-800">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 uppercase">
                    {file.type} • {file.size}
                  </p>
                </div>
                <a
                  href={file.url}
                  download={file.name}
                  className="p-2 bg-white rounded-full shadow hover:bg-gray-200 text-black"
                >
                  <Download size={16} />
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Metin Kısmı */}
        {msg.text && (
          <p className="whitespace-pre-wrap break-words break-all text-sm sm:text-base leading-relaxed">
            <Linkify text={msg.text} />
          </p>
        )}

        {/* Link Kısmı*/}
        {urlInText && (
          <div className="mt-2 rounded-xl overflow-hidden bg-gray-50 border border-gray-200">
            <div className="h-32 bg-gray-200 flex items-center justify-center relative">
              {urlInText.includes("youtube") ||
              urlInText.includes("instagram") ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                  <PlayCircle
                    size={48}
                    className="text-white drop-shadow-lg opacity-80"
                  />
                </div>
              ) : (
                <span className="text-gray-400 font-bold text-4xl italic select-none">
                  LINK
                </span>
              )}
              <img
                src={`https://www.google.com/s2/favicons?domain=${extractUrl(urlInText)}&sz=128`}
                className="absolute bottom-2 left-2 w-6 h-6 rounded bg-white p-0.5 shadow-sm"
                alt="favicon"
              />
            </div>
            <div className="p-3">
              <p className="text-xs font-bold text-gray-500 uppercase mb-1">
                {new URL(urlInText).hostname}
              </p>
              <a
                href={urlInText}
                target="_blank"
                className="text-sm font-black text-black line-clamp-1 hover:underline"
              >
                Visit Link
              </a>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] relative">
      {lightboxData.isOpen && (
        <Lightbox
          images={lightboxData.images}
          startIndex={lightboxData.startIndex}
          onClose={() => setLightboxData({ ...lightboxData, isOpen: false })}
        />
      )}

      {/* Header */}
      <header className="h-20 bg-base-100 border-b-2 border-base-300 flex items-center justify-between px-4 sm:px-6 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="w-12 h-12 bg-[#F4C724] border-2 border-black rounded-full flex items-center justify-center text-2xl overflow-hidden">
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
          <div>
            <h3 className="font-black text-lg leading-tight text-base-content">
              {chat.name}
            </h3>
            <span className="text-xs font-bold text-success uppercase tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>{" "}
              Online
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-3 text-gray-500">
          <button className="p-2 hover:bg-base-200 rounded-full transition-colors hidden sm:block">
            <Phone size={20} />
          </button>
          <button className="p-2 hover:bg-base-200 rounded-full transition-colors hidden sm:block">
            <Video size={20} />
          </button>
          <button className="p-2 hover:bg-base-200 rounded-full transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
      </header>

      {/* Chat Akışı*/}
      <div
        className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar bg-[#f3f4f6]"
        onClick={() => setShowEmojiPicker(false)}
      >
        {chat.messages &&
          chat.messages.map((msg, index) => {
            const prevMsg = chat.messages[index - 1];
            const isNewDay =
              !prevMsg ||
              new Date(msg.timestamp).toDateString() !==
                new Date(prevMsg.timestamp).toDateString();

            return (
              <div key={msg.id}>
                {isNewDay && (
                  <div className="flex justify-center my-6 sticky top-2 z-10">
                    <span className="bg-black/40 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm backdrop-blur-sm select-none border border-white/10">
                      {formatDateLabel(msg.timestamp)}
                    </span>
                  </div>
                )}

                {/* Mesaj Kutucuğu*/}
                <div
                  className={`flex mb-4 ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[60%] px-4 py-3 sm:px-5 sm:py-4 rounded-2xl border-2 shadow-sm relative transition-all ${
                      msg.sender === "me"
                        ? "bg-black text-[#F4C724] border-black rounded-tr-none"
                        : "bg-white text-gray-800 border-gray-200 rounded-tl-none"
                    }`}
                  >
                    {renderMessageContent(msg)}

                    <span
                      className={`text-[10px] block text-right mt-1 opacity-60 font-bold ${msg.sender === "me" ? "text-gray-400" : "text-gray-400"}`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-base-100 border-t-2 border-base-300 relative z-30">
        {selectedFiles.length > 0 && (
          <div className="mb-3 flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {selectedFiles.map((fileObj, idx) => (
              <div
                key={idx}
                className="relative w-20 h-20 shrink-0 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 overflow-hidden group"
              >
                {fileObj.type === "image" ? (
                  <img
                    src={fileObj.url}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-1 text-center bg-white">
                    <File size={20} />
                    <span className="text-[9px] truncate w-full mt-1 font-bold">
                      {fileObj.type}
                    </span>
                  </div>
                )}
                <button
                  onClick={() => handleRemoveFile(idx)}
                  className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors shadow-sm"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {showEmojiPicker && (
          <div className="absolute bottom-24 right-4 z-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl border-2 border-black overflow-hidden bg-white">
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              theme="light"
              searchDisabled={false}
              width={300}
              height={400}
            />
          </div>
        )}

        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
          />

          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="p-3 text-gray-400 hover:text-black hover:bg-gray-100 rounded-xl transition-colors hidden sm:block tooltip tooltip-top font-bold"
            data-tip="Add Files"
          >
            <Paperclip size={20} />
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message..."
              className="w-full pl-4 pr-10 py-3 sm:py-4 bg-base-200 border-2 border-base-300 rounded-xl focus:border-black focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all outline-none font-medium text-base-content placeholder-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${showEmojiPicker ? "text-[#F4C724]" : "text-gray-400 hover:text-[#F4C724]"}`}
            >
              <Smile size={20} />
            </button>
          </div>

          <button
            type="submit"
            disabled={!messageInput.trim() && selectedFiles.length === 0}
            className="p-3 sm:p-4 bg-black text-[#F4C724] rounded-xl hover:bg-[#F4C724] hover:text-black border-2 border-transparent hover:border-black transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} className="stroke-2" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;