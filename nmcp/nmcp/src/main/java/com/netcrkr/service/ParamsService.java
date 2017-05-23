package com.netcrkr.service;

import com.netcrkr.entity.Params;

import java.util.List;

/**
 * Created by Nikas on 14.04.2017.
 */
public interface ParamsService {
    List<Params> getAll();
    Params add(Params params);
}
