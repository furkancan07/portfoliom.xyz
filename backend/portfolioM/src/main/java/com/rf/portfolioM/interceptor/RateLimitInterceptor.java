package com.rf.portfolioM.interceptor;

import com.rf.portfolioM.config.RateLimitConfig;
import com.rf.portfolioM.exception.RateLimitException;
import io.github.bucket4j.Bucket;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitInterceptor implements HandlerInterceptor {

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();
    private final RateLimitConfig rateLimitConfig;

    public RateLimitInterceptor(RateLimitConfig rateLimitConfig) {
        this.rateLimitConfig = rateLimitConfig;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String ipAddress = getClientIP(request);
        
        // IP adresine göre bucket oluştur veya mevcut olanı al
        Bucket bucket = buckets.computeIfAbsent(ipAddress, k -> rateLimitConfig.createNewBucket());

        // 1 token kullanmayı dene
        if (bucket.tryConsume(1)) {
            response.addHeader("X-Rate-Limit-Remaining", String.valueOf(bucket.getAvailableTokens()));
            return true;
        }

        // Rate limit aşıldı
        throw new RateLimitException("Rate Limiti Aşıldı");

    }

    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
} 