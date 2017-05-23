package com.netcrkr.util;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

/**
 * Created by Nikas on 27.03.2017.
 */
public class Response {
    public static ResponseEntity<?> createErrorResponse(HttpStatus httpStatus, String message) {
        return new ResponseEntity<> (new RespError(message, Long.parseLong(httpStatus.toString())), httpStatus);
    }

    public static ResponseEntity<?> createResponse(Object object) {
        return new ResponseEntity<>(object, HttpStatus.OK);
    }

    public static ResponseEntity<?> createResponse() {
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
