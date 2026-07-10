package com.devmind.template.security;

import com.devmind.template.common.exceptions.ResourceNotFoundException;
import com.devmind.template.user.UserEntity;
import com.devmind.template.user.UserRepo;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepo userRepo;

    public UserDetailsServiceImpl(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserEntity user = userRepo
            .findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with username " + username));

        return new UserPrincipal(user);
    }
}
