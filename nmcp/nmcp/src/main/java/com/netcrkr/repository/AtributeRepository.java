package com.netcrkr.repository;

import com.netcrkr.entity.Atribute;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Created by rt on 13.04.17.
 */
public interface AtributeRepository extends JpaRepository<Atribute, Integer> {
    Atribute findByName(String columnName);
    Atribute findById(Integer id);
}
