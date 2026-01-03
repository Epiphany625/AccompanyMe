import { ProfileAvatar } from "../../design-system/profiles/ProfileAvatar"
import { UserProfile } from "../types"
import "./ProfileCard.css"

type ProfileCardProps = {
    profile: UserProfile
    onClick?: () => void
}

export const ProfileCard = ({ profile, onClick }: ProfileCardProps) => {
    const shortId = profile.userId ? profile.userId.slice(0, 8) : "member"
    const avatarFallback = profile.userId ? profile.userId.slice(0, 2).toUpperCase() : "ME"
    const description = profile.description?.trim() || "No bio yet."

    return (
        <button
            type="button"
            className="profile-card"
            aria-label={`Open profile ${shortId}`}
            onClick={onClick}
        >

            <ProfileAvatar width="56px" fontSize="1rem" aria-hidden="true">
                {profile.profilePicLink ? (
                    <img src={profile.profilePicLink} alt="" />
                ) : (
                    <span>{avatarFallback}</span>
                )}
            </ProfileAvatar>


            <div className="profile-card__body">
                <div className="profile-card__title">Member {shortId}</div>
                <p className="profile-card__description">{description}</p>
                <div className="profile-card__meta">
                    <span>Born {profile.birthYear}</span>
                    <span>{profile.gender}</span>
                </div>
            </div>
        </button>
    )
}
