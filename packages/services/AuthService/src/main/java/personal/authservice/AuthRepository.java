package personal.authservice;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthRepository extends JpaRepository<Auth, Long> {
    public List<Auth> findByUsername(String username);

    public List<Auth> findByEmail(String email);
}
