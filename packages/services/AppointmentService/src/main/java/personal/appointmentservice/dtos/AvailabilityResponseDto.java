package personal.appointmentservice.dtos;

import java.time.OffsetDateTime;
import java.util.UUID;

public class AvailabilityResponseDto {
    private UUID id;
    private UUID userId;
    private OffsetDateTime startTime;
    private Long duration;

    public AvailabilityResponseDto() {
    }

    public AvailabilityResponseDto(UUID id, UUID userId, OffsetDateTime startTime, Long duration) {
        this.id = id;
        this.userId = userId;
        this.startTime = startTime;
        this.duration = duration;
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

    public OffsetDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(OffsetDateTime startTime) {
        this.startTime = startTime;
    }

    public Long getDuration() {
        return duration;
    }

    public void setDuration(Long duration) {
        this.duration = duration;
    }
}
