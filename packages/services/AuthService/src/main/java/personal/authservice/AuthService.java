package personal.authservice;

import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final AuthRepository authRepository;
    private final BCryptPasswordEncoder passwordEncoder;

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
            String hashedPassword = passwordEncoder.encode(authInfo.getHashPassword());
            authInfo.setHashPassword(hashedPassword);
            authRepository.save(authInfo);
            return ServiceStatus.SUCCESS;
        } catch (Exception err) {
            return ServiceStatus.SIGNUPERROR;
        }
    }
}
