import { MALE, FEMALE, NON_BINARY, PREFER_NOT_TO_SAY } from "./constants";

export type Gender =
    | typeof MALE
    | typeof FEMALE
    | typeof NON_BINARY
    | typeof PREFER_NOT_TO_SAY;

export interface UserState {
    userId: string | null,
    username: string | null,
    email: string | null
}
