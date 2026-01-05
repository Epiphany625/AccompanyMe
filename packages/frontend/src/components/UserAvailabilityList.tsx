import { useEffect, useState } from "react"
import Button from "../../design-system/buttons/Button"
import { EMPTY_AVAILABILITY } from "../constants"
import { useUserState } from "../state/user.hooks"
import { useAvailabilityActions, useAvailabilityState } from "../state/availability.hooks"
import type { AvailabilityFormState, AvailabilityRecord } from "../types"

const formatAvailabilityTime = (raw: string) => {
    const parsed = new Date(raw)
    if (Number.isNaN(parsed.getTime())) {
        return raw
    }
    return parsed.toLocaleString()
}

const toDatetimeLocalValue = (raw: string) => {
    const parsed = new Date(raw)
    if (Number.isNaN(parsed.getTime())) {
        return ""
    }
    return parsed.toISOString().slice(0, 16)
}

export const UserAvailabilityList = () => {
    const { userId } = useUserState()
    // const [availabilities, setAvailabilities] = useState<AvailabilityRecord[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [deletingIds, setDeletingIds] = useState<number[]>([])
    const [editingId, setEditingId] = useState<number | null>(null)
    const [editForm, setEditForm] = useState<AvailabilityFormState>(EMPTY_AVAILABILITY)
    const [isSaving, setIsSaving] = useState(false)

    const availabilityAction = useAvailabilityActions()
    const { availabilities, forUserId } = useAvailabilityState()

    useEffect(() => {
        console.log(availabilities.length)
        if (!userId) {
            console.log('no userid')
            return
        }

        let isActive = true
        const loadAvailabilities = async () => {
            setIsLoading(true)
            setErrorMessage(null)
            try {
                if (availabilities.length === 0 || forUserId !== userId) {
                    const response = await availabilityAction.loadAvailabilities(userId).unwrap()

                }
            } catch (error: unknown) {
                setErrorMessage(typeof error === "string" ? error : "Unable to load availabilities. Please try again.");
            } finally {
                if (isActive) {
                    setIsLoading(false)
                }
            }
        }

        loadAvailabilities()

        return () => {
            isActive = false
        }
    }, [userId])

    const handleDelete = async (availabilityId: number) => {
        setErrorMessage(null)
        setDeletingIds((prev) => [...prev, availabilityId])
        try {
            await availabilityAction.deleteAvailability(availabilityId).unwrap()
            // setAvailabilities((prev) => prev.filter((item) => item.id !== availabilityId))
        } catch (error: unknown) {
            setErrorMessage(typeof error === "string" ? error : "Unable to delete availability.")
        } finally {
            setDeletingIds((prev) => prev.filter((id) => id !== availabilityId))
        }
    }

    const startEditing = (availability: AvailabilityRecord) => {
        const start = availability.startTime
        const duration = availability.duration
        setEditingId(availability.id)
        setEditForm({
            startTime: start ? toDatetimeLocalValue(start) : "",
            duration: duration ? String(duration) : "",
        })
        setErrorMessage(null)
    }

    const cancelEditing = () => {
        setEditingId(null)
        setEditForm(EMPTY_AVAILABILITY)
    }

    const handleEditChange = (field: keyof AvailabilityFormState, value: string) => {
        setEditForm((prev) => ({ ...prev, [field]: value }))
    }

    const handleSave = async (availabilityId: number) => {
        if (!userId) {
            setErrorMessage("Please log in again before editing availability.")
            return
        }

        if (!editForm.startTime) {
            setErrorMessage("Select a start time.")
            return
        }

        const parsedStart = new Date(editForm.startTime)
        if (Number.isNaN(parsedStart.getTime())) {
            setErrorMessage("Start time looks invalid.")
            return
        }

        const durationValue = Number(editForm.duration)
        if (!Number.isFinite(durationValue) || durationValue < 1) {
            setErrorMessage("Duration must be at least 1 minute.")
            return
        }

        setIsSaving(true)
        setErrorMessage(null)

        try {
            const response = await availabilityAction
                .editAvailability(availabilityId, userId, parsedStart.toISOString(), durationValue)
                .unwrap()
            // setAvailabilities((prev) =>
            //     prev.map((item) => (item.id === availabilityId ? response : item))
            // )
            cancelEditing()
        } catch (error: unknown) {
            setErrorMessage(typeof error === "string" ? error : "Unable to update availability.")
        } finally {
            setIsSaving(false)
        }
    }

    const content = () => {
        if (isLoading) {
            return <p className="availability-status">Loading availabilities...</p>
        }

        if (errorMessage) {
            return <p className="availability-status availability-status--error">{errorMessage}</p>
        }

        if (availabilities.length === 0) {
            return <p className="availability-status">No availabilities yet.</p>
        }

        return (
            <ul className="availability-list">
                {availabilities.map((availability) => {
                    const start = availability.startTime
                    const duration = availability.duration
                    const isEditing = editingId === availability.id
                    return (
                        <li className="availability-list-item" key={availability.id}>
                            {isEditing ? (
                                <div className="availability-edit">
                                    <div className="availability-edit-fields">
                                        <div className="ds-field">
                                            <label className="ds-label" htmlFor={`edit-start-${availability.id}`}>
                                                Start time
                                            </label>
                                            <input
                                                className="ds-input"
                                                id={`edit-start-${availability.id}`}
                                                type="datetime-local"
                                                value={editForm.startTime}
                                                onChange={(event) => handleEditChange("startTime", event.target.value)}
                                            />
                                        </div>
                                        <div className="ds-field">
                                            <label className="ds-label" htmlFor={`edit-duration-${availability.id}`}>
                                                Duration (minutes)
                                            </label>
                                            <input
                                                className="ds-input"
                                                id={`edit-duration-${availability.id}`}
                                                type="number"
                                                min={1}
                                                value={editForm.duration}
                                                onChange={(event) => handleEditChange("duration", event.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="availability-item-actions">
                                        <Button
                                            className="availability-edit-button"
                                            type="button"
                                            variant="primary"
                                            onClick={() => handleSave(availability.id)}
                                            disabled={isSaving}
                                        >
                                            {isSaving ? "Saving..." : "Save"}
                                        </Button>
                                        <Button
                                            className="availability-edit-button"
                                            type="button"
                                            variant="secondary"
                                            onClick={cancelEditing}
                                            disabled={isSaving}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <p className="availability-item-time">
                                            {start ? formatAvailabilityTime(start) : "Unknown time"}
                                        </p>
                                        <p className="availability-item-meta">
                                            {duration ? `${duration} minutes` : "Duration not set"}
                                        </p>
                                    </div>
                                    <div className="availability-item-actions">
                                        <span className="availability-item-pill">Open</span>
                                        <Button
                                            className="availability-edit-button"
                                            type="button"
                                            variant="secondary"
                                            onClick={() => startEditing(availability)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            className="availability-delete-button"
                                            type="button"
                                            variant="warning"
                                            onClick={() => handleDelete(availability.id)}
                                            disabled={deletingIds.includes(availability.id)}
                                        >
                                            {deletingIds.includes(availability.id) ? "Deleting..." : "Delete"}
                                        </Button>
                                    </div>
                                </>
                            )}
                        </li>
                    )
                })}
            </ul>
        )
    }

    return (
        <section className="availability-panel page-panel">
            <header className="availability-panel-header">
                <div>
                    <p className="availability-card-title">Your availability</p>
                    <p className="availability-card-desc">These slots are currently open to book.</p>
                </div>
            </header>
            {content()}
        </section>
    )
}
