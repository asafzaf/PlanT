import MainInfoCard from "./MainInfoCard";
import * as FaIcons from "react-icons/fa";

type CardListProps = {
  cards: {
    title: string;
    number: number;
    icon: string;
  }[];
};

export default function CardList({ cards }: CardListProps) {
  return (
    <div className="card_list">
      {cards.map((card, index) => {
        const IconComponent = FaIcons[card.icon as keyof typeof FaIcons];

        return (
          <MainInfoCard
            key={index}
            title={card.title}
            number={card.number}
            icon={IconComponent ? <IconComponent /> : null}
          />
        );
      })}
    </div>
  );
}
