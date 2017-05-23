package com.netcrkr.service.impl;

import com.netcrkr.entity.ObjectD;
import com.netcrkr.repository.ObjectDRepository;
import com.netcrkr.service.ObjectDService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by Nikas on 14.04.2017.
 */
@Service("ObjectDService")
@Transactional
public class ObjectDServiceImpl implements ObjectDService{
    @Autowired
    ObjectDRepository obr;

    @Override
    public List<ObjectD> getAll() {
        return obr.findAll();
    }

    @Override
    public ObjectD add(ObjectD obj) {
        return obr.saveAndFlush(obj);
    }

    @Override
    public ObjectD getById(Integer id) {
        return obr.findById(id);
    }
}
