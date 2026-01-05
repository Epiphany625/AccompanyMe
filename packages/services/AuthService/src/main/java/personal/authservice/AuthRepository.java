package personal.authservice;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthRepository extends JpaRepository<Auth, UUID> {
    public List<Auth> findByUsername(String username);

    public List<Auth> findByEmail(String email);

    public Optional<Auth> findById(UUID id);
}
