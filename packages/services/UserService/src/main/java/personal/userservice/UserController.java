package personal.userservice;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserByUserId(@PathVariable UUID userId) {
        UserWithAuthInfo user = userService.getUserByUserId(userId);
        if (user == null) {
            return new ResponseEntity<>(Map.of("message", "User not found"), HttpStatus.NOT_FOUND);
        }

        return ResponseEntity.ok(user);
    }

    @GetMapping("/profiles")
    public ResponseEntity<List<UserWithAuthInfo>> getRecentProfiles(@RequestParam(defaultValue = "10") int limit) {
        int safeLimit = Math.min(Math.max(limit, 1), 10);
        return ResponseEntity.ok(userService.getRecentUsers(safeLimit));
    }

    @PostMapping("")
    public ResponseEntity<?> createUser(@RequestBody User user) {
        Optional<User> created = userService.createUser(user);
        if (created.isEmpty()) {
            return new ResponseEntity<>(Map.of("message", "User already exists or invalid payload"),
                    HttpStatus.BAD_REQUEST);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(created.get());
    }

    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUserByUserId(@PathVariable UUID userId, @RequestBody User updates) {
        Optional<User> updated = userService.updateUserByUserId(userId, updates);
        if (updated.isEmpty()) {
            return new ResponseEntity<>(Map.of("message", "User not found or invalid payload"),
                    HttpStatus.NOT_FOUND);
        }

        return ResponseEntity.ok(updated.get());
    }
}
