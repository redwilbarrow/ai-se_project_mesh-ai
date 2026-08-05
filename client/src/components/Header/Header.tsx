import logo from "../../assets/images/logo-2.png";
import "./Header.css";
import { NavLink } from "react-router-dom";

export default function Header() {
  function getNavLinkClass({ isActive }: { isActive: boolean }) {
    return isActive
      ? "header__nav-link header__nav-link_active"
      : "header__nav-link";
  }

  return (
    <header className="header">
      <img src={logo} alt="MeshAI logo" className="header__logo" />
      <nav className="header__nav">
        <NavLink to="/knowledge" className={getNavLinkClass}>
          Knowledge Base
        </NavLink>
        <NavLink to="/chat" className={getNavLinkClass}>
          Chat
        </NavLink>
      </nav>
    </header>
  );
}
