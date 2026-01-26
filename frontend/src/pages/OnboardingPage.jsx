import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosINSTANCE from "../lib/axios.js";
import toast from "react-hot-toast";

// Ayı görseli (public klasöründe Grizzly_Bear_Standing.webp dosyası olduğundan emin ol)
import bearImg from "/Grizzly_Bear_Standing.webp";

import { LANGUAGES } from "../constants/language.js";

// Geçici ülke listesi (gerçek COUNTRIES dosyası yoksa bunu kullan)
const COUNTRIES = [
  "Turkey", "United States", "United Kingdom", "Germany", "France",
  "Spain", "Italy", "Japan", "Brazil", "Canada", "Australia", "India",
  "Mexico", "South Korea", "Netherlands", "Sweden", "Poland", "Argentina",
  "Indonesia", "Egypt"
];

// İlgi alanları
const INTERESTS_LIST = [
  "Music", "Technology", "Travel", "Movies", "Food",
  "Sports", "Art", "Gaming", "Science", "Fashion"
];

const OnboardingPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Form verileri (location eklendi)
  const [formData, setFormData] = useState(() => ({
    bio: "",
    age: "",
    gender: "",
    location: "",
    language: "",
    learningLanguages: [], // String yerine boş dizi yapman daha sağlıklı
    interests: [],
    profilePicture: `https://avatar.iran.liara.run/public/${Math.floor(Math.random() * 100) + 1}`,
  }));

  // Ayı göz takibi
  const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 });
  const eyesContainerRef = useRef(null);

  // Avatar yenileme
  const refreshAvatar = () => {
    setFormData(prev => ({
      ...prev,
      profilePicture: `https://avatar.iran.liara.run/public/${Math.floor(Math.random() * 100) + 1}`,
    }));
  };

  // Input değişimi
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // İlgi alanı toggle
  const toggleInterest = (interest) => {
    setFormData((prev) => {
      if (prev.interests.includes(interest)) {
        return { ...prev, interests: prev.interests.filter((i) => i !== interest) };
      } else {
        return { ...prev, interests: [...prev.interests, interest] };
      }
    });
  };

  // Backend güncelleme
  const { mutate: UpdateUser, isPending } = useMutation({
    mutationFn: async (data) => {
            console.log("Onboarding response:", data);

      const response = await axiosINSTANCE.post("/auth/onboarding", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Profile completed! Welcome aboard.");
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    UpdateUser(formData);
  };

  const getLanguageName = (code) => LANGUAGES.find(l => l.code === code)?.name || "Select Language";

  // Göz takibi (performans için requestAnimationFrame eklendi)
  useEffect(() => {
    let rafId;
    const handleMouseMove = (e) => {
      if (!eyesContainerRef.current) return;

      const rect = eyesContainerRef.current.getBoundingClientRect();
      const eyesX = rect.left + rect.width / 2;
      const eyesY = rect.top + rect.height / 2;

      const angle = Math.atan2(e.clientY - eyesY, e.clientX - eyesX);
      const distance = Math.min(10, Math.hypot(e.clientX - eyesX, e.clientY - eyesY) / 10);

      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;

      rafId = requestAnimationFrame(() => {
        setPupilPos({ x, y });
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-[#f3f4f6]">
      <div className="flex flex-col lg:flex-row w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 min-h-[700px]">
        
        {/* SOL TARAF: FORM */}
        <div className="w-full lg:w-3/5 p-8 sm:p-10 lg:p-14 flex flex-col overflow-y-auto">
          <div className="flex items-center gap-3 mb-8">
            <h1 className="text-3xl font-black tracking-tighter italic text-black">Complete Your Profile</h1>
          </div>

          {/* Avatar */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-32 h-32 rounded-full border-4 border-yellow-400 p-1 mb-4 relative group">
              <img
                src={formData.profilePicture}
                alt="Avatar"
                className="w-full h-full rounded-full bg-gray-100 object-cover"
              />
              <button
                onClick={refreshAvatar}
                type="button"
                className="absolute bottom-0 right-0 bg-black text-white p-2 rounded-full shadow-lg hover:bg-yellow-500 hover:text-black transition-colors"
                title="Randomize Avatar"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Bio */}
            <div className="relative">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Bio</label>
              <textarea
                name="bio"
                rows="3"
                placeholder="Tell us a bit about yourself..."
                value={formData.bio}
                onChange={handleChange}
                className="w-full px-5 py-3 mt-1 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all text-sm font-semibold text-black resize-none placeholder:text-gray-400 placeholder:font-normal"
              />
            </div>

            {/* Age & Gender */}
            <div className="flex gap-4">
              <div className="w-1/3">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Age</label>
                <input
                  type="number"
                  name="age"
                  placeholder="25"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all text-sm font-medium text-slate-800"
                />
              </div>

              <div className="w-2/3">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Gender</label>
                <div className="dropdown w-full">
                  <div tabIndex={0} role="button" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl flex justify-between items-center text-sm font-medium text-slate-800 hover:bg-white hover:border-gray-300 transition-colors cursor-pointer">
                    {formData.gender ? formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1) : "Select Gender"}
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                  <ul tabIndex={0} className="dropdown-content z-[60] menu p-2 shadow-xl bg-white rounded-xl w-full mt-2 border border-gray-100">
                    {["Male", "Female", "Prefer not to say"].map((g) => (
                      <li key={g} onClick={() => {
                        handleChange({ target: { name: "gender", value: g.toLowerCase() } });
                        document.activeElement.blur();
                      }}>
                        <a className="hover:bg-yellow-50 text-slate-700 font-medium py-2 rounded-lg">{g}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Location</label>
              <div className="dropdown w-full">
                <div tabIndex={0} role="button" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl flex justify-between items-center text-sm font-medium text-slate-800 hover:bg-white hover:border-gray-300 transition-colors cursor-pointer">
                  <span className="truncate">{formData.location || "Select Country"}</span>
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>

                <div tabIndex={0} className="dropdown-content z-[55] p-2 shadow-2xl bg-white rounded-xl w-full mt-2 border border-gray-100 max-h-60 overflow-y-auto">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                    {COUNTRIES.map((country) => (
                      <button
                        key={country}
                        type="button"
                        onClick={() => {
                          handleChange({ target: { name: "location", value: country } });
                          document.activeElement.blur();
                        }}
                        className={`text-left px-3 py-2 rounded-lg text-sm transition-colors truncate ${
                          formData.location === country
                            ? "bg-black text-yellow-400 font-bold"
                            : "text-slate-600 hover:bg-yellow-50 hover:text-slate-900"
                        }`}
                      >
                        {country}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Languages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Native Language */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Native Language</label>
                <div className="dropdown w-full">
                  <div tabIndex={0} role="button" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl flex justify-between items-center text-sm font-medium text-slate-800 hover:bg-white hover:border-gray-300 transition-colors cursor-pointer">
                    <span className="truncate">{getLanguageName(formData.language)}</span>
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>

                  <div tabIndex={0} className="dropdown-content z-[60] p-2 shadow-2xl bg-white rounded-xl w-[300px] sm:w-[400px] mt-2 border border-gray-100 max-h-80 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-1">
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => {
                            handleChange({ target: { name: "language", value: lang.code } });
                            document.activeElement.blur();
                          }}
                          className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            formData.language === lang.code
                              ? "bg-black text-yellow-400 font-bold"
                              : "text-slate-600 hover:bg-yellow-50 hover:text-slate-900"
                          }`}
                        >
                          {lang.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Learning Language */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Learning Language</label>
                <div className="dropdown w-full">
                  <div tabIndex={0} role="button" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl flex justify-between items-center text-sm font-medium text-slate-800 hover:bg-white hover:border-gray-300 transition-colors cursor-pointer">
                    <span className="truncate">{getLanguageName(formData.learningLanguages)}</span>
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>

                  <div tabIndex={0} className="dropdown-content z-[60] p-2 shadow-2xl bg-white rounded-xl w-[300px] sm:w-[400px] mt-2 border border-gray-100 max-h-80 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-1">
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => {
                            handleChange({ target: { name: "learningLanguages", value: lang.code } });
                            document.activeElement.blur();
                          }}
                          className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            formData.learningLanguages === lang.code
                              ? "bg-black text-yellow-400 font-bold"
                              : "text-slate-600 hover:bg-yellow-50 hover:text-slate-900"
                          }`}
                        >
                          {lang.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interests */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Interests & Topics</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {INTERESTS_LIST.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all border ${
                      formData.interests.includes(interest)
                        ? "bg-black text-yellow-400 border-black transform scale-105"
                        : "bg-white text-gray-500 border-gray-200 hover:border-yellow-400 hover:text-black"
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-5 mt-4 bg-black text-yellow-400 font-black uppercase italic tracking-widest rounded-xl hover:bg-yellow-500 hover:text-black transition-all duration-300 shadow-xl shadow-yellow-500/10 active:scale-95 disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Complete Onboarding"}
            </button>
          </form>
        </div>

        {/* SAĞ TARAF: AYI */}
        <div className="hidden lg:flex lg:w-2/5 bg-yellow-400 items-center justify-center relative overflow-hidden">
          <div className="absolute top-10 right-10 text-black opacity-5 text-9xl font-black italic">TALKO</div>

          <div className="relative w-full h-full flex items-end justify-center pb-10">
            <img
              src={bearImg}
              alt="Friendly Bear"
              className="w-3/5 h-auto object-contain z-10"
            />

            {/* Gözler */}
            <div
              ref={eyesContainerRef}
              className="absolute z-20 flex gap-5 top-[30%] left-[45%] transform -translate-x-1/2 -rotate-[15deg]"
            >
              {/* Sol Göz */}
              <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-sm border border-gray-200">
                <div
                  className="w-2.5 h-2.5 bg-black rounded-full transition-transform duration-75"
                  style={{ transform: `translate(${pupilPos.x}px, ${pupilPos.y}px)` }}
                />
              </div>
              {/* Sağ Göz */}
              <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-sm border border-gray-200 mt-3 -ml-3">
                <div
                  className="w-2.5 h-2.5 bg-black rounded-full transition-transform duration-75"
                  style={{ transform: `translate(${pupilPos.x}px, ${pupilPos.y}px)` }}
                />
              </div>
            </div>

            {/* Konuşma balonu */}
            <div className="absolute top-[18%] left-[60%] bg-white px-3 py-3 rounded-2xl rounded-br-none shadow-xl transform -rotate-3 z-30 animate-bounce">
              <p className="text-sm font-black text-black italic whitespace-nowrap">"Let's be friends!"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;