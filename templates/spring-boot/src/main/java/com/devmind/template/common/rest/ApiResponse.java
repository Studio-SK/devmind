package com.devmind.template.common.rest;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.Instant;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    @JsonProperty("message")
    private final String message;

    @JsonProperty("body")
    private final T body;

    @JsonProperty("isSuccess")
    private final boolean isSuccess;

    @JsonProperty("timestamp")
    private final Instant timestamp = Instant.now();

    private static final String SUCCESS_MESSAGE = "Success";

    private ApiResponse(String message, T body, boolean isSuccess) {
        this.message = message;
        this.body = body;
        this.isSuccess = isSuccess;
    }

    public static ApiResponse<Void> success() {
        return success(SUCCESS_MESSAGE, null);
    }

    public static <T> ApiResponse<T> success(T body) {
        return success(SUCCESS_MESSAGE, body);
    }

    public static ApiResponse<Void> successMessage(String message) {
        return success(message, null);
    }

    public static <T> ApiResponse<T> success(String message, T body) {
        return new ApiResponse<>(message, body, true);
    }

    public String getMessage() {
        return message;
    }

    public T getBody() {
        return body;
    }

    public boolean isSuccess() {
        return isSuccess;
    }

    public Instant getTimestamp() {
        return timestamp;
    }
}
