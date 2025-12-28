import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { UserState } from "../types"

const initialState: UserState = {
    userId: "",
    username: "",
    email: "hello@example.com"
}

// export const incrementAsync = createAsyncThunk(
//     "counter/incrementAysnc",
//     async (amount: number) => {
//         await new Promise(resolve => setTimeout(resolve, 1000));
//         return amount;
//     }
// )

const userSlice = createSlice({
    name: "userState",
    initialState: initialState,
    reducers: {
        setUserId: (state, action: PayloadAction<string>) => {
            state.userId = action.payload
        },
        setUsername: (state, action: PayloadAction<string>) => {
            state.username = action.payload
        },
        setEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload
        },
        setUser: (state, action: PayloadAction<UserState>) => {
            state.email = action.payload.email
            state.userId = action.payload.userId
            state.username = action.payload.username
        }
    }
})

export const { setUserId, setUsername, setEmail, setUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
