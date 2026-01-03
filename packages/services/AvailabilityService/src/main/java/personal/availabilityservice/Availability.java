package personal.availabilityservice;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "availability")
public class Availability {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private UUID userId; // from AuthService

    @Column(nullable = false)
    private OffsetDateTime startTime;

    @Column(nullable = false)
    @Min(1)
    private Long duration;

    public Availability() {
        // Default constructor
    }

    public Availability(Long id, UUID userId, OffsetDateTime startTime, Long duration) {
        this.id = id;
        this.userId = userId;
        this.startTime = startTime;
        this.duration = duration;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
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

    public void setstartTime(OffsetDateTime startTime) {
        this.startTime = startTime;
    }

    public Long getDuration() {
        return duration;
    }

    public void setDuration(Long duration) {
        this.duration = duration;
    }
}