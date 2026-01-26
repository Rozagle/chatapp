import { useQuery } from "@tanstack/react-query";
import axiosINSTANCE from "../lib/axios";

export const useAuthUser = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => (await axiosINSTANCE.get('/auth/test')).data,
    staleTime: 1000 * 60 * 5, // 5 dakika boyunca veri "taze" sayılır, tekrar istek atmaz.
    retry: false,
  });

  return {
    authUser: data?.user, // API'den dönen user objesi
    isLoading,
    isError,
    error
  };
};