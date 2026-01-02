package personal.authservice;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

// Define the FeignClient interface
@FeignClient(name = "userservice")
public interface UserClient { // Use an interface, not a class
    @PostMapping("/user")
    ResponseEntity<?> createUser(@RequestBody UserDto userDto);
}