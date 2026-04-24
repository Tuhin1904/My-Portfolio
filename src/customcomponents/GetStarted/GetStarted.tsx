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
      console.log("window.location is :", window.location.hash)
      if (window.location.hash === "#connect" && (userToken.accessToken == null)) {
        setOpen(true);
      }
    }
  }, []);

  const onSubmit = async (data: FormValues) => {
    try {
      // console.log("Form Data:", data);
      await apiRequest({
        method: "POST",
        url: apiEndpoints.postRequest,
        data: { ...data, typeOfUser: "guest" }
      })

      // console.log("Response is:", res);
      toast("Request submitted successfully!")

      setSuccess(true);
      reset();
    } catch (err) {
      console.error(err);
    }
  };

  const highlight = useSelector(
    (state: any) => state.ui.highlightStartButton
  );


  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (!val) setSuccess(false); // when closing
      setOpen(val);
    }}>
      <DialogTrigger asChild>
        <button className={`border border-white text-white text-lg px-2 py-1 rounded-xl hover:text-[#c1c0c0] hover:border-[#c1c0c0] transition-all cursor-pointer whitespace-nowrap w-fit max-w-full ms-auto ${highlight ? "blink-highlight" : ""}`}>
          Get Started
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-gray-500 text-xl">
            Start Your Project With Me
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Tell me about your idea — I’ll get back with a quote.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="text-center py-6">
            <p className="text-green-700 text-lg">
              Request submitted successfully!
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
              <Select onValueChange={(value) => setValue("workType", value, { shouldValidate: true })}>
                <SelectTrigger className="w-full bg-transparent border">
                  <SelectValue placeholder="Type of Work" />
                </SelectTrigger>

                <SelectContent className="border border-white/10 cursor-pointer">
                  {workTypes.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
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
              <Select onValueChange={(value) => setValue("budget", value, { shouldValidate: true })}>
                <SelectTrigger className="w-full bg-transparent border">
                  <SelectValue placeholder="Select Budget" />
                </SelectTrigger>

                <SelectContent className=" border border-white/10 cursor-pointer">
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
                {isSubmitting ? <ButtonSpinner /> : "Submit as Guest"}
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
                onClick={() => {
                  setOpen(false);
                  router.push("/sign-in");
                }}
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