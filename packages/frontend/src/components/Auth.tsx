import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ROOT } from "../constants";
import { useUserActions } from "../state/user.hooks";
import { UserState } from "../interfaces";

interface LoginInput {
    email: string,
    password: string
}

interface SignupInput extends LoginInput {
    username: string,
    confirmPassword: string,
    gender?: 'male' | 'female' | 'non-binary',
    age?: number,
    description?: string
}

// signup states. 
const SIGNUP = 0 as const;
const LOGIN = 1 as const;
type AuthState = typeof SIGNUP | typeof LOGIN;

export const Auth = () => {
    const [authState, setAuthState] = useState<AuthState>(SIGNUP);
    const [errMsg, setErrMsg] = useState<string>("");
    const userAction = useUserActions();
    const [loginInput, setLoginInput] = useState<LoginInput>({
        email: "",
        password: ""
    });
    const [signUpInput, setSignUpInput] = useState<SignupInput>({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [signUpNextPage, setSignUpNextpage] = useState<boolean>(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (authState === SIGNUP && !(signUpNextPage)) {

            if (signUpInput.password !== signUpInput.confirmPassword) {
                setErrMsg("Passwords do not match");
                return;
            }

            try {
                const response = await axios.post(`${ROOT}/auth/signup`, {
                    username: signUpInput.username,
                    email: signUpInput.email,
                    password: signUpInput.password,
                });

                userAction.setUser({
                    userId: response.data.id,
                    email: response.data.email,
                    username: response.data.username
                } as UserState)

            } catch (error) {
                const message = axios.isAxiosError(error)
                    ? (error.response?.data?.message ?? error.message)
                    : "Sign up failed. Please try again.";
                setErrMsg(message);
                return;
            }

            setSignUpNextpage(true);
        }

        else if (authState === LOGIN) {
            // http://localhost:9000/auth/login
            try {
                const response = await axios.post(`${ROOT}/auth/login`, {
                    email: loginInput.email,
                    password: loginInput.password,
                });

                userAction.setUser({
                    userId: response.data.id,
                    email: response.data.email,
                    username: response.data.username
                } as UserState)

            } catch (error) {
                const message = axios.isAxiosError(error)
                    ? (error.response?.data?.message ?? error.message)
                    : "Login failed. Please try again.";
                setErrMsg(message);
                return;
            }
        }

        else if (authState === SIGNUP && signUpNextPage) {

        }
    }
    return (
        <div>
            <div>
                <button onClick={() => setAuthState(SIGNUP)} >Sign up</button>
                <button onClick={() => setAuthState(LOGIN)}>Log in</button>
            </div>
            <form onSubmit={handleSubmit}>
                {(authState === SIGNUP && !(signUpNextPage)) &&
                    <div>
                        <h3>Sign up</h3>
                        <div>
                            <div>
                                <label htmlFor="signUpUsername">Username: </label>
                                <input id="signUpUsername"
                                    type="text"
                                    placeholder="Enter your username: "
                                    value={signUpInput.username}
                                    onChange={(e) => {
                                        setErrMsg("");
                                        setSignUpInput({
                                            ...signUpInput,
                                            username: e.target.value,
                                        });
                                    }} />
                            </div>
                            <div>
                                <label htmlFor="signUpEmail">Email: </label>
                                <input id="signUpEmail"
                                    type="email"
                                    placeholder="hello@example.com"
                                    required={true}
                                    value={signUpInput.email}
                                    onChange={(e) => {
                                        setErrMsg("");
                                        setSignUpInput({
                                            ...signUpInput,
                                            email: e.target.value,
                                        });
                                    }} />
                            </div>
                            <div>
                                <label htmlFor="signUpPassword">Password: </label>
                                <input id="signUpPassword"
                                    type="password"
                                    placeholder="length between 8-20 characters"
                                    required={true}
                                    value={signUpInput.password}
                                    onChange={(e) => {
                                        setErrMsg("");
                                        setSignUpInput({
                                            ...signUpInput,
                                            password: e.target.value,
                                        });
                                    }} />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword">Confirm Password: </label>
                                <input id="confirmPassword"
                                    type="password"
                                    required={true}
                                    value={signUpInput.confirmPassword}
                                    onChange={(e) => {
                                        setErrMsg("");
                                        setSignUpInput({
                                            ...signUpInput,
                                            confirmPassword: e.target.value,
                                        });
                                    }} />
                            </div>
                        </div>
                    </div>
                }

                {
                    authState === LOGIN &&
                    <div>
                        <h3>Welcome back! </h3>
                        <div>
                            <div>
                                <label htmlFor="loginEmail">Email: </label>
                                <input id="loginEmail"
                                    type="email"
                                    required={true}
                                    value={loginInput.email}
                                    onChange={(e) => {
                                        setErrMsg("");
                                        setLoginInput({
                                            ...loginInput,
                                            email: e.target.value,
                                        });
                                    }} />
                            </div>
                            <div>
                                <label htmlFor="loginPassword">Password: </label>
                                <input id="loginPassword"
                                    type="password"
                                    required={true}
                                    value={loginInput.password}
                                    onChange={(e) => {
                                        setErrMsg("");
                                        setLoginInput({
                                            ...loginInput,
                                            password: e.target.value,
                                        });
                                    }} />
                            </div>
                        </div>
                    </div>
                }
                <button type="submit">Continue</button>
                <p>{errMsg}</p>
            </form>
            {
                (authState === SIGNUP && signUpNextPage) &&
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="signUpGender">Gender: </label>
                        <select
                            id="signUpGender"
                            value={signUpInput.gender ?? ""}
                            onChange={(e) => {
                                setErrMsg("");
                                const value = e.target.value;
                                setSignUpInput({
                                    ...signUpInput,
                                    gender: value === "" ? undefined : (value as SignupInput["gender"]),
                                });
                            }}
                        >
                            <option value="">Prefer not to say</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="non-binary">Non-binary</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="signUpAge">Age: </label>
                        <input
                            id="signUpAge"
                            type="number"
                            min={18}
                            max={120}
                            value={signUpInput.age ?? ""}
                            onChange={(e) => {
                                setErrMsg("");
                                const value = e.target.value;
                                setSignUpInput({
                                    ...signUpInput,
                                    age: value === "" ? undefined : Number(value),
                                });
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor="signupDescription">Provide a short description: </label>
                        <input
                            id="signupDescription"
                            type="text"
                            maxLength={280}
                            value={signUpInput.description ?? ""}
                            onChange={(e) => {
                                setErrMsg("");
                                setSignUpInput({
                                    ...signUpInput,
                                    description: e.target.value,
                                });
                            }}
                        />
                    </div>
                    <button type="submit">Finish</button>
                </form>
            }
        </div>
    )
}
