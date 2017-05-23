package com.netcrkr.entity;

import java.util.List;
import javax.persistence.*;
import java.io.Serializable;
import java.util.Random;
import java.util.Set;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Created by Nikas on 27.03.2017.
 */
@Entity
@Table(name = "account", schema = "public")
public class Account implements Serializable {
    @Id
    @Column(name = "uid")
    private UUID uid;


    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "acl", joinColumns = @JoinColumn(name = "accountuid"),
            inverseJoinColumns = @JoinColumn(name = "objectid"))
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @JsonIgnore
    private List<ObjectD> Objects;



    @OneToMany(mappedBy = "accountuids")
    @JsonIgnore
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private List<Transaction> accountuid;


    @Column (name = "login")
    private String login;

    @Column (name = "pass")
    private String pass;

    @Column (name = "admin")
    private Boolean admin;

    @Column (name = "email")
    private String email;

    @Column (name = "is_active")
    private Boolean isActive;

    @Column (name = "validate_str")
    private String valdateStr;

    public Account() {
    }

    public Account(UUID uid, String name, String pass, Boolean isadmin, String email) {
        this.uid = uid;
        this.login = name;
        this.pass = pass;
        this.admin = isadmin;
        this.email = email;
    }

    public void generateValidateStr()
    {
        String characters = "qwertyuiopasdfghjklzxcvbnm1234567890QWERTYUIOASDFGHJKLZXCVBNM";
        Random rnd = new Random();
        char[] text = new char[17];
        for (int i = 0; i < 17; i++)
        {
            text[i] = characters.charAt(rnd.nextInt(characters.length()));
        }
        this.setValdateStr(new String(text));
    }

    public UUID getUid() {
        return uid;
    }

    public void setUid(UUID uid) {
        this.uid = uid;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getPass() {
        return pass;
    }

    public void setPass(String pass) {
        this.pass = pass;
    }

    public Boolean getAdmin() {
        return admin;
    }

    public Boolean isAdmin() {
        return admin;
    }

    public void setAdmin(Boolean admin) {
        this.admin = admin;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<ObjectD> getObjects() {
        return Objects;
    }

    public void setObjects(List<ObjectD> objects) {
        Objects = objects;
    }

    public List<Transaction> getAccountuid() {
        return accountuid;
    }

    public void setAccountuid(List<Transaction> accountuid) {
        this.accountuid = accountuid;
    }

    public Boolean getActive() {
        return isActive;
    }

    public void setActive(Boolean active) {
        isActive = active;
    }

    public String getValdateStr() {
        return valdateStr;
    }

    public void setValdateStr(String valdateStr) {
        this.valdateStr = valdateStr;
    }
}