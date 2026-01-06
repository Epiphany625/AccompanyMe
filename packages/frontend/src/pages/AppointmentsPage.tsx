import { useEffect, useMemo, useState } from "react"
import axios, { AxiosError } from "axios"
import { Sidebar } from "../components/Sidebar"
import { useValidateUser } from "../utils/hooks"
import { AddAvailabilityCard } from "../components/AddAvailabilityCard"
import { UserAvailabilityList } from "../components/UserAvailabilityList"
import { ROOT } from "../constants"
import { AppointmentRecord, AppointmentStatus } from "../types"
import { useUserState } from "../state/user.hooks"
import "./PageLayout.css"
import "./AppointmentsPage.css"

const STATUS_CLASS_MAP: Record<AppointmentStatus, string> = {
  confirmed: "confirmed",
  completed: "completed",
  cancelled: "cancelled",
  pending: "pending",
}

const formatAppointmentTime = (raw: string) => {
  const parsed = new Date(raw)
  if (Number.isNaN(parsed.getTime())) {
    return raw
  }
  return parsed.toLocaleString()
}

const formatStatusLabel = (status: AppointmentStatus) =>
  status.charAt(0).toUpperCase() + status.slice(1)

const formatClientLabel = (clientUserId: string) => {
  if (!clientUserId) {
    return "Client"
  }
  return `Client ${clientUserId.slice(0, 8)}`
}

const getTimeValue = (raw: string) => {
  const parsed = new Date(raw)
  const timeValue = parsed.getTime()
  return Number.isNaN(timeValue) ? 0 : timeValue
}

const AppointmentCard = ({
  appointment,
}: {
  appointment: AppointmentRecord
}) => {
  const statusClass = STATUS_CLASS_MAP[appointment.status]
  const clientLabel = formatClientLabel(appointment.clientUserId)

  return (
    <article className="appointment-card page-panel">
      <header className="appointment-card-header">
        <div>
          <h3 className="appointment-card-title">{clientLabel}</h3>
          <p className="appointment-card-meta">
            {formatAppointmentTime(appointment.appointmentTime)}
          </p>
        </div>
        <span
          className={`appointment-status appointment-status--${statusClass}`}
        >
          {formatStatusLabel(appointment.status)}
        </span>
      </header>
      <div className="appointment-card-details">
        <div>
          <span className="appointment-detail-label">Duration</span>
          <span className="appointment-detail-value">
            {appointment.duration} minutes
          </span>
        </div>
        <div>
          <span className="appointment-detail-label">Location</span>
          <span className="appointment-detail-value">
            {appointment.location}
          </span>
        </div>
        <div>
          <span className="appointment-detail-label">Mode</span>
          <span className="appointment-detail-value">{appointment.mode}</span>
        </div>
      </div>
      {appointment.notes ? (
        <p className="appointment-card-notes">{appointment.notes}</p>
      ) : null}
    </article>
  )
}

const AppointmentList = ({
  appointments,
  emptyMessage,
}: {
  appointments: AppointmentRecord[]
  emptyMessage: string
}) => {
  if (!appointments.length) {
    return (
      <div className="appointment-empty page-panel">
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <ul className="appointments-list">
      {appointments.map(appointment => (
        <li className="appointments-list-item" key={appointment.id}>
          <AppointmentCard appointment={appointment} />
        </li>
      ))}
    </ul>
  )
}

export const AppointmentsPage = () => {
  useValidateUser()
  const { userId } = useUserState()
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([])
  const [appointmentsStatus, setAppointmentsStatus] = useState<
    "idle" | "loading" | "ready" | "error"
  >("idle")
  const [appointmentsError, setAppointmentsError] = useState("")

  useEffect(() => {
    if (!userId) {
      setAppointments([])
      setAppointmentsStatus("idle")
      setAppointmentsError("")
      return
    }

    let isMounted = true
    const fetchAppointments = async () => {
      setAppointmentsStatus("loading")
      setAppointmentsError("")
      try {
        const response = await axios.get<AppointmentRecord[]>(
          `${ROOT}/appointments/user/${userId}`,
        )
        if (!isMounted) {
          return
        }
        setAppointments(response.data)
        setAppointmentsStatus("ready")
      } catch (error: unknown) {
        if (!isMounted) {
          return
        }
        setAppointmentsStatus("error")
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<{ message?: string }>
          setAppointmentsError(
            axiosError.response?.data?.message ?? axiosError.message,
          )
        } else {
          setAppointmentsError("Unable to load appointments right now.")
        }
      }
    }

    fetchAppointments()

    return () => {
      isMounted = false
    }
  }, [userId])

  const { upcomingAppointments, pastAppointments } = useMemo(() => {
    const upcoming: AppointmentRecord[] = []
    const past: AppointmentRecord[] = []
    const now = Date.now()

    appointments.forEach(appointment => {
      const timeValue = getTimeValue(appointment.appointmentTime)
      const isPastStatus =
        appointment.status === "completed" || appointment.status === "cancelled"
      const isPastTime = timeValue !== 0 && timeValue < now
      if (isPastStatus || isPastTime) {
        past.push(appointment)
      } else {
        upcoming.push(appointment)
      }
    })

    upcoming.sort(
      (a, b) =>
        getTimeValue(a.appointmentTime) - getTimeValue(b.appointmentTime),
    )
    past.sort(
      (a, b) =>
        getTimeValue(b.appointmentTime) - getTimeValue(a.appointmentTime),
    )

    return { upcomingAppointments: upcoming, pastAppointments: past }
  }, [appointments])

  const upcomingEmptyMessage =
    appointmentsStatus === "loading"
      ? "Loading appointments..."
      : appointmentsStatus === "error"
        ? appointmentsError || "Unable to load appointments right now."
        : "No upcoming appointments. Add availability to get booked."

  const pastEmptyMessage =
    appointmentsStatus === "loading"
      ? "Loading appointments..."
      : appointmentsStatus === "error"
        ? appointmentsError || "Unable to load appointments right now."
        : "No past appointments yet."

  return (
    <div className="page-shell">
      <Sidebar activePage="appointments" />
      <main className="page-content">
        <div className="appointments-section">
          <p className="appointments-eyebrow">Availability</p>
          <h2 className="appointments-title">Add availabilities</h2>
          <AddAvailabilityCard />
          <UserAvailabilityList />
        </div>
        <div className="appointments-section">
          <p className="appointments-eyebrow">Schedule</p>
          <h2 className="appointments-title">Upcoming Appointments</h2>
          <AppointmentList
            appointments={upcomingAppointments}
            emptyMessage={upcomingEmptyMessage}
          />
        </div>
        <div className="appointments-section">
          <p className="appointments-eyebrow">History</p>
          <h2 className="appointments-title">Past Appointments</h2>
          <AppointmentList
            appointments={pastAppointments}
            emptyMessage={pastEmptyMessage}
          />
        </div>
      </main>
    </div>
  )
}
