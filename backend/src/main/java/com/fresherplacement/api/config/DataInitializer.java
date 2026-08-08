package com.fresherplacement.api.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Override
    public void run(String... args) {
        // Strict Database Mode: No static or curated data seeding on startup.
    }
}
