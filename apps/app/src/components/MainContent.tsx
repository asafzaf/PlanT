import { type ReactNode } from "react";

type ContentProps = {
  children?: ReactNode;
};

export default function MainContent({ children }: ContentProps) {
  return (
    <main>
      <div className="main_container">{children}</div>
    </main>
  );
}
