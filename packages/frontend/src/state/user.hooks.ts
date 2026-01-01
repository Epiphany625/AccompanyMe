import { useAppDispatch, useAppSelector } from "./hooks";
import { UserState } from "../types";
import { logIn, logOut, setUser, signUp } from "./user.slice";

export const useUserActions = () => {
    const dispatch = useAppDispatch();
    return {
        setUser: (payload: UserState) => {
            dispatch(setUser(payload))
        },
        logOut: () => {
            dispatch(logOut())
        },
        logIn: (email: string, password: string) => {
            return dispatch(logIn({ inputEmail: email, password }))
        },
        signUp: (inputUsername: string, inputEmail: string, inputPassword: string) => {
            return dispatch(signUp({ inputUsername, inputEmail, inputPassword }))
        }
    };
};

export const useUserState = () => useAppSelector((state) => state.user);
