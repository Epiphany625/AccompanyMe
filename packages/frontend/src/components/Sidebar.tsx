import "./Sidebar.css";
export const Sidebar = () => {

    return (
        <div
            className="sidebar-wrapper"
        >
            <button className="sidebar-button">
                Dashboard
            </button>
            <button className="sidebar-button">
                Messages
            </button>
            <button className="sidebar-button">
                AI
            </button>
            <button className="sidebar-button">
                Profile
            </button>
        </div >
    )
}
