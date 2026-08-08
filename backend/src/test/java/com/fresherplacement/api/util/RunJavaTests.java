package com.fresherplacement.api.util;

import com.fresherplacement.api.entity.Job;

public class RunJavaTests {

    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println("🧪 Running Java Backend Standalone Test Suite...");
        System.out.println("==================================================");

        int passed = 0;
        int failed = 0;

        // Test 1: Identical Fingerprint
        try {
            Job job1 = new Job();
            job1.setCompany("Google");
            job1.setRole("Associate Software Engineer");
            job1.setLocation("Bangalore, India");
            job1.setSalary("₹18–24 LPA");
            job1.setExperience("Fresher (0–1 yr)");
            job1.setDescription("Build distributed cloud backend services.");

            Job job2 = new Job();
            job2.setCompany("  GOOGLE  ");
            job2.setRole("associate software engineer");
            job2.setLocation("bangalore, india ");
            job2.setSalary("₹18–24 LPA");
            job2.setExperience("fresher (0–1 yr)");
            job2.setDescription("Build distributed cloud backend services.");

            String fp1 = JobFingerprintUtil.generateFingerprint(job1);
            String fp2 = JobFingerprintUtil.generateFingerprint(job2);

            if (fp1.equals(fp2)) {
                System.out.println("✅ TEST 1 PASSED: Identical fingerprint generated for matching job fields.");
                passed++;
            } else {
                System.err.println("❌ TEST 1 FAILED: Fingerprints do not match (" + fp1 + " vs " + fp2 + ")");
                failed++;
            }
        } catch (Exception e) {
            System.err.println("❌ TEST 1 FAILED with exception: " + e.getMessage());
            failed++;
        }

        // Test 2: Parameter Difference Detection (Salary/Location)
        try {
            Job job1 = new Job();
            job1.setCompany("Amazon");
            job1.setRole("SDE 1");
            job1.setLocation("Hyderabad");
            job1.setSalary("₹28 LPA");

            Job job2 = new Job();
            job2.setCompany("Amazon");
            job2.setRole("SDE 1");
            job2.setLocation("Bangalore"); // Different location
            job2.setSalary("₹28 LPA");

            String fp1 = JobFingerprintUtil.generateFingerprint(job1);
            String fp2 = JobFingerprintUtil.generateFingerprint(job2);

            if (!fp1.equals(fp2)) {
                System.out.println("✅ TEST 2 PASSED: Distinct fingerprints generated when location differs.");
                passed++;
            } else {
                System.err.println("❌ TEST 2 FAILED: Fingerprints should differ when location differs.");
                failed++;
            }
        } catch (Exception e) {
            System.err.println("❌ TEST 2 FAILED with exception: " + e.getMessage());
            failed++;
        }

        // Test 3: Normalization Utility
        try {
            String norm = JobFingerprintUtil.normalizeText("  TCS - NQT @2026!!  ");
            if ("tcsnqt2026".equals(norm)) {
                System.out.println("✅ TEST 3 PASSED: Text normalization stripped punctuation & whitespace.");
                passed++;
            } else {
                System.err.println("❌ TEST 3 FAILED: Unexpected normalized string: " + norm);
                failed++;
            }
        } catch (Exception e) {
            System.err.println("❌ TEST 3 FAILED with exception: " + e.getMessage());
            failed++;
        }

        System.out.println("==================================================");
        System.out.println("📊 Test Summary: " + passed + " Passed, " + failed + " Failed.");
        System.out.println("==================================================");

        if (failed > 0) {
            System.exit(1);
        }
    }
}
