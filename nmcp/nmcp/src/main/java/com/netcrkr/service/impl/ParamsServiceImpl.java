package com.netcrkr.service.impl;

import com.netcrkr.entity.Params;
import com.netcrkr.repository.ParamsRepository;
import com.netcrkr.service.ParamsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by Nikas on 14.04.2017.
 */
@Service("ParamsService")
@Transactional
public class ParamsServiceImpl implements ParamsService{
    @Autowired
    ParamsRepository prs;

    @Override
    public List<Params> getAll() {
        return prs.findAll();
    }

    @Override
    public Params add(Params params) {
        return prs.saveAndFlush(params);
    }
}
