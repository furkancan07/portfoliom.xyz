package com.rf.portfolioM.model.enums;

import org.springframework.security.core.GrantedAuthority;

public enum ROLE implements GrantedAuthority {
    ROLE_USER("USER"),ROLE_ADMIN("ADMIN");
    private String val;
    ROLE(String val) {
        this.val=val;

    }

    @Override
    public String getAuthority() {
        return name();
    }
}
