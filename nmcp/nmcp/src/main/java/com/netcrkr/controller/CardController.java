package com.netcrkr.controller;

import com.netcrkr.entity.Account;
import com.netcrkr.entity.Atribute;
import com.netcrkr.entity.ObjectD;
import com.netcrkr.entity.Params;
import com.netcrkr.service.AccountService;
import com.netcrkr.service.AtributeService;
import com.netcrkr.service.impl.AccountServiceImpl;
import com.netcrkr.util.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.security.Principal;
import java.util.List;

/**
 * Created by Nikas on 12.04.2017.
 */
@RestController
@RequestMapping("api/account/")
public class CardController {

    @Resource(name = "AccountService")
    AccountService accSrv;

    /**
     * User's data retrieval method by table name
     *
     * @param principal User's access token
     * @param name required Table name, String
     * @return List<Params> of required table
     */
    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(value = "/table/{name}", method = RequestMethod.GET)
    public ResponseEntity<?> getTableByName(Principal principal, @PathVariable("name") String name) {
        if(principal == null)
            return Response.createErrorResponse(HttpStatus.BAD_REQUEST, "Wrong or empty access token");
        Account user = accSrv.getByLogin(principal.getName());
        //get all user's objects
        List<ObjectD> relatedObjects = user.getObjects();
        for (ObjectD obj: relatedObjects)
        {
            //Getting "Table"
            if (obj.getTableName().getName().equals(name))
            {
                List<Params> objParams = obj.getParams();
                for (Params p: objParams){
                    p.setAtr_name(p.getPrimaryKeyP().getAtributes().getName());
                    p.setRu_name(p.getPrimaryKeyP().getAtributes().getRu_name());
                    p.getPrimaryKeyP().getObjectDS().setAccounts(null);
                }
                return Response.createResponse(objParams);
            }
        }
        return Response.createErrorResponse(HttpStatus.NO_CONTENT, "Couldn't find any useful data");
    }


}
