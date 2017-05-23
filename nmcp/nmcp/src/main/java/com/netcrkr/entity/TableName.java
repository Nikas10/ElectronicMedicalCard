package com.netcrkr.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;
import java.util.Set;

/**
 * Created by rt on 04.04.17.
 */

@Entity
@Table(name = "table_name", schema = "public")
public class TableName implements Serializable{
    @Id
    @Column(name = "table_name_id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "table_name_seq")
    @SequenceGenerator(name = "table_name_seq", sequenceName = "table_name_id_seq",schema = "public", allocationSize=1)
    private Integer id;


    @ManyToMany
    @JoinTable(name = "table_name_atribute", joinColumns = @JoinColumn(name = "table_nameid"),
            inverseJoinColumns = @JoinColumn(name = "atributeid"))
    @JsonIgnore
    private List<Atribute> atributes;

    @OneToMany(mappedBy = "tableName")
    @JsonIgnore
    private List<ObjectD> ObjectDS;

    @Column(name = "name")
    private String name;

    public TableName(String name) {
        this.name = name;
    }

    public TableName() {};

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getId() {
        return id;
    }

    public List<Atribute> getAtributes() {
        return atributes;
    }

    public void setAtributes(List<Atribute> atributes) {
        this.atributes = atributes;
    }

    public List<ObjectD> getObjectDS() {
        return ObjectDS;
    }

    public void setObjectDS(List<ObjectD> objectDS) {
        ObjectDS = objectDS;
    }
}