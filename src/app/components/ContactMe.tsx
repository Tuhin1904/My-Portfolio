"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
import * as yup from "yup";
import emailjs from "@emailjs/browser";
import { useForm } from "react-hook-form";

// ✅ Validation Schema
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
    const [showForm, setShowForm] = useState(false);
    const formRef = useRef<HTMLDivElement | null>(null);
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    useEffect(() => {
        if (showForm && formRef.current) {
            formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [showForm]);

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
            console.error("EmailJS keys are missing");
            setStatusMessage("❌ Email configuration error");
            setLoading(false);
            return;
        }
        emailjs
            .send(
                serviceId!,
                templateId!,
                {
                    name: data.name,
                    email: data.email,
                    message: data.message,
                },
                publicKey!
            )
            .then(
                () => {
                    setStatusMessage("✅ Message sent successfully!");
                    reset();
                },
                () => {
                    setStatusMessage("❌ Failed to send message. Try again.");
                }
            )
            .finally(() => setLoading(false));
    };

    return (
        <section className="bg-gray-900 text-white relative py-20">
            {/* Contact Banner */}
            <div className="max-w-5xl mx-auto px-6 py-12">
                <div className="bg-gray-600 rounded-2xl p-8 flex flex-col justify-between items-center">
                    <div className="flex justify-between items-center w-full">
                        <div>
                            <p className="text-lg mb-2">— Contact me</p>
                            <h2 className="text-3xl md:text-4xl font-bold">
                                Do you have any query?
                            </h2>
                        </div>
                        <button
                            onClick={() => setShowForm(true)}
                            className="mt-6 md:mt-0 bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition cursor-pointer"
                        >
                            Drop a message
                        </button>
                    </div>
                    {/* Contact Form (Slide-in) */}
                    {showForm && (
                        <div ref={formRef} className="mt-6 bg-gray-700 rounded-lg p-6 transition-all duration-500 ease-in-out w-full">
                            <h3 className="text-2xl font-bold mb-4">Send me a message</h3>
                            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                                <input {...register("name")} type="text" placeholder="Your Name" className="p-3 rounded bg-gray-800 text-white outline-none" />
                                {errors.name && <span className="text-red-400 text-sm">{errors.name.message}</span>}

                                <input {...register("email")} type="email" placeholder="Your Email" className="p-3 rounded bg-gray-800 text-white outline-none" />
                                {errors.email && <span className="text-red-400 text-sm">{errors.email.message}</span>}

                                <textarea {...register("message")} placeholder="Your Message" className="p-3 rounded bg-gray-800 text-white outline-none h-28"></textarea>
                                {errors.message && <span className="text-red-400 text-sm">{errors.message.message}</span>}

                                <button type="submit" disabled={loading} className={`${loading ? "bg-gray-200" : "bg-gray-300"} py-3 rounded font-bold hover:bg-gray-200 transition text-gray-700 cursor-pointer`}>
                                    {loading ? "Sending..." : "Send Message"}
                                </button>
                            </form>

                            {statusMessage && (
                                <p className={`mt-3 text-sm ${statusMessage.includes("✅") ? "text-green-400" : "text-red-400"}`}>
                                    {statusMessage}
                                </p>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </section>
    );
}
