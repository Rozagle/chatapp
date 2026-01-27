import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Navbar from "../Components/Navbar";
import {
  Search,
  MessageCircle,
  UserMinus,
  MoreHorizontal,
  UserPlus,
  Clock,
} from "lucide-react";
import { useState, useMemo } from "react";
import axiosINSTANCE from "../lib/axios.js";
import toast from "react-hot-toast";

const Friends = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: async () => {
      const response = await axiosINSTANCE.get("/user/friends");
      return Array.isArray(response.data) ? response.data : [];
    },
  });

  const { data: outgoingRequests = [] } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: async () => {
      const response = await axiosINSTANCE.get(
        "/user/outgoing-friend-request/",
      );
      return response.data;
    },
  });

  const { data: incomingData } = useQuery({
    queryKey: ["incomingRequests"],
    queryFn: async () => {
      const response = await axiosINSTANCE.get("/user/friend-request/");
      return response.data;
    },
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axiosINSTANCE.get("/user");
      return response.data;
    },
  });

  const { mutate: sendRequestMutate, isPending: isSending } = useMutation({
    mutationFn: async (recipientId) => {
      const response = await axiosINSTANCE.post(
        `/user/friend-request/${recipientId}`,
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Arkadaşlık isteği gönderildi!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "İstek gönderilemedi.");
    },
  });

  // logic

  const sentRequestIds = useMemo(() => {
    return new Set(outgoingRequests.map((req) => req.recipient?._id));
  }, [outgoingRequests]);

  const incomingIds = useMemo(() => {
    const reqs = Array.isArray(incomingData) ? incomingData : [];
    return new Set(reqs.map((req) => req.requester?._id));
  }, [incomingData]);

  const filteredFriends = friends.filter((friend) =>
    friend.fullname?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="h-screen flex flex-col bg-[#f8f9fa] overflow-hidden">
      <Navbar />
      <div className="flex-1 overflow-y-auto p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          {/* People May You Know*/}
          <section className="mb-12">
            <h2 className="text-xl font-black italic uppercase mb-4 flex items-center gap-2">
              <UserPlus size={24} /> People You May Know
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {loadingUsers ? (
                <p className="font-bold opacity-50 italic">Loading...</p>
              ) : (
                recommendedUsers.map((user) => {
                  const hasSent = sentRequestIds.has(user._id);
                  const hasReceived = incomingIds.has(user._id);

                  return (
                    <div
                      key={user._id}
                      className="min-w-[180px] bg-white border-2 border-black p-4 rounded-2xl flex flex-col items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                    >
                      <img
                        src={
                          user.profilePicture ||
                          "https://avatar.iran.liara.run/public"
                        }
                        className="w-16 h-16 rounded-full border-2 border-black mb-2 object-cover bg-gray-50"
                      />
                      <p className="font-bold text-center truncate w-full text-sm">
                        {user.fullname}
                      </p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">
                        {user.location || "Global"}
                      </p>

                      <button
                        disabled={hasSent || hasReceived || isSending}
                        onClick={() => sendRequestMutate(user._id)}
                        className={`mt-3 w-full py-2 border-2 border-black rounded-lg font-black text-[10px] uppercase transition-all flex items-center justify-center gap-1 ${
                          hasSent || hasReceived
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-[#F4C724] hover:bg-black hover:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none"
                        }`}
                      >
                        {hasSent
                          ? "Request Sent"
                          : hasReceived
                            ? "Pending Approval"
                            : "Add Friend"}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* Arkadaş Listesi */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 border-t-2 border-black pt-8">
            <div>
              <h1 className="text-3xl font-black italic uppercase tracking-tighter">
                My Friends
              </h1>
              <p className="text-gray-500 font-bold text-sm">
                You have {friends.length} friends
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search friends..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border-2 border-black rounded-xl font-bold text-sm outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFriends.map((friend) => (
              <div
                key={friend._id}
                className="bg-white border-2 border-black rounded-2xl p-4 flex items-center gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                <img
                  src={
                    friend.profilePicture ||
                    "https://avatar.iran.liara.run/public"
                  }
                  className="w-14 h-14 rounded-full border-2 border-black object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-lg truncate">
                    {friend.fullname}
                  </h3>
                  <p className="text-gray-500 text-xs font-bold uppercase">
                    {friend.location}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 bg-black text-[#F4C724] rounded-lg border-2 border-black hover:bg-[#F4C724] hover:text-black transition-all">
                    <MessageCircle size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Friends;