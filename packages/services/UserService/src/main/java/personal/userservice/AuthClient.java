package personal.userservice;

import java.util.UUID;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient("AuthService")
public interface AuthClient {
    @GetMapping("auth/{userId}")
    AuthResponseDto getAuthInfoFromUserId(@PathVariable("userId") UUID uuid);
}
