package personal.userservice;

import java.sql.Date;
import java.util.UUID;

class UserWithAuthInfo extends User {
    private String username;
    private String email;

    public UserWithAuthInfo(
            UUID id,
            UUID userId,
            String gender,
            Integer birthYear,
            String description,
            Date registrationDate,
            String profilePicLink,
            String username,
            String email) {
        super(id, userId, gender, birthYear, description, registrationDate, profilePicLink);
        this.username = username;
        this.email = email;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getUsername() {
        return this.username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getEmail() {
        return this.email;
    }
}
