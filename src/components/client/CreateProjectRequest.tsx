import { apiRequest } from '@/apiFiles/apiClient';
import { apiEndpoints } from '@/apiFiles/apiEndpoints';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { budgetOptions, workTypes } from '@/const/masterData';
import { RootState } from '@/store';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Loader2, Send } from 'lucide-react';
import { FaBriefcase, FaEnvelope, FaMoneyBillWave, FaUser } from 'react-icons/fa';

type FormValues = {
    workType: string;
    budget: string;
    message: string;
    name: string;
    email: string;
};

const CreateProjectRequest = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        control,
        setValue,
        reset,
        formState: { errors },
    } = useForm<FormValues>();

    const userInfo = useSelector((state: RootState) => state.user);

    useEffect(() => {
        if (userInfo) {
            setValue("name", userInfo.name || "");
            setValue("email", userInfo.email || "");
        }
    }, [userInfo, setValue]);

    const onSubmit = async (data: FormValues) => {
        setLoading(true);
        try {
            const reqstat = await apiRequest({ method: "POST", url: apiEndpoints.postRequest, data: { ...data, typeOfUser: "registered" } });
            console.log("reqstat is :", reqstat)
            toast("Request submitted successfully!");
            router.push("/my-project-requests");
        } catch (err: any) {
            console.error(err);
            toast(err?.message || "An error occurred while submitting the request.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Heading */}
            <div>
                <p className="text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-1">New Request</p>
                <h1 className="text-2xl font-bold text-white">Work Inquiry</h1>
            </div>

            {/* Two-column desktop layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                {/* LEFT — Form (3/5) */}
                <div className="lg:col-span-3">
                    <div className="glass-card rounded-2xl p-8" style={{ border: '1px solid rgba(99,102,241,0.15)' }}>
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">

                            {/* Work Type + Budget */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="flex items-center gap-1.5 text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">
                                        <FaBriefcase className="text-indigo-500" size={11} /> Type of Work
                                    </label>
                                    <Controller
                                        name="workType"
                                        control={control}
                                        rules={{ required: "Work type is required" }}
                                        render={({ field }) => (
                                            <>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger className={`w-full cursor-pointer bg-gray-800/60 border-white/8 text-gray-300 rounded-xl ${errors.workType ? "border-red-500/60" : ""}`}>
                                                        <SelectValue placeholder="Select work type" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-gray-900 border border-white/10 text-white">
                                                        {workTypes.map((item) => (
                                                            <SelectItem key={item.value} value={item.value} className="hover:bg-indigo-500/10 cursor-pointer">
                                                                {item.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.workType && <p className="text-red-400 text-xs mt-1">{errors.workType.message}</p>}
                                            </>
                                        )}
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-1.5 text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">
                                        <FaMoneyBillWave className="text-indigo-500" size={11} /> Budget Range
                                    </label>
                                    <Controller
                                        name="budget"
                                        control={control}
                                        rules={{ required: "Budget is required" }}
                                        render={({ field }) => (
                                            <>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger className={`w-full cursor-pointer bg-gray-800/60 border-white/8 text-gray-300 rounded-xl ${errors.budget ? "border-red-500/60" : ""}`}>
                                                        <SelectValue placeholder="Select budget" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-gray-900 border border-white/10 text-white">
                                                        {budgetOptions.map((item) => (
                                                            <SelectItem key={item.value} value={item.value} className="hover:bg-indigo-500/10 cursor-pointer">
                                                                {item.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.budget && <p className="text-red-400 text-xs mt-1">{errors.budget.message}</p>}
                                            </>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Name + Email (read-only, prefilled) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="flex items-center gap-1.5 text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">
                                        <FaUser className="text-indigo-500" size={11} /> Your Name
                                    </label>
                                    <input
                                        placeholder="Your Name"
                                        disabled
                                        {...register("name", { required: "Name is required" })}
                                        className="w-full bg-gray-800/40 border border-white/5 text-gray-400 rounded-xl px-4 py-3 outline-none disabled:cursor-not-allowed text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="flex items-center gap-1.5 text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">
                                        <FaEnvelope className="text-indigo-500" size={11} /> Your Email
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="Your Email"
                                        disabled
                                        {...register("email", { required: "Email is required" })}
                                        className="w-full bg-gray-800/40 border border-white/5 text-gray-400 rounded-xl px-4 py-3 outline-none disabled:cursor-not-allowed text-sm"
                                    />
                                </div>
                            </div>

                            {/* Message */}
                            <div>
                                <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2 block">
                                    Project Description
                                </label>
                                <textarea
                                    placeholder="Describe your project idea, requirements, timeline, and any other relevant details..."
                                    rows={6}
                                    {...register("message", { required: "Message is required" })}
                                    className={`w-full bg-gray-800/60 border text-white placeholder-gray-600 rounded-xl px-4 py-3 outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 resize-none text-sm ${errors.message ? "border-red-500/60" : "border-white/8"}`}
                                />
                                {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
                            </div>

                            <div className="h-px bg-white/5" />

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`shimmer-btn text-white px-8 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 ${loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send size={14} /> Submit Request</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* RIGHT — Helper panel (2/5) */}
                <div className="lg:col-span-2 flex flex-col gap-5">

                    {/* Process steps */}
                    <div className="glass-card rounded-2xl p-6" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-5">How It Works</p>
                        <div className="flex flex-col gap-5">
                            {[
                                { step: '01', title: 'Submit your inquiry', desc: 'Fill in the form with your project details and budget.' },
                                { step: '02', title: 'Review & quote', desc: 'Tuhin will review and reply with a tailored quote.' },
                                { step: '03', title: 'Kickoff', desc: 'Once agreed, the project kicks off with a timeline.' },
                            ].map(({ step, title, desc }) => (
                                <div key={step} className="flex gap-4">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-indigo-300 shrink-0"
                                        style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)' }}>
                                        {step}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-white mb-0.5">{title}</p>
                                        <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Budget guide */}
                    <div className="rounded-2xl p-6"
                        style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(168,85,247,0.1))', border: '1px solid rgba(99,102,241,0.2)' }}>
                        <p className="text-xs text-indigo-400 uppercase tracking-widest font-semibold mb-4">Budget Guide</p>
                        <div className="flex flex-col gap-2.5 text-xs text-gray-400">
                            {[
                                { range: '₹10k–₹25k', scope: 'Landing pages, small features' },
                                { range: '₹25k–₹50k', scope: 'Full websites, dashboards' },
                                { range: '₹50k–₹1L', scope: 'Complex web apps, APIs' },
                                { range: '₹1L+', scope: 'Enterprise / long-term projects' },
                            ].map(({ range, scope }) => (
                                <div key={range} className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0">
                                    <span className="text-indigo-300 font-semibold">{range}</span>
                                    <span className="text-gray-500">{scope}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateProjectRequest
