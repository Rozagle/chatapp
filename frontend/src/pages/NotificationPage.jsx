import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosINSTANCE from '../lib/axios.js';
import toast from 'react-hot-toast';
import Navbar from '../Components/Navbar';
import { UserCheck, UserX, Bell, Clock, Send } from 'lucide-react';

const NotificationPage = () => {
  const queryClient = useQueryClient();

  // 1. Gelen İstekler
  const { data: incomingData, isLoading: loadingIncoming } = useQuery({
    queryKey: ['incomingRequests'],
    queryFn: async () => {
      const response = await axiosINSTANCE.get('/user/friend-request/');
      return response.data; // Direkt array dönüyor: [{}, {}]
    },
  });

  const incomingRequests = Array.isArray(incomingData) ? incomingData : [];

  // 2. Giden İstekler
  const { data: outgoingRequests = [], isLoading: loadingOutgoing } = useQuery({
    queryKey: ['outgoingRequests'],
    queryFn: async () => {
      const response = await axiosINSTANCE.get(
        '/user/outgoing-friend-request/'
      );
      return response.data;
    },
  });

  // 3. Kabul Et Mutasyonu
  const { mutate: acceptRequest } = useMutation({
    mutationFn: async (requesterId) => {
      return await axiosINSTANCE.put(
        `/user/friend-request/${requesterId}/accept`
      );
    },
    onSuccess: () => {
      toast.success('İstek kabul edildi!');
      queryClient.invalidateQueries({ queryKey: ['incomingRequests'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // 4. Reddet Mutasyonu
  const { mutate: rejectRequest } = useMutation({
    mutationFn: async (requesterId) => {
      return await axiosINSTANCE.put(
        `/user/friend-request/${requesterId}/reject`
      );
    },
    onSuccess: () => {
      toast.success('İstek reddedildi.');
      queryClient.invalidateQueries({ queryKey: ['incomingRequests'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return (
    <div className="h-screen bg-[#f8f9fa] flex flex-col">
      <Navbar />
      <div className="flex-1 overflow-y-auto p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-black italic uppercase mb-8 flex items-center gap-3">
            <Bell size={32} /> Notifications
          </h1>

          {/* GELEN İSTEKLER */}
          <section className="mb-12">
            <div className="bg-white border-4 border-black rounded-3xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="p-4 border-b-4 border-black bg-yellow-400 flex items-center justify-between">
                <span className="font-black uppercase italic text-lg tracking-widest">
                  Gelen İstekler
                </span>
                <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold">
                  {incomingRequests.length}
                </span>
              </div>

              {loadingIncoming ? (
                <div className="p-10 text-center font-bold italic">
                  Yükleniyor...
                </div>
              ) : incomingRequests.length === 0 ? (
                <div className="p-10 text-center text-gray-400 font-bold italic">
                  Yeni bildirim yok.
                </div>
              ) : (
                <div className="divide-y-4 divide-black">
                  {incomingRequests.map((request) => (
                    <div
                      key={request._id}
                      className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            request.requester?.profilePicture ||
                            'https://avatar.iran.liara.run/public'
                          }
                          className="w-14 h-14 rounded-full border-2 border-black object-cover bg-white"
                        />
                        <div>
                          <p className="font-black text-md leading-tight">
                            {request.requester?.fullname}
                          </p>
                          <p className="text-xs font-bold text-gray-500 uppercase">
                            {request.requester?.location}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => acceptRequest(request.requester?._id)}
                          className="bg-black text-[#F4C724] p-2 rounded-xl border-2 border-black hover:bg-[#F4C724] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none"
                        >
                          <UserCheck size={20} />
                        </button>
                        <button
                          onClick={() => rejectRequest(request.requester?._id)}
                          className="bg-white text-red-500 p-2 rounded-xl border-2 border-black hover:bg-red-500 hover:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none"
                        >
                          <UserX size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* GİDEN İSTEKLER */}
          <section className="mb-12">
            <h2 className="text-xl font-black italic uppercase mb-4 flex items-center gap-2">
              <Send size={24} /> Gönderilen İstekler
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
              {loadingOutgoing ? (
                <p>Yükleniyor...</p>
              ) : outgoingRequests.length === 0 ? (
                <p className="font-bold text-gray-400 italic">
                  Gönderilen istek yok.
                </p>
              ) : (
                outgoingRequests.map((req) => (
                  <div
                    key={req._id}
                    className="min-w-[200px] bg-white border-4 border-black p-4 rounded-3xl flex flex-col items-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <div className="relative mb-3">
                      <img
                        src={
                          req.recipient?.profilePicture ||
                          'https://avatar.iran.liara.run/public'
                        }
                        className="w-20 h-20 rounded-full border-2 border-black object-cover"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-yellow-400 border-2 border-black p-1 rounded-full">
                        <Clock size={14} />
                      </div>
                    </div>
                    <p className="font-black text-center truncate w-full text-sm">
                      {req.recipient?.fullname}
                    </p>
                    <div className="mt-4 w-full py-2 bg-gray-100 border-2 border-black rounded-xl font-black text-[10px] uppercase text-center text-gray-500">
                      Beklemede
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;