import { ProfileCard } from "../components/ProfileCard"
import { SearchBar } from "../components/SearchBar"
import { Sidebar } from "../components/Sidebar"

export const LandingPage = () => {
    return (
        <div>
            <div>
                <Sidebar />
            </div>
            <div>
                <SearchBar />
                <ProfileCard />
            </div>
        </div>

    )
}