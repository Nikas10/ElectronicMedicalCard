package com.netcrkr.repository;

import com.netcrkr.entity.ObjectD;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Created by Nikas on 14.04.2017.
 */
public interface ObjectDRepository extends JpaRepository<ObjectD, Long> {
    List<ObjectD> findAll();
    ObjectD findById(Integer id);
}
