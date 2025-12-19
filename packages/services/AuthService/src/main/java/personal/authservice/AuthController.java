package personal.authservice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import personal.authservice.Jwt.JwtUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

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

class SigninResponse {
    private Long id;
    private String email;
    private String username;
    private String token;

    public SigninResponse(Long id, String email, String username, String token) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.token = token;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getUsername() {
        return username;
    }

    public String getToken() {
        return token;
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
    public ResponseEntity<String> signUpUser(@RequestBody Auth infoAuth) {
        int responseType = authService.signUp(infoAuth);
        if (responseType == ServiceStatus.SUCCESS) {
            return new ResponseEntity<>(ServiceStatus.RESPONSES.get(responseType), HttpStatus.CREATED);
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

        String token = jwtUtils.generateTokenFromUsername(user);
        SigninResponse response = new SigninResponse(user.getId(), user.getEmail(), user.getUsername(), token);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
