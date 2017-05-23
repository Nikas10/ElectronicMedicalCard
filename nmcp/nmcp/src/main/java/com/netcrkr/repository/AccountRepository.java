package com.netcrkr.repository;

import com.netcrkr.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

/**
 * Created by Nikas on 27.03.2017.
 */
public interface AccountRepository extends JpaRepository<Account, UUID> {
    List<Account> findAll();
    Account findByLogin(String login);
    Account findByEmail(String email);
}
