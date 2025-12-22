package personal.authservice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import personal.authservice.Jwt.JwtUtils;
import java.util.UUID;

import org.springframework.web.bind.annotation.GetMapping;

class SigninDto {
    private String email;
    private String password;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

class AuthResponse {
    private UUID id;
    private String email;
    private String username;

    public AuthResponse(UUID id, String email, String username) {
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

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    @Autowired
    JwtUtils jwtUtils;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("")
    public String getMethodName() {
        return "Hello";
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signUpUser(@RequestBody Auth infoAuth) {
        int responseType = authService.signUp(infoAuth);

        AuthResponse response = new AuthResponse(infoAuth.getId(), infoAuth.getEmail(), infoAuth.getUsername());

        ResponseCookie cookie = authService.generateCookie(infoAuth);

        if (responseType == ServiceStatus.SUCCESS) {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(response);
        }
        return new ResponseEntity<>(ServiceStatus.RESPONSES.get(responseType), HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody SigninDto entity) {
        Auth user = authService.signIn(entity.getEmail(), entity.getPassword());
        if (user == null) {
            return new ResponseEntity<>(
                    java.util.Map.of("message", "Invalid email or password"),
                    HttpStatus.UNAUTHORIZED);
        }

        ResponseCookie cookie = authService.generateCookie(user);

        AuthResponse response = new AuthResponse(user.getId(), user.getEmail(), user.getUsername());

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).body(response);

    }

}
