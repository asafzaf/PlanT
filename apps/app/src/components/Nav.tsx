import { type ReactNode } from "react";

type NavProps = {
  name: string;
  description?: string;
  children: ReactNode;
};

export default function Nav({ name, description, children }: NavProps) {
  return (
    <nav className="sidebar">
      <div className="upper_sidebar">
        <h2>{name}</h2>
        <h3>{description}</h3>
      </div>
      <div className="lower_sidebar">{children}</div>
    </nav>
  );
}
