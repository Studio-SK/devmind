package com.devmind.template.health;

import com.devmind.template.health.dto.HealthResponse;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class HealthService {
    public HealthResponse getStatus() {
        return new HealthResponse("UP", Instant.now());
    }
}
