import { MALE, FEMALE, NON_BINARY, PREFER_NOT_TO_SAY } from "./constants"

export type Gender =
  | typeof MALE
  | typeof FEMALE
  | typeof NON_BINARY
  | typeof PREFER_NOT_TO_SAY

export type AvailabilityRecord = {
  id: number
  userId: string
  startTime: string
  duration: number
}

export type AvailabilityFormState = {
  startTime: string
  duration: string
}

export type UserProfile = {
  id: string
  userId: string
  username: string
  gender: string
  birthYear: number
  description: string
  profilePicLink?: string | null
}
// redux state definitions
export interface UserState {
  userId: string | null
  username: string | null
  email: string | null
}
export interface AvailabilityState {
  availabilities: AvailabilityRecord[]
  forUserId: string | null
}

// request data structures
export interface AppointmentRequest {
  userId: string // owner
  clientUserId: string // client
  status: AppointmentStatus // TODO. needs further value constraints.
  location?: string
  mode?: string
  notes?: string | null
}

export type AppointmentStatus =
  | "confirmed"
  | "completed"
  | "cancelled"
  | "pending"

// Response data structures

export type AuthResponse = {
  userId: string
  email: string
  username: string
}

export type AppointmentRecordResponse = {
  id: string
  userId: string
  clientUserId: string
  appointmentTime: string
  duration: number
  location: string
  mode: string
  status: AppointmentStatus
  notes?: string | null
}
