"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { apiRequest } from "@/apiFiles/apiClient";
import { apiEndpoints } from "@/apiFiles/apiEndpoints";
import { toast } from "sonner";
import { setProfilePic } from "@/store/slices/UserInfo";

const page = () => {
    const userInfo = useSelector((state: RootState) => state.user);
    // const [image, setImage] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const dispatch = useDispatch();

    const MAX_SIZE = 2 * 1024 * 1024;
    const ALLOWED_TYPES = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/svg+xml",
        "image/heic",
        "image/heif"
    ];

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!ALLOWED_TYPES.includes(file.type)) {
            toast.error("Unsupported file type", {
                description: "Only JPG, PNG, WEBP, SVG, HEIC are allowed",
            });
            return;
        }

        // Size validation
        if (file.size > MAX_SIZE) {
            toast.error("File too large", {
                description: "Image must be less than 2MB",
            });
            return;
        }

        if (file) {
            // const url = URL.createObjectURL(file);
            // setImage(url);
            uploadImage(file);
        }
    };

    const uploadImage = async (image: any) => {
        try {
            setUploading(true);
            let uploadedImageUrl = "";

            if (image) {
                const formData = new FormData();
                formData.append("image", image);

                const uploadRes = await apiRequest({
                    method: "POST",
                    url: apiEndpoints.uploadFile,
                    data: formData
                })
                console.log("uploadRes ", uploadRes?.url)
                if (!uploadRes.success) {
                    throw new Error("Image upload failed");
                }

                uploadedImageUrl = uploadRes?.url || "";
            }

            await apiRequest({
                method: "PUT",
                url: apiEndpoints.updateProfile,
                data: { profilePicUrl: uploadedImageUrl }
            })

            dispatch(setProfilePic({ profilePicUrl: uploadedImageUrl }))

            toast.success("Picture updated!")

        } catch (error) {
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-[70vh] flex justify-center items-center p-4">
            <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-sm border">

                <h2 className="text-2xl font-semibold text-center mb-6">
                    Profile
                </h2>

                {/* Profile Image */}
                <div className="flex flex-col items-center gap-3 mb-6">
                    <div className="relative w-24 h-24">
                        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                            {userInfo.profilePicUrl ? (
                                <img
                                    src={userInfo.profilePicUrl}
                                    alt="profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="w-10 h-10 text-gray-400" />
                            )}
                        </div>

                        {/* Spinner Overlay */}
                        {uploading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
                                <Loader2 className="h-6 w-6 animate-spin text-white" />
                            </div>
                        )}
                    </div>

                    <label className="text-sm text-gray-600 cursor-pointer border border-dashed px-2 py-1 rounded-sm">
                        Change Photo
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </label>
                </div>

                {/* Name */}
                <div className="mb-4">
                    <Input
                        value={userInfo.name || ""}
                        placeholder="Your Name"
                        disabled
                    />
                </div>

                {/* Email */}
                <div className="mb-6">
                    <Input
                        value={userInfo.email || ""}
                        placeholder="Your Email"
                        disabled
                    />
                </div>
            </div>
        </div>
    )
}

export default page