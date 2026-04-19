// hooks/useGuestOnly.ts
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import type { RootState } from "@/store";

const useGuestOnly = () => {
  const router = useRouter();
  const token = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    if (token) {
      // go back if possible, else fallback
      if (window.history.length > 1) {
        router.back();
      } else {
        router.push("/"); // fallback (dashboard/home)
      }
    }
  }, [token, router]);

  return { isGuest: !token };
};

export default useGuestOnly;
