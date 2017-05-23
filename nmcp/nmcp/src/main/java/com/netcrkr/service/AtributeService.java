package com.netcrkr.service;

import com.netcrkr.entity.Atribute;

/**
 * Created by rt on 19.04.17.
 */
public interface AtributeService {
    Atribute getByName(String name);
    Atribute getById(Integer id);
}
