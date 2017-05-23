package com.netcrkr.repository;

import com.netcrkr.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Created by Nikas on 14.04.2017.
 */
public interface TransactionRepository extends JpaRepository<Transaction, Integer> {
        List<Transaction> findAll();
        Transaction findByTransactionId(Integer id);
}
