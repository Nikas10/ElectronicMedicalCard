package com.netcrkr.controller.UserPersonalArea;

import com.netcrkr.entity.*;
import com.netcrkr.entity.pojo.UtilTransaction;
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
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Created by rt on 18.04.17.
 */

@RestController
@RequestMapping("api/account/transactions/")
public class TransactionsController {

    @Resource(name = "AccountService")
    AccountService accSrv;
    @Resource(name = "TransactionService")
    TransactionService trSrv;
    @Resource(name = "ObjectDService")
    ObjectDService objSrv;
    @Resource(name = "AtributeService")
    AtributeService atrSrv;
    @Resource(name = "MailService")
    private MailService mailService;


    /**
     * User's transactions receive method by status
     *
     * @param principal user's identification
     * @param status transaction status
     * @return transaction array
     */
    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(value = "{status}", method = RequestMethod.GET)
    public ResponseEntity<?> getTransactions(Principal principal, @PathVariable("status") Status status) {
        //The method can be extended to select a specific status
        if(principal == null)
            return Response.createErrorResponse(HttpStatus.BAD_REQUEST, "Wrong or empty access token");

        Account user = accSrv.getByLogin(principal.getName());
        List<ObjectD> relatedObjects = user.getObjects();
        List<Transaction> transactions;

        transactions = relatedObjects.stream()
                    .flatMap((obj) ->
                            obj.getTransactions()
                                    .stream())
                                    .filter((tr) -> tr.getStatus().equals(status))
                                    .collect(Collectors.toList());
        for (Transaction t:transactions){
            t.setAtr_name(t.getTransParam().getAtributes().getName());
            t.setRu_name(t.getTransParam().getAtributes().getRu_name());
            t.getTransParam().getObjectDS().setAccounts(null);
        }
        return Response.createResponse(transactions);
    }

    /**
     * transaction push method overload, simplified to receive ready jsons
     *
     * @param principal user, who push transaction (doctor/admin)
     * @param transactions array of transactions, represented in simplified form
     * @return HttpStatus
     */
    @PreAuthorize("hasAuthority('ADMIN')")
    @RequestMapping(value = "/push/body/{login}/{tname}", method = RequestMethod.POST)
    public ResponseEntity<?> pushTransactionsBody(Principal principal,
                                                  @PathVariable("login") String login,
                                                  @PathVariable("tname") String tablename,
                                                  @RequestBody List<Transaction> transactions) {
        //The method can be extended to select a specific status
        if(principal == null)
            return Response.createErrorResponse(HttpStatus.BAD_REQUEST, "Wrong or empty access token");
        Account pacient = accSrv.getByLogin(login);
        Account user = accSrv.getByLogin(principal.getName());
        TableName tn = new TableName();
        ObjectD obj = new ObjectD();
        for (ObjectD o : pacient.getObjects()){
            if (o.getTableName().getName().equals(tablename)){
                tn  = o.getTableName();
                obj=o;
                break;
            }
        }
        for (Transaction tr: transactions)
        {
            Atribute atr = atrSrv.getByName(tr.getAtr_name());
            TrParamId id = new TrParamId();
            id.setObjectDS(obj);
            id.setAtributes(atr);
            tr.setTransParam(id);
            tr.setAccountuids(user);
            tr.setStatus(Status.wait);
            tr = trSrv.add(tr);
        }
        mailService.sendTransactionNotification(pacient, user);
        return Response.createResponse(HttpStatus.OK);
    }


    /**
     * transaction confirmation method for user
     *
     * @param principal user's access token
     * @param idStatus Map<Integer, Status> - transaction id <-> Status
     * @return HttpStatus
     */
    @PreAuthorize("hasAuthority('USER')")
    @RequestMapping(value = "/confirmation", method = RequestMethod.POST)
    public ResponseEntity<?> ConfirmTransactions(Principal principal, @RequestBody Map<Integer,Status> idStatus) {
        if(principal == null)
            return Response.createErrorResponse(HttpStatus.BAD_REQUEST, "Wrong or empty access token");

        try {
            for (Map.Entry<Integer, Status> trEntry :
                    idStatus.entrySet()) {
                Transaction transaction = trSrv.getByTransactionId(trEntry.getKey());
                transaction.setStatus(trEntry.getValue());
                trSrv.add(transaction);
            }
        }
        catch (Exception e) {
            return Response.createErrorResponse(HttpStatus.CONFLICT, "Shit happens");
        }

        return Response.createErrorResponse(HttpStatus.ACCEPTED,"Changes acсepted");
    }

    /**
     * Get all transactions of a doctor to a current user by table
     *
     * @param principal doctor's identities
     * @param login pacient login     *
     * @return List<Transactions> filtered by doctor and user
     */
    @PreAuthorize("hasAuthority('ADMIN')")
    @RequestMapping(value = "/{login}/table/{name}", method = RequestMethod.GET)
    public ResponseEntity<?> getUserTransactions(Principal principal,@PathVariable("login") String login,@PathVariable("name") String name) {
        if(principal == null)
            return Response.createErrorResponse(HttpStatus.BAD_REQUEST, "Wrong or empty access token");
        //receive doctor acc and pacient ids
        Account user = accSrv.getByLogin(principal.getName());
        Account pacient = accSrv.getByLogin(login);
        //get all user's transactions
        List<Transaction> relatedTransactions = user.getAccountuid();
        List<Transaction> filterByUser = new ArrayList<>();
        for (Transaction transaction: relatedTransactions)
        {
            ObjectD obj = transaction.getTransParam().getObjectDS();
            List<Account> accounts = obj.getAccounts();
            if (accounts.contains(pacient))
                filterByUser.add(transaction);
        }
        if (filterByUser.isEmpty())
            return Response.createErrorResponse(HttpStatus.NO_CONTENT, "Couldn't find any useful data");
        List<Transaction> filterByTable = new ArrayList<>();
        for (Transaction transaction: filterByUser)
        {
            ObjectD obj = transaction.getTransParam().getObjectDS();
            TableName tn = obj.getTableName();
            if (tn.getName().equals(name)) {
                transaction.getTransParam().getObjectDS().setAccounts(null);
                filterByTable.add(transaction);
            }
        }
        for (Transaction t:filterByTable){
            t.setAtr_name(t.getTransParam().getAtributes().getName());
            t.setRu_name(t.getTransParam().getAtributes().getRu_name());
            t.getTransParam().getObjectDS().setAccounts(null);
        }
        if (filterByTable.isEmpty())
            return Response.createErrorResponse(HttpStatus.NO_CONTENT, "Couldn't find any useful data");
        else
            return Response.createResponse(filterByUser);
    }

}