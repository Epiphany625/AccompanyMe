import { configureStore } from "@reduxjs/toolkit"
import { userReducer } from "./user.slice"
import { availabilityReducer } from "./availability.slice"
export const store = configureStore({
  reducer: {
    user: userReducer,
    availability: availabilityReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
