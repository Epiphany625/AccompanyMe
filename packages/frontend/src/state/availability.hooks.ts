import {
  addAvailability,
  deleteAvailability,
  editAvailability,
  loadAvailabilities,
} from "./availability.slice"
import { useAppDispatch, useAppSelector } from "./hooks"

export const useAvailabilityActions = () => {
  const dispatch = useAppDispatch()
  return {
    loadAvailabilities: (userId: string) => {
      return dispatch(loadAvailabilities({ userId }))
    },
    addAvailability: (userId: string, startTime: string, duration: number) => {
      return dispatch(addAvailability({ userId, startTime, duration }))
    },
    editAvailability: (
      availabilityId: number,
      userId: string,
      startTime: string,
      duration: number,
    ) => {
      return dispatch(
        editAvailability({ availabilityId, userId, startTime, duration }),
      )
    },
    deleteAvailability: (availabilityId: number) => {
      return dispatch(deleteAvailability({ availabilityId }))
    },
  }
}

export const useAvailabilityState = () =>
  useAppSelector(state => state.availability)
