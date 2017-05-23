package com.netcrkr.service;

/**
 * Created by Nikas on 27.03.2017.
 */
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface DetailsService extends UserDetailsService {
    UserDetails loadUserByUsername(String username);
}