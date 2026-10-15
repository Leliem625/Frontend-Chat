import { Outlet } from "react-router";

export function AppFrame() {
  return (
    <div className="h-full min-h-dvh w-full bg-surface text-on-surface">
      <Outlet />
    </div>
  );
}
