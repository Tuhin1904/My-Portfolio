import { apiRequest } from '@/apiFiles/apiClient';
import { apiEndpoints } from '@/apiFiles/apiEndpoints';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { budgetOptions, workTypes } from '@/const/masterData';
import { RootState } from '@/store';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

type FormValues = {
    workType: string;
    budget: string;
    message: string;
    name: string;
    email: string;
};

const CreateProjectRequest = () => {
    const router = useRouter();
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
        console.log("Form Data:", data);
        try {
            // console.log("Form Data:", data);
            await apiRequest({
                method: "POST",
                url: apiEndpoints.postRequest,
                data: { ...data, typeOfUser: "registered" }
            })

            // console.log("Response is:", res);
            toast("Request submitted successfully!")
            router.push("/my-project-requests")

        } catch (err) {
            console.error(err);
        }

    };

    return (
        <div className="min-h-[50vh] flex justify-center items-start">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full bg-white p-8 rounded-lg shadow-sm border flex flex-col gap-2"
            >
                <h2 className="text-2xl font-semibold text-center mb-6">
                    Work Inquiry
                </h2>

                <div className='flex gap-2 flex-col lg:flex-row'>
                    <div className='flex-1'>
                        {/* Work Type */}
                        <Controller
                            name="workType"
                            control={control}
                            rules={{ required: "Work type is required" }}
                            render={({ field }) => (
                                <>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger
                                            className={`w-full mb-1 cursor-pointer ${errors.workType ? "border-red-500" : ""
                                                }`}
                                        >
                                            <SelectValue placeholder="Type of Work" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {workTypes.map((item) => (
                                                <SelectItem key={item.value} value={item.value} className='cursor-pointer'>
                                                    {item.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {errors.workType && (
                                        <p className="text-red-500 text-sm mb-3">
                                            {errors.workType.message}
                                        </p>
                                    )}
                                </>
                            )}
                        />
                    </div>
                    <div className='flex-1'>
                        {/* Budget */}
                        <Controller
                            name="budget"
                            control={control}
                            rules={{ required: "Budget is required" }}
                            render={({ field }) => (
                                <>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className={`w-full cursor-pointer ${errors.budget ? "border-red-500" : ""}`}>
                                            <SelectValue placeholder="Select Budget" />
                                        </SelectTrigger>
                                        <SelectContent >
                                            {budgetOptions.map((item) => (
                                                <SelectItem key={item.value} value={item.value} className='cursor-pointer'>
                                                    {item.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {errors.budget && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.budget.message}
                                        </p>
                                    )}
                                </>
                            )}
                        />
                    </div>
                </div>
                <div className='flex gap-2 flex-col lg:flex-row'>
                    {/* Name */}
                    <div className='flex-1'>
                        <Input
                            placeholder="Your Name"
                            disabled
                            {...register("name", { required: "Name is required" })}
                            className={errors.name ? "border-red-500 bg-gray-100" : "bg-gray-100"}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mb-3">
                                {errors.name.message}
                            </p>
                        )}
                    </div>
                    <div className='flex-1'>
                        {/* Email */}
                        <Input
                            type="email"
                            placeholder="Your Email"
                            disabled
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: "Invalid email",
                                },
                            })}
                            className={errors.email ? "border-red-500 bg-gray-100" : "bg-gray-100"}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mb-3">
                                {errors.email.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Message */}
                <Textarea
                    placeholder="Your Message"
                    rows={4}
                    {...register("message", { required: "Message is required" })}
                    className={errors.message ? "border-red-500" : ""}
                />
                {errors.message && (
                    <p className="text-red-500 text-sm mb-3">
                        {errors.message.message}
                    </p>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    className="w-full bg-gray-900 text-white py-3 rounded-md font-medium hover:bg-gray-700 transition mt-2 cursor-pointer"
                >
                    Submit
                </button>
            </form>
        </div>
    )
}

export default CreateProjectRequest