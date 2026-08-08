package com.fresherplacement.api.util;

public class JobFingerprintUtilTest {

    public void testIdenticalFingerprint() {
        String fp1 = JobFingerprintUtil.generateFingerprint("Google", "Associate Software Engineer", "Bangalore, India", "₹18–24 LPA", "Fresher (0–1 yr)", "Build distributed cloud backend services.");
        String fp2 = JobFingerprintUtil.generateFingerprint("  GOOGLE  ", "associate software engineer", "bangalore, india ", "₹18–24 LPA", "fresher (0–1 yr)", "Build distributed cloud backend services.");

        if (!fp1.equals(fp2) || !fp1.contains("google") || !fp1.contains("associatesoftwareengineer")) {
            throw new AssertionError("Identical fingerprint test failed");
        }
    }

    public void testDifferentFingerprint() {
        String fp1 = JobFingerprintUtil.generateFingerprint("Amazon", "SDE 1", "Hyderabad", "₹28 LPA", "Fresher", "Fullstack development");
        String fp2 = JobFingerprintUtil.generateFingerprint("Amazon", "SDE 1", "Bangalore", "₹28 LPA", "Fresher", "Fullstack development");

        if (fp1.equals(fp2)) {
            throw new AssertionError("Different fingerprint test failed");
        }
    }
}
