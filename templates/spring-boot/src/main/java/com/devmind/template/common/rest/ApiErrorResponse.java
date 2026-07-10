package com.devmind.template.common.rest;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.Instant;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiErrorResponse<T> {
    @JsonProperty("message")
    private final String message;

    @JsonProperty("errors")
    private final T errors;

    @JsonProperty("isSuccess")
    private final boolean isSuccess;

    @JsonProperty("timestamp")
    private final Instant timestamp = Instant.now();

    private static final String ERROR_MESSAGE = "Error";

    private ApiErrorResponse(String message, T errors, boolean isSuccess) {
        this.message = message;
        this.errors = errors;
        this.isSuccess = isSuccess;
    }

    public static ApiErrorResponse<Void> error() {
        return error(ERROR_MESSAGE, null);
    }

    public static <T> ApiErrorResponse<T> error(T errors) {
        return error(ERROR_MESSAGE, errors);
    }

    public static ApiErrorResponse<Void> errorMessage(String message) {
        return error(message, null);
    }

    public static <T> ApiErrorResponse<T> error(String message, T errors) {
        return new ApiErrorResponse<>(message, errors, false);
    }

    public String getMessage() {
        return message;
    }

    public T getErrors() {
        return errors;
    }

    public boolean isSuccess() {
        return isSuccess;
    }

    public Instant getTimestamp() {
        return timestamp;
    }
}
