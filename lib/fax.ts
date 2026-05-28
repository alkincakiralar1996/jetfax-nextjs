// Server-issued fax confirmation number, e.g. "FX-48213-KQF".
// Letters exclude I/L/O to stay legible on a printed receipt.
const LETTERS = "ABCDEFGHJKMNPQRSTUVWXYZ";

export function confirmationNumber(): string {
  const a = Math.floor(10000 + Math.random() * 89999);
  const b = Array.from({ length: 3 })
    .map(() => LETTERS[Math.floor(Math.random() * LETTERS.length)])
    .join("");
  return `FX-${a}-${b}`;
}
