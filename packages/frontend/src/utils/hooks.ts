import axios from "axios";
import { useUserState, useUserActions } from "../state/user.hooks"
import { ROOT } from "../constants";
import { UserState } from "../types";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Redirects authenticated users away from auth screens by validating the session.
export const useSkipAuth = () => {
    const userAction = useUserActions();
    const navigate = useNavigate();

    useEffect(() => {

        let isActive = true;
        const validate = async () => {


            try {
                const response = await axios.get(`${ROOT}/auth`);
                if (!isActive) {
                    return;
                }
                userAction.setUser({
                    userId: response.data.id,
                    email: response.data.email,
                    username: response.data.username
                } as UserState);

                navigate("/dashboard")
            }

            catch (err) {
                if (!isActive) {
                    return;
                }
            }

        }

        validate();

        return () => { isActive = false; }

    }, [userAction])
}

// Ensures a valid user session; routes to auth on 401/403, otherwise home on error.
export const useValidateUser = () => {
    const userAction = useUserActions();
    const { username, userId, email } = useUserState();
    const navigate = useNavigate();

    useEffect(() => {
        let isActive = true;

        const validate = async () => {
            if (!(username === "" || username === null || username === undefined ||
                userId === "" || userId === null || userId === undefined ||
                email === "" || email === undefined || email === null)) {
                return;
            }

            try {
                const response = await axios.get(`${ROOT}/auth`);
                if (!isActive) {
                    return;
                }
                console.log(response.data.id);
                userAction.setUser({
                    userId: response.data.id,
                    email: response.data.email,
                    username: response.data.username
                } as UserState);
            }
            catch (err) {
                if (!isActive) {
                    return;
                }

                if (axios.isAxiosError(err)) {
                    const status = err.response?.status;
                    if (status === 400 || status === 401 || status === 403) {
                        navigate("/auth");
                        return;
                    }
                }

                navigate("/");
            }
        };

        validate();

        return () => {
            isActive = false;
        };
    }, [username, userId, email, userAction, navigate]);
}
