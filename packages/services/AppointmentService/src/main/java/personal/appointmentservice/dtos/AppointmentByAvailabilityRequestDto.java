package personal.appointmentservice.dtos;

import java.util.UUID;

public class AppointmentByAvailabilityRequestDto {
    private UUID userId;
    private UUID clientUserId;
    private String status;
    private String mode;
    private String notes;

    public AppointmentByAvailabilityRequestDto() {
    }

    public AppointmentByAvailabilityRequestDto(UUID userId, UUID clientUserId) {
        this.userId = userId;
        this.clientUserId = clientUserId;
    }

    public AppointmentByAvailabilityRequestDto(
            UUID userId,
            UUID clientUserId,
            String status,
            String mode,
            String notes) {
        this.userId = userId;
        this.clientUserId = clientUserId;
        this.status = status;
        this.mode = mode;
        this.notes = notes;
    }

    public UUID getUserId() {
        return userId;
    }

    public UUID getClientUserId() {
        return clientUserId;
    }

    public String getStatus() {
        return status;
    }

    public String getMode() {
        return mode;
    }

    public String getNotes() {
        return notes;
    }
}
