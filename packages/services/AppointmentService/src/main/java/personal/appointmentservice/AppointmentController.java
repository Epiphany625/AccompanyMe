package personal.appointmentservice;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {
    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByUserId(@PathVariable UUID userId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByUserId(userId));
    }

    @GetMapping("/client/{clientUserId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByClientUserId(@PathVariable UUID clientUserId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByClientUserId(clientUserId));
    }

    @PostMapping("")
    public ResponseEntity<?> createAppointment(@RequestBody Appointment appointment) {
        Optional<Appointment> created = appointmentService.createAppointment(appointment);
        if (created.isEmpty()) {
            return new ResponseEntity<>(Map.of("message", "Invalid payload"), HttpStatus.BAD_REQUEST);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(created.get());
    }

    @PutMapping("/{appointmentId}")
    public ResponseEntity<?> updateAppointment(
            @PathVariable UUID appointmentId,
            @RequestBody Appointment appointment
    ) {
        Optional<Appointment> updated = appointmentService.updateAppointment(appointmentId, appointment);
        if (updated.isEmpty()) {
            return new ResponseEntity<>(Map.of("message", "Invalid appointment update"), HttpStatus.BAD_REQUEST);
        }

        return ResponseEntity.ok(updated.get());
    }

    @PutMapping("/{appointmentId}/cancel")
    public ResponseEntity<?> cancelAppointment(@PathVariable UUID appointmentId) {
        Optional<Appointment> updated = appointmentService.cancelAppointment(appointmentId);
        if (updated.isEmpty()) {
            return new ResponseEntity<>(Map.of("message", "Appointment not found"), HttpStatus.NOT_FOUND);
        }

        return ResponseEntity.ok(updated.get());
    }
}
