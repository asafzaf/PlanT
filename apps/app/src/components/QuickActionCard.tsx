import * as FaIcons from "react-icons/fa";
import QuickActions from "../dummyData/QuickActions.json";

type QuickActionVariant = "purple" | "green" | "red" | "blue";

export type QuickAction = {
  id: string;
  label: string;
  icon: string;
  variant: QuickActionVariant;
};

type QuickActionsCardProps = {
  onActionClick?: (id: string) => void;
};

export function QuickActionsCard({ onActionClick }: QuickActionsCardProps) {
  return (
    <div className="quick_actions" dir="rtl">
      <div className="quick_actions_grid">
        {QuickActions.quickActions.map((action) => {
          const Icon =
            FaIcons[action.icon as keyof typeof FaIcons] ?? FaIcons.FaPlus;

          return (
            <button
              key={action.id}
              type="button"
              className={`quick_action_card quick_action_${action.variant}`}
              onClick={() => onActionClick?.(action.id)}
            >
              <span className="quick_action_icon">
                <Icon />
              </span>
              <span className="quick_action_label">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
