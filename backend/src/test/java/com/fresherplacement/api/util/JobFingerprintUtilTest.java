package com.fresherplacement.api.util;

import com.fresherplacement.api.entity.Job;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class JobFingerprintUtilTest {

    @Test
    @DisplayName("Generates identical fingerprint for matching job attributes regardless of case or whitespace")
    void testIdenticalFingerprint() {
        Job job1 = Job.builder()
                .company("Google")
                .role("Associate Software Engineer")
                .location("Bangalore, India")
                .salary("₹18–24 LPA")
                .experience("Fresher (0–1 yr)")
                .description("Build distributed cloud backend services.")
                .build();

        Job job2 = Job.builder()
                .company("  GOOGLE  ")
                .role("associate software engineer")
                .location("bangalore, india ")
                .salary("₹18–24 LPA")
                .experience("fresher (0–1 yr)")
                .description("Build distributed cloud backend services.")
                .build();

        String fp1 = JobFingerprintUtil.generateFingerprint(job1);
        String fp2 = JobFingerprintUtil.generateFingerprint(job2);

        assertEquals(fp1, fp2);
        assertTrue(fp1.contains("google"));
        assertTrue(fp1.contains("associatesoftwareengineer"));
    }

    @Test
    @DisplayName("Generates different fingerprints when salary or location differs")
    void testDifferentFingerprint() {
        Job job1 = Job.builder()
                .company("Amazon")
                .role("SDE 1")
                .location("Hyderabad")
                .salary("₹28 LPA")
                .experience("Fresher")
                .description("Fullstack development")
                .build();

        Job job2 = Job.builder()
                .company("Amazon")
                .role("SDE 1")
                .location("Bangalore") // Different location
                .salary("₹28 LPA")
                .experience("Fresher")
                .description("Fullstack development")
                .build();

        String fp1 = JobFingerprintUtil.generateFingerprint(job1);
        String fp2 = JobFingerprintUtil.generateFingerprint(job2);

        assertNotEquals(fp1, fp2);
    }
}
