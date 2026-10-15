import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

import { sendOtp } from "@/api/auth";
import appLogo from "@/assets/messenger_app_icon.png";
import { AuthLeftCanvas } from "@/components/auth/AuthLeftCanvas";
import { Icon, Spinner } from "@/components/common";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Chưa nhập email", {
        description: "Vui lòng nhập địa chỉ email của bạn",
      });
      return;
    }

    if (!isValidEmail) {
      toast.error("Email không hợp lệ", {
        description: "Vui lòng nhập đúng định dạng email (vd: name@gmail.com)",
      });
      return;
    }

    setLoading(true);
    try {
      await sendOtp(email.trim());
      toast.success("Mã OTP đã được gửi", {
        description: "Vui lòng kiểm tra hòm thư email của bạn",
      });
      navigate(`/verify-otp?${new URLSearchParams({ email: email.trim() })}`);
    } catch (error: any) {
      toast.error("Không thể gửi OTP", {
        description: error.message || "Vui lòng thử lại sau",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh h-full w-full flex-col overflow-y-auto bg-surface lg:flex-row lg:overflow-hidden">
      {/* Left Canvas: Brand Story & Process Stepper */}
      <AuthLeftCanvas
        brandTitle="Streamline"
        versionBadge="v3.4 Desktop"
        brandTag="DESKTOP WORKSPACE EDITION"
        headline={
          <>
            Khôi phục tài khoản
            <br />
            dễ dàng &amp; bảo mật
          </>
        }
        description="Hệ thống mã hoá End-to-End Streamline hỗ trợ đặt lại chứng thực bảo vệ với quy trình gửi mã OTP 6 số tức thời, đảm bảo tin nhắn và dữ liệu tổ chức luôn an toàn."
      >
        <div className="relative w-full max-w-xs overflow-hidden rounded-2xl bg-surface-container-lowest/10 p-5 shadow-xl backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-label-md text-label-md uppercase tracking-wider text-primary-fixed">
              Tiến trình xác thực
            </span>
            <span className="rounded-full bg-surface-container-lowest px-2.5 py-0.5 font-label-sm text-label-sm font-semibold text-primary-container">
              Bước 1 / 3
            </span>
          </div>

          {/* Key illustration badge */}
          <div className="relative flex items-center justify-center py-2">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-32 w-32 animate-ping rounded-full bg-surface-container-lowest/10 opacity-25" />
            </div>
            <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-surface-container-lowest p-3 shadow-xl">
              <img
                src="https://lh3.googleusercontent.com/aida/AEtjO1VjQKExso3wAgMJ9LNMwDj-36t2ki2Bmj0eeeeqOoi2luoxximtsMvtnKkSot_FueUGxvm4wxM8SXrdqYjbmGoQLsNzjW7rEw32DVuuCFynAN1LHt6NmmLGTwCRrduR4csQqOYrcAqAmy-phY9GNS0hBSOZDA_UWJj0FGUMuNCJUs0a01Q0ChrZ051Qhbhxc1JxGV_kO0znL6gZjdVSK-7fcV2dQfduTMnHYSSu7DsDfCjZ3PlnpYSA6g"
                alt="Khôi phục mật khẩu"
                className="h-full w-full object-contain pointer-events-none select-none"
              />
            </div>
          </div>

          {/* Speech bubble step hint */}
          <div className="mt-4 rounded-xl bg-surface-container-lowest p-3.5 text-on-surface shadow-md">
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 shrink-0 rounded bg-primary-fixed p-1 text-primary-container">
                <Icon name="mail" size={18} filled />
              </div>
              <div>
                <p className="font-label-md text-label-md font-semibold text-on-surface">
                  Bước 1: Nhập địa chỉ liên kết
                </p>
                <p className="mt-0.5 font-body-sm text-body-sm text-on-surface-variant">
                  Nhập email liên kết để nhận mã xác thực 6 số gửi về hòm thư công việc của bạn.
                </p>
              </div>
            </div>
          </div>
        </div>
      </AuthLeftCanvas>

      {/* Right Canvas: Interactive Reset Form */}
      <div className="flex min-h-full flex-1 w-full flex-col justify-between overflow-y-auto bg-surface p-5 sm:p-8 lg:h-full lg:w-7/12 lg:p-10 xl:w-1/2 xl:p-12 lg:overflow-hidden">
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
                Khôi phục
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1.5 rounded-full bg-primary-fixed/40 px-2.5 py-0.5 font-label-sm text-label-sm text-primary">
            <span>Bước 1/3</span>
          </div>
        </div>

        {/* Top Action Nav */}
        <div className="flex w-full items-center justify-between pb-2">
          <Link
            to="/login"
            className="group inline-flex items-center gap-2 font-label-md text-label-md text-on-surface-variant transition-colors hover:text-primary"
          >
            <Icon
              name="arrow_back"
              size={18}
              className="transition-transform group-hover:-translate-x-1"
            />
            <span>Quay lại Đăng nhập</span>
          </Link>
          <div className="hidden items-center gap-2 font-label-sm text-label-sm text-on-surface-variant sm:flex">
            <span>Trợ giúp nhanh?</span>
            <a href="#" className="font-label-md text-label-md text-primary hover:underline">
              FAQ Khôi phục
            </a>
          </div>
        </div>

        {/* Main Form Box */}
        <div className="my-auto mx-auto w-full max-w-md py-4">
          <div className="mb-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-container-highest text-primary shadow-sm">
              <Icon name="password" size={24} filled />
            </div>
            <h2 className="mb-1.5 font-headline-lg text-headline-lg font-bold tracking-tight text-on-surface">
              Quên mật khẩu?
            </h2>
            <p className="font-body-md text-body-md leading-relaxed text-on-surface-variant">
              Đừng lo lắng! Vui lòng nhập địa chỉ email đã đăng ký với tài khoản
              Streamline của bạn để nhận mã xác minh OTP.
            </p>
          </div>

          <form onSubmit={handleSendOtp} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="recovery-identity"
                  className="font-label-md text-label-md font-medium text-on-surface"
                >
                  Email hoặc Tên đăng nhập
                </label>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Bắt buộc
                </span>
              </div>
              <div className="relative flex items-center">
                <span className="pointer-events-none absolute left-3.5 text-outline">
                  <Icon name="mail" size={18} />
                </span>
                <input
                  id="recovery-identity"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="h-11 w-full rounded-xl bg-surface-container-lowest py-2.5 pl-11 pr-4 font-body-md text-body-md text-on-surface shadow-sm transition-all placeholder:text-outline focus:bg-surface-container-low focus:outline-none"
                />
              </div>
              <p className="pl-1 font-label-sm text-label-sm text-on-surface-variant">
                Khuyên dùng địa chỉ email được liên kết với phòng ban của bạn.
              </p>
            </div>

            {/* Security Tip Banner */}
            <div className="flex items-start gap-3 rounded-xl bg-surface-container-low p-3.5 shadow-sm">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-container-lowest p-1 shadow-sm">
                <img
                  src="https://lh3.googleusercontent.com/aida/AEtjO1UspyEiNXU2zDk_oPD3o0YYO08_kjfr05zKv8oIwzMjD5OO0FHTZrKhk81hZ2PqMbc50L25U4nOSZG88Z2mOVLFEePYOrQFl5_2iZs_33GWRCJHRwokwwC-3Xz9u6sBiPPS0kv3sFGQfXEz4lrHrIXb2CD_TcENQlcKjjDdIq4e7ltgUdxONkmYrvi48wJAeFBxSvxec_Jpm0BKSbkAvPflKb7kDcNhwVPH5DzWZLftOsMT1_-ISyRlOaE"
                  alt="Bảo mật"
                  className="h-full w-full object-contain pointer-events-none select-none"
                />
              </div>
              <div className="flex-1">
                <div className="mb-0.5 flex items-center gap-1.5">
                  <span className="font-label-md text-label-md font-semibold text-on-surface">
                    Bảo mật mã OTP Streamline
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-tertiary" />
                </div>
                <p className="font-body-sm text-body-sm leading-normal text-on-surface-variant">
                  Mã xác thực gồm 6 chữ số có hiệu lực trong 10 phút. Tuyệt đối không
                  chia sẻ mã với bất kỳ ai.
                </p>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={loading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 font-label-lg text-label-lg font-semibold text-on-primary shadow-md transition-all duration-150 active:scale-[0.99] hover:bg-primary-container hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-75"
            >
              {loading ? (
                <Spinner size={18} color="#ffffff" />
              ) : (
                <>
                  <span>Gửi mã xác thực OTP</span>
                  <Icon name="arrow_forward" size={18} className="text-white" />
                </>
              )}
            </button>
          </form>

          {/* Auxiliary Links */}
          <div className="mt-5 flex flex-col items-center gap-3 text-center">
            <div className="font-body-md text-body-md text-on-surface-variant">
              Bạn nhớ lại mật khẩu?
              <Link
                to="/login"
                className="ml-1 font-label-md text-label-md font-bold text-primary hover:underline"
              >
                Đăng nhập ngay
              </Link>
            </div>
            <a
              href="#"
              className="inline-flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant transition-colors hover:text-on-surface"
            >
              <Icon name="support_agent" size={16} />
              <span>Cần hỗ trợ kỹ thuật? Liên hệ CSKH</span>
            </a>
          </div>
        </div>

        {/* Bottom Platform Footer */}
        <div className="flex w-full flex-col items-center justify-between gap-2 pt-4 font-label-sm text-label-sm text-on-surface-variant sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="font-medium text-on-surface">
              Streamline Security Center
            </span>
            <span className="opacity-40">•</span>
            <span>Bảo mật 256-bit</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="#" className="hover:underline">
              Điều khoản
            </a>
            <a href="#" className="hover:underline">
              Bảo mật
            </a>
            <a href="#" className="hover:underline">
              Trạng thái (99.98%)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
