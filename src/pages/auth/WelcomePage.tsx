import { useNavigate } from "react-router";

import appLogo from "@/assets/messenger_app_icon.png";
import { Icon } from "@/components/common";

export default function WelcomePage() {
  const navigate = useNavigate();

  const handleSkip = () => {
    navigate("/login", { replace: true });
  };

  const handleGetStarted = () => {
    navigate("/register");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-surface">
      {/* Header với nút Bỏ qua */}
      <div className="flex h-11 shrink-0 flex-row items-center justify-end px-5">
        <button
          type="button"
          className="rounded-full bg-white/80 px-3.5 py-1.5 transition active:opacity-75"
          onClick={handleSkip}
        >
          <span className="text-sm font-medium text-slate-500">Bỏ qua</span>
        </button>
      </div>

      <div className="flex flex-1 flex-col justify-between overflow-y-auto px-5 pb-4">
        {/* Khu vực Hero minh họa */}
        <div className="relative flex w-full flex-col items-center justify-center py-3">
          {/* Hiệu ứng vầng sáng nền (Glow backlight backdrop) */}
          <div className="absolute h-56 w-56 -translate-y-2 rounded-full bg-primary/15 opacity-90" />
          <div className="absolute h-36 w-36 translate-x-10 translate-y-4 rounded-full bg-cyan-400/20 opacity-90" />

          {/* Hero Visual Composition */}
          <div className="relative flex h-52 w-64 flex-col items-center justify-center">
            {/* Huy hiệu nổi bên trái: Bảo mật đa tầng */}
            <div className="absolute left-0 top-6 z-20 flex flex-row items-center gap-1.5 rounded-full border border-slate-100 bg-white/95 px-3 py-1.5 shadow-sm">
              <Icon name="lock" size={15} color="#10b981" />
              <span className="text-[11px] font-semibold text-slate-800">
                Bảo mật đa tầng
              </span>
            </div>

            {/* Biểu tượng cảm xúc nổi bên phải trên: ✨ */}
            <div className="absolute right-2 top-2 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm">
              <span className="text-lg">✨</span>
            </div>

            {/* Logo ứng dụng chính */}
            <div className="relative z-10 rounded-[2.5rem] border border-black/5 bg-white p-2.5 shadow-xl">
              <div className="h-28 w-28 overflow-hidden rounded-[32px] bg-gradient-to-br from-[#0084ff] to-[#00a3ff] p-0.5">
                <img
                  src={appLogo}
                  alt="Logo ứng dụng"
                  className="h-full w-full rounded-[30px] object-cover"
                />
              </div>

              {/* Chấm trực tuyến màu xanh lá */}
              <div className="absolute bottom-3 right-3 h-5 w-5 rounded-full border-2 border-white bg-emerald-500 shadow-sm" />
            </div>

            {/* Huy hiệu nổi bên phải dưới: Gọi thoại HD */}
            <div className="absolute bottom-4 right-0 z-20 flex flex-row items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 shadow-md">
              <Icon name="videocam" size={15} color="#ffffff" />
              <span className="text-[11px] font-bold tracking-tight text-white">
                Gọi thoại HD
              </span>
            </div>
          </div>
        </div>

        {/* Tiêu đề & Lời giới thiệu */}
        <div className="flex flex-col items-center px-1 text-center">
          <h1 className="text-center text-[25px] font-bold leading-[32px] tracking-tight text-slate-900">
            Kết nối nhanh chóng,
            <br />
            trò chuyện không giới hạn
          </h1>
          <p className="mt-2.5 max-w-sm text-center text-[14px] font-normal leading-5 text-slate-500">
            Trải nghiệm nhắn tin tức thì, gọi thoại HD chất lượng cao và chia sẻ
            từng khoảnh khắc ý nghĩa cùng bạn bè hoàn toàn miễn phí.
          </p>
        </div>

        {/* Danh sách 3 thẻ tính năng */}
        <div className="my-4 flex w-full flex-col gap-2.5">
          {/* Card 1: Trợ lý AI */}
          <FeatureCard
            icon="smart-toy"
            title="Trợ lý AI thông minh"
            description="Hỗ trợ dịch thuật trực tiếp, tóm tắt và gợi ý phản hồi nhanh chóng."
          />

          {/* Card 2: Lưu trữ đám mây */}
          <FeatureCard
            icon="cloud-done"
            title="Lưu trữ đám mây vĩnh viễn"
            description="Hình ảnh, video và tệp tài liệu lưu trữ an toàn, không lo hết hạn."
          />

          {/* Card 3: Hội nhóm & Cộng đồng */}
          <FeatureCard
            icon="groups"
            title="Hội nhóm & Cộng đồng lớn"
            description="Tạo nhóm kết nối không giới hạn, chia sẻ khoảnh khắc vui vẻ cùng bạn bè."
          />
        </div>

        {/* Khu vực phân trang & Nút hành động */}
        <div className="mt-auto flex w-full flex-col items-center gap-3.5 pt-1">
          {/* Thanh chấm chỉ báo phân trang (Pagination Dots) */}
          <div className="flex flex-row items-center justify-center gap-1.5">
            <div className="h-2 w-7 rounded-full bg-primary" />
            <div className="h-2 w-2 rounded-full bg-slate-200" />
            <div className="h-2 w-2 rounded-full bg-slate-200" />
          </div>

          {/* Nút hành động chính: Bắt đầu khám phá */}
          <div className="flex w-full flex-col items-center gap-2.5">
            <button
              type="button"
              className="flex h-[52px] w-full flex-row items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 shadow-lg transition active:opacity-90"
              onClick={handleGetStarted}
            >
              <span className="text-[15px] font-semibold text-white">
                Bắt đầu khám phá
              </span>
              <Icon name="arrow-forward" size={19} color="#ffffff" />
            </button>

            {/* Nút chuyển sang Đăng nhập */}
            <button
              type="button"
              className="flex flex-row items-center gap-1 rounded-full px-4 py-1.5 transition active:opacity-75"
              onClick={handleLogin}
            >
              <span className="text-[13px] text-slate-500">
                Đã có tài khoản?
              </span>
              <span className="text-[13px] font-semibold text-primary">
                Đăng nhập
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-row items-center gap-3.5 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
        <Icon name={icon} size={22} color="#0084ff" />
      </div>
      <div className="flex-1 text-left">
        <p className="text-[14px] font-semibold text-slate-900">{title}</p>
        <p className="mt-0.5 line-clamp-2 text-[12px] leading-4 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}
