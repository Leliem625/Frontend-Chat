import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";

import { forgotPassword } from "@/api/auth";
import appLogo from "@/assets/messenger_app_icon.png";
import { PasswordStrengthMeter } from "@/components/auth/PasswordStrengthMeter";
import { Icon, Spinner } from "@/components/common";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [logoutOtherDevices, setLogoutOtherDevices] = useState(true);
  const [loading, setLoading] = useState(false);

  const hasMinLength = newPassword.length >= 8;
  const hasCase = /[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword);
  const isStrong = hasMinLength && hasCase && hasNumber && hasSpecial;

  const isMatch = confirmPassword.length > 0 && newPassword === confirmPassword;
  const isMismatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;

  const handleSubmitNewPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!hasMinLength || !hasCase || !hasNumber) {
      toast.error("Mật khẩu chưa đủ mạnh", {
        description: "Vui lòng hoàn thành các tiêu chí bảo mật cho mật khẩu",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu không khớp", {
        description: "Mật khẩu xác nhận không trùng khớp",
      });
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email, newPassword);
      toast.success("Đặt lại mật khẩu thành công!", {
        description: "Mời bạn đăng nhập bằng mật khẩu mới",
      });
      navigate("/login", { replace: true });
    } catch (error: any) {
      toast.error("Lỗi cập nhật mật khẩu", {
        description: error.message || "Không thể đặt lại mật khẩu lúc này",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh h-full w-full flex-col overflow-y-auto bg-surface lg:flex-row lg:overflow-hidden">
      {/* Left Column: Branding / Security Showcase (Desktop only: >= 1024px) */}
      <section className="relative z-10 hidden flex-col justify-between overflow-hidden bg-primary-container p-6 text-on-primary-container shadow-xl lg:flex lg:h-full lg:w-5/12 lg:p-10 xl:w-1/2 xl:p-12">
        {/* Ambient Lighting & Graphic Decors */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary opacity-40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-tertiary-fixed-dim opacity-20 blur-3xl" />

        {/* Top Brand Tag */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-space-sm rounded-full bg-surface-container-lowest/15 px-3.5 py-1.5 backdrop-blur-md">
            <Icon
              name="shield_with_heart"
              size={18}
              filled
              className="text-primary-fixed"
            />
            <span className="font-label-md text-label-md tracking-wider text-surface-container-lowest uppercase">
              Streamline Shield
            </span>
          </div>
          <span className="rounded-full bg-primary/40 px-2.5 py-0.5 font-mono font-label-sm text-label-sm text-primary-fixed/80">
            STEP 03/03
          </span>
        </div>

        {/* Main Visual & Headline */}
        <div className="relative z-10 my-auto flex max-w-lg flex-col items-start py-4">
          {/* Floating Security Badge Illustration */}
          <div className="relative mb-5 self-center lg:self-start">
            <div className="relative flex h-36 w-36 items-center justify-center rounded-3xl bg-surface-container-lowest/10 p-3.5 shadow-2xl backdrop-blur-xl sm:h-40 sm:w-40">
              <img
                src="https://lh3.googleusercontent.com/aida/AEtjO1X_bGOA19-6UpC99JupxlaaULZqvTRzENnDtSYd6PrGJ3Q-m8ULHzf5qJFilBrXflsI8hMlv2L1Nbf_g-Qr85lnntc7V_9nxzyBEI9q6I2TBE1tyNNE4tTbh2dXfOEYGUqFxkqnaBjBoFC2ZcJZzU2q-wH3YPlDMsUwlcmR6Tg8U25WoyxxB_j85uF-yeMCwf6_60ptVf-Mig2i_jaN2RmW1IbjUFJpbpuG6sGG7xffKGiWxTkv_fvp06Q"
                alt="Khóa an toàn"
                className="h-full w-full object-contain filter drop-shadow-md pointer-events-none select-none"
              />
              <div className="absolute -bottom-2.5 -right-2.5 flex items-center gap-1 rounded-full bg-tertiary px-2.5 py-1 text-on-tertiary shadow-lg">
                <Icon name="verified" size={14} filled />
                <span className="font-label-sm text-label-sm">256-bit AES</span>
              </div>
            </div>
          </div>

          <h1 className="mb-2 font-headline-lg text-headline-lg tracking-tight text-surface-container-lowest">
            Khởi tạo mật khẩu mạnh mẽ &amp; an toàn
          </h1>
          <p className="mb-5 font-body-md text-body-md leading-relaxed text-primary-fixed opacity-95">
            Thiết lập mật khẩu mới để bảo vệ toàn diện các cuộc trò chuyện và dữ
            liệu của bạn trước các rủi ro xâm nhập.
          </p>

          {/* Recommended Security Highlights Card */}
          <div className="w-full rounded-2xl bg-surface-container-lowest/10 p-4 shadow-inner backdrop-blur-md">
            <div className="mb-2 flex items-center gap-2 font-label-sm text-label-sm uppercase tracking-wider text-primary-fixed">
              <Icon name="verified_user" size={16} />
              <span>Tiêu chuẩn bảo vệ dữ liệu</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-surface-container-lowest">
              <div className="flex items-center gap-1.5">
                <Icon
                  name="lock_reset"
                  size={16}
                  className="text-tertiary-fixed"
                />
                <span className="font-body-sm text-body-sm">
                  Đồng bộ mã hóa E2EE
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Icon name="devices" size={16} className="text-tertiary-fixed" />
                <span className="font-body-sm text-body-sm">
                  Rà soát phiên truy cập
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Icon
                  name="notifications_active"
                  size={16}
                  className="text-tertiary-fixed"
                />
                <span className="font-body-sm text-body-sm">
                  Cảnh báo đăng nhập lạ
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Icon
                  name="fingerprint"
                  size={16}
                  className="text-tertiary-fixed"
                />
                <span className="font-body-sm text-body-sm">
                  Hỗ trợ Passkey / Sinh trắc
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Left Footer Info */}
        <div className="relative z-10 flex items-center justify-between pt-4 text-primary-fixed/80">
          <span className="font-body-sm text-body-sm">
            © Streamline Connect System
          </span>
          <div className="flex items-center gap-1 font-label-sm text-label-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-tertiary-fixed" />
            <span>Giao thức kết nối an toàn (SSL/TLS)</span>
          </div>
        </div>
      </section>

      {/* Right Column: Reset Password Form (Full width on mobile, right on desktop) */}
      <section className="relative flex min-h-full flex-1 flex-col justify-between overflow-y-auto bg-surface p-5 sm:p-8 lg:h-full lg:w-7/12 lg:p-10 xl:w-1/2 xl:p-12 lg:overflow-hidden">
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
                Đặt lại mật khẩu
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1.5 rounded-full bg-primary-fixed/40 px-2.5 py-0.5 font-label-sm text-label-sm text-primary">
            <span>Bước 3/3</span>
          </div>
        </div>

        <div className="mx-auto my-auto flex w-full max-w-md flex-col py-2 sm:py-4">
          {/* Breadcrumb / Back Navigation */}
          <Link
            to="/login"
            className="group mb-4 inline-flex items-center gap-1.5 self-start font-label-md text-label-md text-on-surface-variant transition-colors hover:text-primary"
          >
            <Icon
              name="arrow_back"
              size={18}
              className="transition-transform group-hover:-translate-x-1"
            />
            <span>Quay lại trang Đăng nhập</span>
          </Link>

          {/* Form Header */}
          <div className="mb-5">
            <div className="mb-2 inline-block rounded-full bg-primary-fixed px-2.5 py-0.5 font-label-sm text-label-sm text-on-primary-fixed">
              BẢO MẬT TÀI KHOẢN
            </div>
            <h2 className="mb-1 font-headline-lg text-headline-lg font-bold tracking-tight text-on-surface">
              Tạo mật khẩu mới
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Mật khẩu mới của bạn cần khác biệt với các mật khẩu đã từng sử
              dụng trước đây để đảm bảo an toàn tối đa.
            </p>
          </div>

          {/* Form Elements */}
          <form
            onSubmit={handleSubmitNewPassword}
            className="flex flex-col gap-3.5"
            noValidate
          >
            {/* Field 1: New Password */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="new-password"
                className="flex items-center justify-between font-label-md text-label-md font-medium text-on-surface"
              >
                <span>Mật khẩu mới</span>
                <span
                  className={`flex items-center gap-1 font-label-sm text-label-sm ${
                    isStrong
                      ? "text-tertiary"
                      : newPassword
                        ? "text-amber-600"
                        : "text-outline"
                  }`}
                >
                  <Icon
                    name={isStrong ? "check_circle" : "shield"}
                    size={14}
                    filled={isStrong}
                  />
                  {isStrong
                    ? "Mạnh"
                    : newPassword
                      ? "Đang hoàn thiện"
                      : "Chưa nhập"}
                </span>
              </label>

              <div className="relative flex items-center rounded-xl bg-surface-container transition-all focus-within:bg-surface-container-lowest focus-within:shadow-md">
                <span className="pointer-events-none absolute left-3.5 text-on-surface-variant">
                  <Icon name="lock" size={18} />
                </span>
                <input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="new-password"
                  required
                  className="h-11 w-full bg-transparent py-2.5 pl-11 pr-11 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  aria-label="Ẩn hiện mật khẩu"
                  className="absolute right-3 flex items-center justify-center rounded-full p-1 text-on-surface-variant transition-colors hover:text-primary"
                >
                  <Icon
                    name={showNewPassword ? "visibility_off" : "visibility"}
                    size={18}
                  />
                </button>
              </div>

              {/* Password Strength Meter Component */}
              <PasswordStrengthMeter password={newPassword} />
            </div>

            {/* Field 2: Confirm New Password */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="confirm-password"
                className="font-label-md text-label-md font-medium text-on-surface"
              >
                Xác nhận mật khẩu mới
              </label>
              <div className="relative flex items-center rounded-xl bg-surface-container transition-all focus-within:bg-surface-container-lowest focus-within:shadow-md">
                <span className="pointer-events-none absolute left-3.5 text-on-surface-variant">
                  <Icon name="lock_reset" size={18} />
                </span>
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="new-password"
                  required
                  className="h-11 w-full bg-transparent py-2.5 pl-11 pr-11 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label="Ẩn hiện mật khẩu xác nhận"
                  className="absolute right-3 flex items-center justify-center rounded-full p-1 text-on-surface-variant transition-colors hover:text-primary"
                >
                  <Icon
                    name={showConfirmPassword ? "visibility_off" : "visibility"}
                    size={18}
                  />
                </button>
              </div>

              {/* Match Indicator */}
              {isMatch && (
                <div className="flex items-center gap-1.5 px-1 pt-0.5 font-label-sm text-label-sm text-tertiary">
                  <Icon name="done_all" size={15} />
                  <span>Mật khẩu trùng khớp hoàn toàn</span>
                </div>
              )}
              {isMismatch && (
                <div className="flex items-center gap-1.5 px-1 pt-0.5 font-label-sm text-label-sm text-error">
                  <Icon name="error" size={15} />
                  <span>Mật khẩu xác nhận chưa trùng khớp</span>
                </div>
              )}
            </div>

            {/* Checkbox: Log out from all other devices */}
            <div
              onClick={() => setLogoutOtherDevices((prev) => !prev)}
              className="flex cursor-pointer items-start gap-2.5 rounded-xl bg-surface-container-low p-3 transition-colors hover:bg-surface-container-high"
            >
              <input
                id="logout-devices"
                type="checkbox"
                checked={logoutOtherDevices}
                onChange={(e) => setLogoutOtherDevices(e.target.checked)}
                onClick={(e) => e.stopPropagation()}
                className="mt-0.5 h-4 w-4 cursor-pointer rounded text-primary-container accent-primary-container focus:ring-0"
              />
              <label htmlFor="logout-devices" className="cursor-pointer select-none">
                <span className="block font-label-md text-label-md text-on-surface font-semibold">
                  Đăng xuất khỏi tất cả các thiết bị khác
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  (Khuyên dùng để phòng ngừa rủi ro bảo mật &amp; vô hiệu hóa các
                  phiên đã mở)
                </span>
              </label>
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={loading || !isMatch || !isStrong}
              className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary-container px-6 font-label-lg text-label-lg font-semibold text-on-primary-container shadow-md transition-all duration-200 active:scale-[0.99] hover:bg-primary hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <Spinner size={18} color="#ffffff" />
              ) : (
                <>
                  <span>Cập nhật mật khẩu &amp; Đăng nhập</span>
                  <Icon name="arrow_forward" size={18} className="text-white" />
                </>
              )}
            </button>
          </form>

          {/* Footer Links & Compliance Statement */}
          <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-slate-100 pt-4 text-on-surface-variant sm:flex-row font-label-sm text-label-sm">
            <div className="flex cursor-pointer items-center gap-1.5 transition-colors hover:text-primary">
              <Icon name="support_agent" size={16} />
              <span>Cần hỗ trợ bảo mật? CSKH</span>
            </div>
            <div className="flex items-center gap-3">
              <a href="#" className="transition-colors hover:text-primary">
                Điều khoản
              </a>
              <span className="text-outline-variant">•</span>
              <a href="#" className="transition-colors hover:text-primary">
                Bảo mật
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
