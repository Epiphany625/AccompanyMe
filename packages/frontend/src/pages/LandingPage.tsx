import { ProfileCard } from "../components/ProfileCard"
import { SearchBar } from "../components/SearchBar"
import { Sidebar } from "../components/Sidebar"
import { useValidateUser } from "../utils/hooks"
import "./LandingPage.css"
import "./PageLayout.css"

export const LandingPage = () => {
    useValidateUser();
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
