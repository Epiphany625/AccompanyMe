import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { ROOT } from "../constants"
import { useUserActions, useUserState } from "../state/user.hooks"
import { Gender } from "../types"
import { MALE, FEMALE, NON_BINARY, PREFER_NOT_TO_SAY } from "../constants"
import "./Auth.css"
import Button from "../../design-system/buttons/Button"

interface LoginInput {
  email: string
  password: string
}

interface SignupInput extends LoginInput {
  username: string
  confirmPassword: string
  gender: Gender
  birthYear: number
  description: string
}

// signup states.
const SIGNUP = 0 as const
const LOGIN = 1 as const
type AuthState = typeof SIGNUP | typeof LOGIN

export const Auth = () => {
  const [authState, setAuthState] = useState<AuthState>(SIGNUP)
  const [errMsg, setErrMsg] = useState<string>("")
  const userAction = useUserActions()
  const [loginInput, setLoginInput] = useState<LoginInput>({
    email: "",
    password: "",
  })
  const [signUpInput, setSignUpInput] = useState<SignupInput>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: PREFER_NOT_TO_SAY,
    birthYear: new Date().getFullYear(),
    description: "",
  })

  const [signUpNextPage, setSignUpNextpage] = useState<boolean>(false)
  const { userId } = useUserState()

  const navigate = useNavigate()

  const handleSubmit = async (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()
    if (authState === SIGNUP && !signUpNextPage) {
      if (signUpInput.password !== signUpInput.confirmPassword) {
        setErrMsg("Passwords do not match")
        return
      }

      try {
        await userAction
          .signUp(signUpInput.username, signUpInput.email, signUpInput.password)
          .unwrap()
        setSignUpNextpage(true)
      } catch (error) {
        setErrMsg(
          typeof error === "string"
            ? error
            : "Sign up failed. Please try again.",
        )
      }
    } else if (authState === LOGIN) {
      // http://localhost:9000/auth/login

      try {
        await userAction.logIn(loginInput.email, loginInput.password).unwrap()
        navigate("/dashboard")
      } catch (error) {
        setErrMsg(
          typeof error === "string" ? error : "Login failed. Please try again.",
        )
      }
    } else if (authState === SIGNUP && signUpNextPage) {
      try {
        await axios.post(`${ROOT}/auth/profile`, {
          userId,
          gender: signUpInput.gender,
          birthYear: signUpInput.birthYear,
          description: signUpInput.description,
        })

        navigate("/dashboard")
      } catch (error) {
        const message = axios.isAxiosError(error)
          ? (error.response?.data?.message ?? error.message)
          : "Registration failed. Please try again."
        setErrMsg(message)
        return
      }
    }
  }
  return (
    <div className="auth-wrapper">
      <div className="auth-component">
        <div className="auth-switch">
          <Button
            variant={authState === SIGNUP ? "primary" : "secondary"}
            onClick={() => {
              setAuthState(SIGNUP)
              setErrMsg("")
            }}
          >
            Sign up
          </Button>
          <Button
            variant={authState === LOGIN ? "primary" : "secondary"}
            onClick={() => {
              setAuthState(LOGIN)
              setErrMsg("")
            }}
            disabled={signUpNextPage}
          >
            Log in
          </Button>
        </div>
        {(authState !== SIGNUP || !signUpNextPage) && (
          <form className="ds-form" onSubmit={handleSubmit}>
            {authState === SIGNUP && !signUpNextPage && (
              <div className="auth-stack">
                <div>
                  <h3 className="auth-title">Sign up</h3>
                  <p className="auth-subtitle">
                    Start your journey with a calm, guided space.
                  </p>
                </div>
                <div className="auth-grid">
                  <div className="ds-field">
                    <label className="ds-label" htmlFor="signUpUsername">
                      Username
                    </label>
                    <input
                      className="ds-input"
                      id="signUpUsername"
                      type="text"
                      placeholder="Enter your username: "
                      value={signUpInput.username}
                      onChange={e => {
                        setErrMsg("")
                        setSignUpInput({
                          ...signUpInput,
                          username: e.target.value,
                        })
                      }}
                    />
                  </div>
                  <div className="ds-field">
                    <label className="ds-label" htmlFor="signUpEmail">
                      Email
                    </label>
                    <input
                      className="ds-input"
                      id="signUpEmail"
                      type="email"
                      placeholder="hello@example.com"
                      required={true}
                      value={signUpInput.email}
                      onChange={e => {
                        setErrMsg("")
                        setSignUpInput({
                          ...signUpInput,
                          email: e.target.value,
                        })
                      }}
                    />
                  </div>
                  <div className="ds-field">
                    <label className="ds-label" htmlFor="signUpPassword">
                      Password
                    </label>
                    <input
                      className="ds-input"
                      id="signUpPassword"
                      type="password"
                      placeholder="length between 8-20 characters"
                      required={true}
                      value={signUpInput.password}
                      onChange={e => {
                        setErrMsg("")
                        setSignUpInput({
                          ...signUpInput,
                          password: e.target.value,
                        })
                      }}
                    />
                  </div>
                  <div className="ds-field">
                    <label className="ds-label" htmlFor="confirmPassword">
                      Confirm Password
                    </label>
                    <input
                      className="ds-input"
                      id="confirmPassword"
                      type="password"
                      required={true}
                      value={signUpInput.confirmPassword}
                      onChange={e => {
                        setErrMsg("")
                        setSignUpInput({
                          ...signUpInput,
                          confirmPassword: e.target.value,
                        })
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {authState === LOGIN && (
              <div className="auth-stack">
                <div>
                  <h3 className="auth-title">Welcome back</h3>
                  <p className="auth-subtitle">We are glad to see you again.</p>
                </div>
                <div className="auth-grid">
                  <div className="ds-field">
                    <label className="ds-label" htmlFor="loginEmail">
                      Email
                    </label>
                    <input
                      className="ds-input"
                      id="loginEmail"
                      type="email"
                      required={true}
                      value={loginInput.email}
                      onChange={e => {
                        setErrMsg("")
                        setLoginInput({
                          ...loginInput,
                          email: e.target.value,
                        })
                      }}
                    />
                  </div>
                  <div className="ds-field">
                    <label className="ds-label" htmlFor="loginPassword">
                      Password
                    </label>
                    <input
                      className="ds-input"
                      id="loginPassword"
                      type="password"
                      required={true}
                      value={loginInput.password}
                      onChange={e => {
                        setErrMsg("")
                        setLoginInput({
                          ...loginInput,
                          password: e.target.value,
                        })
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="auth-actions">
              <Button variant="primary" type="submit">
                Continue
              </Button>
              <p className="ds-help ds-help--error">{errMsg}</p>
            </div>
          </form>
        )}
        {authState === SIGNUP && signUpNextPage && (
          <form className="ds-form auth-card" onSubmit={handleSubmit}>
            <div className="auth-stack">
              <div>
                <h3 className="auth-title">A little more about you</h3>
                <p className="auth-subtitle">
                  Share a few details to personalize your support.
                </p>
              </div>
            </div>
            <div className="ds-field">
              <label className="ds-label" htmlFor="signUpGender">
                Gender
              </label>
              <select
                className="ds-input ds-input--select"
                id="signUpGender"
                value={signUpInput.gender ?? ""}
                onChange={e => {
                  setErrMsg("")
                  const value = e.target.value
                  setSignUpInput({
                    ...signUpInput,
                    gender: value as SignupInput["gender"],
                  })
                }}
              >
                <option value={PREFER_NOT_TO_SAY}>{PREFER_NOT_TO_SAY}</option>
                <option value={MALE}>{MALE}</option>
                <option value={FEMALE}>{FEMALE}</option>
                <option value={NON_BINARY}>{NON_BINARY}</option>
              </select>
            </div>
            <div className="ds-field">
              <label className="ds-label" htmlFor="signUpBirthYear">
                Birth year
              </label>
              <input
                className="ds-input"
                id="signUpBirthYear"
                type="number"
                min={1900}
                max={new Date().getFullYear()}
                required={true}
                value={signUpInput.birthYear ?? ""}
                onChange={e => {
                  setErrMsg("")
                  const value = e.target.value
                  setSignUpInput({
                    ...signUpInput,
                    birthYear: Number(value),
                  })
                }}
              />
            </div>
            <div className="ds-field">
              <label className="ds-label" htmlFor="signupDescription">
                Provide a short description
              </label>
              <input
                required={true}
                className="ds-input"
                id="signupDescription"
                type="text"
                maxLength={280}
                value={signUpInput.description ?? ""}
                onChange={e => {
                  setErrMsg("")
                  setSignUpInput({
                    ...signUpInput,
                    description: e.target.value,
                  })
                }}
              />
            </div>
            <Button variant="primary" type="submit">
              Finish
            </Button>
            <p className="ds-help ds-help--error">{errMsg}</p>
          </form>
        )}
      </div>
    </div>
  )
}
