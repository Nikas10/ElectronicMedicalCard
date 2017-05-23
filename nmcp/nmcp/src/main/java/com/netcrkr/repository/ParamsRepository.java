package com.netcrkr.repository;

import com.netcrkr.entity.Atribute;
import com.netcrkr.entity.Params;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Created by rt on 13.04.17.
 */
public interface ParamsRepository extends JpaRepository<Params, Integer> {
    List<Params> findAll();
}
