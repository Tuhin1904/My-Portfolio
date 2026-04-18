"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useRef, useState } from "react";
import { FaChevronUp, FaTimes } from "react-icons/fa";
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
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setShowForm(false);
            setIsClosing(false);
        }, 300); // Match transition duration
    };

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
                            onClick={() => {
                                // setShowForm(true);

                                window.scrollTo({ top: 0, behavior: "smooth" });

                                setTimeout(() => {
                                    const el = document.getElementById("startButton");
                                    if (el) {
                                        el.classList.add("blink-highlight");

                                        setTimeout(() => {
                                            el.classList.remove("blink-highlight");
                                        }, 1500);
                                    } else {
                                        console.log("Button not found");
                                    }
                                }, 300);
                            }}
                            className="mt-6 md:mt-0 bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition cursor-pointer"
                        >
                            Drop a message
                        </button>
                    </div>
                    {/* Contact Form (Slide-in) */}
                    {/* {showForm && (
                        <div ref={formRef}
                            className={`mt-6 bg-gray-700 rounded-lg p-6 transition-all duration-300 ease-in-out w-full 
                            ${isClosing ? "opacity-0 -translate-y-8" : "opacity-100 translate-y-0"}`}>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-2xl font-bold">Send me a message</h3>
                                <button
                                    onClick={handleClose}
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition cursor-pointer"
                                >
                                    <FaChevronUp />
                                </button>
                            </div>
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
                    )} */}

                </div>
            </div>
        </section>
    );
}
