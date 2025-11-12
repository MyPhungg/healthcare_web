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

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email da ton tai");
        }


        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username da ton tai");
        }


        if (userRepository.existsByPhone(phone)) {
            throw new RuntimeException("SDT da ton tai");
        }

        User user = new User();
        user.setUserId(CodeGeneratorUtils.generateCode("usr")); // TẠO USER_ID Ở ĐÂY
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
    public Optional<User> findById(String userId) {
        return userRepository.findById(userId);
    }
    // ================= OAuth2 SUPPORT =================

    // Tìm user theo provider + providerId
    public Optional<User> findByProviderAndProviderId(User.AuthProvider provider, String providerId) {
        return userRepository.findByProviderAndProviderId(provider, providerId);
    }

    // Lưu user (có thể dùng cho OAuth2)
    public User save(User user) {
        return userRepository.save(user);
    }

//    //Update
//    public User updateUser(String userId, String newEmail, String newPhone) {
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new RuntimeException("User không tồn tại"));
//
//        user.setEmail(newEmail);
//        user.setPhone(newPhone);
//        return userRepository.save(user);
//    }
//    // lay toan bo user
//    public List<User> getAllUsers() {
//        return userRepository.findAll();
//    }
//    //Delete
//    public void deleteUser(String userId) {
//        if (!userRepository.existsById(userId)) {
//            throw new RuntimeException("User không tồn tại");
//        }
//        userRepository.deleteById(userId);
//    }

}