import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosINSTANCE from "../lib/axios.js";
import toast from "react-hot-toast";
import {
  UsersRound,
  Bell,
  LogOut,
  User,
  Palette,
  ChevronDown,
} from "lucide-react";
import { useAuthUser } from "../Hooks/useAuthUser.jsx";
import Theme from "./Theme.jsx";

const Navbar = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { authUser } = useAuthUser();

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

  console.log("authUser in Navbar:", authUser.profilePicture);
  console.log("authUser in Navbar:", authUser);

  const avatars = [
    "🐻",
    "🐼",
    "🐻‍❄️",
    "🐨",
    "🐯",
    "🦁",
    "🐷",
    "🐸",
    "🐵",
    "🦊",
    "🐰",
    "🐔",
    "🐧",
    "🐢",
    "🐙",
    "🦄",
    "🐝",
    "🐬",
    "🐴",
    "🐺",
    "🦉",
    "🐗",
    "🐛",
    "🦖",
    "🐠",
    "🐳",
    "🦋",
    "🐞",
    "🐐",
    "🦥",
    "🦦",
    "🦨",
    "🦩",
    "🐓",
    "🦃",
    "🦢",
    "🦫",
    "🦦",
    "🐕",
    "🐈",
  ];
  return (
    <nav className="h-20 bg-base-100 border-b-4 border-base-content flex items-center justify-between px-4 sm:px-8 z-50 relative">
      <Link
        to="/"
        className="flex items-center gap-3 hover:scale-105 transition-transform"
      >
        <div className="w-10 h-10 bg-black text-[#F4C724] rounded-lg flex items-center justify-center font-black text-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)]">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-full h-full"
          >
            <path d="M12 2C6.477 2 2 6.477 2 12C2 14.225 2.73 16.279 3.965 17.942L3 22L7.058 21.035C8.583 21.657 10.25 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z" />
            <rect x="7" y="10" width="3" height="1.5" fill="black" />
            <rect x="14" y="10" width="3" height="1.5" fill="black" />
            <path
              d="M9 15C10 16 14 16 15 15"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="black"
            />
          </svg>
        </div>
        <span className="text-2xl font-black italic tracking-tighter text-base-content hidden sm:block">
          TALKO
        </span>
      </Link>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Connections Linki */}
        <Link
          to="/friends"
          className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all group"
          title="Connections"
        >
          <div className="relative">
            <UsersRound
              size={24}
              className="group-hover:text-black transition-colors"
            />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 border border-black rounded-full"></span>
          </div>
          <span className="hidden md:block font-black uppercase italic text-sm tracking-tighter">
            Connections
          </span>
        </Link>

        {/* Theme Selector Component */}

        <Theme />

        {/* Notifications*/}
        <Link
          to="/notifications"
          className="relative btn btn-ghost btn-circle hover:bg-base-200 group"
        >
          <Bell
            size={24}
            className="stroke-2 group-hover:scale-110 transition-transform"
          />
          <span className="absolute top-2 right-2 w-3 h-3 bg-yellow-400 border-2 border-white rounded-full"></span>
        </Link>

        {/* Profile Gidiş*/}
        <Link
          to="/profile"
          className="flex items-center gap-2 pl-2 pr-4 py-1.5 bg-black text-white rounded-full hover:bg-yellow-400 hover:text-black border-2 border-transparent hover:border-black transition-all group"
        >
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-black border border-white group-hover:border-black overflow-hidden">
            {authUser?.profilePicture ? (
              <img
                src={authUser.profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={
                  avatars.map((avatar, index) => ({
                    avatar,
                    index,
                  }))[authUser?.avatarIndex || 0].avatar
                }
                alt="avatar"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <span className="text-sm font-bold hidden md:block">
            {authUser?.fullname}
          </span>
        </Link>

        {/* LOGOUT */}
        <button
          onClick={logout}
          className="btn btn-ghost btn-circle text-error hover:bg-gray-50"
          title="Log Out"
        >
          <LogOut size={24} className="stroke-2" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
