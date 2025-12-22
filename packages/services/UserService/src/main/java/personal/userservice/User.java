package personal.userservice;

import java.sql.Date;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = "user_id") })
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    @Column(name = "user_id", nullable = false)
    private UUID userId; // from AuthService

    @Column(nullable = true)
    private String gender;

    @NotNull
    @Min(1900)
    @Max(2100)
    @Column(nullable = false)
    private Integer birthYear;

    @Column(nullable = true)
    private String description;

    @NotNull
    @PastOrPresent
    @Column(nullable = false)
    private Date registrationDate;

    @Column(nullable = true)
    private String profilePicLink;

    public User() {
        // Default constructor
    }

    public User(UUID id, UUID userId, String gender, Integer birthYear, String description, Date registrationDate,
            String profilePicLink) {
        this.id = id;
        this.userId = userId;
        this.gender = gender;
        this.birthYear = birthYear;
        this.description = description;
        this.registrationDate = registrationDate;
        this.profilePicLink = profilePicLink;
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

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public Integer getBirthYear() {
        return birthYear;
    }

    public void setBirthYear(Integer birthYear) {
        this.birthYear = birthYear;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(Date registrationDate) {
        this.registrationDate = registrationDate;
    }

    @PrePersist
    private void ensureRegistrationDate() {
        if (this.registrationDate == null) {
            this.registrationDate = new Date(System.currentTimeMillis());
        }
    }

    public String getProfilePicLink() {
        return profilePicLink;
    }

    public void setProfilePicLink(String profilePicLink) {
        this.profilePicLink = profilePicLink;
    }
}
