'use client'
import { apiRequest } from '@/apiFiles/apiClient';
import { apiEndpoints } from '@/apiFiles/apiEndpoints';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type FormValues = {
    email: string;
    password: string;
    location: string;
    phone: string;
    userName: string;
};

const page = () => {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>();

    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (data: FormValues) => {
        try {
            await apiRequest({
                method: "POST",
                url: apiEndpoints.signUp,
                data: { ...data, userRole: 1 }
            })

            toast("Login to continue")

        } catch (err) {
            console.log("Error", err)
            toast("Sign up failed")
        }

    };

    const inputStyle = (error: any) =>
        `w-full border rounded-md px-4 py-3 mb-1 outline-none focus:ring-2 ${error ? "border-red-500 focus:ring-red-500" : "focus:ring-gray-500"
        }`;

    return (
        <div className="min-h-[50vh] md:min-h-[80vh] flex justify-center items-center">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm border flex flex-col gap-2"
            >
                <h2 className="text-2xl font-semibold text-center mb-6">
                    Sign Up
                </h2>

                {/* Username */}
                <input
                    type="text"
                    placeholder="Enter username"
                    {...register("userName", { required: "Username is required" })}
                    className={inputStyle(errors.userName)}
                />
                {errors.userName && (
                    <p className="text-red-500 text-sm mb-3">
                        {errors.userName.message}
                    </p>
                )}

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
                    className={inputStyle(errors.email)}
                />
                {errors.email && (
                    <p className="text-red-500 text-sm mb-3">
                        {errors.email.message}
                    </p>
                )}

                {/* Phone */}
                <input
                    type="text"
                    placeholder="Enter phone number"
                    {...register("phone", {
                        required: "Phone is required",
                        minLength: {
                            value: 8,
                            message: "Invalid phone number",
                        },
                    })}
                    className={inputStyle(errors.phone)}
                />
                {errors.phone && (
                    <p className="text-red-500 text-sm mb-3">
                        {errors.phone.message}
                    </p>
                )}

                {/* Location */}
                <input
                    type="text"
                    placeholder="Enter location"
                    {...register("location", { required: "Location is required" })}
                    className={inputStyle(errors.location)}
                />
                {errors.location && (
                    <p className="text-red-500 text-sm mb-3">
                        {errors.location.message}
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
                                value: 8,
                                message: "Minimum 8 characters",
                            },
                        })}
                        className={inputStyle(errors.password)}
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-3 text-gray-500"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                {errors.password && (
                    <p className="text-red-500 text-sm mb-3">
                        {errors.password.message}
                    </p>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    className="w-full bg-gray-900 text-white py-3 rounded-md font-medium hover:bg-gray-700 transition mt-2 cursor-pointer"
                >
                    Create Account
                </button>

                {/* Divider */}
                <div className="flex items-center my-6">
                    <div className="flex-1 h-px bg-gray-300" />
                    <span className="mx-3 text-gray-500 text-sm">or</span>
                    <div className="flex-1 h-px bg-gray-300" />
                </div>

                {/* Login Redirect */}
                <p className="text-center text-sm text-gray-500">
                    Already have an account?
                </p>

                <button
                    type="button"
                    onClick={() => router.push("/sign-in")}
                    className="w-full border border-gray-600 text-gray-600 py-2 rounded-md mt-3 hover:bg-gray-50 transition cursor-pointer"
                >
                    Login
                </button>
            </form>
        </div>
    )
}

export default page