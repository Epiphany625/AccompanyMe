package personal.userservice;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<User> getUserByUserId(UUID userId) {
        return userRepository.findByUserId(userId);
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

    public List<User> getRecentUsers(int limit) {
        return userRepository
                .findAll(PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "registrationDate")))
                .getContent();
    }
}
