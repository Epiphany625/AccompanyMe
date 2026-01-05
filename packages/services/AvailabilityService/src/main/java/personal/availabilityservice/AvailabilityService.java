package personal.availabilityservice;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AvailabilityService {
    private final AvailabilityRepository availabilityRepository;

    public AvailabilityService(AvailabilityRepository availabilityRepository) {
        this.availabilityRepository = availabilityRepository;
    }

    public List<Availability> getAvailabilitiesByUserId(UUID userId) {
        return availabilityRepository.findAllByUserId(userId);
    }

    public Optional<Availability> createAvailability(Availability availability) {
        if (availability == null || availability.getUserId() == null || availability.getStartTime() == null
                || availability.getDuration() == null || availability.getDuration() < 1) {
            return Optional.empty();
        }

        return Optional.of(availabilityRepository.save(availability));
    }

    public boolean deleteAvailability(UUID availabilityId) {
        if (availabilityId == null) {
            return false;
        }

        if (!availabilityRepository.existsById(availabilityId)) {
            return false;
        }

        availabilityRepository.deleteById(availabilityId);
        return true;
    }

    public Optional<Availability> updateAvailability(UUID availabilityId, Availability availability) {
        if (availabilityId == null || availability == null) {
            return Optional.empty();
        }

        if (availability.getUserId() == null || availability.getStartTime() == null
                || availability.getDuration() == null || availability.getDuration() < 1) {
            return Optional.empty();
        }

        Optional<Availability> existing = availabilityRepository.findById(availabilityId);
        if (existing.isEmpty()) {
            return Optional.empty();
        }

        Availability record = existing.get();
        record.setUserId(availability.getUserId());
        record.setstartTime(availability.getStartTime());
        record.setDuration(availability.getDuration());

        return Optional.of(availabilityRepository.save(record));
    }

    public Optional<Availability> scheduleAvailability(UUID availabilityId) {
        if (availabilityId == null) {
            return Optional.empty();
        }

        Optional<Availability> existing = availabilityRepository.findById(availabilityId);
        if (existing.isEmpty()) {
            return Optional.empty();
        }

        boolean deleted = deleteAvailability(availabilityId);
        if (!deleted) {
            return Optional.empty();
        }
        return existing;
    }
}
