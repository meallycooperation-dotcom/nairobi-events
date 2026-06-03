import { v4 as uuid } from "uuid";

export function generateTicketCode() {
  return `EVT-${uuid()
    .replace(/-/g, "")
    .slice(0, 10)
    .toUpperCase()}`;
}