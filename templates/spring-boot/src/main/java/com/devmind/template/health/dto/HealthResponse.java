package com.devmind.template.health.dto;

import java.time.Instant;

public record HealthResponse(String status, Instant timestamp) {}
