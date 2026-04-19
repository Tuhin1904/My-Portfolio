// hooks/useAuthChecker.ts
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import type { RootState } from "@/store";

const useAuthChecker = () => {
  const router = useRouter();

  const token = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    if (!token) {
      router.push("/sign-in");
    }
  }, [token, router]);

  return { isAuthenticated: !!token };
};

export default useAuthChecker;
