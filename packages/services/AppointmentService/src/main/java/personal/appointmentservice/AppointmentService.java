package personal.appointmentservice;

import org.springframework.stereotype.Service;

import personal.appointmentservice.clients.AvailabilityClient;
import personal.appointmentservice.dtos.AvailabilityResponseDto;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final AvailabilityClient availabilityClient;

    public AppointmentService(AppointmentRepository appointmentRepository, AvailabilityClient availabilityClient) {
        this.appointmentRepository = appointmentRepository;
        this.availabilityClient = availabilityClient;
    }

    public List<Appointment> getAppointmentsByUserId(UUID userId) {
        return appointmentRepository.findAllByUserId(userId);
    }

    public List<Appointment> getAppointmentsByClientUserId(UUID clientUserId) {
        return appointmentRepository.findAllByClientUserId(clientUserId);
    }

    public Optional<Appointment> createAppointment(Appointment appointment) {
        if (!isValidAppointment(appointment)) {
            return Optional.empty();
        }

        return Optional.of(appointmentRepository.save(appointment));
    }

    public Optional<Appointment> updateAppointment(UUID appointmentId, Appointment updates) {
        if (appointmentId == null) {
            throw new IllegalArgumentException("Appointment id is required.");
        }

        if (!isValidAppointment(updates)) {
            throw new IllegalArgumentException("Invalid appointment update.");
        }

        Optional<Appointment> existing = appointmentRepository.findById(appointmentId);
        if (existing.isEmpty()) {
            return Optional.empty();
        }

        Appointment record = existing.get();
        record.setUserId(updates.getUserId());
        record.setClientUserId(updates.getClientUserId());
        record.setAppointmentTime(updates.getAppointmentTime());
        record.setDuration(updates.getDuration());
        record.setLocation(updates.getLocation());
        record.setMode(updates.getMode());
        record.setStatus(updates.getStatus());
        record.setNotes(updates.getNotes());

        return Optional.of(appointmentRepository.save(record));
    }

    public Optional<Appointment> cancelAppointment(UUID appointmentId) {
        if (appointmentId == null) {
            return Optional.empty();
        }

        Optional<Appointment> existing = appointmentRepository.findById(appointmentId);
        if (existing.isEmpty()) {
            return Optional.empty();
        }

        Appointment record = existing.get();
        record.setStatus("cancelled");
        return Optional.of(appointmentRepository.save(record));
    }

    public AvailabilityResponseDto scheduleAppointmentBasedOnAvailability(UUID availabilityId) {
        AvailabilityResponseDto scheduledAvailability = availabilityClient.scheduleByAvailabilityId(availabilityId);
        return scheduledAvailability;
    }

    private boolean isValidAppointment(Appointment appointment) {
        if (appointment == null) {
            return false;
        }

        if (appointment.getUserId() == null
                || appointment.getClientUserId() == null
                || appointment.getAppointmentTime() == null
                || appointment.getDuration() == null
                || appointment.getDuration() < 1
                || appointment.getLocation() == null
                || appointment.getMode() == null
                || appointment.getStatus() == null) {
            return false;
        }

        String status = appointment.getStatus().toLowerCase();
        return status.equals("confirmed")
                || status.equals("completed")
                || status.equals("cancelled")
                || status.equals("pending");
    }
}
