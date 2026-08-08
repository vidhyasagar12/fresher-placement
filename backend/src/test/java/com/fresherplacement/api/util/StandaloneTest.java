package com.fresherplacement.api.util;

public class StandaloneTest {

    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println("🧪 Running Java 21 Enterprise Logic Unit Tests...");
        System.out.println("==================================================");

        int passed = 0;
        int failed = 0;

        // Test 1: Identical Fingerprint
        try {
            String fp1 = JobFingerprintUtil.generateFingerprint("Google", "Associate Software Engineer", "Bangalore, India", "₹18–24 LPA", "Fresher (0–1 yr)", "Build distributed cloud backend services.");
            String fp2 = JobFingerprintUtil.generateFingerprint("  GOOGLE  ", "associate software engineer", "bangalore, india ", "₹18–24 LPA", "fresher (0–1 yr)", "Build distributed cloud backend services.");

            if (fp1.equals(fp2)) {
                System.out.println("✅ TEST 1 PASSED: Identical fingerprint generated for matching job attributes.");
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
            String fp1 = JobFingerprintUtil.generateFingerprint("Amazon", "SDE 1", "Hyderabad", "₹28 LPA", "Fresher", "Fullstack development");
            String fp2 = JobFingerprintUtil.generateFingerprint("Amazon", "SDE 1", "Bangalore", "₹28 LPA", "Fresher", "Fullstack development");

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

        // Test 3: Text Normalization Utility
        try {
            String norm = JobFingerprintUtil.normalizeText("  TCS - NQT @2026!!  ");
            if ("tcsnqt2026".equals(norm)) {
                System.out.println("✅ TEST 3 PASSED: Text normalization stripped noise, special chars & whitespace.");
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
        System.out.println("📊 Unit Test Execution Summary: " + passed + " Passed, " + failed + " Failed.");
        System.out.println("==================================================");

        if (failed > 0) {
            System.exit(1);
        }
    }
}
