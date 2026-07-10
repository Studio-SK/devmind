package com.devmind.template.security;

import com.devmind.template.common.types.Role;
import com.devmind.template.user.UserEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class UserPrincipal implements UserDetails {
    private final Integer userId;
    private final String username;
    private final String password;
    private final Role role;
    private final boolean enabled;

    public UserPrincipal(Integer userId, String username, String password, Role role, boolean enabled) {
        this.userId = userId;
        this.username = username;
        this.password = password;
        this.role = role;
        this.enabled = enabled;
    }

    public UserPrincipal(UserEntity user) {
        this(user.getId(), user.getUsername(), user.getPassword(), user.getRole(), user.isActive());
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.username;
    }

    @Override
    public boolean isEnabled() {
        return this.enabled;
    }

    public Role getRole() {
        return role;
    }

    public Integer getUserId() {
        return this.userId;
    }
}
