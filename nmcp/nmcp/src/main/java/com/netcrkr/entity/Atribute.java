package com.netcrkr.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import org.hibernate.annotations.Type;
import javax.persistence.*;
import java.io.Serializable;
import java.util.List;


/**
 * Created by rt on 03.04.17.
 */
 
@Entity
@Table(name = "atribute", schema = "public")
public class Atribute implements Serializable {

    @Id 
    @Column(name = "atribute_id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "atr_seq")
    @SequenceGenerator(name = "atr_seq", sequenceName = "atribute_id_seq",schema = "public",allocationSize=1)
    private Integer id;

    @Column(name = "name")
    private String name;

    @Column(name = "ru_name")
    private String ru_name;

    @Column(name = "pair")
    @Type(type = "numeric_boolean")
    private boolean pair;

    @Column(name = "is_modifable")
    @Type(type = "numeric_boolean")
    private Boolean isModifable;

    @Column(name = "is_unique")
    @Type(type = "numeric_boolean")
    private Boolean isUnique;

    @ManyToMany(mappedBy = "atributes", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<TableName> tableNames;

    @OneToMany(mappedBy = "primaryKeyP.atributes")
    @JsonIgnore
    private List<Params> params;

    @OneToMany(mappedBy = "transParam.atributes")
    @JsonIgnore
    private List<Transaction> transactions;


    public Atribute(){}

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Boolean isPair() {
        return pair;
    }

    public void setPair(Boolean pair) {
        this.pair = pair;
    }

    public Boolean getUnique() {
        return isUnique;
    }

    public void setUnique(Boolean unique) {
        isUnique = unique;
    }

    public Boolean getModifable() {
        return isModifable;
    }

    public void setModifable(Boolean modifable) {
        isModifable = modifable;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public List<TableName> getTableNames() {
        return tableNames;
    }

    public void setTableNames(List<TableName> tableNames) {
        this.tableNames = tableNames;
    }

    public List<Transaction> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<Transaction> transactions) {
        this.transactions = transactions;
    }

    public List<Params> getParams() {
        return params;
    }

    public void setParams(List<Params> params) {
        this.params = params;
    }

    public String getRu_name() {
        return ru_name;
    }

    public void setRu_name(String ru_name) {
        this.ru_name = ru_name;
    }

    public void setPair(boolean pair) {
        this.pair = pair;
    }

}