// import { type ReactNode } from "react";

type CardProps = {
  title: string;
  number: number;
  icon?: React.ReactNode;
};

export default function MainInfoCard({ title, number, icon }: CardProps) {
  return (
    <div className="main_info_card">
      <div className="card_texts">
        <h2>{title}</h2>
        <p>{number.toLocaleString()}</p>
      </div>
      <div className="icon_wrapper">{icon}</div>
    </div>
  );
}
