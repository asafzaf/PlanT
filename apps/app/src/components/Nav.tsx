import { NavLink } from "react-router-dom";
import type { Dictionary } from "../i18n/i18n";
import { type ReactNode } from "react";

type NavTexts = Dictionary["nav"];

type NavProps = {
  name: string;
  description: string;
  t: NavTexts;
  children?: ReactNode;
};

export default function Nav({ name, description, t, children }: NavProps) {
  return (
    <nav className="sidebar">
      <div className="upper_sidebar">
        <h2>{name}</h2>
        <h3>{description}</h3>
      </div>
      <div className="lower_sidebar">
        <ul>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "nav_link nav_link--active" : "nav_link"
            }
          >
            {" "}
            <li>📊 {t.dashboard}</li>{" "}
          </NavLink>

          <NavLink
            to="/projects"
            className={({ isActive }) =>
              isActive ? "nav_link nav_link--active" : "nav_link"
            }
          >
            {" "}
            <li>📁 {t.projects}</li>
          </NavLink>

          <NavLink
            to="/expenses"
            className={({ isActive }) =>
              isActive ? "nav_link nav_link--active" : "nav_link"
            }
          >
            {" "}
            <li>💸 {t.expenses}</li>
          </NavLink>

          <NavLink
            to="/incomes"
            className={({ isActive }) =>
              isActive ? "nav_link nav_link--active" : "nav_link"
            }
          >
            {" "}
            <li>💰 {t.incomes}</li>
          </NavLink>

          <NavLink
            to="/monthly"
            className={({ isActive }) =>
              isActive ? "nav_link nav_link--active" : "nav_link"
            }
          >
            {" "}
            <li>📅 {t.monthly}</li>
          </NavLink>
        </ul>
      </div>
      <div className="sidebar_footer">{children}</div>
    </nav>
  );
}
