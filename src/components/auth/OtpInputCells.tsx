import {
  useRef,
  type ClipboardEvent,
  type KeyboardEvent,
  type ChangeEvent,
} from "react";

export interface OtpInputCellsProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export function OtpInputCells({ value, onChange, disabled }: OtpInputCellsProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const digits = Array.from({ length: 6 }, (_, i) => value[i] || "");

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const char = e.target.value.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    const newVal = newDigits.join("");
    onChange(newVal);

    if (char && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted);
    if (pasted.length > 0) {
      const focusIndex = Math.min(pasted.length, 5);
      inputsRef.current[focusIndex]?.focus();
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 sm:gap-3">
      {digits.map((digit, idx) => {
        const isFilled = Boolean(digit);
        return (
          <div
            key={idx}
            className={`relative flex h-16 flex-1 items-center justify-center rounded-2xl shadow-sm transition-all duration-200 sm:h-20 ${
              isFilled
                ? "bg-surface-container-lowest ring-1 ring-primary/40 shadow-md"
                : "bg-surface-container-low focus-within:bg-surface-container-lowest focus-within:ring-2 focus-within:ring-primary"
            }`}
          >
            <input
              ref={(el) => {
                inputsRef.current[idx] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              disabled={disabled}
              onChange={(e) => handleChange(e, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              onPaste={handlePaste}
              className="h-full w-full select-all bg-transparent text-center font-headline-lg text-headline-lg font-bold text-on-surface focus:outline-none focus:text-primary"
            />
          </div>
        );
      })}
    </div>
  );
}
