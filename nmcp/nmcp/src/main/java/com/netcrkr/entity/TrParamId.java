package com.netcrkr.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.Embeddable;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.io.Serializable;

/**
 * Created by rt on 04.04.17.
 */

@Embeddable
public class TrParamId implements Serializable {

    @ManyToOne
    @JoinColumn(name = "atributeid")
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Atribute atributes;

    @ManyToOne
    @JoinColumn(name = "objectid")
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private ObjectD objectDS;

    public TrParamId(Atribute atributes, ObjectD objectDS) {
        this.atributes = atributes;
        this.objectDS = objectDS;
    }

    public TrParamId(){}

    public Atribute getAtributes() {
        return atributes;
    }

    public ObjectD getObjectDS() {
        return objectDS;
    }

    public void setAtributes(Atribute atributes) {
        this.atributes = atributes;
    }

    public void setObjectDS(ObjectD objectDS) {
        this.objectDS = objectDS;
    }

}
