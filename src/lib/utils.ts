export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string) {
  const date = new Date(value);

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function truncateText(value: string, length = 120) {
  if (value.length <= length) {
    return value;
  }

  return `${value.slice(0, length).trim()}…`;
}
