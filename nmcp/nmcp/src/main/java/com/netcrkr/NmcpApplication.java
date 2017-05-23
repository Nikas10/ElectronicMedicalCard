package com.netcrkr;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@ComponentScan
@SpringBootApplication
public class NmcpApplication {

	public static void main(String[] args) {

		SpringApplication.run(NmcpApplication.class, args);
	}
}
