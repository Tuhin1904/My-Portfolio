export const workTypes = [
  { label: "Web Development", value: "web-dev" },
  { label: "App Development", value: "app-dev" },
  { label: "UI/UX Design", value: "ui-ux" },
  { label: "Cloud Services", value: "cloud" },
  { label: "AI Integration", value: "ai" },
];

export const budgetOptions = [
  { label: "10k-25k", value: "10k-25k" },
  { label: "25k-50k", value: "25k-50k" },
  { label: "50k-1l", value: "50k-1l" },
  { label: "1l+", value: "1l+" },
];

export const getLabel = (value: string) =>
  workTypes.find((i: any) => i.value === value)?.label || value;
