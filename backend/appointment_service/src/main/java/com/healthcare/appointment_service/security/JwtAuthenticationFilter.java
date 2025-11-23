package com.healthcare.appointment_service.security;

import com.healthcare.appointment_service.security.JwtTokenProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getServletPath();
        logger.info("JWT Filter: path = {}", path);

        String header = request.getHeader("Authorization");
        logger.info("JWT Filter: Authorization header = {}", header);

        //Cho phép prelight Options request đi qua
        if ("OPTIONS".equalsIgnoreCase(request.getMethod()))
        {
            logger.info("JWT Filter : bypass OPTIONS prelight");
            filterChain.doFilter(request, response);
            return;
        }
        // Bỏ qua các endpoint login/public
        if (path.startsWith("/api/auth/")) {
            logger.info("JWT Filter: bypass /api/auth/**");
            filterChain.doFilter(request, response);
            return;
        }

        // Check JWT cho các request khác
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            logger.info("JWT Filter: token = {}", token);

            if (jwtTokenProvider.validateToken(token)) {
                String userId = jwtTokenProvider.getUserIdFromToken(token);
                String role   = jwtTokenProvider.getRoleFromToken(token);
                logger.info("JWT Filter: token valid, userId = {}", userId);

                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(
                                userId,
                                null,
                                Collections.singleton(() ->  role)
                        );
                SecurityContextHolder.getContext().setAuthentication(auth);
                //Tiếp tục filter chain
                filterChain.doFilter(request, response);
            } else {
                logger.warn("JWT Filter: token invalid");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("JWT token invalid or expired");
                return;
            }
        } else {
            logger.warn("JWT Filter: no Authorization header or invalid format");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Missing or invalid Authorization header");
            return;
        }

//        filterChain.doFilter(request, response);
    }

//    @Override
//    protected boolean shouldNotFilter(HttpServletRequest request) {
//        String path = request.getServletPath();
//        return path.startsWith("/api/doctors")
//                || path.startsWith("/api/users")
//                || path.startsWith("/appointments")
//                || path.startsWith("/api/specialities")
//                || path.startsWith("/api/patients"); // public
//    }
}
