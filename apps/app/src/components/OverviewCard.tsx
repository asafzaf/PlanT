import { type ReactNode } from "react";

type CardProps = {
  title: string;
  children: ReactNode;
};

export default function OverviewCard({ title, children }: CardProps) {
  return (
    <div className="overview_card">
      <h2 className="overview_card_title">{title}</h2>
      <div className="overview_card_body">{children}</div>
    </div>
  );
}
