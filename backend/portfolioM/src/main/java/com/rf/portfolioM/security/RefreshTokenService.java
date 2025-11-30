package com.rf.portfolioM.security;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {
    private final StringRedisTemplate redisTemplate;
    private final long refreshTokenDuration = 7;

    public String createRefreshToken(String username) {

        String refreshToken = UUID.randomUUID().toString();


        redisTemplate.opsForValue().set(
                refreshToken,
                username,
                refreshTokenDuration,
                TimeUnit.DAYS
        );

        return refreshToken;
    }

    public String validateRefreshToken(String refreshToken) {
        return redisTemplate.opsForValue().get(refreshToken);

    }


    public void deleteRefreshToken(String refreshToken) {
        redisTemplate.delete(refreshToken);
    }


    public String rotateRefreshToken(String oldRefreshToken, String username) {
        redisTemplate.delete(oldRefreshToken);
        return createRefreshToken(username);
    }

}
