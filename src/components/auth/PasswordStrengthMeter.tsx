import { Icon } from "@/components/common";

export interface PasswordStrengthMeterProps {
  password: string;
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const hasMinLength = password.length >= 8;
  const hasCase = /[A-Z]/.test(password) && /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  const score =
    (hasMinLength ? 1 : 0) +
    (hasCase ? 1 : 0) +
    (hasNumber ? 1 : 0) +
    (hasSpecial ? 1 : 0);

  const criteria = [
    { ok: hasMinLength, label: "Tối thiểu 8 ký tự" },
    { ok: hasCase, label: "Chứa cả chữ hoa & chữ thường" },
    { ok: hasNumber, label: "Chứa ít nhất 1 chữ số (0-9)" },
    { ok: hasSpecial, label: "Chứa ký tự đặc biệt (!@#$%^&*)" },
  ];

  return (
    <div className="mt-2 flex flex-col gap-2">
      {/* 4-bar Progress Meter */}
      <div className="grid w-full grid-cols-4 gap-1.5">
        {[1, 2, 3, 4].map((barIndex) => {
          const isActive = barIndex <= score;
          return (
            <div
              key={barIndex}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                isActive
                  ? score >= 3
                    ? "bg-tertiary"
                    : score === 2
                      ? "bg-amber-500"
                      : "bg-red-500"
                  : "bg-surface-container-high"
              }`}
            />
          );
        })}
      </div>

      {/* Checklist Criteria Grid */}
      <div className="mt-2 grid grid-cols-1 gap-2 rounded-2xl bg-surface-container-low p-3.5 sm:grid-cols-2">
        {criteria.map((c, i) => (
          <div key={i} className="flex items-center gap-2">
            <Icon
              name={c.ok ? "check_circle" : "radio_button_unchecked"}
              size={18}
              filled={c.ok}
              className={c.ok ? "text-tertiary" : "text-outline"}
            />
            <span
              className={`font-body-sm text-body-sm ${
                c.ok ? "font-medium text-on-surface" : "text-on-surface-variant"
              }`}
            >
              {c.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
