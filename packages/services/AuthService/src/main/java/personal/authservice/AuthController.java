package personal.authservice;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signUpUser(@RequestBody Auth infoAuth) {
        int responseType = authService.signUp(infoAuth);
        if (responseType == ServiceStatus.SUCCESS) {
            return new ResponseEntity<>(ServiceStatus.RESPONSES.get(responseType), HttpStatus.CREATED);
        }
        return new ResponseEntity<>(ServiceStatus.RESPONSES.get(responseType), HttpStatus.BAD_REQUEST);
    }

}
