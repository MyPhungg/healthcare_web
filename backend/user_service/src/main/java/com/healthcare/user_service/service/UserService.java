package com.healthcare.user_service.service;

import com.healthcare.user_service.common.CodeGeneratorUtils;
import com.healthcare.user_service.dto.UpdateUserRequest;
import com.healthcare.user_service.entity.User;
import com.healthcare.user_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
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
//=======================NEW method ================/
    public List<User> getAllUsers(){
        return userRepository.findAll();
    }

    //UPDATE user
    public User updateUser(String userId, UpdateUserRequest request)
    {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found with id: "+userId));
        //Kiểm tra tên đã trùng (nếu có)
        if (request.getUsername() != null &&
                !request.getUsername().equals(user.getUsername()) &&
                userRepository.existsByUsername(request.getUsername()))
        {
            throw new RuntimeException("Username is already exists");
        }
        //Kiem tra email trung neu co
        if (request.getEmail() != null &&
                !request.getEmail().equals(user.getEmail()) &&
                userRepository.existsByEmail(request.getEmail()))
        {
            throw new RuntimeException("Email is already exists");
        }
        //Kiem tra sdt trung neu co
        if (request.getPhone() != null &&
                !request.getPhone().equals(user.getPhone()) &&
                userRepository.existsByPhone(request.getPhone()))
        {
            throw new RuntimeException("Phone is already exists");
        }

        //Cap nhat thong tin
        if (request.getUsername() != null){
            user.setUsername(request.getUsername());
        }
        if (request.getEmail() != null){
            user.setEmail(request.getEmail());
        }
        if (request.getPhone() != null){
            user.setPhone(request.getPhone());
        }
        if (request.getIsActive() != null){
            user.setIsActive(request.getIsActive());
        }

        return userRepository.save(user);
    }
    // DELETE USER (hard delete)
    public void deleteUser(String userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found with id: " + userId);
        }
        userRepository.deleteById(userId);

    }

    // DEACTIVATE USER (soft delete)
    public User deactivateUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        user.setIsActive(false);
        return userRepository.save(user);
    }

    // ACTIVATE USER
    public User activateUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        user.setIsActive(true);
        return userRepository.save(user);
    }

    // GET USER BY EMAIL
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // GET USER BY USERNAME
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}