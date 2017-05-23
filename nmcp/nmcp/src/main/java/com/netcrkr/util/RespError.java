package com.netcrkr.util;

import java.util.Calendar;

/**
 * Created by Nikas on 27.03.2017.
 */
public class RespError {
    String message;
    Long time;
    Long code;

    public RespError(String message, Long code) {
        this.message = message;
        this.time = Calendar.getInstance().getTimeInMillis();
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public long getTime() {
        return time;
    }

    public void setTime(Long time) {
        this.time = time;
    }

    public Long getCode() {
        return code;
    }

    public void setCode(Long code) {
        this.code = code;
    }
}
