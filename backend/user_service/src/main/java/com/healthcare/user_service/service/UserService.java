package com.healthcare.user_service.service;

import com.healthcare.user_service.common.CodeGeneratorUtils;
import com.healthcare.user_service.entity.User;
import com.healthcare.user_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User registerUser(String username, String email, String phone, String password, User.Role role) {
        // Check if email exists
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }

        // Check if username exists
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username already exists");
        }

        // Check if phone exists
        if (userRepository.existsByPhone(phone)) {
            throw new RuntimeException("Phone number already exists");
        }

        User user = new User();
        user.setUserId(CodeGeneratorUtils.generateCode("USR")); // TẠO USER_ID Ở ĐÂY
        user.setUsername(username);
        user.setEmail(email);
        user.setPhone(phone);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        user.setIsActive(true);
        user.setProvider(User.AuthProvider.LOCAL);

        return userRepository.save(user);
    }

    public Optional<User> authenticateUser(String emailOrPhone, String password) {
        Optional<User> userOptional;

        // Check if input is email or phone
        if (emailOrPhone.contains("@")) {
            userOptional = userRepository.findByEmail(emailOrPhone);
        } else {
            userOptional = userRepository.findByPhone(emailOrPhone);
        }

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(password, user.getPassword()) && Boolean.TRUE.equals(user.getIsActive())) {
                return Optional.of(user);
            }
        }
        return Optional.empty();
    }

    public Optional<User> findById(UUID id) {
        return userRepository.findById(id);
    }
}