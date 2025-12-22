package personal.authservice;

import java.time.Duration;
import java.util.List;

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

    public ResponseCookie generateCookie(Auth userAuth) {
        String token = jwtUtils.generateTokenFromUserId(userAuth);

        ResponseCookie cookie = ResponseCookie.from("access_token", token)
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(Duration.ofHours(20))
                .build();

        return cookie;
    }
}
