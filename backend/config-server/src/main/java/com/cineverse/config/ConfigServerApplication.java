package com.cineverse.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.config.server.EnableConfigServer;

@SpringBootApplication
@EnableConfigServer
public class ConfigServerApplication {

    private static final Logger log = LoggerFactory.getLogger(ConfigServerApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(ConfigServerApplication.class, args);
        log.info("CineVerse Config Server started successfully on port 8888");
    }
}
