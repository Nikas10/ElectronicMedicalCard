package com.netcrkr.service;

import com.netcrkr.entity.ObjectD;

import java.util.List;

/**
 * Created by Nikas on 14.04.2017.
 */
public interface ObjectDService {
    List<ObjectD> getAll();
    ObjectD add(ObjectD obj);
    ObjectD getById(Integer id);
}
