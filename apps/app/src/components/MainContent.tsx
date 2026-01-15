import { type ReactNode } from "react";

type ContentProps = {
  children?: ReactNode;
};

export default function MainContent({ children }: ContentProps) {
  return (
    <main className="main_scroll">
      <div className="main_container">{children}</div>
    </main>
  );
}
