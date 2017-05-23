package com.netcrkr.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.sql.Blob;
import javax.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;


@Entity
@Table(name = "params", schema = "public")
public class Params implements Serializable{

    public Params(){}

    @EmbeddedId
    @JsonIgnore
    private TrParamId primaryKeyP;

    @Transient
    private String atr_name;

    @Transient
    private String ru_name;

    @Column (name = "value_str", nullable = true)
    private String strValue;

    @Column (name = "int_value")
    private Integer intValue;

    @Column (name = "real_value")
    private Float realValue;

    @Column (name = "date_value")
    private java.sql.Timestamp dateValue;

    @Column (name = "blob_value")
    private byte[] blobValue;

    @Column (name = "long_value")
    private Long longValue;

    public Params(String strValue, Integer intValue, Float realValue,
                  Timestamp dateValue, byte[] blobValue) {
        this.strValue = strValue;
        this.intValue = intValue;
        this.realValue = realValue;
        this.dateValue = dateValue;
        this.blobValue = blobValue;
    }

    public String getAtr_name() {
        return atr_name;
    }

    public void setAtr_name(String atr_name) {
        this.atr_name = atr_name;
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

    public void setPrimaryKeyP(TrParamId primaryKeyP) {
        this.primaryKeyP = primaryKeyP;
    }

    public TrParamId getPrimaryKeyP() {
        return primaryKeyP;
    }

    public Long getLongValue() {
        return longValue;
    }

    public void setLongValue(Long longValue) {
        this.longValue = longValue;
    }

    public String getRu_name() {
        return ru_name;
    }

    public void setRu_name(String ru_name) {
        this.ru_name = ru_name;
    }
}
