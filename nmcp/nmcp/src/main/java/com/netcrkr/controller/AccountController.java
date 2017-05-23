package com.netcrkr.controller;

import com.netcrkr.entity.*;
import com.netcrkr.service.*;

import com.netcrkr.service.impl.MailService;
import com.netcrkr.util.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Nikas on 27.03.2017.
 */
@RestController
@RequestMapping("api/account/")
public class AccountController {

    @Resource(name = "MailService")
    private MailService mailService;
    @Resource(name = "AccountService")
    AccountService accSrv;
    @Resource(name = "TableNameService")
    TableNameService tnr;
    @Resource(name = "ParamsService")
    ParamsService prs;
    @Resource(name = "TransactionService")
    TransactionService trs;
    @Resource(name = "ObjectDService")
    ObjectDService obs;
    @Resource(name = "AtributeService")
    AtributeService atrSrv;

    /**
     * General Account get method for admin or medical worker
     *
     * @param login user's login
     * @return ResponceEntity containing user Account Entity, with password field clear
     */
    @PreAuthorize("hasAuthority('ADMIN')")
    @RequestMapping(value = "/{login}", method = RequestMethod.GET)
    public ResponseEntity<?> getAccount(@PathVariable("login") String login) {
        Account acc = accSrv.getByLogin(login);
        if (acc==null)
            return Response.createErrorResponse(HttpStatus.BAD_REQUEST,"No user found");
        //Password field clear so that no one steal it
        acc.setPass("");
        acc.setObjects(null);
        return Response.createResponse(acc);
    }

    /**
     * User's method for getting data about self
     *
     * @param principal Spring security class, containing user's login and pass via TOKEN parsing
     * @return ResponceEntity containing user Account Entity
     */
    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(value = "", method = RequestMethod.GET)
    public ResponseEntity<?> getAccount(Principal principal) {
        if(principal == null)
            return Response.createErrorResponse(HttpStatus.BAD_REQUEST, "Wrong or empty access token");
        Account acc = accSrv.getByLogin(principal.getName());
        acc.setObjects(null);
        acc.setPass("");
        return Response.createResponse(acc);
    }

    /**
     * Find user by atribute method (passport)
     *
     * @param type atribute name, String
     * @param docStr atribute value, Long
     * @return User's Account
     */
    @PreAuthorize("hasAuthority('ADMIN')")
    @RequestMapping(value = "find_user/{type}/{num}", method = RequestMethod.GET)
    public ResponseEntity<?> getAccountByPassport(@PathVariable("type") String type,
                                                  @PathVariable("num") String docStr) {
        Long number = Long.valueOf(docStr);
        Atribute passAtr = atrSrv.getByName(type);
        if (passAtr.equals(""))
            return Response.createErrorResponse(HttpStatus.BAD_REQUEST, "Wrong attribute name");
        ObjectD linkedObject;
        Account res;
        Params passportParam = passAtr.getParams()
                    .stream()
                    .filter(params -> params.getLongValue().equals(number))
                    .findFirst()
                    .orElse(null);
        try {
            linkedObject = passportParam.getPrimaryKeyP().getObjectDS();
            res = linkedObject.getAccounts().get(0);
        }
        catch (NullPointerException e) {
            return Response.createErrorResponse(HttpStatus.NO_CONTENT, "Not found");
        }

        res.setObjects(null);
        res.setPass("");
        return Response.createResponse(res);
    }

    /**
     * Account find by email method
     *
     * @param mail user's email
     * @return user's account
     */
    @PreAuthorize("hasAuthority('ADMIN')")
    @RequestMapping(value = "find_user/mail/{mail}", method = RequestMethod.GET)
    public ResponseEntity<?> getAccountByMail(@PathVariable("mail") String mail) {
        String email = mail.replace('+','.');
        if (email.equals(""))
        {
            return Response.createErrorResponse(HttpStatus.BAD_REQUEST,"Empty email");
        }
        Account res = accSrv.getByEmail(email);
        if (res==null)
        {
            return Response.createErrorResponse(HttpStatus.NO_CONTENT,"Not found");
        }
        res.setObjects(null);
        res.setPass("");
        return Response.createResponse(res);
    }



    /**
     * User register method
     * Admin Accounts and Medical Worker account are not available to register here
     * The service admin has the only right to do that
     *
     * @param account
     * @return
     */
    @RequestMapping(value = "", method = RequestMethod.POST)
    public ResponseEntity<?> registerNewAccount(@RequestBody Account account) {
        //acc check logic here
        String login  = account.getLogin();
        String email = account.getEmail();

        if (login.equals("") || (email.equals("")) || (account.getPass().equals("")))
            return Response.createErrorResponse(HttpStatus.BAD_REQUEST, "Invalid login, mail, or password.");
        Account check = accSrv.getByLogin(login);

        if (check!=null)
            return Response.createErrorResponse(HttpStatus.BAD_REQUEST, "Login already in use.");
        check = accSrv.getByEmail(email);

        if (check!=null)
            return Response.createErrorResponse(HttpStatus.BAD_REQUEST, "E-mail already in use.");

        //acc manage logic:
        account.setAdmin(false);
        account=accSrv.add(account); //flush empty links object, receive new one
        account.generateValidateStr();
        mailService.sendRegistrationMail(account);
        accSrv.update(account);
        return Response.createResponse(HttpStatus.OK);
    }

    /**
     * Admin register method
     * Admin Accounts and Medical Worker account are available to register here
     * The service admin has the only right to do that
     *
     * @param account
     * @return
     */
    
    @RequestMapping(value = "/admin/register", method = RequestMethod.POST)
    public ResponseEntity<?> registerMedicalWorker(@RequestBody Account account) {
        //acc check logic here
        String login  = account.getLogin();
        String email = account.getEmail();

        if (login.equals("") || (email.equals("")) || (account.getPass().equals("")))
            return Response.createErrorResponse(HttpStatus.BAD_REQUEST, "Invalid login, mail, or password.");
        Account check = accSrv.getByLogin(login);

        if (check!=null)
            return Response.createErrorResponse(HttpStatus.BAD_REQUEST, "Login already in use.");
        check = accSrv.getByEmail(email);

        if (check!=null)
            return Response.createErrorResponse(HttpStatus.BAD_REQUEST, "E-mail already in use.");
        //acc manage logic:
        account.setAdmin(true);
        account=accSrv.add(account); //flush empty links object, receive new one
        account.generateValidateStr();
        mailService.sendAdminRegistrationMail(account);
        accSrv.update(account);
        return Response.createResponse(HttpStatus.OK);
    }


}
