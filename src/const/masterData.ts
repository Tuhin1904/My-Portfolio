export const workTypes = [
  { label: "Web Development", value: "web-dev" },
  { label: "App Development", value: "app-dev" },
  { label: "UI/UX Design", value: "ui-ux" },
  { label: "Cloud Services", value: "cloud" },
  { label: "AI Integration", value: "ai" },
  { label: "Custom SaaS Solutions", value: "saas" },
  { label: "E-commerce Development", value: "ecommerce" },
  { label: "API Development & Integration", value: "api-dev" },
  { label: "CRM & ERP Integration", value: "crm-erp" },
  { label: "Maintenance & Support", value: "maintenance" },
];

export const budgetOptions = [
  { label: "₹10k–₹25k", value: "10k-25k" },
  { label: "₹25k–₹50k", value: "25k-50k" },
  { label: "₹50k–₹1L", value: "50k-1l" },
  { label: "₹1L–₹2L", value: "1l-2l" },
  { label: "₹2L–₹5L", value: "2l-5l" },
  { label: "₹5L+", value: "5l+" },
];

export const getLabel = (value: string) =>
  workTypes.find((i: any) => i.value === value)?.label || value;

export const getBudgetLabel = (value: string) =>
  budgetOptions.find((i: any) => i.value === value)?.label || value;
