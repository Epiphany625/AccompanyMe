import { ProfileCard } from "../components/ProfileCard"
import { SearchBar } from "../components/SearchBar"
import { Sidebar } from "../components/Sidebar"
import "./LandingPage.css"
import "./PageLayout.css"

export const LandingPage = () => {
    return (
        <div className="page-shell">
            <Sidebar activePage="dashboard" />
            <main className="page-content">
                <div className="landing-page">
                    <SearchBar />
                    <ProfileCard />
                </div>
            </main>
        </div>

    )
}
