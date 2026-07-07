"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Loader2, User, Camera } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { apiRequest } from "@/apiFiles/apiClient";
import { apiEndpoints } from "@/apiFiles/apiEndpoints";
import { toast } from "sonner";
import { setProfilePic } from "@/store/slices/UserInfo";

const ClientProfile = () => {
    const userInfo = useSelector((state: RootState) => state.user);
    const [uploading, setUploading] = useState(false);
    const dispatch = useDispatch();

    const MAX_SIZE = 2 * 1024 * 1024;
    const ALLOWED_TYPES = [
        "image/jpeg", "image/jpg", "image/png",
        "image/webp", "image/svg+xml", "image/heic", "image/heif"
    ];

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!ALLOWED_TYPES.includes(file.type)) {
            toast.error("Unsupported file type", { description: "Only JPG, PNG, WEBP, SVG, HEIC are allowed" });
            return;
        }
        if (file.size > MAX_SIZE) {
            toast.error("File too large", { description: "Image must be less than 2MB" });
            return;
        }
        uploadImage(file);
    };

    const uploadImage = async (image: any) => {
        try {
            setUploading(true);
            let uploadedImageUrl = "";
            if (image) {
                const formData = new FormData();
                formData.append("image", image);
                const uploadRes = await apiRequest({ method: "POST", url: apiEndpoints.uploadFile, data: formData });
                if (!uploadRes.success) throw new Error("Image upload failed");
                uploadedImageUrl = uploadRes?.url || "";
            }
            await apiRequest({ method: "PUT", url: apiEndpoints.updateProfile, data: { profilePicUrl: uploadedImageUrl } });
            dispatch(setProfilePic({ profilePicUrl: uploadedImageUrl }));
            toast.success("Picture updated!");
        } catch (error) {
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const isAdmin = userInfo?.userRole === 1;
    const roleLabel = isAdmin ? "Administrator" : "Registered User";

    return (
        <div className="space-y-6">
            {/* Heading */}
            <div>
                <p className="text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-1">Settings</p>
                <h1 className="text-2xl font-bold text-white">My Profile</h1>
            </div>

            {/* Two-column layout on desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                {/* LEFT — Profile card */}
                <div className="lg:col-span-2">
                    <div className="glass-card rounded-2xl p-8 h-full" style={{ border: '1px solid rgba(99,102,241,0.15)' }}>

                        {/* Avatar */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="relative mb-4">
                                <div className="absolute -inset-0.5 rounded-full"
                                    style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }} />
                                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
                                    {userInfo.profilePicUrl ? (
                                        <img src={userInfo.profilePicUrl} alt="profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-10 h-10 text-gray-500" />
                                    )}
                                    {uploading && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                            <Loader2 className="h-6 w-6 animate-spin text-white" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer transition-all duration-200 px-4 py-2 rounded-lg"
                                style={{ color: '#a5b4fc', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)' }}>
                                <Camera size={13} />
                                {uploading ? "Uploading..." : "Change Photo"}
                                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                            </label>
                            <p className="text-xs text-gray-600 mt-2">JPG, PNG, WEBP up to 2MB</p>
                        </div>

                        <div className="h-px bg-white/5 mb-6" />

                        {/* Fields */}
                        <div className="flex flex-col gap-5">
                            <div>
                                <label className="block text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Full Name</label>
                                <Input
                                    value={userInfo.name || ""}
                                    placeholder="Your Name"
                                    disabled
                                    className="bg-gray-800/60 border-white/8 text-white disabled:opacity-60 rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Email Address</label>
                                <Input
                                    value={userInfo.email || ""}
                                    placeholder="Your Email"
                                    disabled
                                    className="bg-gray-800/60 border-white/8 text-white disabled:opacity-60 rounded-xl"
                                />
                            </div>
                        </div>

                        {/* Role */}
                        <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between">
                            <span className="text-xs text-gray-600">Account Role</span>
                            <span className="text-xs font-semibold px-3 py-1 rounded-full"
                                style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc' }}>
                                {roleLabel}
                            </span>
                        </div>
                    </div>
                </div>

                {/* RIGHT — Info panels */}
                <div className="lg:col-span-3 flex flex-col gap-5">

                    {/* Account details table */}
                    <div className="glass-card rounded-2xl p-6" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-4">Account Details</p>
                        <div className="flex flex-col">
                            {[
                                { label: 'Display Name', value: userInfo?.name || '—' },
                                { label: 'Email', value: userInfo?.email || '—' },
                                { label: 'Role', value: roleLabel },
                                { label: 'Status', value: 'Active' },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                                    <span className="text-sm text-gray-500">{label}</span>
                                    <span className="text-sm text-gray-200 font-medium">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tips / help card */}
                    <div className="rounded-2xl p-6 flex-1"
                        style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(168,85,247,0.1))', border: '1px solid rgba(99,102,241,0.2)' }}>
                        <p className="text-xs text-indigo-400 uppercase tracking-widest font-semibold mb-4">Quick Tips</p>
                        <ul className="flex flex-col gap-3 text-sm text-gray-400">
                            <li className="flex items-start gap-2.5">
                                <span className="text-indigo-400 mt-0.5 shrink-0">→</span>
                                Upload a clear profile photo so Tuhin can recognize you easily.
                            </li>
                            <li className="flex items-start gap-2.5">
                                <span className="text-indigo-400 mt-0.5 shrink-0">→</span>
                                Use <span className="text-indigo-300 font-medium">New Request</span> to submit a new project inquiry at any time.
                            </li>
                            <li className="flex items-start gap-2.5">
                                <span className="text-indigo-400 mt-0.5 shrink-0">→</span>
                                Track your enquiry status and chat updates from <span className="text-indigo-300 font-medium">My Enquiries</span>.
                            </li>
                            <li className="flex items-start gap-2.5">
                                <span className="text-indigo-400 mt-0.5 shrink-0">→</span>
                                Profile photo changes are applied immediately across your account.
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ClientProfile;