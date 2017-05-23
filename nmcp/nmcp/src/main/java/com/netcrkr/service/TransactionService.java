package com.netcrkr.service;

import com.netcrkr.entity.Transaction;

import java.util.List;

/**
 * Created by Nikas on 14.04.2017.
 */
public interface TransactionService {
    List<Transaction> getAll();
    Transaction add(Transaction transaction);
    Transaction getByTransactionId(Integer Id);
}
