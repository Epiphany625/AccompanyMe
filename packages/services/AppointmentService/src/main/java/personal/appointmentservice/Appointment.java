package personal.appointmentservice;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "appointments")
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    @Column(name = "user_id", nullable = false)
    private UUID userId; // owner

    @NotNull
    @Column(name = "client_user_id", nullable = false)
    private UUID clientUserId;

    @NotNull
    @Column(nullable = false)
    private OffsetDateTime appointmentTime;

    @NotNull
    @Min(1)
    @Column(nullable = false)
    private Long duration;

    @NotNull
    @Size(max = 255)
    @Column(nullable = false)
    private String location;

    @NotNull
    @Column(nullable = false)
    private String mode;

    @NotNull
    @Pattern(regexp = "confirmed|completed|cancelled")
    @Column(nullable = false)
    private String status;

    @Column(nullable = true)
    @Size(max = 1000)
    private String notes;

    public Appointment() {
        // Default constructor
    }

    public Appointment(
            UUID id,
            UUID userId,
            UUID clientUserId,
            OffsetDateTime appointmentTime,
            Long duration,
            String location,
            String mode,
            String status,
            String notes
    ) {
        this.id = id;
        this.userId = userId;
        this.clientUserId = clientUserId;
        this.appointmentTime = appointmentTime;
        this.duration = duration;
        this.location = location;
        this.mode = mode;
        this.status = status;
        this.notes = notes;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public UUID getClientUserId() {
        return clientUserId;
    }

    public void setClientUserId(UUID clientUserId) {
        this.clientUserId = clientUserId;
    }

    public OffsetDateTime getAppointmentTime() {
        return appointmentTime;
    }

    public void setAppointmentTime(OffsetDateTime appointmentTime) {
        this.appointmentTime = appointmentTime;
    }

    public Long getDuration() {
        return duration;
    }

    public void setDuration(Long duration) {
        this.duration = duration;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
