package personal.userservice;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final AuthClient authClient;

    public UserService(UserRepository userRepository, AuthClient authClient) {
        this.userRepository = userRepository;
        this.authClient = authClient;
    }

    public UserWithAuthInfo getUserByUserId(UUID userId) {
        User user = userRepository.findByUserId(userId).orElse(null);
        if (user != null) {
            AuthResponseDto authInfo = authClient.getAuthInfoFromUserId(userId);
            return new UserWithAuthInfo(user.getId(), user.getUserId(), user.getGender(),
                    user.getBirthYear(), user.getDescription(), user.getRegistrationDate(), user.getProfilePicLink(),
                    authInfo.getUsername(), authInfo.getEmail());
        }
        return null;
    }

    public Optional<User> createUser(User user) {
        if (user == null || user.getUserId() == null) {
            return Optional.empty();
        }

        // Prevent duplicate profiles for the same AuthService userId.
        Optional<User> existing = userRepository.findByUserId(user.getUserId());
        if (existing.isPresent()) {
            return Optional.empty();
        }

        return Optional.of(userRepository.save(user));
    }

    public Optional<User> updateUserByUserId(UUID userId, User updates) {
        if (updates == null) {
            return Optional.empty();
        }

        // Patch-style update: only overwrite fields that are provided.
        Optional<User> existing = userRepository.findByUserId(userId);
        if (existing.isEmpty()) {
            return Optional.empty();
        }

        User user = existing.get();
        if (updates.getGender() != null) {
            user.setGender(updates.getGender());
        }
        if (updates.getBirthYear() != null) {
            user.setBirthYear(updates.getBirthYear());
        }
        if (updates.getDescription() != null) {
            user.setDescription(updates.getDescription());
        }

        if (updates.getProfilePicLink() != null) {
            user.setProfilePicLink(updates.getProfilePicLink());
        }

        return Optional.of(userRepository.save(user));
    }

    public List<UserWithAuthInfo> getRecentUsers(int limit) {
        List<User> users = userRepository
                .findAll(PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "registrationDate")))
                .getContent();

        return users.stream()
                .map(user -> {
                    AuthResponseDto authInfo = authClient.getAuthInfoFromUserId(user.getUserId());
                    return new UserWithAuthInfo(user.getId(), user.getUserId(), user.getGender(),
                            user.getBirthYear(), user.getDescription(), user.getRegistrationDate(),
                            user.getProfilePicLink(), authInfo.getUsername(), authInfo.getEmail());
                })
                .collect(Collectors.toList());
    }
}
