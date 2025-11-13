package com.healthcare.user_service.controller;
import com.healthcare.user_service.dto.UpdateUserRequest;
import com.healthcare.user_service.dto.UserResponse;
import com.healthcare.user_service.entity.User;
import com.healthcare.user_service.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {
    private final UserService userService;
    //get all users - chỉ có Admin
    @GetMapping
    @PreAuthorize("HasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers()
    {
        try{
            List<User> users = userService.getAllUsers();
            List<UserResponse> userResponses = users.stream()
                    .map(UserResponse:: fromUser)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(userResponses);
        }
        catch (Exception e)
        {
           return ResponseEntity.internalServerError().build();
        }
    }

    //getusers by id
    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN) or @userSecurity.isOwnProfile(authentication, #userId)")
    public ResponseEntity<UserResponse> getUserById(@PathVariable String userId)
    {
        try
        {
            User user = userService.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with id" + userId));
            return ResponseEntity.ok(UserResponse.fromUser(user));
        }
        catch (Exception e)
        {
            return ResponseEntity.internalServerError().build();
        }
    }

    //Update user
    @PutMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN) or @userSecurity.isOwnProfile(authentication, #userId)")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable String userId,
            @Valid @RequestBody UpdateUserRequest request
    )
    {
        try {
            User updatedUser = userService.updateUser(userId, request);
            return ResponseEntity.ok(UserResponse.fromUser(updatedUser));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
        catch (Exception e)
        {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN) or @userSecurity.isOwnProfile(authentication, #userId)")
    public ResponseEntity<?> deleteUser(@PathVariable String userId) {
        try {
            userService.deleteUser(userId);
            return ResponseEntity.ok().body("User deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }


    //deactiveuser - soft delete
    @PatchMapping("/{userId}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> deactivateUser(@PathVariable String userId)
    {
        try
        {
            User deactivedUser = userService.deactivateUser(userId);
            return ResponseEntity.ok(UserResponse.fromUser(deactivedUser));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    //ActiveUser
    @PatchMapping("/{userId}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> activateUser(@PathVariable String userId)
    {
        try
        {
            User activedUser = userService.activateUser(userId);
            return ResponseEntity.ok(UserResponse.fromUser(activedUser));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    //Get current user
    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getCurrentUserProfile()
    {
        try {
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }


}
