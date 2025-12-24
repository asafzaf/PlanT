import { NavLink } from "react-router-dom";

type NavProps = {
  name: string;
  description: string;
};

export default function Nav({ name, description }: NavProps) {
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
            <li>📊 לוח בקרה</li>{" "}
          </NavLink>

          <NavLink
            to="/projects"
            className={({ isActive }) =>
              isActive ? "nav_link nav_link--active" : "nav_link"
            }
          >
            {" "}
            <li>📁 פרויקטים</li>
          </NavLink>

          <NavLink
            to="/expenses"
            className={({ isActive }) =>
              isActive ? "nav_link nav_link--active" : "nav_link"
            }
          >
            {" "}
            <li>💸 הוצאות</li>
          </NavLink>

          <NavLink
            to="/income"
            className={({ isActive }) =>
              isActive ? "nav_link nav_link--active" : "nav_link"
            }
          >
            {" "}
            <li>💰 הכנסות</li>
          </NavLink>

          <NavLink
            to="/monthly"
            className={({ isActive }) =>
              isActive ? "nav_link nav_link--active" : "nav_link"
            }
          >
            {" "}
            <li>📅 מעקב חודשי</li>
          </NavLink>
        </ul>
      </div>
    </nav>
  );
}
