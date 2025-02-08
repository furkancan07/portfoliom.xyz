package com.rf.portfolioM.service;

import com.rf.portfolioM.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JwtService {


    private final UserService userService;
    @Value("${jwt.secret}")
    private String SECRET_KEY;

    @Value("${jwt.expiration}")
    private long expirationTime;

    public JwtService(UserService userService) {
        this.userService = userService;
    }
    // create Token
    public String createToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis())) // Token oluşturulma zamanı
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime)) // Token süresi
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY) // Token'ı güvenli bir şekilde imzala
                .compact();
    }
    // validate Token
    public boolean validateToken(String token){
        User user=getUser(token);
        return user!=null && !isTokenExpired(token);
    }

    // token geçerlilik süresi
    private boolean isTokenExpired(String token){
        return extractClaims(token).getExpiration().before(new Date());
    }


    // getUser
    public User getUser(String token) {
        String username = extractUsername(token); // Token'dan kullanıcı adı al
        return userService.findByUserName(username);
    }

    private String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    private Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY).build().parseClaimsJws(token).getBody();
    }


}

