package personal.authservice;

import java.time.Duration;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseCookie;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import personal.authservice.Jwt.JwtUtils;

@Service
public class AuthService {
    private final AuthRepository authRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    JwtUtils jwtUtils;

    public AuthService(AuthRepository authRepository, BCryptPasswordEncoder passwordEncoder) {
        this.authRepository = authRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Optional<Auth> jwtRetrieve(String jwt) {
        if (jwt == null || jwt.isBlank()) {
            return Optional.empty();
        }

        try {
            UUID id = jwtUtils.getUserIdFromJwtToken(jwt);
            return authRepository.findById(id);
        } catch (Exception err) {
            return Optional.empty();
        }
    }

    public int signUp(Auth authInfo) {
        List<Auth> users1 = authRepository.findByUsername(authInfo.getUsername());
        if (users1.size() > 0) {
            return ServiceStatus.USERNAMEERROR;
        }
        List<Auth> users2 = authRepository.findByEmail(authInfo.getEmail());
        if (users2.size() > 0) {
            return ServiceStatus.EMAILERROR;
        }

        try {
            String hashedPassword = passwordEncoder.encode(authInfo.getPassword());
            authInfo.setPassword(hashedPassword);
            authRepository.save(authInfo);
            return ServiceStatus.SUCCESS;
        } catch (Exception err) {
            return ServiceStatus.SIGNUPERROR;
        }
    }

    public Auth signIn(String email, String password) {
        List<Auth> users = authRepository.findByEmail(email);
        if (users.isEmpty()) {
            return null;
        }

        Auth user = users.get(0);
        if (!passwordEncoder.matches(password, user.getPassword())) {
            return null;
        }

        return user;
    }

    public Optional<Auth> getAuthById(UUID id) {
        return authRepository.findById(id);
    }

    public ResponseCookie generateCookie(UUID id) {
        String token = jwtUtils.generateTokenFromUserId(id);

        ResponseCookie cookie = ResponseCookie.from("access_token", token)
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(Duration.ofHours(20))
                .build();

        return cookie;
    }

    public ResponseCookie clearAuthCookie() {
        return ResponseCookie.from("access_token", "")
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(0)
                .build();
    }
}
