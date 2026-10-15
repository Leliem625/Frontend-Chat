import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";

import { sendOtp, verifyOtp } from "@/api/auth";
import appLogo from "@/assets/messenger_app_icon.png";
import { AuthTimelineStepper } from "@/components/auth/AuthTimelineStepper";
import { OtpInputCells } from "@/components/auth/OtpInputCells";
import { Icon, Spinner } from "@/components/common";

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "user***@gmail.com";

  const [otpCode, setOtpCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(48);
  const [loading, setLoading] = useState(false);

  // Đếm ngược gửi lại mã
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleResendOtp = async () => {
    setTimeLeft(60);
    setOtpCode("");
    toast.info("Đã gửi lại mã", {
      description: `Mã OTP mới đã được gửi tới ${email}`,
    });
    try {
      await sendOtp(email);
    } catch (error: any) {
      toast.error("Không thể gửi OTP", {
        description: error.message || "Vui lòng thử lại sau",
      });
    }
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 6) {
      toast.error("Mã OTP chưa đủ", {
        description: "Vui lòng nhập đủ 6 chữ số mã xác thực",
      });
      return;
    }

    setLoading(true);
    try {
      await verifyOtp(otpCode, email);
      toast.success("Xác thực thành công", {
        description: "Mời bạn tạo mật khẩu mới",
      });
      navigate(
        `/reset-password?${new URLSearchParams({ email, otp: otpCode })}`
      );
    } catch (error: any) {
      toast.error("Mã OTP không đúng", {
        description: error.message || "Mã xác thực không hợp lệ hoặc đã hết hạn",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTimer = (secs: number) => {
    const s = secs < 10 ? `0${secs}` : secs;
    return `00:${s}s`;
  };

  return (
    <div className="grid min-h-dvh h-full w-full grid-cols-1 bg-surface overflow-y-auto lg:overflow-hidden lg:grid-cols-12">
      {/* LEFT PANEL: Brand Story & Security Progress Timeline (Desktop only: >= 1024px) */}
      <section className="relative hidden flex-col justify-between overflow-hidden bg-primary p-6 text-on-primary shadow-2xl lg:flex lg:h-full lg:col-span-5 lg:p-10">
        {/* Ambient Fluid Gradients */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary-container/40 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-primary-fixed-dim/20 blur-2xl" />

        {/* Top Brand Bar */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-lowest/15 shadow-sm backdrop-blur-md">
              <Icon
                name="lock_open"
                size={22}
                filled
                className="text-surface-container-lowest"
              />
            </div>
            <div>
              <span className="block font-headline-sm text-headline-sm font-bold tracking-tight text-surface-container-lowest">
                Streamline
              </span>
              <span className="block font-label-sm text-label-sm tracking-wider text-primary-fixed uppercase">
                Identity &amp; Access Guard
              </span>
            </div>
          </div>
          <span className="rounded-full bg-surface-container-lowest/10 px-3 py-1 font-label-sm text-label-sm text-surface-container-lowest backdrop-blur-md">
            2FA Secure Port
          </span>
        </div>

        {/* Center Stage: Hero Graphic & Stepper Visualizer */}
        <div className="relative z-10 my-auto flex flex-col items-center py-4 text-center">
          <div className="group relative mb-5">
            <div className="absolute inset-0 rounded-3xl bg-primary-container opacity-50 blur-xl transition-transform duration-500 group-hover:scale-105" />
            <div className="relative flex h-40 w-40 flex-col items-center justify-center rounded-3xl bg-surface-container-lowest/10 p-4 shadow-xl backdrop-blur-xl sm:h-44 sm:w-44 lg:h-48 lg:w-48">
              <img
                src="https://lh3.googleusercontent.com/aida/AEtjO1UNEIq03HULcp0RuWP_rBSvZDLhDvW8cgy3KogmT4kRvRsadWpDpNo9w-ZV-7x5Fqhd6LbgfMzg6rTGWttN3jI8huq7EMK58cUT7G2jKOGsrIBAUZMuqL_NSGPidXqMJCip6kBFEQflI-wV0JuKkVVPArBi7M-Y5GtgwAOS5DhPlgnvehljrcj_4WZd3WlZppVPCCK_74TBWT2KM9DvxL91ib3Dj5p8JZ1WVjt3ovbaCCGp_bK75NcSKOg"
                alt="Minh họa OTP"
                className="h-full w-full object-contain filter drop-shadow-md transition duration-500 hover:scale-105 pointer-events-none select-none"
              />
            </div>
            <div className="absolute -bottom-2.5 left-1/2 flex -translate-x-1/2 items-center space-x-1.5 whitespace-nowrap rounded-full bg-surface-container-lowest px-3 py-1 font-label-sm text-label-sm text-primary shadow-lg">
              <span className="h-2 w-2 animate-pulse rounded-full bg-tertiary" />
              <span>Mã hóa AES-256 Bit</span>
            </div>
          </div>

          <h1 className="mb-2 max-w-sm font-headline-lg text-headline-lg tracking-tight text-surface-container-lowest">
            Bảo vệ tài khoản hai lớp
          </h1>
          <p className="mb-5 max-w-sm font-body-md text-body-md leading-relaxed text-primary-fixed opacity-95">
            Quy trình chuyển tiếp khóa mã hóa một lần (OTP) theo thời gian thực
            nhằm đảm bảo chỉ có bạn sở hữu quyền can thiệp tài khoản.
          </p>

          {/* Dynamic Process Timeline Stepper Component */}
          <AuthTimelineStepper currentStep={2} />
        </div>

        {/* Left Bottom Status Metadata */}
        <div className="relative z-10 flex items-center justify-between pt-3 font-label-sm text-label-sm text-primary-fixed">
          <div className="flex items-center space-x-2">
            <Icon name="verified_user" size={16} />
            <span>Zero-Knowledge System</span>
          </div>
          <span>Phiên: #8392-Sec</span>
        </div>
      </section>

      {/* RIGHT PANEL: Dedicated OTP Entry Core (Full width on mobile, right on desktop) */}
      <main className="flex min-h-full flex-1 flex-col justify-between overflow-y-auto bg-surface-container-lowest p-5 sm:p-8 lg:h-full lg:col-span-7 lg:p-10 lg:overflow-hidden">
        {/* Mobile Header (Brand Icon + Title, visible on < lg) */}
        <div className="flex items-center justify-between pb-4 lg:hidden">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-low p-2 shadow-sm">
              <img
                src={appLogo}
                alt="Streamline Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <div className="font-headline-sm text-headline-sm font-bold leading-none text-on-surface">
                Streamline
              </div>
              <div className="mt-0.5 font-label-sm text-label-sm tracking-wider text-outline uppercase">
                Xác thực 2FA
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1.5 rounded-full bg-primary-fixed/40 px-2.5 py-0.5 font-label-sm text-label-sm text-primary">
            <span>Bước 2/3</span>
          </div>
        </div>

        {/* Top Context Nav */}
        <div className="mx-auto flex w-full max-w-md items-center justify-between pb-2">
          <Link
            to="/forgot-password"
            className="group inline-flex items-center space-x-2 rounded-full bg-surface-container px-3 py-1 font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-high"
          >
            <Icon
              name="arrow_back"
              size={18}
              className="transition-transform group-hover:-translate-x-1"
            />
            <span>Đổi email khác</span>
          </Link>
          <div className="flex items-center space-x-1.5 font-label-sm text-label-sm text-on-surface-variant">
            <span className="h-2 w-2 rounded-full bg-tertiary" />
            <span>Cổng bảo mật trực tuyến</span>
          </div>
        </div>

        {/* Main OTP Entry Box */}
        <div className="mx-auto my-auto w-full max-w-md py-4">
          {/* Header Messaging */}
          <div className="mb-5 space-y-1">
            <div className="mb-2 inline-flex items-center space-x-1.5 rounded-full bg-primary-fixed px-3 py-0.5 font-label-sm text-label-sm text-on-primary-fixed">
              <Icon name="mark_email_read" size={15} filled />
              <span>Mã 6 chữ số đã được gửi</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg font-bold tracking-tight text-on-surface">
              Xác thực mã OTP 6 số
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Mã xác thực đã được gửi đến{" "}
              <span className="rounded bg-surface-container-low px-2 py-0.5 font-semibold text-on-surface">
                {email}
              </span>
              . Kiểm tra hộp thư đến hoặc thư rác.
            </p>
          </div>

          {/* Interactive 6-Cell OTP Input Control */}
          <form onSubmit={handleVerifyOtp} className="space-y-5" noValidate>
            <div>
              <OtpInputCells
                value={otpCode}
                onChange={setOtpCode}
                disabled={loading}
              />
            </div>

            {/* Resend Countdown Timer Banner */}
            <div className="flex flex-col items-center justify-between gap-2.5 rounded-xl bg-surface-container-low p-3 sm:flex-row">
              <div className="flex items-center space-x-2 font-body-sm text-body-sm text-on-surface-variant">
                <Icon
                  name="schedule"
                  size={16}
                  className="animate-spin text-primary"
                  style={{ animationDuration: "4s" }}
                />
                <span>Gửi lại sau:</span>
                <span
                  className={`font-label-md text-label-md font-bold tracking-wide ${
                    timeLeft > 0 ? "text-primary" : "text-outline"
                  }`}
                >
                  {formatTimer(timeLeft)}
                </span>
              </div>
              <button
                type="button"
                disabled={timeLeft > 0 || loading}
                onClick={handleResendOtp}
                className="flex items-center space-x-1 font-label-sm text-label-sm font-bold text-primary transition-colors hover:text-primary-container disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span>Gửi lại mã</span>
                <Icon name="refresh" size={15} />
              </button>
            </div>

            {/* Primary Submit Action Button */}
            <button
              type="submit"
              disabled={loading || otpCode.length < 6}
              className="flex h-11 w-full items-center justify-center space-x-2 rounded-xl bg-primary font-label-lg text-label-lg font-semibold text-on-primary shadow-md transition-all duration-150 active:scale-[0.99] hover:bg-primary-container hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <Spinner size={18} color="#ffffff" />
              ) : (
                <>
                  <span>Xác nhận mã OTP</span>
                  <Icon name="arrow_forward" size={18} className="text-white" />
                </>
              )}
            </button>
          </form>

          {/* Security Guard Tip Card */}
          <div className="mt-5 flex items-start space-x-3 rounded-xl bg-surface-container-low/80 p-3.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-tertiary-fixed/40 p-1 shadow-sm">
              <img
                src="https://lh3.googleusercontent.com/aida/AEtjO1UspyEiNXU2zDk_oPD3o0YYO08_kjfr05zKv8oIwzMjD5OO0FHTZrKhk81hZ2PqMbc50L25U4nOSZG88Z2mOVLFEePYOrQFl5_2iZs_33GWRCJHRwokwwC-3Xz9u6sBiPPS0kv3sFGQfXEz4lrHrIXb2CD_TcENQlcKjjDdIq4e7ltgUdxONkmYrvi48wJAeFBxSvxec_Jpm0BKSbkAvPflKb7kDcNhwVPH5DzWZLftOsMT1_-ISyRlOaE"
                alt="Bảo mật"
                className="h-full w-full object-contain pointer-events-none select-none"
              />
            </div>
            <div>
              <div className="mb-0.5 flex items-center space-x-1 font-label-md text-label-md font-bold text-on-surface">
                <span>Mẹo bảo vệ danh tính</span>
                <Icon
                  name="check_circle"
                  size={15}
                  filled
                  className="text-tertiary"
                />
              </div>
              <p className="font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
                Nhân viên Streamline{" "}
                <strong className="font-semibold text-on-surface">
                  không bao giờ
                </strong>{" "}
                yêu cầu bạn cung cấp mã xác thực OTP này qua bất kỳ hình thức nào.
              </p>
            </div>
          </div>
        </div>

        {/* Right Desktop Sub-footer */}
        <footer className="mx-auto flex w-full max-w-xl flex-col items-center justify-between gap-2 pt-6 font-label-sm text-label-sm text-on-surface-variant sm:flex-row">
          <span>© 2026 Streamline Security Inc. Tất cả quyền được bảo lưu.</span>
          <div className="flex items-center space-x-4">
            <a href="#" className="transition-colors hover:text-primary">
              Trợ giúp
            </a>
            <span>•</span>
            <a href="#" className="transition-colors hover:text-primary">
              Điều khoản bảo mật
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
