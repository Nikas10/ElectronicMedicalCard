package com.netcrkr.entity.pojo;

import java.io.Serializable;

/**
 * Created by Дмитрий on 04.05.2017.
 */
public class UtilMail implements Serializable {
    private String email;
    private String pass;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPass() {
        return pass;
    }

    public void setPass(String pass) {
        this.pass = pass;
    }
    public UtilMail(){};
}
