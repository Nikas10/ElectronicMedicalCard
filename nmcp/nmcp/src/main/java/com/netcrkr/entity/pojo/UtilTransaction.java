package com.netcrkr.entity.pojo;

import com.netcrkr.entity.Atribute;
import com.netcrkr.entity.Status;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.UUID;

/**
 * Created by Nikas on 26.04.2017.
 */
public class UtilTransaction implements Serializable {

    private Integer transactionId;

    private Integer atributes;
    private Integer objectDS;

    private UUID accountuids;

    private com.netcrkr.entity.Status status;

    private String strValue;

    private Integer intValue;

    private Long longValue;

    private Float realValue;

    private java.sql.Timestamp dateValue;

    private byte[] blobValue;

    private java.sql.Timestamp stamp;

    public UtilTransaction() {
    }

    public Integer getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(Integer transactionId) {
        this.transactionId = transactionId;
    }

    public Integer getAtributes() {
        return atributes;
    }

    public void setAtributes(Integer atributes) {
        this.atributes = atributes;
    }

    public Integer getObjectDS() {
        return objectDS;
    }

    public void setObjectDS(Integer objectDS) {
        this.objectDS = objectDS;
    }

    public UUID getAccountuids() {
        return accountuids;
    }

    public void setAccountuids(UUID accountuids) {
        this.accountuids = accountuids;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getStrValue() {
        return strValue;
    }

    public void setStrValue(String strValue) {
        this.strValue = strValue;
    }

    public Integer getIntValue() {
        return intValue;
    }

    public void setIntValue(Integer intValue) {
        this.intValue = intValue;
    }

    public Long getLongValue() {
        return longValue;
    }

    public void setLongValue(Long longValue) {
        this.longValue = longValue;
    }

    public Float getRealValue() {
        return realValue;
    }

    public void setRealValue(Float realValue) {
        this.realValue = realValue;
    }

    public Timestamp getDateValue() {
        return dateValue;
    }

    public void setDateValue(Timestamp dateValue) {
        this.dateValue = dateValue;
    }

    public byte[] getBlobValue() {
        return blobValue;
    }

    public void setBlobValue(byte[] blobValue) {
        this.blobValue = blobValue;
    }

    public Timestamp getStamp() {
        return stamp;
    }

    public void setStamp(Timestamp stamp) {
        this.stamp = stamp;
    }
}
