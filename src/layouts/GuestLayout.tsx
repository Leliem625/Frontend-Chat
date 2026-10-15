import { Outlet } from "react-router";

export function GuestLayout() {
  return (
    <div className="h-full min-h-dvh w-full overflow-y-auto bg-surface text-on-surface lg:overflow-hidden">
      <Outlet />
    </div>
  );
}
