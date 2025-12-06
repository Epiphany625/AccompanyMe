package personal.authservice;

import java.util.List;

public class ServiceStatus {
    public static final int SUCCESS = 0;
    public static final int EMAILERROR = 1;
    public static final int USERNAMEERROR = 2;
    public static final int SIGNUPERROR = 3;
    public static final List<String> RESPONSES = List.of(
        "success",
        "duplicate email",
        "duplicate username",
        "signup failed"
    );
}
