package com.fresherplacement.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> getHome() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "app", "FresherPlacement Java Spring Boot 3 API",
            "version", "1.0.0",
            "swaggerUi", "/swagger-ui.html",
            "jobsApi", "/api/v1/jobs"
        ));
    }
}
