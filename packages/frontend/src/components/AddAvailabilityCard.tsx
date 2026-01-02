import { FormEvent, useState } from "react"
import Button from "../../design-system/buttons/Button"
import axios, { AxiosError } from "axios"
import { EMPTY_AVAILABILITY } from "../constants"
import { useUserState } from "../state/user.hooks"
import type { AvailabilityFormState } from "../types"
import { useAvailabilityActions } from "../state/availability.hooks"

export const AddAvailabilityCard = () => {
    const { userId } = useUserState()
    const [isExpanded, setIsExpanded] = useState(false)
    const [formState, setFormState] = useState<AvailabilityFormState>(EMPTY_AVAILABILITY)
    const [statusMessage, setStatusMessage] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const availabilityAction = useAvailabilityActions();

    const handleChange = (field: keyof AvailabilityFormState, value: string) => {
        setFormState((prev) => ({ ...prev, [field]: value }))
    }

    const resetMessages = () => {
        setStatusMessage(null)
        setErrorMessage(null)
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        resetMessages()

        if (!userId) {
            setErrorMessage("Please log in again before adding availability.")
            return
        }

        if (!formState.startTime) {
            setErrorMessage("Select a start time.")
            return
        }

        const parsedStart = new Date(formState.startTime)
        if (Number.isNaN(parsedStart.getTime())) {
            setErrorMessage("Start time looks invalid.")
            return
        }

        const durationValue = Number(formState.duration)
        if (!Number.isFinite(durationValue) || durationValue < 1) {
            setErrorMessage("Duration must be at least 1 minute.")
            return
        }

        setIsSubmitting(true)

        try {
            await availabilityAction.addAvailability(
                userId, parsedStart.toISOString(), durationValue
            ).unwrap()
            setStatusMessage("Availability saved.")
            setFormState(EMPTY_AVAILABILITY)
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<{ message?: string }>
                setErrorMessage(
                    axiosError.response?.data?.message ??
                    axiosError.message ??
                    "Unable to save availability."
                )
            } else {
                setErrorMessage("Unable to save availability.")
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!isExpanded) {
        return (
            <button
                className="availability-add-card"
                type="button"
                onClick={() => {
                    setIsExpanded(true)
                    resetMessages()
                }}
            >
                <div>
                    <p className="availability-card-title">Add availability</p>
                    <p className="availability-card-desc">
                        Share a start time and duration so others can book with you.
                    </p>
                </div>
                <span className="availability-card-action">+ New</span>
            </button>
        )
    }

    return (
        <section className="availability-panel page-panel">
            <header className="availability-panel-header">
                <div>
                    <p className="availability-card-title">New availability</p>
                    <p className="availability-card-desc">Pick a start time and how long you are free.</p>
                </div>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                        setIsExpanded(false)
                        resetMessages()
                    }}
                >
                    Cancel
                </Button>
            </header>
            <form className="availability-form" onSubmit={handleSubmit}>
                <div className="ds-field">
                    <label className="ds-label" htmlFor="startTime">
                        Start time
                    </label>
                    <input
                        className="ds-input"
                        id="startTime"
                        type="datetime-local"
                        value={formState.startTime}
                        onChange={(event) => handleChange("startTime", event.target.value)}
                    />
                    <div className="ds-help">Local time will be converted to UTC when submitted.</div>
                </div>
                <div className="ds-field">
                    <label className="ds-label" htmlFor="duration">
                        Duration (minutes)
                    </label>
                    <input
                        className="ds-input"
                        id="duration"
                        type="number"
                        min={1}
                        value={formState.duration}
                        onChange={(event) => handleChange("duration", event.target.value)}
                    />
                </div>
                <div className="availability-form-actions">
                    <Button type="submit" variant="primary" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save availability"}
                    </Button>
                    {statusMessage ? (
                        <span className="availability-status availability-status--success">{statusMessage}</span>
                    ) : null}
                    {errorMessage ? (
                        <span className="availability-status availability-status--error">{errorMessage}</span>
                    ) : null}
                </div>
            </form>
        </section>
    )
}
