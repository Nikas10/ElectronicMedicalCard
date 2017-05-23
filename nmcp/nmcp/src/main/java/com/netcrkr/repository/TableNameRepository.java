package com.netcrkr.repository;

import com.netcrkr.entity.TableName;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Created by Nikas on 14.04.2017.
 */
public interface TableNameRepository extends JpaRepository<TableName, Long> {
    List<TableName> findAll();
}
