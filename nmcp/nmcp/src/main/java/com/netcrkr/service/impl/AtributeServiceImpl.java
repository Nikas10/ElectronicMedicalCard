package com.netcrkr.service.impl;

import com.netcrkr.entity.Atribute;
import com.netcrkr.repository.AtributeRepository;
import com.netcrkr.service.AtributeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Created by rt on 13.04.17.
 */

@Service("AtributeService")
@Transactional
public class AtributeServiceImpl implements AtributeService {

    @Autowired
    AtributeRepository atrRepo;

    @Override
    public Atribute getByName(String name) {
        return  atrRepo.findByName(name);
    }

    @Override
    public Atribute getById(Integer id) {
        return atrRepo.findById(id);
    }
}
