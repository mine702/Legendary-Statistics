package com.legendary_statistics.backend.common;

import com.legendary_statistics.backend.util.UserIPGetter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Slf4j
@Component
public class LoggingInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        log.info("["+ UserIPGetter.get(request) +"] request : ("+request.getMethod()+") "+request.getRequestURI());
        return true;
    }
}
