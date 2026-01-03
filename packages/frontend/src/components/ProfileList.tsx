import { useEffect, useState } from "react"
import axios, { AxiosError } from "axios"
import { ROOT } from "../constants"
import { UserProfile } from "../types"
import { ProfileCard } from "./ProfileCard"
import { ProfileModal } from "./ProfileModal"
import "./ProfileList.css"

export const ProfileList = () => {
    const [profiles, setProfiles] = useState<UserProfile[]>([])
    const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")
    const [errorMessage, setErrorMessage] = useState("")
    const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null)

    useEffect(() => {
        let isMounted = true

        const fetchProfiles = async () => {
            setStatus("loading")
            setErrorMessage("")
            try {
                const response = await axios.get<UserProfile[]>(`${ROOT}/user/profiles`, {
                    params: { limit: 10 },
                })
                if (!isMounted) {
                    return
                }
                setProfiles(response.data.slice(0, 10))
                setStatus("ready")
            } catch (error: unknown) {
                if (!isMounted) {
                    return
                }
                if (axios.isAxiosError(error)) {
                    const axiosError = error as AxiosError<{ message?: string }>
                    setErrorMessage(axiosError.response?.data?.message ?? axiosError.message)
                } else {
                    setErrorMessage("Unable to load profiles right now.")
                }
                setStatus("error")
            }
        }

        fetchProfiles()

        return () => {
            isMounted = false
        }
    }, [])

    const handleOpenProfile = (profile: UserProfile) => {
        setSelectedProfile(profile)
    }

    const handleCloseProfile = () => {
        setSelectedProfile(null)
    }

    return (
        <section className="profile-list">
            <div className="profile-list__header">
                <div>
                    <p className="profile-list__eyebrow">Community</p>
                    <h2>Registered profiles</h2>
                </div>
                <span className="profile-list__count">{profiles.length} of 10</span>
            </div>
            <div className="profile-list__content">
                {status === "loading" && (
                    <p className="profile-list__status">Loading profiles...</p>
                )}
                {status === "error" && (
                    <p className="profile-list__status profile-list__status--error">
                        {errorMessage || "Unable to load profiles right now."}
                    </p>
                )}
                {status === "ready" && profiles.length === 0 && (
                    <p className="profile-list__status">No profiles yet. Check back soon.</p>
                )}
                {profiles.length > 0 && (
                    <ul className="profile-list__grid">
                        {profiles.map((profile) => (
                            <li key={profile.userId} className="profile-list__item">
                                <ProfileCard
                                    profile={profile}
                                    onClick={() => handleOpenProfile(profile)}
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {selectedProfile && (
                <ProfileModal profile={selectedProfile} onClose={handleCloseProfile} />
            )}
        </section>
    )
}
