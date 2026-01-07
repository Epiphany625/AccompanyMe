package personal.appointmentservice.clients;

import java.util.UUID;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import personal.appointmentservice.dtos.AvailabilityResponseDto;

@FeignClient(name = "availabilityservice", url = "${AvailabilityService.url}")
public interface AvailabilityClient {

    @PostMapping("availabilities/schedule/{availabilityId}")
    public AvailabilityResponseDto scheduleByAvailabilityId(
            @PathVariable UUID availabilityId);
}
