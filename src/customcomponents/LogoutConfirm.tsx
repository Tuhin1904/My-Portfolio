"use client";

import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { useDispatch } from "react-redux";
import { clearTokens, } from "@/store/slices/AuthSlice"; // adjust path
import { useRouter } from "next/navigation";
import { clearUser } from "@/store/slices/UserInfo";

const LogoutButton = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    const handleLogout = () => {
        dispatch(clearTokens());
        dispatch(clearUser());
        router.push("/sign-in");
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <span className="inline-block w-full">
                    Log Out
                </span>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will log you out of your account.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>

                    <AlertDialogAction
                        onClick={handleLogout}
                        className="bg-red-700 hover:bg-red-600 cursor-pointer"
                    >
                        Log Out
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default LogoutButton;