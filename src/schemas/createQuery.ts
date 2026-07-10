import * as yup from "yup";

export const formSchema = yup.object({
  name: yup.string().required("Name is required"),

  email: yup.string().email("Invalid email").required("Email is required"),

  workType: yup.string().required("Please select a work type"),

  budget: yup.string().required("Please select a budget"),

  message: yup
    .string()
    .min(10, "Minimum 10 characters")
    .required("Message is required"),
});
