import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { AvailabilityRecord } from "../types"
import { ROOT } from "../constants"
import axios from "axios"


const initialState: AvailabilityRecord[] = []

export const loadAvailabilities = createAsyncThunk<
    AvailabilityRecord[], // Success payload type (array of AvailabilityRecord)
    { userId: string },   // Argument type (expects an object with userId)
    { rejectValue: string } // Failure payload type (string message)
>(
    "availability/load",
    async ({ userId }, thunkAPI) => {
        try {
            const response = await axios.get<AvailabilityRecord[]>(
                `${ROOT}/availabilities/user/${userId}`
            )
            return response.data
        } catch (error) {
            const message = axios.isAxiosError(error)
                ? (error.response?.data?.message ?? error.message)
                : "Availability load failed. Please try again. "
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const addAvailability = createAsyncThunk<
    AvailabilityRecord, // Success payload type (AvailabilityRecord)
    { userId: string, startTime: string, duration: number },   // Argument type (expects an object with userId)
    { rejectValue: string } // Failure payload type (string message)
>(
    "availability/add",
    async ({ userId, startTime, duration }, thunkAPI) => {
        try {
            const response = await axios.post(`${ROOT}/availabilities`, {
                userId,
                startTime,
                duration,
            })
            return response.data
        } catch (error) {
            const message = axios.isAxiosError(error)
                ? (error.response?.data?.message ?? error.message)
                : "Add availability failed. Please try again. "
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const editAvailability = createAsyncThunk<
    AvailabilityRecord, // Success payload type (updated AvailabilityRecord)
    { availabilityId: number, userId: string, startTime: string, duration: number }, // Argument type
    { rejectValue: string } // Failure payload type (string message)
>(
    "availability/edit",
    async ({ availabilityId, userId, startTime, duration }, thunkAPI) => {
        try {
            const response = await axios.put<AvailabilityRecord>(
                `${ROOT}/availabilities/${availabilityId}`,
                {
                    userId,
                    startTime,
                    duration,
                }
            )
            return response.data
        } catch (error) {
            const message = axios.isAxiosError(error)
                ? (error.response?.data?.message ?? error.message)
                : "Edit availability failed. Please try again. "
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const deleteAvailability = createAsyncThunk<
    number, // Success payload type (deleted availability id)
    { availabilityId: number }, // Argument type
    { rejectValue: string } // Failure payload type (string message)
>(
    "availability/delete",
    async ({ availabilityId }, thunkAPI) => {
        try {
            await axios.delete(`${ROOT}/availabilities/${availabilityId}`)
            return availabilityId
        } catch (error) {
            const message = axios.isAxiosError(error)
                ? (error.response?.data?.message ?? error.message)
                : "Delete availability failed. Please try again. "
            return thunkAPI.rejectWithValue(message)
        }
    }
)

const availabilitySlice = createSlice({
    name: "availabilityState",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadAvailabilities.fulfilled, (state, action) => {
                return action.payload
            })
            .addCase(addAvailability.fulfilled, (state, action) => {
                state.push(action.payload)
            })
            .addCase(editAvailability.fulfilled, (state, action) => {
                const updated = action.payload
                const index = state.findIndex((item) => item.id === updated.id)
                if (index !== -1) {
                    state[index] = updated
                }
            })
            .addCase(deleteAvailability.fulfilled, (state, action) => {
                return state.filter((item) => item.id !== action.payload)
            })
    }
})
export const availabilityReducer = availabilitySlice.reducer;
