import { useState } from "react";
import img from "/Cubs.webp"; // Aynı görseli veya login için başka bir görseli kullanabilirsin
import { Link, useNavigate } from "react-router-dom"; 
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosINSTANCE from "../lib/axios.js"; 
import toast from "react-hot-toast"; 

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate(); 
  const queryClient = useQueryClient();

  const { mutate: loginMutate, isPending } = useMutation({
    mutationFn: async (data) => {
      // Login endpointine istek atıyoruz
      const response = await axiosINSTANCE.post("/auth/login", data);
      return response.data;
    },
    onSuccess: () => {
      // Kullanıcı bilgisini güncelle
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      
      // Başarılı giriş sonrası anasayfaya yönlendir
      // (ProtectedLayout zaten onboarding durumunu kontrol edip yönlendirecektir)
      navigate("/"); 
      toast.success("Tekrar hoş geldiniz! Giriş yapılıyor...");
    },
    onError: (error) => {
      // Hata mesajını göster
      const errorMessage = error.response?.data?.message || "Giriş yapılamadı";
      toast.error(errorMessage);
    }
  });

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    loginMutate(loginData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-[#f3f4f6]">
      
      <div className="flex flex-col lg:flex-row w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* SOL TARAF (FORM) */}
        <div className="w-full lg:w-1/2 p-8 sm:p-10 lg:p-16 flex flex-col justify-center bg-white text-black order-1">
          
          <div className="flex items-center gap-3 mb-8 lg:mb-12">
            <div className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center text-yellow-500">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12 2C6.477 2 2 6.477 2 12C2 14.225 2.73 16.279 3.965 17.942L3 22L7.058 21.035C8.583 21.657 10.25 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z" />
                <rect x="7" y="10" width="3" height="1.5" fill="white" />
                <rect x="14" y="10" width="3" height="1.5" fill="white" />
                <path d="M9 15C10 16 14 16 15 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              </svg>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black tracking-tighter italic">TALKO</h1>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Welcome Back!</h2>
            <p className="text-gray-500 text-sm">Please enter your details to log in.</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-6 lg:space-y-8">
            
            {/* Login sayfasında 'Full Name' olmaz, sadece Email ve Şifre */}

            <div className="relative">
              <label className="absolute -top-2.5 left-4 bg-white px-2 text-xs font-bold text-gray-400 uppercase tracking-widest z-10">
                Email Address
              </label>
              <input
                type="email"
                placeholder="hello@example.com"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all text-sm font-medium"
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-4 bg-white px-2 text-xs font-bold text-gray-400 uppercase tracking-widest z-10">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all text-sm font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-5 bg-black text-yellow-400 font-black uppercase italic tracking-widest rounded-xl hover:bg-yellow-500 hover:text-black transition-all duration-300 shadow-xl shadow-yellow-500/10 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Logging In..." : "Log In"}
            </button>
          </form>

          <p className="mt-8 lg:mt-12 text-center text-sm font-medium text-gray-400">
            Don't have an account? <Link to="/signup" className="text-black font-bold underline hover:text-yellow-600 transition-colors">Create Account</Link>
          </p>
        </div>

        {/* SAĞ TARAF (GÖRSEL - Login için uyarlanmış metinler) */}
        <div className="flex w-full lg:w-1/2 bg-yellow-400 items-center justify-center p-8 lg:p-12 relative overflow-hidden order-2 min-h-[400px] lg:min-h-auto">
          
          <div className="absolute top-0 right-0 p-4 text-black opacity-10 text-6xl lg:text-9xl font-black select-none tracking-tighter italic pointer-events-none">
            LOGIN
          </div>
          
          <div className="relative z-10 w-full max-w-sm text-center">
            <div className="bg-black p-2 rounded-3xl shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500 mx-auto w-3/4 sm:w-full">
               <div className="aspect-square bg-white flex items-center justify-center overflow-hidden rounded-2xl border-2 border-black relative">
                  <img 
                    src={img}
                    alt="Talko Login" 
                    className="object-contain w-full h-full p-2" 
                  />
               </div>
            </div>

            <div className="mt-8 lg:mt-10 text-black">
              <h3 className="text-2xl lg:text-3xl font-black uppercase italic leading-none tracking-tighter">Good to see you!</h3>
              <p className="mt-4 lg:mt-5 font-bold text-sm leading-tight uppercase opacity-90">
                Continue your language journey where you left off.
              </p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-3 bg-black"></div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;