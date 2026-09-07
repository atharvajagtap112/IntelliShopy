package com.atharva.ecommerce.Config;

public class JwtConstant {
    public static final String SECRET_KEY="asfgahfgajhfgbdjhffjkhvbvbbhsdsdfgewiuyewuehffhajkhhfsdjhgskgslkhshsous";
    public static final String JWT_HEADER="Authorization";

    // Access token lives only 15 minutes - if stolen, it dies fast.
    public static final long ACCESS_TOKEN_VALIDITY_MS = 15 * 60 * 1000L;          // 15 min
    // Refresh token lives 7 days (stored in Redis; this is its TTL in seconds).
    public static final long REFRESH_TOKEN_VALIDITY_SECONDS = 7 * 24 * 60 * 60L;   // 7 days
}
