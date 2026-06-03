import { v4 as uuid } from "uuid";

export function generateReference() {
  return `PAY-${uuid()
    .replace(/-/g, "")
    .slice(0, 12)
    .toUpperCase()}`;
}
