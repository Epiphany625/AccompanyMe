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
import org.springframework.web.bind.annotation.CookieValue;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import personal.authservice.Jwt.JwtUtils;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

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

class UserDto {
    private UUID userId;
    private String gender;
    private Integer birthYear;
    private String description;

    public UserDto() {
    }

    public UserDto(UUID userId, String gender, Integer birthYear, String description) {
        this.userId = userId;
        this.gender = gender;
        this.birthYear = birthYear;
        this.description = description;
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

    @Autowired
    UserClient userClient;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAuthInfoById(@PathVariable UUID id) {
        Optional<Auth> authInfo = authService.getAuthById(id);
        if (authInfo.isEmpty()) {
            return new ResponseEntity<>(Map.of("message", "User not found"), HttpStatus.NOT_FOUND);
        }

        Auth user = authInfo.get();
        AuthResponse response = new AuthResponse(user.getId(), user.getEmail(), user.getUsername());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signUpUser(@RequestBody Auth infoAuth) {
        int responseType = authService.signUp(infoAuth);

        AuthResponse response = new AuthResponse(infoAuth.getId(), infoAuth.getEmail(), infoAuth.getUsername());

        if (responseType == ServiceStatus.SUCCESS) {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(response);
        }
        System.out.println("bad request~");
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

        ResponseCookie cookie = authService.generateCookie(user.getId());

        AuthResponse response = new AuthResponse(user.getId(), user.getEmail(), user.getUsername());

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).body(response);

    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logoutUser(HttpServletResponse response) {

        ResponseCookie cookie = authService.clearAuthCookie();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.noContent().build(); // 204
    }

    @GetMapping("")
    public ResponseEntity<?> retrieveUserInfoByCookie(
            HttpServletRequest request,
            @CookieValue(name = "access_token", required = true) String cookieToken) {
        String jwt = cookieToken;
        if (jwt == null || !jwtUtils.validateJwtToken(jwt)) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        Optional<Auth> authInfo = authService.jwtRetrieve(jwt);
        if (authInfo.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        Auth user = authInfo.get();
        AuthResponse response = new AuthResponse(user.getId(), user.getEmail(), user.getUsername());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/profile")
    public ResponseEntity<?> setupUserProfile(@RequestBody UserDto userDto) {
        ResponseEntity<?> response;
        try {
            response = userClient.createUser(userDto);
        } catch (feign.FeignException err) {
            HttpStatus status = HttpStatus.resolve(err.status());
            if (status == null) {
                status = HttpStatus.INTERNAL_SERVER_ERROR;
            }

            if (status == HttpStatus.BAD_REQUEST) {
                return new ResponseEntity<>(
                        java.util.Map.of("message", "User already exists or invalid payload"),
                        status);
            }

            return new ResponseEntity<>(
                    java.util.Map.of("message", "User service error"),
                    status);
        }

        if (!response.getStatusCode().is2xxSuccessful()) {
            return new ResponseEntity<>(
                    ServiceStatus.RESPONSES.get(ServiceStatus.SIGNUPERROR),
                    HttpStatus.BAD_REQUEST);
        }

        // issue cookie
        ResponseCookie cookie = authService.generateCookie(userDto.getUserId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(response.getBody());
    }
}
