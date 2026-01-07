import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { UserState, AuthResponse } from "../types"
import { ROOT } from "../constants"
import axios from "axios"

type LoginArgs = {
  inputEmail: string
  password: string
}
type SignUpArgs = {
  inputUsername: string
  inputEmail: string
  inputPassword: string
}

const initialState: UserState = {
  userId: "",
  username: "",
  email: "hello@example.com",
}

export const logOut = createAsyncThunk("user/logout", async () => {
  await axios.post(`${ROOT}/auth/logout`)
})

export const logIn = createAsyncThunk<
  AuthResponse,
  LoginArgs,
  { rejectValue: string }
>("user/login", async ({ inputEmail, password }, thunkAPI) => {
  try {
    const response = await axios.post(`${ROOT}/auth/login`, {
      email: inputEmail,
      password: password,
    })

    const { id, email, username } = response.data

    return { userId: id, email, username }
  } catch (error) {
    const message = axios.isAxiosError(error)
      ? (error.response?.data?.message ?? error.message)
      : "Login failed. Please try again."
    return thunkAPI.rejectWithValue(message)
  }
})

export const signUp = createAsyncThunk<
  AuthResponse,
  SignUpArgs,
  { rejectValue: string }
>(
  "user/signup",
  async ({ inputUsername, inputEmail, inputPassword }, thunkAPI) => {
    try {
      const response = await axios.post(`${ROOT}/auth/signup`, {
        username: inputUsername,
        email: inputEmail,
        password: inputPassword,
      })

      const { id, email, username } = response.data

      return { userId: id, email, username }
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data?.message ?? error.message)
        : "Sign up failed. Please try again."
      return thunkAPI.rejectWithValue(message)
    }
  },
)

// http://localhost:9000/auth/login

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
    },
  },
  extraReducers: builder => {
    builder
      .addCase(logOut.fulfilled, state => {
        state.userId = null
        state.username = null
        state.email = null
      })
      .addCase(logIn.fulfilled, (state, action) => {
        state.userId = action.payload.userId
        state.email = action.payload.email
        state.username = action.payload.username
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.userId = action.payload.userId
        state.email = action.payload.email
        state.username = action.payload.username
      })
  },
})

export const { setUserId, setUsername, setEmail, setUser } = userSlice.actions
export const userReducer = userSlice.reducer
