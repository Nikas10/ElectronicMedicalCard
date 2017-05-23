package com.netcrkr.service.impl;

import com.netcrkr.entity.TableName;
import com.netcrkr.repository.TableNameRepository;
import com.netcrkr.service.TableNameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by Nikas on 14.04.2017.
 */
@Service("TableNameService")
@Transactional
public class TableNameServiceImpl implements TableNameService {
    @Autowired
    TableNameRepository tnr;

    @Override
    public List<TableName> getAll() {
        return tnr.findAll();
    }
}
