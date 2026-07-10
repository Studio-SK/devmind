package com.devmind.template.common.exceptions;

import com.devmind.template.common.rest.ApiErrorResponse;
import com.devmind.template.common.rest.ErrorCode;
import com.devmind.template.common.rest.Res;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger LOG = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiErrorResponse<Void>> handleResourceNotFound(ResourceNotFoundException ex) {
        LOG.error(ex.getMessage(), ex);
        return Res.error(ErrorCode.RESOURCE_NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ApiErrorResponse<Void>> handleConflict(ConflictException ex) {
        LOG.error(ex.getMessage(), ex);
        return Res.error(ErrorCode.CONFLICT, ex.getMessage());
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiErrorResponse<Void>> handleBadRequest(BadRequestException ex) {
        LOG.error(ex.getMessage(), ex);
        return Res.error(ErrorCode.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<ApiErrorResponse<Void>> handleForbidden(ForbiddenException ex) {
        LOG.error(ex.getMessage(), ex);
        return Res.error(ErrorCode.FORBIDDEN, ex.getMessage());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiErrorResponse<Void>> handleDataIntegrity(DataIntegrityViolationException ex) {
        LOG.error(ex.getMessage(), ex);
        return Res.error(ErrorCode.CONFLICT, "Request violates a database constraint");
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiErrorResponse<Void>> handleAuthException(AuthenticationException ex) {
        LOG.error(ex.getMessage(), ex);
        return Res.error(ErrorCode.UNAUTHORIZED, "Login failed");
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse<Map<String, String>>> handleValidationException(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult()
            .getFieldErrors()
            .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
        LOG.error(ex.getMessage(), ex);
        return Res.error(ErrorCode.VALIDATION_FAILED, "Invalid request", errors);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse<Void>> handleGenericException(Exception ex) {
        LOG.error(ex.getMessage(), ex);
        return Res.errorMessage("Something went wrong");
    }
}
