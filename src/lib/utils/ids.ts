import { randomBytes } from "crypto";

function randomToken(bytes: number) {
  return randomBytes(bytes).toString("hex").toUpperCase();
}

export function generateSubmissionId() {
  return `SUB-${randomToken(6)}`;
}
