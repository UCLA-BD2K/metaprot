package org.bd2k.metaprot.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

/**
 * Created by davidmeng on 8/8/17.
 */
@Component
@PropertySource("classpath:application.properties")
public class EmailService {

    @Autowired
    public JavaMailSender emailSender;


    @Value("${spring.mail.email}")
    String email;

    @Value("${spring.mail.email.feedback}")
    String emailFeedback;

    @Value("${spring.mail.name}")
    String name;

    public void sendMessage(String to, String from, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setFrom(from);
        message.setSubject(subject);
        message.setText(text);
        emailSender.send(message);
    }
    public void sendSimpleMessage(String to, String subject, String text) {
        String from = name + " <" + email + ">";
        sendMessage(to, from, subject, text);
    }

    public void sendFeedback(String subject, String text) {
        String from = "Feedback <" + email + ">";
        sendMessage(emailFeedback, from, subject, text);
    }
}
