package com.netcrkr.service.impl;

import com.netcrkr.entity.Transaction;
import com.netcrkr.repository.ParamsRepository;
import com.netcrkr.repository.TransactionRepository;
import com.netcrkr.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by Nikas on 14.04.2017.
 */
@Service("TransactionService")
@Transactional
public class TransactionServiceImpl implements TransactionService {
    @Autowired
    TransactionRepository trs;

    @Override
    public List<Transaction> getAll() {
        return trs.findAll();
    }

    @Override
    public Transaction add(Transaction transaction) {
        return trs.saveAndFlush(transaction);
    }

    @Override
    public Transaction getByTransactionId(Integer Id) {
        return trs.findByTransactionId(Id);
    }


}
