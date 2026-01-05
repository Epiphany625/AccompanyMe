package personal.userservice;

import java.util.UUID;

public class AuthResponseDto {
    private UUID id;
    private String email;
    private String username;

    public AuthResponseDto(UUID id, String email, String username) {
        this.id = id;
        this.email = email;
        this.username = username;
    }

    public UUID getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getUsername() {
        return username;
    }
}
