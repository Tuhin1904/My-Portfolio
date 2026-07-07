"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import emailjs from "@emailjs/browser";
import { useForm } from "react-hook-form";
import { removeHighlight, triggerHighlight } from "@/store/slices/UiSlice";
import { useDispatch } from "react-redux";
import { FaEnvelope, FaArrowRight } from "react-icons/fa";

// Validation Schema
const schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string()
        .email("Invalid email format")
        .required("Email is required"),
    message: yup.string()
        .required("Message cannot be empty")
        .min(10, "Message should be at least 10 characters"),
});

export default function ContactSection() {
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data: any) => {
        setLoading(true);
        if (!serviceId || !templateId || !publicKey) {
            setStatusMessage("❌ Email configuration error");
            setLoading(false);
            return;
        }
        emailjs
            .send(serviceId!, templateId!, { name: data.name, email: data.email, message: data.message }, publicKey!)
            .then(
                () => { setStatusMessage("✅ Message sent successfully!"); reset(); },
                () => { setStatusMessage("❌ Failed to send message. Try again."); }
            )
            .finally(() => setLoading(false));
    };

    return (
        <section id="contact" className="relative bg-gray-900 border-t border-white/5 py-24 overflow-hidden">
            {/* Background decoration blobs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute inset-0 dot-grid-bg opacity-30 pointer-events-none" />

            <div className="relative max-w-5xl mx-auto px-6">
                {/* Top Banner */}
                <div className="relative rounded-3xl p-10 md:p-14 overflow-hidden mb-12"
                    style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.2))', border: '1px solid rgba(99,102,241,0.25)' }}>

                    {/* Inner gradient glow */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />

                    <div className="relative flex flex-col md:flex-row justify-between items-center gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <FaEnvelope className="text-indigo-400" />
                                <span className="text-indigo-400 text-sm font-semibold uppercase tracking-widest">Contact Me</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                Let's build something{" "}
                                <span className="gradient-text">amazing</span> together.
                            </h2>
                            <p className="text-gray-400">Have a project in mind? Let's talk!</p>
                        </div>
                        <button
                            onClick={() => {
                                window.scrollTo({ top: 0, behavior: "smooth" });
                                setTimeout(() => {
                                    dispatch(triggerHighlight());
                                    setTimeout(() => { dispatch(removeHighlight()); }, 1500);
                                }, 300);
                            }}
                            className="shimmer-btn text-white px-8 py-4 rounded-xl font-semibold text-sm flex items-center gap-2 flex-shrink-0 group"
                        >
                            Drop a Message
                            <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
                        </button>
                    </div>
                </div>

                {/* Inline Contact Form */}
                {/* <div className="glass-card rounded-2xl p-8">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <span className="w-1 h-6 rounded-full" style={{ background: 'linear-gradient(to bottom, #6366f1, #a855f7)' }} />
                        Send me a message
                    </h3>
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <input
                                    {...register("name")}
                                    type="text"
                                    placeholder="Your Name"
                                    className="w-full p-3.5 rounded-xl bg-gray-800/60 border border-white/8 text-white placeholder-gray-500 outline-none focus:border-indigo-500/60 transition-colors duration-200"
                                />
                                {errors.name && <span className="text-red-400 text-xs mt-1 block">{errors.name.message}</span>}
                            </div>
                            <div>
                                <input
                                    {...register("email")}
                                    type="email"
                                    placeholder="Your Email"
                                    className="w-full p-3.5 rounded-xl bg-gray-800/60 border border-white/8 text-white placeholder-gray-500 outline-none focus:border-indigo-500/60 transition-colors duration-200"
                                />
                                {errors.email && <span className="text-red-400 text-xs mt-1 block">{errors.email.message}</span>}
                            </div>
                        </div>

                        <div>
                            <textarea
                                {...register("message")}
                                placeholder="Your Message"
                                className="w-full p-3.5 rounded-xl bg-gray-800/60 border border-white/8 text-white placeholder-gray-500 outline-none focus:border-indigo-500/60 transition-colors duration-200 h-32 resize-none"
                            />
                            {errors.message && <span className="text-red-400 text-xs mt-1 block">{errors.message.message}</span>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`shimmer-btn text-white py-3.5 rounded-xl font-semibold text-sm tracking-wide flex items-center justify-center gap-2 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                        >
                            {loading ? "Sending..." : "Send Message"}
                            {!loading && <FaArrowRight />}
                        </button>

                        {statusMessage && (
                            <p className={`text-sm text-center ${statusMessage.includes("✅") ? "text-green-400" : "text-red-400"}`}>
                                {statusMessage}
                            </p>
                        )}
                    </form>
                </div> */}
            </div>
        </section>
    );
}
