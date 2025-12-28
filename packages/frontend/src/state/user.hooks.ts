import { useAppDispatch, useAppSelector } from "./hooks";
import { UserState } from "../types";
import { setUser } from "./user.slice";

export const useUserActions = () => {
    const dispatch = useAppDispatch();
    return {
        setUser: (payload: UserState) => {
            dispatch(setUser(payload))
        }
    };
};

export const useUserState = () => useAppSelector((state) => state.user);
