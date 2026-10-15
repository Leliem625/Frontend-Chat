export interface AuthTimelineStepperProps {
  currentStep: 1 | 2 | 3;
}

export function AuthTimelineStepper({ currentStep }: AuthTimelineStepperProps) {
  const steps = [
    { step: 1, title: "Bước 1", desc: "Nhập email" },
    { step: 2, title: "Bước 2", desc: "Xác thực OTP" },
    { step: 3, title: "Bước 3", desc: "Đổi mật khẩu" },
  ];

  return (
    <div className="w-full max-w-sm rounded-2xl bg-surface-container-lowest/10 p-5 shadow-inner backdrop-blur-md">
      <div className="relative flex items-start justify-between">
        {/* Connecting Line */}
        <div className="absolute left-6 right-6 top-4 -z-0 h-0.5 bg-surface-container-lowest/20" />

        {steps.map((s) => {
          const isDone = s.step < currentStep;
          const isActive = s.step === currentStep;

          return (
            <div
              key={s.step}
              className={`relative z-10 flex flex-col items-center text-center ${
                isActive ? "w-28" : "w-24 opacity-80"
              }`}
            >
              <div
                className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full shadow-md ${
                  isDone
                    ? "bg-tertiary text-on-tertiary"
                    : isActive
                      ? "bg-surface-container-lowest text-primary ring-4 ring-primary-container"
                      : "bg-surface-container-lowest/20 text-surface-container-lowest"
                }`}
              >
                {isDone ? (
                  <span className="material-symbols-outlined text-sm font-bold">
                    check
                  </span>
                ) : isActive ? (
                  <span className="h-2.5 w-2.5 animate-ping rounded-full bg-primary" />
                ) : (
                  <span className="font-label-sm text-label-sm font-bold">
                    {s.step}
                  </span>
                )}
              </div>
              <span
                className={`font-label-md text-label-md ${
                  isActive ? "font-bold text-surface-container-lowest" : "text-surface-container-lowest/90"
                }`}
              >
                {s.title}
              </span>
              <span className="font-label-sm text-[11px] text-surface-container-lowest/80">
                {s.desc}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
