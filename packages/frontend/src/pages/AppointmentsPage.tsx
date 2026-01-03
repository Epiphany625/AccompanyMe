import { Sidebar } from "../components/Sidebar"
import { useValidateUser } from "../utils/hooks"
import { AddAvailabilityCard } from "../components/AddAvailabilityCard"
import { UserAvailabilityList } from "../components/UserAvailabilityList"
import "./PageLayout.css"
import "./AppointmentsPage.css"

type AppointmentStatus = "confirmed" | "completed" | "cancelled"

type Appointment = {
    id: string
    userId: string
    clientUserId: string
    appointmentTime: string
    duration: number
    location: string
    mode: string
    status: AppointmentStatus
    notes?: string | null
    clientName: string
}

const STATUS_CLASS_MAP: Record<AppointmentStatus, string> = {
    confirmed: "confirmed",
    completed: "completed",
    cancelled: "cancelled",
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

const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
    const statusClass = STATUS_CLASS_MAP[appointment.status]

    return (
        <article className="appointment-card page-panel">
            <header className="appointment-card-header">
                <div>
                    <h3 className="appointment-card-title">{appointment.clientName}</h3>
                    <p className="appointment-card-meta">
                        {formatAppointmentTime(appointment.appointmentTime)}
                    </p>
                </div>
                <span className={`appointment-status appointment-status--${statusClass}`}>
                    {formatStatusLabel(appointment.status)}
                </span>
            </header>
            <div className="appointment-card-details">
                <div>
                    <span className="appointment-detail-label">Duration</span>
                    <span className="appointment-detail-value">{appointment.duration} minutes</span>
                </div>
                <div>
                    <span className="appointment-detail-label">Location</span>
                    <span className="appointment-detail-value">{appointment.location}</span>
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
    appointments: Appointment[]
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
            {appointments.map((appointment) => (
                <li className="appointments-list-item" key={appointment.id}>
                    <AppointmentCard appointment={appointment} />
                </li>
            ))}
        </ul>
    )
}

export const AppointmentsPage = () => {
    useValidateUser()

    const upcomingAppointments: Appointment[] = [
        {
            id: "upcoming-1",
            userId: "3a1d6a6f-3dd0-4fb7-9c93-4926ef7e91d9",
            clientUserId: "c4d1b02c-90f3-4b10-9509-f4c2f5e9d91b",
            appointmentTime: "2024-03-12T09:00:00-05:00",
            duration: 60,
            clientName: "Avery Chen",
            location: "Design Studio 4B",
            mode: "In-person",
            status: "confirmed",
            notes: "Intro consult: brand refresh and visual audit.",
        },
        {
            id: "upcoming-2",
            userId: "3a1d6a6f-3dd0-4fb7-9c93-4926ef7e91d9",
            clientUserId: "8a708e45-5db9-4c49-98ae-2a0230b81c1f",
            appointmentTime: "2024-03-14T13:30:00-05:00",
            duration: 45,
            clientName: "Jordan Lee",
            location: "Room 12 / Building C",
            mode: "Hybrid",
            status: "confirmed",
            notes: "Needs agenda and pre-read before session.",
        },
        {
            id: "upcoming-3",
            userId: "3a1d6a6f-3dd0-4fb7-9c93-4926ef7e91d9",
            clientUserId: "b7623d1b-1f4e-4c90-9c3b-b22d2f1e7b78",
            appointmentTime: "2024-03-15T11:00:00-05:00",
            duration: 60,
            clientName: "Priya Shah",
            location: "Zoom",
            mode: "Virtual",
            status: "confirmed",
            notes: "Follow-up on partnership goals and launch timeline.",
        },
    ]

    const pastAppointments: Appointment[] = [
        {
            id: "past-1",
            userId: "3a1d6a6f-3dd0-4fb7-9c93-4926ef7e91d9",
            clientUserId: "3b80fb2e-5b4b-47c0-9f1a-5cb9f25c1c58",
            appointmentTime: "2024-03-04T15:00:00-05:00",
            duration: 45,
            clientName: "Miguel Santos",
            location: "Studio Annex",
            mode: "In-person",
            status: "completed",
            notes: "Reviewed sprint outcomes; sent recap afterward.",
        },
        {
            id: "past-2",
            userId: "3a1d6a6f-3dd0-4fb7-9c93-4926ef7e91d9",
            clientUserId: "e18f6897-8c86-4a1b-8f52-6a6a9d6c58c3",
            appointmentTime: "2024-03-06T10:00:00-05:00",
            duration: 60,
            clientName: "Naomi Brooks",
            location: "Google Meet",
            mode: "Virtual",
            status: "completed",
            notes: "Shared next steps and onboarding docs.",
        },
        {
            id: "past-3",
            userId: "3a1d6a6f-3dd0-4fb7-9c93-4926ef7e91d9",
            clientUserId: "c02fe78f-0d1f-4a6c-9a64-0b64f66e1c79",
            appointmentTime: "2024-03-08T14:00:00-05:00",
            duration: 30,
            clientName: "Samir Patel",
            location: "Room 5A",
            mode: "In-person",
            status: "cancelled",
            notes: "Cancelled same-day; reschedule for next week.",
        },
    ]

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
                        emptyMessage="No upcoming appointments. Add availability to get booked."
                    />
                </div>
                <div className="appointments-section">
                    <p className="appointments-eyebrow">History</p>
                    <h2 className="appointments-title">Past Appointments</h2>
                    <AppointmentList
                        appointments={pastAppointments}
                        emptyMessage="No past appointments yet."
                    />
                </div>
            </main>
        </div>

    )
}
