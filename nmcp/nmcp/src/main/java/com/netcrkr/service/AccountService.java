package com.netcrkr.service;

import com.netcrkr.entity.Account;
import org.springframework.http.ResponseEntity;

import java.util.List;

/**
 * Created by Nikas on 27.03.2017.
 */
public interface AccountService {
    List<Account> getAll();
    Account getByLogin(String login);
    Account add(Account acc);
    Account update(Account acc);
    Account getByEmail(String email);
}
