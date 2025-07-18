import { ReactNode } from "react";

export default function StickySidebar({
  children,
  top = 112,
}: {
  children: ReactNode;
  top?: number;
}) {
  return (
    <div
      className="sticky"
      style={{
        top: `${top}px`,
        alignSelf: "flex-start",
      }}
    >
      {children}
    </div>
  );
}
