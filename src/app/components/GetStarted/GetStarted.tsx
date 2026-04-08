'use client'
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useForm } from "react-hook-form";

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
  } = useForm<FormValues>();

  const [success, setSuccess] = useState(false);

  const onSubmit = async (data: FormValues) => {
    try {
      console.log("Form Data:", data);

      // 👉 API call here
      await new Promise((res) => setTimeout(res, 1000));

      setSuccess(true);
      reset();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignIn = () => {
    console.log("Redirect to auth...");
    // 👉 your auth logic (Firebase / NextAuth)
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="border border-white text-white text-lg px-2 py-1 rounded-xl hover:text-[#c1c0c0] hover:border-[#c1c0c0] transition-all cursor-pointer">
          Get Started
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] bg-gray-100">
        <DialogHeader>
          <DialogTitle className="text-gray-500 text-xl">
            Start Your Project
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Tell me about your idea — I’ll get back with a quote.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="text-center py-6">
            <p className="text-green-400 text-lg">
              ✅ Request submitted successfully!
            </p>
            <p className="text-gray-400 text-sm mt-2">
              I’ll contact you soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            {/* Name */}
            <div>
              <Input
                placeholder="Your Name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <Input
                type="email"
                placeholder="Your Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Work Type */}
            <div>
              <Select onValueChange={(value) => setValue("workType", value)}>
                <SelectTrigger className="w-full bg-transparent border border-white/10 text-white">
                  <SelectValue placeholder="Type of Work" />
                </SelectTrigger>

                <SelectContent className="bg-[#0f172a] text-white border border-white/10">
                  <SelectItem value="web-dev">Web Development</SelectItem>
                  <SelectItem value="app-dev">App Development</SelectItem>
                  <SelectItem value="ui-ux">UI/UX Design</SelectItem>
                  <SelectItem value="cloud">Cloud Services</SelectItem>
                  <SelectItem value="ai">AI Integration</SelectItem>
                </SelectContent>
              </Select>
              {errors.workType && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.workType.message}
                </p>
              )}
            </div>

            {/* Budget */}
            <div>
              <Select onValueChange={(value) => setValue("budget", value)}>
                <SelectTrigger className="w-full bg-transparent border border-white/10 text-white">
                  <SelectValue placeholder="Select Budget" />
                </SelectTrigger>

                <SelectContent className="bg-[#0f172a] text-white border border-white/10">
                  <SelectItem value="10k-25k">₹10k–₹25k</SelectItem>
                  <SelectItem value="25k-50k">₹25k–₹50k</SelectItem>
                  <SelectItem value="50k-1l">₹50k–₹1L</SelectItem>
                  <SelectItem value="1l+">₹1L+</SelectItem>
                </SelectContent>
              </Select>
              {errors.budget && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.budget.message}
                </p>
              )}
            </div>

            {/* Message */}
            <div>
              <Textarea
                placeholder="Describe your idea..."
                {...register("message", {
                  required: "Message is required",
                  minLength: {
                    value: 10,
                    message: "Minimum 10 characters",
                  },
                })}
              />
              {errors.message && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-2">
              {/* Submit as Guest */}
              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-gray-200 cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit as Guest"}
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <div className="flex-1 h-px bg-white/10"></div>
                OR
                <div className="flex-1 h-px bg-white/10"></div>
              </div>

              {/* Sign In */}
              <Button
                type="button"

                className="w-full border-white/20 text-white hover:bg-gray-700 cursor-pointer"
                onClick={handleSignIn}
              >
                Sign In & Continue
              </Button>

            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}