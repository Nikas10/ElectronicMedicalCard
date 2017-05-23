package com.netcrkr.controller.UserPersonalArea;

import com.netcrkr.entity.Account;
import com.netcrkr.entity.pojo.UtilMail;
import com.netcrkr.service.AccountService;
import com.netcrkr.util.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.security.Principal;

/**
 * Created by rt on 19.04.17.
 */

@RestController
@RequestMapping("api/account/")
public class ChangeUserData {

    @Resource(name = "AccountService")
    private AccountService accSrv;

    /**
     * Change email method for user and admin
     *
     * @param principal user's token
     * @param mymail object, storing mail or password
     * @return HttpStatus
     */
    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(value = "/change_email/", method = RequestMethod.POST)
    public ResponseEntity<?> setEmail(Principal principal, @RequestBody UtilMail mymail) {
        if(principal == null)
            return Response.createErrorResponse(HttpStatus.BAD_REQUEST, "Wrong or empty access token");
        Account acc = accSrv.getByLogin(principal.getName());
        acc.setEmail(mymail.getEmail());
        accSrv.update(acc);
        return Response.createResponse(HttpStatus.OK);
    }

    /**
     * Change password meethod
     *
     * @param principal user's token
     * @param mypass object, storing mail or password
     * @return HttpStatus
     */
    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(value = "/change_password/", method = RequestMethod.POST)
    public ResponseEntity<?> setPass(Principal principal, @RequestBody UtilMail mypass) {
        if(principal == null)
            return Response.createErrorResponse(HttpStatus.BAD_REQUEST, "Wrong or empty access token");
        Account acc = accSrv.getByLogin(principal.getName());
        acc.setPass(mypass.getPass());
        accSrv.update(acc);
        return Response.createResponse(HttpStatus.OK);
    }

}
