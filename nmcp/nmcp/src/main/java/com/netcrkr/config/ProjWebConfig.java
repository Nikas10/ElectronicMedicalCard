package com.netcrkr.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import java.util.Properties;

/**
 * Created by Nikas on 04.04.2017.
 */

@Configuration
@EnableWebMvc
@ComponentScan("com.netcrkr")
public class ProjWebConfig extends WebMvcConfigurerAdapter {

    private final Environment env;

    public void addViewControllers(ViewControllerRegistry registry) {

        registry.addRedirectViewController("/", "/home.html");
    }

    @Autowired
    public ProjWebConfig(Environment env) {
        this.env = env;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**").addResourceLocations("classpath:/static/");
    }

    @Bean
    public JavaMailSenderImpl mailSender() {
        JavaMailSenderImpl javaMailSender = new JavaMailSenderImpl();
        javaMailSender.setProtocol("smtp");
        javaMailSender.setHost(env.getProperty("spring.mail.host"));
        javaMailSender.setPort(Integer.valueOf(env.getProperty("spring.mail.port")));
        javaMailSender.setUsername(env.getProperty("spring.mail.username"));
        javaMailSender.setPassword(env.getProperty("spring.mail.password"));
        javaMailSender.setDefaultEncoding("UTF-8");
        Properties props= new Properties();
        props.put("mail.smtp.from",env.getProperty("spring.mail.username"));
        props.put("mail.smtp.user",env.getProperty("spring.mail.username"));
        props.put("mail.smtp.auth",true);
        props.put("mail.smtp.starttls.enable",true);
        props.put("mail.smtp.port",587);
        javaMailSender.setJavaMailProperties(props);
        return javaMailSender;
    }


}
