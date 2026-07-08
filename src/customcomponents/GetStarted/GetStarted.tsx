'use client'
import { apiRequest } from "@/apiFiles/apiClient";
import { apiEndpoints } from "@/apiFiles/apiEndpoints";
import { formSchema } from "@/app/schema/createQuery";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ButtonSpinner from "../Loading/ButtonSpinner";
import { toast } from "sonner"
import { useRouter } from "next/navigation";
import { workTypes } from "@/const/masterData";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { FaArrowRight, FaCheckCircle, FaRocket } from "react-icons/fa";

type FormValues = {
  name: string;
  email: string;
  workType: string;
  budget: string;
  message: string;
};

export default function StartProjectDialog() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<FormValues>({
    resolver: yupResolver(formSchema),
    mode: "onChange",
  });

  const [success, setSuccess] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const userToken = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.location.hash === "#connect" && (userToken.accessToken == null)) {
        setOpen(true);
      }
    }
  }, []);

  const onSubmit = async (data: FormValues) => {
    try {
      await apiRequest({
        method: "POST",
        url: apiEndpoints.postRequest,
        data: { ...data, typeOfUser: "guest" }
      })
      toast("Request submitted successfully!")
      setSuccess(true);
      reset();
    } catch (err) {
      console.error(err);
    }
  };

  // const highlight = useSelector((state: any) => state.ui.highlightStartButton);

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (!val) setSuccess(false);
      setOpen(val);
    }}>
      <DialogTrigger asChild>
        <button
          className={`shimmer-btn text-white text-sm px-4 py-2 rounded-lg font-semibold tracking-wide flex items-center gap-2 group transition-all  cursor-pointer`}
        // ${highlight ? "blink-highlight" : ""}
        >
          Get Started
          <FaArrowRight className="group-hover:translate-x-0.5 transition-transform duration-200 text-xs" />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[520px] bg-gray-900 border border-indigo-500/20 text-white p-0 overflow-hidden">

        {/* Header gradient strip */}
        <div className="h-1 w-full" style={{ background: 'linear-gradient(to right, #6366f1, #a855f7)' }} />

        <div className="p-6">
          <DialogHeader className="mb-5">
            <div className="flex items-center gap-2 mb-1">
              <FaRocket className="text-indigo-400 text-sm" />
              <span className="text-indigo-400 text-xs font-semibold uppercase tracking-widest">New Project</span>
            </div>
            <DialogTitle className="text-xl font-bold text-white">
              Start Your Project With Me
            </DialogTitle>
            <DialogDescription className="text-gray-500 text-sm">
              Tell me about your idea — I'll get back with a quote.
            </DialogDescription>
          </DialogHeader>

          {success ? (
            <div className="flex flex-col items-center text-center py-10 gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}>
                <FaCheckCircle className="text-indigo-400 text-3xl" />
              </div>
              <h3 className="text-lg font-semibold text-white">Request Submitted!</h3>
              <p className="text-gray-500 text-sm max-w-xs">
                I'll review your project details and reach out to you soon with a quote.
              </p>
              <button
                onClick={() => { setSuccess(false); setOpen(false); }}
                className="mt-2 text-indigo-400 hover:text-indigo-300 text-sm transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

              {/* Name + Email row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Input
                    placeholder="Your Name"
                    {...register("name", { required: "Name is required" })}
                    className="bg-gray-800/60 border-white/8 text-white placeholder:text-gray-600 focus:border-indigo-500/60 focus:ring-indigo-500/20 rounded-xl"
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <Input
                    type="email"
                    placeholder="Your Email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                    })}
                    className="bg-gray-800/60 border-white/8 text-white placeholder:text-gray-600 focus:border-indigo-500/60 focus:ring-indigo-500/20 rounded-xl"
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>

              {/* Work Type */}
              <div>
                <Select onValueChange={(value) => setValue("workType", value, { shouldValidate: true })}>
                  <SelectTrigger className="w-full bg-gray-800/60 border-white/8 text-gray-300 rounded-xl focus:border-indigo-500/60">
                    <SelectValue placeholder="Type of Work" />
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
              </div>

              {/* Budget */}
              <div>
                <Select onValueChange={(value) => setValue("budget", value, { shouldValidate: true })}>
                  <SelectTrigger className="w-full bg-gray-800/60 border-white/8 text-gray-300 rounded-xl focus:border-indigo-500/60">
                    <SelectValue placeholder="Select Budget" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border border-white/10 text-white">
                    <SelectItem value="10k-25k" className="hover:bg-indigo-500/10 cursor-pointer">₹10k–₹25k</SelectItem>
                    <SelectItem value="25k-50k" className="hover:bg-indigo-500/10 cursor-pointer">₹25k–₹50k</SelectItem>
                    <SelectItem value="50k-1l" className="hover:bg-indigo-500/10 cursor-pointer">₹50k–₹1L</SelectItem>
                    <SelectItem value="1l+" className="hover:bg-indigo-500/10 cursor-pointer">₹1L+</SelectItem>
                  </SelectContent>
                </Select>
                {errors.budget && <p className="text-red-400 text-xs mt-1">{errors.budget.message}</p>}
              </div>

              {/* Message */}
              <div>
                <Textarea
                  placeholder="Describe your idea..."
                  {...register("message", {
                    required: "Message is required",
                    minLength: { value: 10, message: "Minimum 10 characters" },
                  })}
                  className="bg-gray-800/60 border-white/8 text-white placeholder:text-gray-600 focus:border-indigo-500/60 focus:ring-indigo-500/20 rounded-xl resize-none min-h-[100px]"
                />
                {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 pt-1">
                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full shimmer-btn text-white border-0 rounded-xl py-2.5 font-semibold cursor-pointer"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <ButtonSpinner /> : (
                    <span className="flex items-center gap-2">Submit as Guest <FaArrowRight className="text-xs" /></span>
                  )}
                </Button>

                {/* Divider */}
                <div className="flex items-center gap-2 text-gray-600 text-xs">
                  <div className="flex-1 h-px bg-white/8" />
                  OR
                  <div className="flex-1 h-px bg-white/8" />
                </div>

                {/* Sign In */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300 rounded-xl cursor-pointer bg-transparent"
                  onClick={() => {
                    setOpen(false);
                    router.push("/sign-in");
                  }}
                >
                  Sign In Instead
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}