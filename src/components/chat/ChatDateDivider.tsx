export interface ChatDateDividerProps {
  label: string;
}

export function ChatDateDivider({ label }: ChatDateDividerProps) {
  return (
    <div className="my-2.5 flex items-center justify-center">
      <div className="rounded-full bg-slate-100 px-3 py-1">
        <span className="text-[11px] font-medium tracking-wide text-slate-500">
          {label}
        </span>
      </div>
    </div>
  );
}
