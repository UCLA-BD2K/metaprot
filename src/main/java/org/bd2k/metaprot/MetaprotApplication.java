package org.bd2k.metaprot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;

@SpringBootApplication(scanBasePackages = "org.bd2k.metaprot")
public class MetaprotApplication extends SpringBootServletInitializer {

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(MetaprotApplication.class);	// required for external Tomcat
	}

	public static void main(String[] args) {
		SpringApplication.run(MetaprotApplication.class, args);
	}
}
