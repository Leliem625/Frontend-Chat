import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

import { register } from "@/api/auth";
import appLogo from "@/assets/messenger_app_icon.png";
import { PasswordStrengthMeter } from "@/components/auth/PasswordStrengthMeter";
import { SocialButtons } from "@/components/auth/SocialIcons";
import { Icon, Spinner } from "@/components/common";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [userContact, setUserContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const isMatch = confirmPassword.length > 0 && password === confirmPassword;
  const isMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !userContact.trim() || !password) {
      toast.error("Thông tin chưa đủ", {
        description: "Vui lòng nhập đầy đủ các trường bắt buộc",
      });
      return;
    }

    if (password.length < 8) {
      toast.error("Mật khẩu quá ngắn", {
        description: "Mật khẩu cần tối thiểu 8 ký tự",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Mật khẩu không khớp", {
        description: "Mật khẩu và xác nhận mật khẩu phải giống nhau",
      });
      return;
    }

    if (!agreeTerms) {
      toast.error("Chưa đồng ý điều khoản", {
        description:
          "Vui lòng đồng ý với Điều khoản dịch vụ và Chính sách bảo mật",
      });
      return;
    }

    setLoading(true);
    try {
      await register(fullName.trim(), userContact.trim(), password);
      toast.success("Đăng ký thành công!", {
        description: "Mời bạn đăng nhập vào tài khoản vừa tạo",
      });
      navigate("/login", { replace: true });
    } catch (error: any) {
      const msg =
        error.message ||
        error.response?.data?.message ||
        "Đăng ký thất bại, vui lòng thử lại";
      toast.error("Lỗi đăng ký", { description: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh h-full w-full flex-col overflow-y-auto bg-surface lg:flex-row lg:overflow-hidden">
      {/* =========================================================================
          LEFT BRANDING & HIGHLIGHTS HERO PANEL (Desktop only: >= 1024px)
         ========================================================================= */}
      <section className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-primary via-primary-container to-on-primary-fixed-variant p-6 text-on-primary lg:flex lg:h-full lg:w-5/12 lg:p-10 xl:w-1/2 xl:p-12">
        {/* Ambient Lighting Blobs */}
        <div className="pointer-events-none absolute -left-28 -top-28 h-80 w-80 rounded-full bg-primary-fixed/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-surface-tint/30 blur-3xl" />

        {/* Vector Mesh Pattern */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="register-mesh"
              width="44"
              height="44"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 44 0 L 0 0 0 44"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect fill="url(#register-mesh)" width="100%" height="100%" />
        </svg>

        {/* Top Brand Bar */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-container-lowest p-2 shadow-md">
              <img
                src={appLogo}
                alt="Streamline Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <div className="font-headline-md text-headline-md font-bold leading-none tracking-tight text-surface-container-lowest">
                Streamline
              </div>
              <div className="mt-0.5 font-label-sm text-label-sm tracking-widest text-primary-fixed uppercase">
                Desktop Edition
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 rounded-full bg-on-primary/15 px-3 py-1 text-on-primary backdrop-blur-md">
            <span className="h-2 w-2 animate-pulse rounded-full bg-tertiary-fixed" />
            <span className="font-label-md text-label-md">Gia nhập cộng đồng</span>
          </div>
        </div>

        {/* Central Stage: Value Propositions */}
        <div className="relative z-10 my-auto py-6 space-y-5">
          <div className="max-w-xl space-y-2.5">
            <div className="inline-flex items-center space-x-1.5 rounded-full bg-surface-container-lowest/15 px-3 py-1 text-primary-fixed backdrop-blur-md">
              <Icon name="person_add" size={16} filled />
              <span className="font-label-md text-label-md font-semibold tracking-wide">
                Đăng ký thành viên mới
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg font-bold leading-tight text-on-primary">
              Tạo tài khoản &amp; Trò chuyện không giới hạn
            </h1>
            <p className="font-body-md text-body-md text-primary-fixed opacity-95">
              Hàng triệu tin nhắn và cuộc gọi được mã hóa đầu cuối mỗi ngày. Bắt đầu
              kết nối cùng bạn bè và đối tác chỉ với vài bước đơn giản.
            </p>
          </div>

          {/* Benefit Cards List */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start space-x-3 rounded-2xl bg-surface-container-lowest/10 p-3.5 backdrop-blur-md transition-all hover:bg-surface-container-lowest/15">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-container-lowest/20 text-tertiary-fixed">
                <Icon name="lock" size={20} filled />
              </div>
              <div>
                <h4 className="font-label-lg text-label-lg font-semibold text-on-primary">
                  Bảo mật chuẩn mã hóa AES 256-bit
                </h4>
                <p className="mt-0.5 font-body-sm text-body-sm text-primary-fixed opacity-85">
                  Tin nhắn, hình ảnh và dữ liệu cá nhân chỉ bạn và người nhận được phép đọc.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 rounded-2xl bg-surface-container-lowest/10 p-3.5 backdrop-blur-md transition-all hover:bg-surface-container-lowest/15">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-container-lowest/20 text-primary-fixed">
                <Icon name="sync" size={20} />
              </div>
              <div>
                <h4 className="font-label-lg text-label-lg font-semibold text-on-primary">
                  Đồng bộ đa thiết bị tức thì
                </h4>
                <p className="mt-0.5 font-body-sm text-body-sm text-primary-fixed opacity-85">
                  Tiếp tục trò chuyện liền mạch giữa máy tính và điện thoại mọi lúc mọi nơi.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 rounded-2xl bg-surface-container-lowest/10 p-3.5 backdrop-blur-md transition-all hover:bg-surface-container-lowest/15">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-container-lowest/20 text-secondary-fixed">
                <Icon name="cloud_upload" size={20} />
              </div>
              <div>
                <h4 className="font-label-lg text-label-lg font-semibold text-on-primary">
                  Truyền tệp và ảnh dung lượng cao
                </h4>
                <p className="mt-0.5 font-body-sm text-body-sm text-primary-fixed opacity-85">
                  Gửi file tài liệu, video và ảnh chất lượng gốc với tốc độ cực nhanh.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Left Bottom Metadata Footer */}
        <div className="relative z-10 flex items-center justify-between pt-4 font-label-sm text-label-sm text-primary-fixed">
          <div className="flex items-center space-x-2">
            <Icon name="verified_user" size={16} />
            <span>Mã hóa đầu cuối E2EE</span>
          </div>
          <span>Streamline ID Gateway</span>
        </div>
      </section>

      {/* =========================================================================
          RIGHT REGISTRATION FORM SECTION (Responsive: Full width on mobile, right on desktop)
         ========================================================================= */}
      <main className="flex min-h-full flex-1 flex-col justify-between overflow-y-auto bg-surface-container-lowest p-5 sm:p-8 lg:h-full lg:w-7/12 lg:p-10 xl:w-1/2 xl:p-14">
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
                Web Edition
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1.5 rounded-full bg-tertiary-fixed/40 px-2.5 py-0.5 font-label-sm text-label-sm text-tertiary">
            <span className="h-1.5 w-1.5 rounded-full bg-tertiary" />
            <span>Đăng ký</span>
          </div>
        </div>

        {/* Top Context Navigation */}
        <div className="mx-auto flex w-full max-w-md items-center justify-between pb-2">
          <Link
            to="/login"
            className="group inline-flex items-center space-x-1.5 font-label-md text-label-md text-outline transition-colors hover:text-primary"
          >
            <Icon
              name="arrow_back"
              size={18}
              className="transition-transform group-hover:-translate-x-1"
            />
            <span>Quay lại đăng nhập</span>
          </Link>
          <div className="flex items-center space-x-1.5 font-label-sm text-label-sm text-on-surface-variant">
            <span className="h-2 w-2 rounded-full bg-tertiary" />
            <span>Đăng ký bảo mật</span>
          </div>
        </div>

        {/* Central Registration Form Box */}
        <div className="mx-auto my-auto w-full max-w-md py-4">
          <div className="mb-5 space-y-1">
            <h2 className="font-headline-lg text-headline-lg font-bold tracking-tight text-on-surface">
              Tạo tài khoản mới
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Điền thông tin để bắt đầu trải nghiệm trò chuyện mượt mà.
            </p>
          </div>

          <form className="space-y-3.5" onSubmit={handleRegister} noValidate>
            {/* Input 1: Họ và tên */}
            <div className="space-y-1">
              <label
                htmlFor="reg-fullname"
                className="block font-label-md text-label-md font-medium text-on-surface"
              >
                Họ và tên
              </label>
              <div className="relative flex items-center">
                <span className="pointer-events-none absolute left-3.5 text-outline">
                  <Icon name="person" size={18} />
                </span>
                <input
                  id="reg-fullname"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  required
                  autoComplete="name"
                  className="h-11 w-full rounded-xl bg-surface-container-low py-2.5 pl-11 pr-4 font-body-md text-body-md text-on-surface shadow-sm transition-all placeholder:text-outline focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Input 2: Email hoặc Số điện thoại */}
            <div className="space-y-1">
              <label
                htmlFor="reg-contact"
                className="block font-label-md text-label-md font-medium text-on-surface"
              >
                Email hoặc Số điện thoại
              </label>
              <div className="relative flex items-center">
                <span className="pointer-events-none absolute left-3.5 text-outline">
                  <Icon name="alternate_email" size={18} />
                </span>
                <input
                  id="reg-contact"
                  type="text"
                  value={userContact}
                  onChange={(e) => setUserContact(e.target.value)}
                  placeholder="name@example.com hoặc số điện thoại"
                  required
                  autoComplete="email"
                  className="h-11 w-full rounded-xl bg-surface-container-low py-2.5 pl-11 pr-4 font-body-md text-body-md text-on-surface shadow-sm transition-all placeholder:text-outline focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Input 3: Mật khẩu */}
            <div className="space-y-1">
              <label
                htmlFor="reg-password"
                className="block font-label-md text-label-md font-medium text-on-surface"
              >
                Mật khẩu
              </label>
              <div className="relative flex items-center">
                <span className="pointer-events-none absolute left-3.5 text-outline">
                  <Icon name="lock" size={18} />
                </span>
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tối thiểu 8 ký tự"
                  required
                  autoComplete="new-password"
                  className="h-11 w-full rounded-xl bg-surface-container-low py-2.5 pl-11 pr-11 font-body-md text-body-md text-on-surface shadow-sm transition-all placeholder:text-outline focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label="Hiện hoặc ẩn mật khẩu"
                  className="absolute right-3 p-1 text-outline transition-colors hover:text-on-surface"
                >
                  <Icon
                    name={showPassword ? "visibility_off" : "visibility"}
                    size={18}
                  />
                </button>
              </div>
              {password && <PasswordStrengthMeter password={password} />}
            </div>

            {/* Input 4: Xác nhận mật khẩu */}
            <div className="space-y-1">
              <label
                htmlFor="reg-confirm-password"
                className="block font-label-md text-label-md font-medium text-on-surface"
              >
                Xác nhận mật khẩu
              </label>
              <div className="relative flex items-center">
                <span className="pointer-events-none absolute left-3.5 text-outline">
                  <Icon name="lock_reset" size={18} />
                </span>
                <input
                  id="reg-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  required
                  autoComplete="new-password"
                  className="h-11 w-full rounded-xl bg-surface-container-low py-2.5 pl-11 pr-11 font-body-md text-body-md text-on-surface shadow-sm transition-all placeholder:text-outline focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label="Hiện hoặc ẩn xác nhận mật khẩu"
                  className="absolute right-3 p-1 text-outline transition-colors hover:text-on-surface"
                >
                  <Icon
                    name={showConfirmPassword ? "visibility_off" : "visibility"}
                    size={18}
                  />
                </button>
              </div>
              {isMatch && (
                <div className="flex items-center gap-1.5 pl-1 pt-0.5 font-label-sm text-label-sm text-tertiary">
                  <Icon name="done_all" size={15} />
                  <span>Mật khẩu trùng khớp hoàn toàn</span>
                </div>
              )}
              {isMismatch && (
                <div className="flex items-center gap-1.5 pl-1 pt-0.5 font-label-sm text-label-sm text-error">
                  <Icon name="error" size={15} />
                  <span>Mật khẩu xác nhận chưa khớp</span>
                </div>
              )}
            </div>

            {/* Checkbox: Đồng ý điều khoản */}
            <label className="flex cursor-pointer items-start space-x-2.5 pt-1">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 cursor-pointer rounded bg-surface-container-high text-primary focus:ring-primary"
              />
              <span className="font-body-sm text-body-sm leading-snug text-on-surface-variant">
                Tôi đồng ý với{" "}
                <a href="#" className="font-semibold text-primary hover:underline">
                  Điều khoản dịch vụ
                </a>{" "}
                và{" "}
                <a href="#" className="font-semibold text-primary hover:underline">
                  Chính sách bảo mật
                </a>
                .
              </span>
            </label>

            {/* Nút Đăng ký CTA */}
            <button
              type="submit"
              disabled={loading}
              className="group flex h-11 w-full items-center justify-center space-x-2 rounded-xl bg-primary font-label-lg text-label-lg font-semibold text-on-primary shadow-md transition-all active:scale-[0.99] hover:bg-primary-container hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <Spinner size={18} color="#ffffff" />
              ) : (
                <>
                  <span>Đăng ký tài khoản</span>
                  <Icon
                    name="arrow_forward"
                    size={18}
                    className="transition-transform group-hover:translate-x-1 text-white"
                  />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-4 flex items-center justify-center">
            <div className="h-px w-full bg-surface-container-high" />
            <span className="absolute bg-surface-container-lowest px-3 font-label-sm text-label-sm text-outline">
              Hoặc đăng ký nhanh bằng
            </span>
          </div>

          {/* Social Signups */}
          <SocialButtons />

          {/* Bottom Login Link */}
          <div className="mt-4 text-center">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Đã có tài khoản?{" "}
              <Link
                to="/login"
                className="group inline-flex items-center space-x-1 font-label-md text-label-md font-bold text-primary transition-colors hover:text-primary-container"
              >
                <span>Đăng nhập ngay</span>
                <Icon
                  name="arrow_forward"
                  size={15}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </p>
          </div>
        </div>

        {/* Security and Encryption Footer Note */}
        <div className="mx-auto flex w-full max-w-md flex-col items-center justify-between gap-2 border-t border-surface-container-high/50 pt-4 font-label-sm text-label-sm text-outline sm:flex-row">
          <div className="flex items-center space-x-1.5">
            <Icon name="lock" size={15} filled className="text-tertiary" />
            <span>Mã hóa E2EE bảo mật</span>
          </div>
          <div className="flex items-center space-x-3">
            <a href="#" className="transition-colors hover:text-on-surface">
              Điều khoản
            </a>
            <span>•</span>
            <a href="#" className="transition-colors hover:text-on-surface">
              Quyền riêng tư
            </a>
            <span>•</span>
            <a href="#" className="transition-colors hover:text-on-surface">
              Trợ giúp
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
