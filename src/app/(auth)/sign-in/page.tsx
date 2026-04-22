'use client'
import { apiRequest } from '@/apiFiles/apiClient';
import { apiEndpoints } from '@/apiFiles/apiEndpoints';
import ButtonSpinner from '@/customcomponents/Loading/ButtonSpinner';
import useGuestOnly from '@/hooks/useGuestOnly';
import { setTokens } from '@/store/slices/AuthSlice';
import { setProfilePic, setUser } from '@/store/slices/UserInfo';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

type FormValues = {
    email: string;
    password: string;
};

const page = () => {
    const [rememberMe, setRememberMe] = useState(
        () => localStorage.getItem("rememberMe") === "true"
    );

    const router = useRouter();
    const dispatch = useDispatch();

    // const { isGuest } = useGuestOnly();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FormValues>();

    useEffect(() => {
        const encrypted = localStorage.getItem("authData");

        if (encrypted) {
            fetch("/api/decrypt", {
                method: "POST",
                body: JSON.stringify({ encrypted }),
            })
                .then(res => res.json())
                .then(data => {
                    setValue("email", data.email);
                    setValue("password", data.password);
                });
        }
    }, [setValue]);

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // if (!isGuest) return <></>;

    const onSubmit = async (data: FormValues) => {
        try {
            const remember = localStorage.getItem("rememberMe") === "true";

            if (remember) {
                const res = await fetch("/api/encrypt", {
                    method: "POST",
                    body: JSON.stringify(data),
                });

                const { encrypted } = await res.json();

                localStorage.setItem("authData", encrypted);
            }

            setLoading(true);
            const res = await apiRequest({
                method: "POST",
                url: apiEndpoints.signIn,
                data
            })

            console.log("Login Res is :", res)

            dispatch(setTokens({
                accessToken: res.data?.accessToken, refreshToken: res.data?.refreshToken
            }))
            dispatch(setUser({
                _id: res.data?.user?._id, email: res.data?.user?.email, name: res.data?.user?.name, userRole: res.data?.user?.userRole
            }))
            dispatch(setProfilePic({
                profilePicUrl: res.data?.user?.profilePicUrl,
            }))

            if (res.data?.user?.userRole == 2) {
                router.push("/my-project-requests");
            } else {
                router.push("/view-clients-req")
            }

            toast("Welcome!")

        } catch (err) {
            console.log("Error :", err)
        } finally {
            setLoading(false);
        }

    };


    return (
        <div className=' min-h-[40vh] md:min-h-[70vh] flex justify-center items-center py-4 px-2'>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm border flex flex-col gap-1.5"
            >
                <h2 className="text-2xl font-semibold text-center mb-6">
                    Login
                </h2>

                {/* Email */}
                <input
                    type="email"
                    placeholder="Enter your email"
                    {...register("email", {
                        required: "Email is required",
                        pattern: {
                            value: /^\S+@\S+$/i,
                            message: "Invalid email",
                        },
                    })}
                    className={`w-full border rounded-md px-4 py-3 mb-1 outline-none focus:ring-2 ${errors.email
                        ? "border-red-500 focus:ring-red-500"
                        : "focus:ring-gray-500"
                        }`}
                />
                {errors.email && (
                    <p className="text-red-500 text-sm mb-3">
                        {errors.email.message}
                    </p>
                )}

                {/* Password */}
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message: "Minimum 6 characters",
                            },
                        })}
                        className={`w-full border rounded-md px-4 py-3 mb-1 outline-none focus:ring-2 ${errors.password
                            ? "border-red-500 focus:ring-red-500"
                            : "focus:ring-gray-500"
                            }`}
                    />

                    {/* Eye Button */}
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                {errors.password && (
                    <p className="text-red-500 text-sm mb-3">
                        {errors.password.message}
                    </p>
                )}

                {/* Remember Me */}
                <div className="flex items-center justify-between mt-2 mb-3 px-1">
                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => {
                                const value = e.target.checked;
                                setRememberMe(value);
                                localStorage.setItem("rememberMe", String(value));
                            }}
                            className="w-4 h-4 accent-gray-900 cursor-pointer"
                        />
                        Remember me
                    </label>

                    <span
                        className="text-sm text-gray-500 cursor-pointer hover:underline"
                        onClick={() => router.push("/forgot-password")}
                    >
                        Forgot password?
                    </span>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="w-full bg-gray-900 text-white py-3 rounded-md font-medium hover:bg-gray-700 transition cursor-pointer mt-2"
                >
                    {loading ? <ButtonSpinner text="Please wait..." /> : "Continue"}
                </button>

                {/* Divider */}
                <div className="flex items-center my-6">
                    <div className="flex-1 h-px bg-gray-300" />
                    <span className="mx-3 text-gray-500 text-sm">or</span>
                    <div className="flex-1 h-px bg-gray-300" />
                </div>

                {/* Sign Up */}
                <p className="text-center text-sm text-gray-500 mt-6">
                    Don't have an TG account?
                </p>

                <button
                    type="button"
                    className="w-full border border-gray-600 text-gray-600 py-2 rounded-md mt-3 hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => router.push("/sign-up")}
                >
                    Sign Up
                </button>
            </form>
        </div>
    )
}

export default page