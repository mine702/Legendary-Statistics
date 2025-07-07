package com.legendary_statistics.backend.global.handler;

import com.legendary_statistics.backend.global.exception.file.JsonFileRuntimeException;
import com.legendary_statistics.backend.global.exception.kind.KindNotFoundException;
import com.legendary_statistics.backend.global.exception.legend.LegendNotFoundException;
import com.legendary_statistics.backend.global.exception.probabilityGroup.ProbabilityGroupNotFoundException;
import com.legendary_statistics.backend.global.exception.treasure.TreasureNotFoundException;
import com.legendary_statistics.backend.global.format.code.ApiResponse;
import com.legendary_statistics.backend.global.format.response.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    private final ApiResponse response;

    @ExceptionHandler(Exception.class)
    protected ResponseEntity<?> handle(Exception e) {
        log.error("Exception = {}", e.getMessage());
        return response.error(ErrorCode.GLOBAL_UNEXPECTED_ERROR);
    }

    /**
     * 전설이 종류 를 찾지 못하였을때 뜨는 예외
     */
    @ExceptionHandler(KindNotFoundException.class)
    protected ResponseEntity<?> handle(KindNotFoundException e) {
        log.error("KindNotFoundException = {}", e.getMessage());
        return response.error(e.getErrorCode());
    }

    /**
     * 보물을 찾지 못하였을때 뜨는 예외
     */
    @ExceptionHandler(TreasureNotFoundException.class)
    protected ResponseEntity<?> handle(TreasureNotFoundException e) {
        log.error("TreasureNotFoundException = {}", e.getMessage());
        return response.error(e.getErrorCode());
    }

    /**
     * 전설이를 찾지 못하였을때 뜨는 예외
     */
    @ExceptionHandler(LegendNotFoundException.class)
    protected ResponseEntity<?> handle(LegendNotFoundException e) {
        log.error("LegendNotFoundException = {}", e.getMessage());
        return response.error(e.getErrorCode());
    }

    /**
     * 확률 그룹을 찾지 못하였을때 뜨는 예외
     */
    @ExceptionHandler(ProbabilityGroupNotFoundException.class)
    protected ResponseEntity<?> handle(ProbabilityGroupNotFoundException e) {
        log.error("ProbabilityGroupNotFoundException = {}", e.getMessage());
        return response.error(e.getErrorCode());
    }

    /**
     * JSON 파일 처리 중 발생하는 예외
     */
    @ExceptionHandler(JsonFileRuntimeException.class)
    protected ResponseEntity<?> handle(JsonFileRuntimeException e) {
        log.error("JsonFileRuntimeException = {}", e.getMessage());
        return response.error(e.getErrorCode());
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request) {

        List<ApiResponse.FieldError> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> new ApiResponse.FieldError(error.getField(), error.getDefaultMessage()))
                .collect(Collectors.toList());

        return (ResponseEntity<Object>) response.error(ErrorCode.VALIDATION_ERROR, errors);
    }

}
