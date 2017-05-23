package com.netcrkr.service.impl;

import com.netcrkr.entity.Account;
import com.netcrkr.repository.AccountRepository;
import com.netcrkr.service.AccountService;
import com.netcrkr.util.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Created by Nikas on 27.03.2017.
 */
@Service("AccountService")
@Transactional
public class AccountServiceImpl implements AccountService {
    @Autowired
    AccountRepository accRepo;

    @Override
    public List<Account> getAll() {
        return accRepo.findAll();
    }

    @Override
    public Account getByLogin(String login) {
        return accRepo.findByLogin(login);
    }

    @Override
    public Account add(Account acc) {
        acc.setUid(UUID.randomUUID());
        return accRepo.saveAndFlush(acc);
    }

    @Override
    public Account update(Account acc) {
        return accRepo.saveAndFlush(acc);
    }


    @Override
    public Account getByEmail(String email) {
        return accRepo.findByEmail(email);
    }


}
