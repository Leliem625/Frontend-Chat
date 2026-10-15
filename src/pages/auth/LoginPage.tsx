import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

import appLogo from "@/assets/messenger_app_icon.png";
import { SocialButtons } from "@/components/auth/SocialIcons";
import { Icon, Spinner } from "@/components/common";
import { useAuth } from "@/context/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      toast.error("Thông tin chưa đủ", {
        description: "Vui lòng nhập tài khoản và mật khẩu",
      });
      return;
    }

    setLoading(true);
    try {
      await login(identifier, password);
      navigate("/", { replace: true });
    } catch (error: any) {
      const msg =
        error.message ||
        error.response?.data?.message ||
        "Tài khoản hoặc mật khẩu không chính xác";
      toast.error("Lỗi đăng nhập", { description: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full min-h-dvh w-full flex-col overflow-y-auto bg-surface lg:flex-row lg:overflow-hidden">
      {/* =========================================================================
          LEFT BRANDING & VISUAL HERO PANEL (Desktop only: >= 1024px)
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
              id="login-mesh"
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
          <rect fill="url(#login-mesh)" width="100%" height="100%" />
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
              <div className="font-label-sm mt-0.5 text-label-sm uppercase tracking-widest text-primary-fixed">
                Desktop Edition
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 rounded-full bg-on-primary/15 px-3 py-1 text-on-primary backdrop-blur-md">
            <span className="h-2 w-2 animate-pulse rounded-full bg-tertiary-fixed" />
            <span className="font-label-md text-label-md">
              v4.8 Sẵn sàng trực tuyến
            </span>
          </div>
        </div>

        {/* Hero Central Content & Mock Chat Canvas */}
        <div className="relative z-10 my-auto space-y-5 py-6">
          <div className="max-w-xl space-y-2.5">
            <div className="inline-flex items-center space-x-1.5 rounded-full bg-surface-container-lowest/15 px-3 py-1 text-primary-fixed backdrop-blur-md">
              <Icon name="forum" size={16} filled />
              <span className="font-label-md text-label-md font-semibold tracking-wide">
                Trải nghiệm thế hệ mới
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg font-bold leading-tight text-on-primary">
              Kết nối mọi lúc, trò chuyện không giới hạn
            </h1>
            <p className="font-body-md text-body-md text-primary-fixed opacity-95">
              Đồng bộ dữ liệu thời gian thực giữa máy tính và điện thoại. Trực
              quan hóa công việc, trao đổi bảo mật và trò chuyện mượt mà.
            </p>
          </div>

          {/* Compact Mock Chat Previews */}
          <div className="relative w-full max-w-lg space-y-2.5 pt-1">
            {/* Incoming Mock Bubble */}
            <div className="flex items-end space-x-2.5">
              <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full border-2 border-surface-container-lowest shadow-sm">
                <img
                  className="h-full w-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDH9mZfMN715tWPHU9CnED1GndH6Vks07i4c4eGr0kB8IByR-4NLtSUj5y5K0bPasmbhBXAHjn9Ond3AZUgDG5Fd98Qp5vR7vHrO9AkY2cLXGVaSDyL0-9p-XkjGG7evDuqIvD2BrBcLi1LA5tj4f7O7cYGTjVuoPFma_2IiW8yV1PowWOTeuK_Axwd8WQJOP3XkV4TeetiBn6g3yQ5lOpJYT11V31Rt9WyO3N0nXFr3IOw1o8gYND8"
                  alt="Mai Linh"
                />
              </div>
              <div className="max-w-[82%] space-y-1 rounded-2xl rounded-bl-sm bg-surface-container-lowest p-3 text-on-surface shadow-md">
                <div className="flex items-center justify-between space-x-3">
                  <span className="font-label-md text-label-md font-semibold text-primary">
                    Mai Linh · UX Lead
                  </span>
                  <span className="font-label-sm text-label-sm text-outline">
                    10:42
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface">
                  File thiết kế giao diện desktop mới đã hoàn tất nhé! Mình vừa
                  gửi qua cloud, bạn xem thử qua chưa? 🎨✨
                </p>
              </div>
            </div>

            {/* Outgoing Mock Bubble */}
            <div className="flex items-end justify-end space-x-2">
              <div className="max-w-[80%] space-y-1 rounded-2xl rounded-br-sm bg-primary-container p-3 text-on-primary-container shadow-md">
                <p className="font-body-sm text-body-sm">
                  Tuyệt vời quá! Tốc độ truyền file trên bản desktop siêu nhanh,
                  mình đang mở review luôn đây.
                </p>
                <div className="flex items-center justify-end space-x-1 opacity-85">
                  <span className="font-label-sm text-label-sm">10:43</span>
                  <Icon
                    name="done_all"
                    size={15}
                    filled
                    className="text-tertiary-fixed"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Pillars Footer */}
        <div className="relative z-10 grid grid-cols-3 gap-3 rounded-2xl bg-surface-container-lowest/10 p-3.5 backdrop-blur-md">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-container-lowest/20 text-tertiary-fixed">
              <Icon name="bolt" size={18} />
            </div>
            <div>
              <div className="font-label-md text-label-md font-semibold leading-tight text-on-primary">
                Tốc độ tức thì
              </div>
              <div className="font-label-sm text-label-sm text-primary-fixed opacity-80">
                Phản hồi &lt;30ms
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-container-lowest/20 text-primary-fixed">
              <Icon name="shield" size={18} />
            </div>
            <div>
              <div className="font-label-md text-label-md font-semibold leading-tight text-on-primary">
                Bảo mật đa tầng
              </div>
              <div className="font-label-sm text-label-sm text-primary-fixed opacity-80">
                E2EE 256-bit
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-container-lowest/20 text-secondary-fixed">
              <Icon name="videocam" size={18} />
            </div>
            <div>
              <div className="font-label-md text-label-md font-semibold leading-tight text-on-primary">
                Gọi HD nhóm
              </div>
              <div className="font-label-sm text-label-sm text-primary-fixed opacity-80">
                Âm thanh rõ nét
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          RIGHT LOGIN FORM SECTION (Responsive: Full width on mobile, right on desktop)
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
              <div className="font-label-sm mt-0.5 text-label-sm uppercase tracking-wider text-outline">
                Web Edition
              </div>
            </div>
          </div>
          <div className="font-label-sm flex items-center space-x-1.5 rounded-full bg-tertiary-fixed/40 px-2.5 py-0.5 text-label-sm text-tertiary">
            <span className="h-1.5 w-1.5 rounded-full bg-tertiary" />
            <span>Sẵn sàng</span>
          </div>
        </div>

        {/* Desktop Top Status Context (Visible only on >= lg) */}
        {/* <div className="mx-auto hidden w-full max-w-md items-center justify-between pb-2 lg:flex">
          <div className="flex items-center space-x-2 text-outline">
            <Icon name="desktop_windows" size={18} />
            <span className="font-label-md text-label-md">Web Browser Client</span>
          </div>
          <div className="flex items-center space-x-1.5 rounded-full bg-tertiary-fixed/40 px-2.5 py-0.5 font-label-md text-label-md text-tertiary">
            <span className="h-1.5 w-1.5 rounded-full bg-tertiary" />
            <span>Hệ thống bình thường</span>
          </div>
        </div> */}

        {/* Central Form Box */}
        <div className="mx-auto my-auto w-full max-w-md py-2 sm:py-4">
          <div className="mb-5 space-y-1 sm:mb-6 sm:space-y-1.5">
            <h2 className="font-headline-lg text-headline-lg font-bold tracking-tight text-on-surface">
              Đăng nhập vào Streamline
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Chào mừng bạn quay trở lại! Điền thông tin để bắt đầu kết nối.
            </p>
          </div>

          <form
            className="space-y-3.5 sm:space-y-4"
            onSubmit={handleLogin}
            noValidate
          >
            {/* Email / Username Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-identity"
                className="font-label-md block text-label-md font-medium text-on-surface"
              >
                Email hoặc Tên đăng nhập
              </label>
              <div className="relative flex items-center">
                <span className="pointer-events-none absolute left-3.5 text-outline">
                  <Icon name="alternate_email" size={18} />
                </span>
                <input
                  id="login-identity"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="name@example.com hoặc username"
                  required
                  autoComplete="username"
                  className="font-body-md h-11 w-full rounded-xl bg-surface-container-low py-2.5 pl-11 pr-4 text-body-md text-on-surface shadow-sm transition-all placeholder:text-outline focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Password Field with Show/Hide toggle */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-password"
                className="font-label-md block text-label-md font-medium text-on-surface"
              >
                Mật khẩu
              </label>
              <div className="relative flex items-center">
                <span className="pointer-events-none absolute left-3.5 text-outline">
                  <Icon name="lock" size={18} />
                </span>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập tối thiểu 8 ký tự"
                  required
                  autoComplete="current-password"
                  className="font-body-md h-11 w-full rounded-xl bg-surface-container-low py-2.5 pl-11 pr-11 text-body-md text-on-surface shadow-sm transition-all placeholder:text-outline focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
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
            </div>

            {/* Options Row (Remember Me & Forgot Link) */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex cursor-pointer select-none items-center space-x-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 cursor-pointer rounded bg-surface-container-high text-primary focus:ring-primary"
                />
                <span className="font-body-sm text-body-sm font-medium text-on-surface-variant">
                  Ghi nhớ đăng nhập
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="font-label-md text-label-md font-semibold text-primary transition-colors hover:text-primary-container hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>

            {/* Primary Submit Action */}
            <button
              type="submit"
              disabled={loading}
              className="font-label-lg group flex h-11 w-full items-center justify-center space-x-2 rounded-xl bg-primary text-label-lg font-semibold text-on-primary shadow-md transition-all hover:bg-primary-container hover:shadow-lg active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <Spinner size={18} color="#ffffff" />
              ) : (
                <>
                  <span>Đăng nhập</span>
                  <Icon
                    name="arrow_forward"
                    size={18}
                    className="text-white transition-transform group-hover:translate-x-1"
                  />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-4 flex items-center justify-center sm:my-5">
            <div className="h-px w-full bg-surface-container-high" />
            <span className="font-label-sm absolute bg-surface-container-lowest px-3 text-label-sm text-outline">
              Hoặc tiếp tục với
            </span>
          </div>

          {/* Social Authentication Buttons */}
          <SocialButtons />

          {/* Registration Link */}
          <div className="mt-4 text-center sm:mt-5">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Chưa có tài khoản?{" "}
              <Link
                to="/register"
                className="font-label-md group inline-flex items-center space-x-1 text-label-md font-bold text-primary transition-colors hover:text-primary-container"
              >
                <span>Đăng ký ngay</span>
                <Icon
                  name="open_in_new"
                  size={15}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </p>
          </div>
        </div>

        {/* Security and Encryption Footer Note */}
        <div className="font-label-sm mx-auto flex w-full max-w-md flex-col items-center justify-between gap-2 border-t border-surface-container-high/50 pt-4 text-label-sm text-outline sm:flex-row">
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
