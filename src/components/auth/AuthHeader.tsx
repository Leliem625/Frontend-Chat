import appLogo from "@/assets/messenger_app_icon.png";
import { Icon } from "@/components/common";

// Thanh tiêu đề dùng chung cho các màn quên mật khẩu / OTP / đặt lại mật khẩu
export function AuthHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex h-14 shrink-0 flex-row items-center justify-between border-b border-slate-100 bg-surface px-4">
      <div className="flex flex-row items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          aria-label="Quay lại"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm transition active:opacity-80"
        >
          <Icon name="arrow-back" size={22} color="#0f172a" />
        </button>
        <div className="ml-1 h-8 w-8 overflow-hidden rounded-xl border border-slate-100 bg-white p-0.5">
          <img src={appLogo} alt="" className="h-full w-full rounded-md object-contain" />
        </div>
        <span className="ml-1 text-[17px] font-semibold tracking-tight text-slate-800">
          {title}
        </span>
      </div>

      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
        <Icon name="person" size={18} color="#ffffff" />
      </div>
    </div>
  );
}
