package org.bd2k.metaprot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "org.bd2k.metaprot.controller")
public class MetaprotApplication {

	public static void main(String[] args) {
		SpringApplication.run(MetaprotApplication.class, args);
	}
}
