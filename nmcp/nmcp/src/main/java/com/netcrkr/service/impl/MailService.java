package com.netcrkr.service.impl;

import com.netcrkr.entity.Account;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Date;

/**
 * Created by Nikas on 03.05.2017.
 */
@Service("MailService")
@Transactional
public class MailService {
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String author;

    @Autowired
    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendRegistrationMail(Account account) {
        try {
            MimeMessagePreparator preparator = mimeMessage -> {
                MimeMessageHelper message = new MimeMessageHelper(mimeMessage, MimeMessageHelper.MULTIPART_MODE_MIXED);
                message.setTo(account.getEmail());
                message.setFrom(author);
                message.setSubject("Mail confirmation");
                message.setSentDate(new Date());
                message.setText("<p>Hello!</p><p>You have registered on NMCP Service<br>" +
                        "with Email: "+account.getEmail()+"</p><p>Your activation code is:<br> "
                        +account.getValdateStr()+ "</p><p>Use <a href=\"http://lowcost-env.rqxujxmbrs.eu-central-1.elasticbeanstalk.com/api/account/verification/"
                        +account.getLogin() +
                        "/" + account.getValdateStr() +
                        "\"> link </a> to validate your account<br>"
                        +"</p><p>Best wishes,<br>NMCP Support.</p>", true);
            };
            mailSender.send(preparator);
        } catch(Exception e) {
            e.printStackTrace();
        }
    }

    @Async
    public void sendAdminRegistrationMail(Account account) {
        try {
            MimeMessagePreparator preparator = mimeMessage -> {
                MimeMessageHelper message = new MimeMessageHelper(mimeMessage, MimeMessageHelper.MULTIPART_MODE_MIXED);
                message.setTo("netcracker.nmcp@gmail.com");
                message.setFrom(author);
                message.setSubject("Medical Worker Registration");
                message.setSentDate(new Date());
                message.setText("" +
                        "<p>Hello!</p><p>Medical worker applied for an NMCP Service account<br>" +
                        "with Email: "+account.getEmail()+"</p>"+
                        "<p>His activation code is:<br> "
                        +account.getValdateStr()+ "</p>" +
                        "<p>Best wishes,<br>NMCP Support.</p>", true);
            };
            mailSender.send(preparator);
        } catch(Exception e) {
            e.printStackTrace();
        }
    }

    @Async
    public void sendTransactionNotification(Account account, Account who) {
        try {
            MimeMessagePreparator preparator = mimeMessage -> {
                MimeMessageHelper message = new MimeMessageHelper(mimeMessage, MimeMessageHelper.MULTIPART_MODE_MIXED);
                message.setTo(account.getEmail());
                message.setFrom(author);
                message.setSubject("New transactions on NMCP");
                message.setSentDate(new Date());
                message.setText("" +
                        "<p>Hello!</p><p>Your medical card was modified by medical worker<br>" +
                        "with Email: "+who.getEmail()+"</p>"+
                        "<p>Please check your account and confirm changes</p>" +
                        "<p>Best wishes,<br>NMCP Support.</p>", true);
            };
            mailSender.send(preparator);
        } catch(Exception e) {
            e.printStackTrace();
        }
    }

}