package com.netcrkr.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.*;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.io.Serializable;
import java.sql.Timestamp;


@Entity
@Table(name = "transactions", schema = "public")
public class Transaction implements Serializable{

    public Transaction(){status=Status.wait;}

    @Id
    @Column(name="transactionid")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "trans_seq")
    @SequenceGenerator(name = "trans_seq", sequenceName = "transactions_transactionid_seq",
            schema = "public", allocationSize = 1)
    private Integer transactionId;

    @JsonIgnore
    private TrParamId transParam;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "accountuid")
    private Account accountuids;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private com.netcrkr.entity.Status status;


    @Transient
    private String atr_name;

    @Transient
    private String ru_name;


    @Column (name = "value_str")
    private String strValue;

    @Column (name = "int_value")
    private Integer intValue;

    @Column (name = "long_value")
    private Long longValue;

    @Column (name = "real_value")
    private Float realValue;

    @Column (name = "date_value")
    private java.sql.Timestamp dateValue;

    @Column (name = "stamp")
    private java.sql.Timestamp stamp;

    @Column (name = "blob_value")
    private byte[] blobValue;

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

    public String getAtr_name() {
        return atr_name;
    }

    public void setAtr_name(String atr_name) {
        this.atr_name = atr_name;
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

    public com.netcrkr.entity.Status getStatus() {
        return status;
    }

    public void setStatus(com.netcrkr.entity.Status status) {
        this.status = status;
    }

    public Account getAccountuids() {
        return accountuids;
    }

    public Long getLongValue() {
        return longValue;
    }

    public void setLongValue(Long longValue) {
        this.longValue = longValue;
    }

    public void setStamp(Timestamp stamp) {
        this.stamp = stamp;
    }

    public Integer getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(Integer transactionId) {
        this.transactionId = transactionId;
    }

    public TrParamId getTransParam() {
        return transParam;
    }

    public void setTransParam(TrParamId transParam) {
        this.transParam = transParam;
    }

    public void setAccountuids(Account accountuids) {
        this.accountuids = accountuids;
    }

    public String getRu_name() {
        return ru_name;
    }

    public void setRu_name(String ru_name) {
        this.ru_name = ru_name;
    }
}

