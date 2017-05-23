package com.netcrkr.entity;

import com.fasterxml.jackson.annotation.*;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "object", schema = "public")
public class ObjectD implements Serializable{


    //@GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "object_id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "obj_seq")
    @SequenceGenerator(name = "obj_seq", sequenceName = "object_id_seq",schema = "public", allocationSize=1)
    private Integer id;

    public ObjectD() {}

    @ManyToMany(mappedBy = "Objects", fetch = FetchType.LAZY)
    @JsonIgnore
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private List<Account> Accounts;

    @ManyToOne
    @JoinColumn(name = "table_nameid")
    @JsonIgnore
    //@JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private TableName tableName;

    @OneToMany(mappedBy = "primaryKeyP.objectDS")
    @JsonIgnore
    //@JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private List<Params> params;

    @OneToMany(mappedBy = "transParam.objectDS")
    @JsonIgnore
    //@JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private List<Transaction> transactions;

    public List<Params> getParams() {
        return params;
    }

    public void setParams(List<Params> params) {
        this.params = params;
    }

    public Integer getId() {
        return id;
    }

    public TableName getTableName() {
        return tableName;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setTableName(TableName tableName) {
        this.tableName = tableName;
    }

    public List<Transaction> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<Transaction> transactions) {
        this.transactions = transactions;
    }

    public List<Account> getAccounts() {
        return Accounts;
    }

    public void setAccounts(List<Account> accounts) {
        Accounts = accounts;
    }
}