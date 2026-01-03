import { useEffect, useMemo, useState } from "react"
import axios, { AxiosError } from "axios"
import { ROOT } from "../constants"
import { AvailabilityRecord, UserProfile } from "../types"
import { ProfileAvatar } from "../../design-system/profiles/ProfileAvatar"
import "./ProfileModal.css"

type ProfileModalProps = {
    profile: UserProfile
    onClose: () => void
}

export const ProfileModal = ({ profile, onClose }: ProfileModalProps) => {
    const [availabilities, setAvailabilities] = useState<AvailabilityRecord[]>([])
    const [availabilityStatus, setAvailabilityStatus] = useState<"idle" | "loading" | "ready" | "error">("idle")
    const [availabilityError, setAvailabilityError] = useState("")
    const [selectedAvailabilityId, setSelectedAvailabilityId] = useState<number | null>(null)

    useEffect(() => {
        let isMounted = true
        const fetchAvailabilities = async () => {
            setAvailabilityStatus("loading")
            setAvailabilityError("")
            try {
                const response = await axios.get<AvailabilityRecord[]>(
                    `${ROOT}/availabilities/user/${profile.userId}`
                )
                if (!isMounted) {
                    return
                }
                setAvailabilities(response.data)
                setAvailabilityStatus("ready")
            } catch (error: unknown) {
                if (!isMounted) {
                    return
                }
                if (axios.isAxiosError(error)) {
                    const axiosError = error as AxiosError<{ message?: string }>
                    setAvailabilityError(axiosError.response?.data?.message ?? axiosError.message)
                } else {
                    setAvailabilityError("Unable to load availabilities right now.")
                }
                setAvailabilityStatus("error")
            }
        }

        fetchAvailabilities()

        return () => {
            isMounted = false
        }
    }, [profile.userId])

    const profileShortId = useMemo(() => {
        if (!profile.userId) {
            return "member"
        }
        return profile.userId.slice(0, 8)
    }, [profile.userId])

    const formatStartTime = (value: string) => {
        const parsed = new Date(value)
        if (Number.isNaN(parsed.getTime())) {
            return value
        }
        return parsed.toLocaleString()
    }

    return (
        <div className="profile-modal" role="dialog" aria-modal="true">
            <button
                type="button"
                className="profile-modal__backdrop"
                aria-label="Close profile details"
                onClick={onClose}
            />
            <div className="profile-modal__panel">
                <header className="profile-modal__header">
                    <div>
                        <p className="profile-modal__eyebrow">Member {profileShortId}</p>
                        <h3>Profile details</h3>
                    </div>
                    <button
                        type="button"
                        className="profile-modal__close"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </header>
                <div className="profile-modal__content">
                    <div className="profile-modal__profile">
                        <ProfileAvatar width="72px" fontSize="1.2rem" aria-hidden="true">
                            {profile.profilePicLink ? (
                                <img src={profile.profilePicLink} alt="" />
                            ) : (
                                <span>
                                    {profile.userId
                                        ? profile.userId.slice(0, 2).toUpperCase()
                                        : "ME"}
                                </span>
                            )}
                        </ProfileAvatar>
                        <div>
                            <p className="profile-modal__name">Member {profileShortId}</p>
                            <p className="profile-modal__description">
                                {profile.description?.trim() || "No bio yet."}
                            </p>
                            <div className="profile-modal__meta">
                                <span>Born {profile.birthYear}</span>
                                <span>{profile.gender}</span>
                            </div>
                        </div>
                    </div>
                    <div className="profile-modal__availability">
                        <div className="profile-modal__section-header">
                            <h4>Availabilities</h4>
                            <span>
                                {availabilityStatus === "ready" ? availabilities.length : 0} slots
                            </span>
                        </div>
                        {availabilityStatus === "loading" && (
                            <p className="profile-modal__status">Loading availabilities...</p>
                        )}
                        {availabilityStatus === "error" && (
                            <p className="profile-modal__status profile-modal__status--error">
                                {availabilityError || "Unable to load availabilities right now."}
                            </p>
                        )}
                        {availabilityStatus === "ready" && availabilities.length === 0 && (
                            <p className="profile-modal__status">No availabilities available yet.</p>
                        )}
                        {availabilityStatus === "ready" && availabilities.length > 0 && (
                            <div className="profile-modal__availability-list">
                                {availabilities.map((availability) => (
                                    <label
                                        key={availability.id}
                                        className={`availability-option${
                                            selectedAvailabilityId === availability.id
                                                ? " is-selected"
                                                : ""
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="availability"
                                            checked={selectedAvailabilityId === availability.id}
                                            onChange={() => setSelectedAvailabilityId(availability.id)}
                                        />
                                        <div>
                                            <p className="availability-option__time">
                                                {formatStartTime(availability.startTime)}
                                            </p>
                                            <p className="availability-option__duration">
                                                Duration {availability.duration} mins
                                            </p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
