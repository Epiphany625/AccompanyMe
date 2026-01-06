import { ProfileAvatar } from "../../design-system/profiles/ProfileAvatar"
import { UserProfile } from "../types"
import "./ProfileCard.css"

type ProfileCardProps = {
  profile: UserProfile
  onClick?: () => void
}

export const ProfileCard = ({ profile, onClick }: ProfileCardProps) => {
  const username = profile.username.slice(0, 15)
  const avatarFallback = profile.userId.slice(0, 2).toUpperCase()
  const description = profile.description?.trim() || "No bio yet."

  return (
    <button
      type="button"
      className="profile-card"
      aria-label={`Open profile ${username}`}
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
        <div className="profile-card__title">{username}</div>
        <p className="profile-card__description">{description}</p>
        <div className="profile-card__meta">
          <span>Born {profile.birthYear}</span>
          <span>{profile.gender}</span>
        </div>
      </div>
    </button>
  )
}
