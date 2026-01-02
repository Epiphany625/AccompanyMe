package personal.availabilityservice;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/availabilities")
public class AvailabilityController {
    private final AvailabilityService availabilityService;

    public AvailabilityController(AvailabilityService availabilityService) {
        this.availabilityService = availabilityService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Availability>> getAvailabilitiesByUserId(@PathVariable UUID userId) {
        return ResponseEntity.ok(availabilityService.getAvailabilitiesByUserId(userId));
    }

    @PostMapping("")
    public ResponseEntity<?> createAvailability(@RequestBody Availability availability) {
        Optional<Availability> created = availabilityService.createAvailability(availability);
        if (created.isEmpty()) {
            return new ResponseEntity<>(Map.of("message", "Invalid payload"), HttpStatus.BAD_REQUEST);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(created.get());
    }

    @DeleteMapping("/{availabilityId}")
    public ResponseEntity<?> deleteAvailability(@PathVariable Long availabilityId) {
        boolean deleted = availabilityService.deleteAvailability(availabilityId);
        if (!deleted) {
            return new ResponseEntity<>(Map.of("message", "Availability not found"), HttpStatus.NOT_FOUND);
        }

        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{availabilityId}")
    public ResponseEntity<?> updateAvailability(
            @PathVariable Long availabilityId,
            @RequestBody Availability availability
    ) {
        Optional<Availability> updated = availabilityService.updateAvailability(availabilityId, availability);
        if (updated.isEmpty()) {
            return new ResponseEntity<>(Map.of("message", "Invalid availability update"), HttpStatus.BAD_REQUEST);
        }

        return ResponseEntity.ok(updated.get());
    }
}
