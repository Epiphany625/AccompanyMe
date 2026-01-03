import { ChangeEvent, useEffect, useState } from "react"
import { useUserState, useUserActions } from "../state/user.hooks"
import { Sidebar } from "../components/Sidebar"
import Button from "../../design-system/buttons/Button"
import { ProfileAvatar } from "../../design-system/profiles/ProfileAvatar"
import axios, { AxiosError } from "axios"
import { FEMALE, MALE, NON_BINARY, PREFER_NOT_TO_SAY, ROOT } from "../constants"
import "./PageLayout.css"
import "./UserProfilePage.css"
import { useNavigate } from "react-router-dom"
import { logger } from "../utils/logger"
import { useValidateUser } from "../utils/hooks"



type UserProfileState = {
  username: string
  birthYear: string
  description: string
  gender?: string | null
  photoFile?: File | null
  profilePicLink?: string | null
}

const EMPTY_PROFILE: UserProfileState = {
  username: "",
  birthYear: "",
  description: "",
  photoFile: null,
  profilePicLink: null,
}

const CURRENT_YEAR = new Date().getFullYear()

export const UserProfilePage = () => {
  const [initialState, setInitialState] = useState<UserProfileState>(EMPTY_PROFILE);
  const [profileState, setProfileState] = useState<UserProfileState>(EMPTY_PROFILE)
  const navigate = useNavigate();
  const userAction = useUserActions();
  useValidateUser();

  const { username, userId } = useUserState();
  logger.info("here", userId)
  logger.info("username and userid: ", username, userId);

  const isDirty = () => {
    return !(initialState.username === profileState.username
      && initialState.birthYear === profileState.birthYear
      && initialState.description === profileState.description
      && initialState.gender === profileState.gender
      && initialState.photoFile === profileState.photoFile
    )
  }

  const logOut = () => {
    userAction.logOut();
    navigate("/auth");
  }


  const retrieveUserProfile = async () => {
    try {

      const response = await axios.get<UserProfileState>(`${ROOT}/user/${userId}`);


      const { gender, birthYear, description, profilePicLink } = response.data;

      const resultObj: UserProfileState = {
        ...profileState,
        username: username ?? "", // if code reaches this stage, username will never be null. this is just for syntax. 
        gender: gender,
        birthYear: birthYear,
        description: description,
        profilePicLink: profilePicLink
      }

      setProfileState(resultObj);

      setInitialState(resultObj);


    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message?: string }>;

        const status = axiosError.response?.status;

        if (status === 401) {
          // unauthorized
          await logOut();
          return;
        }

        console.error(
          "Failed to fetch user:",
          axiosError.response?.data?.message ?? axiosError.message
        );
      } else {
        console.error("Unknown error:", error);
      }
    }
  };

  useEffect(() => {
    retrieveUserProfile();
  }, [username, userId])


  useEffect(() => {
    if (!profileState.photoFile) {
      return
    }

    const objectUrl = URL.createObjectURL(profileState.photoFile)

    setProfileState((prev) => ({ ...prev, profilePicLink: objectUrl }))

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [profileState.photoFile])

  const handleChange = (field: keyof UserProfileState, value: string) => {
    setProfileState((prev) => ({ ...prev, [field]: value }))
  }

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    setProfileState((prev) => ({ ...prev, photoFile: file }))
  }

  const handleReset = () => {
    setProfileState(initialState)
  }
  return (
    <div className="page-shell">
      <Sidebar activePage="profile" />
      <main className="page-content">
        <div className="profile-page">
          <header className="profile-hero">
            <div>
              <p className="profile-eyebrow">Account</p>
              <h1>Hello, {username}</h1>
              <p>
                Update the details your friends see when you show up to the
                dashboard.
              </p>
            </div>
            <Button type="button" variant="secondary">
              View public profile
            </Button>
          </header>

          <div className="profile-grid">
            <section className="profile-card">

              <ProfileAvatar width="150px" fontSize="2.5rem" aria-hidden="true">
                {profileState.profilePicLink ? (
                  <img src={profileState.profilePicLink} alt="Profile preview" />
                ) : (
                  <span>RC</span>
                )}
              </ProfileAvatar>

              <div className="profile-meta">
                <h2>{profileState.username}</h2>
                <p>{profileState.description}</p>
                <div className="profile-badges">
                  <span>Born {profileState.birthYear}</span>
                  <span>{profileState.gender}</span>
                </div>
              </div>
              <div className="profile-snapshot">
                <div>
                  <p className="profile-label">Profile status</p>
                  <p className="profile-value">Ready to connect</p>
                </div>
                <div>
                  <p className="profile-label">Visibility</p>
                  <p className="profile-value">Friends only</p>
                </div>
              </div>
            </section>

            <section className="profile-form ds-form" aria-label="Edit profile">
              <div className="profile-form-header">
                <div>
                  <h2>Edit your information</h2>
                  <p>Changes are saved to your account once you hit save.</p>
                </div>
                <span className={isDirty() ? "profile-pill" : "profile-pill muted"}>
                  {isDirty() ? "Unsaved changes" : "All changes saved"}
                </span>
              </div>

              <div className="ds-field">
                <label className="ds-label" htmlFor="photo">
                  Profile photo
                </label>
                <div className="profile-photo-row">
                  <div className="profile-photo-preview">
                    {profileState.profilePicLink ? (
                      <img src={profileState.profilePicLink} alt="Profile" />
                    ) : (
                      <span>RC</span>
                    )}
                  </div>
                  <label className="ds-button ds-button--secondary profile-upload">
                    Upload new photo
                    <input
                      className="profile-file-input"
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                    />
                  </label>
                </div>
                <div className="ds-help">Recommended: square JPG or PNG.</div>
              </div>

              <div className="ds-field">
                <label className="ds-label" htmlFor="displayName">
                  Display name
                </label>
                <input
                  className="ds-input"
                  id="displayName"
                  type="text"
                  value={profileState.username ?? ""}
                  onChange={(event) => handleChange("username", event.target.value)}
                />
              </div>

              <div className="profile-row">
                <div className="ds-field">
                  <label className="ds-label" htmlFor="birthYear">
                    Birth year
                  </label>
                  <input
                    className="ds-input"
                    id="birthYear"
                    type="number"
                    min="1900"
                    max={CURRENT_YEAR}
                    value={profileState.birthYear}
                    onChange={(event) => handleChange("birthYear", event.target.value)}
                  />
                </div>
                <div className="ds-field">
                  <label className="ds-label" htmlFor="gender">
                    Gender
                  </label>
                  <select
                    className="ds-input ds-input--select"
                    id="gender"
                    value={profileState.gender ?? PREFER_NOT_TO_SAY}
                    onChange={(event) => handleChange("gender", event.target.value)}
                  >
                    <option>{MALE}</option>
                    <option>{FEMALE}</option>
                    <option>{NON_BINARY}</option>
                    <option>{PREFER_NOT_TO_SAY}</option>
                  </select>
                </div>
              </div>

              <div className="ds-field">
                <label className="ds-label" htmlFor="description">
                  Description
                </label>
                <textarea
                  className="ds-input profile-textarea"
                  id="description"
                  rows={4}
                  value={profileState.description}
                  onChange={(event) => handleChange("description", event.target.value)}
                />
                <div className="ds-help">A short intro that appears on your card.</div>
              </div>

              <div className="profile-actions">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleReset}
                  disabled={!isDirty()}
                >
                  Reset
                </Button>
                <Button type="button" variant="primary">
                  Save changes
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={logOut}
                >
                  Log Out
                </Button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
