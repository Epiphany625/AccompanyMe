import { useNavigate } from "react-router-dom"
import "./Sidebar.css"

type PageRequested =
  | "dashboard"
  | "messages"
  | "aichat"
  | "profile"
  | "appointments"

type SidebarProps = {
  activePage: PageRequested
}

export const Sidebar = ({ activePage }: SidebarProps) => {
  const navigate = useNavigate()

  const pages: Array<{ key: PageRequested; label: string; path: string }> = [
    { key: "dashboard", label: "Dashboard", path: "/dashboard" },
    { key: "messages", label: "Messages", path: "/messages" },
    { key: "aichat", label: "AI", path: "/aichat" },
    { key: "appointments", label: "Appointments", path: "/appointments" },
    { key: "profile", label: "Profile", path: "/profile" },
  ]

  return (
    <div className="sidebar-wrapper">
      {pages.map(({ key, label, path }) => {
        const isActive = activePage === key
        return (
          <button
            key={key}
            className={
              isActive
                ? "sidebar-button sidebar-button-active"
                : "sidebar-button"
            }
            aria-current={isActive ? "page" : undefined}
            onClick={isActive ? undefined : () => navigate(path)}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
