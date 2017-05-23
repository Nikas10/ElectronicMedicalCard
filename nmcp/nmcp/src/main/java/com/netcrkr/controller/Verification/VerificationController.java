package com.netcrkr.controller.Verification;

import com.netcrkr.entity.*;
import com.netcrkr.service.*;
import com.netcrkr.util.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by rt on 24.04.17.
 */

@RestController
@RequestMapping("api/account/")
public class VerificationController {
    @Resource(name = "AccountService")
    AccountService accSrv;
    @Resource(name = "ParamsService")
    ParamsService prs;
    @Resource(name = "TransactionService")
    TransactionService trs;
    @Resource(name = "ObjectDService")
    ObjectDService obs;
    @Resource(name = "TableNameService")
    TableNameService tnr;
    /**
     * Account verification method
     *
     * @param login user's login
     * @param token user's access tokne
     * @return HttpStatus
     */
    @RequestMapping(value="/verification/{login}/{token}", method= RequestMethod.GET)
    public ResponseEntity<?> verification(@PathVariable("login") String login,
                                          @PathVariable("token") String token){
        Account acc = accSrv.getByLogin(login);
        if (acc != null && acc.getValdateStr().equals(token)){
            acc.setActive(true);
            acc.setValdateStr(null);
            List<TableName> allTables = tnr.getAll();
            List<ObjectD> accObjects = new ArrayList<>();
            accObjects = manageAccount(acc, allTables, accObjects);
            acc.setObjects(accObjects);
            accSrv.update(acc);
            return Response.createResponse(HttpStatus.OK);
        }
        return Response.createErrorResponse(HttpStatus.NOT_FOUND, "User or token not found");
    }


    /**
     * Service account management method
     *
     * @param account account body
     * @param allTables all tables
     * @param accObjects account objects
     * @return account objects list
     */
    private List<ObjectD> manageAccount(Account account, List<TableName> allTables, List<ObjectD> accObjects){
        for (TableName allTable : allTables) {
            List<Params> objParams = new ArrayList<>();
            List<Transaction> objTransact = new ArrayList<>();
            ObjectD obj = new ObjectD();

            obj.setTableName(allTable);
            obj = obs.add(obj);
            //getting anum attributes for each table
            List<Atribute> objAttr = obj.getTableName().getAtributes();

            for (Atribute anObjAttr : objAttr) {
                TrParamId id = new TrParamId(anObjAttr, obj);
                Params par = new Params();

                par.setPrimaryKeyP(id);

                Transaction trans = new Transaction();
                trans.setAccountuids(account);
                trans.setTransParam(id);
                trans.setStatus(Status.current);

                par = prs.add(par);
                trans = trs.add(trans);
                objParams.add(par);
                objTransact.add(trans);
            }
            obj.setParams(objParams);
            obj.setTransactions(objTransact);
            accObjects.add(obj);
        }
        return accObjects;
    }
}
