package com.atharva.ecommerce.Service;

import com.atharva.ecommerce.Config.JwtConstant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.UUID;

/**
 * Refresh tokens are NOT JWTs. Each one is a random opaque string stored in
 * Redis as  "refresh:<token>" -> userEmail  with a 7-day TTL.
 *
 * Why this design (interview answer):
 *  - Revocation is trivial: delete the Redis key and the token is dead instantly.
 *    (A JWT refresh token can't be un-issued without a separate blocklist.)
 *  - Expiry is automatic: Redis drops the key after the TTL.
 *  - The token carries no data, so a leaked one reveals nothing on its own.
 */
@Service
public class RefreshTokenService {

    private static final String KEY_PREFIX = "refresh:";

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    /** Create a new refresh token for a user and remember it in Redis. */
    public String createRefreshToken(String email) {
        String token = UUID.randomUUID().toString();
        redisTemplate.opsForValue().set(
                KEY_PREFIX + token,
                email,
                Duration.ofSeconds(JwtConstant.REFRESH_TOKEN_VALIDITY_SECONDS)
        );
        return token;
    }

    /** Returns the email if the token is valid & not expired, else null. */
    public String getEmailIfValid(String token) {
        if (token == null || token.isBlank()) return null;
        Object email = redisTemplate.opsForValue().get(KEY_PREFIX + token);
        return email != null ? String.valueOf(email) : null;
    }

    /** Kill a refresh token (used on logout). */
    public void revoke(String token) {
        if (token != null && !token.isBlank()) {
            redisTemplate.delete(KEY_PREFIX + token);
        }
    }

    // ponytail: non-rotating refresh tokens. Upgrade path = rotate on every
    // /refresh (issue a new one, revoke the old) to detect stolen-token reuse.
}
