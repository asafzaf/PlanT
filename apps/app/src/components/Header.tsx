import { type ReactNode } from "react";

type HeaderProps = {
  name: string;
  children?: ReactNode;
};

export default function Header({ name, children }: HeaderProps) {
  return (
    <header>
      <h1>{name}</h1>
      {children}
    </header>
  );
}
