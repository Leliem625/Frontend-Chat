// Màn hình tạm, thay bằng giao diện thật khi code
export function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2">
      <h1 className="text-xl font-semibold">{title}</h1>
      <p className="text-[#888]">Chưa code</p>
    </div>
  );
}
