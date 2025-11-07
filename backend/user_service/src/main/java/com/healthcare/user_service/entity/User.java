//package com.healthcare.user_service.entity;
//
//import jakarta.persistence.*;
//import lombok.Data;
//import org.hibernate.annotations.CreationTimestamp;
//
//import java.time.LocalDateTime;
//import java.util.UUID;
//
//@Entity
//@Table(name = "user")
//@Data
//public class User {
//    @Id
//    @GeneratedValue(strategy = GenerationType.UUID)
//    private UUID id;
//
//    @Column(name = "username", unique = true, nullable = false)
//    private String username;
//
//    @Column(name = "email", unique = true, nullable = false)
//    private String email;
//
//    @Column(name = "phone")
//    private String phone;
//
//    @Column(name = "password", nullable = false)
//    private String password;
//
//    @Enumerated(EnumType.STRING)
//    @Column(name = "role", nullable = false)
//    private Role role;
//
//    @CreationTimestamp
//    @Column(name = "created_at", updatable = false)
//    private LocalDateTime createdAt;
//
//    @Column(name = "is_active")
//    private Boolean isActive = true;
//
//    @Enumerated(EnumType.STRING)
//    @Column(name = "provider")
//    private AuthProvider provider = AuthProvider.LOCAL;
//
//    @Column(name = "provider_id")
//    private String providerId;
//
//    public enum Role {
//        ADMIN, DOCTOR, PATIENT
//    }
//
//    public enum AuthProvider {
//        LOCAL, GOOGLE, FACEBOOK
//    }
//}
package com.healthcare.user_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.Random;

@Entity
@Table(name = "user")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", unique = true, nullable = false)
    private String userId;

    @Column(name = "username", unique = true, nullable = false)
    private String username;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "phone")
    private String phone;

    @Column(name = "password", nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Enumerated(EnumType.STRING)
    @Column(name = "provider")
    private AuthProvider provider = AuthProvider.LOCAL;

    @Column(name = "provider_id")
    private String providerId;

    @PrePersist
    public void prePersist() {
        if (this.isActive == null) {
            this.isActive = true;
        }
        if (this.provider == null) {
            this.provider = AuthProvider.LOCAL;
        }
    }


    public enum Role {
        ADMIN, DOCTOR, PATIENT
    }

    public enum AuthProvider {
        LOCAL, GOOGLE, FACEBOOK
    }

}