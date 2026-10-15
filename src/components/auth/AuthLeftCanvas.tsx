import type { ReactNode } from "react";

export interface AuthLeftCanvasProps {
  brandTitle?: string;
  brandTag?: string;
  versionBadge?: string;
  headline: ReactNode;
  description: string;
  children: ReactNode;
  footerLeft?: ReactNode;
  footerRight?: ReactNode;
  bgGradient?: string;
}

export function AuthLeftCanvas({
  brandTitle = "Streamline",
  brandTag = "Desktop Edition",
  versionBadge,
  headline,
  description,
  children,
  footerLeft,
  footerRight,
  bgGradient = "bg-primary-container",
}: AuthLeftCanvasProps) {
  return (
    <div
      className={`relative hidden w-full flex-col justify-between overflow-hidden p-6 text-on-primary-container lg:flex lg:h-full lg:w-5/12 lg:p-10 xl:w-1/2 xl:p-12 ${bgGradient}`}
    >
      {/* Ambient Lighting Blobs */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary-fixed-dim/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-0 h-80 w-80 rounded-full bg-surface-tint/30 blur-3xl" />

      {/* Top Branding Bar */}
      <div className="relative z-10">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-lowest text-primary shadow-md">
              <span
                className="material-symbols-outlined text-[24px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                forum
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-headline-sm text-headline-sm font-bold tracking-tight text-surface-container-lowest">
                  {brandTitle}
                </span>
                {versionBadge && (
                  <span className="rounded-full bg-surface-container-lowest/20 px-2 py-0.5 font-label-sm text-label-sm uppercase tracking-wider text-surface-container-lowest backdrop-blur-md">
                    {versionBadge}
                  </span>
                )}
              </div>
              <p className="font-label-sm text-label-sm tracking-wider text-primary-fixed">
                {brandTag}
              </p>
            </div>
          </div>
        </div>

        <h1 className="mb-4 font-headline-lg text-headline-lg tracking-tight text-surface-container-lowest">
          {headline}
        </h1>
        <p className="max-w-md font-body-md text-body-md leading-relaxed text-primary-fixed opacity-95">
          {description}
        </p>
      </div>

      {/* Center Showcase / Micro-Interactions */}
      <div className="relative z-10 my-8 flex flex-col items-center">
        {children}
      </div>

      {/* Bottom Metadata Footer */}
      <div className="relative z-10 flex flex-wrap items-center justify-between pt-6 font-label-sm text-label-sm text-primary-fixed">
        <div className="flex items-center gap-4">
          {footerLeft ?? (
            <span className="flex items-center gap-1.5">
              <span
                className="material-symbols-outlined text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified_user
              </span>
              Bảo mật mã hóa AES 256-bit
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-primary-fixed">
          {footerRight ?? (
            <>
              <span className="material-symbols-outlined text-sm">lock</span>
              <span>Secure Gateway v2.4</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
