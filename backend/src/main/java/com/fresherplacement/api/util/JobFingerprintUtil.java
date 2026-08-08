package com.fresherplacement.api.util;

public class JobFingerprintUtil {

    public static String normalizeText(String text) {
        if (text == null) return "";
        return text.toLowerCase().replaceAll("[^a-z0-9]", "").trim();
    }

    public static String generateFingerprint(Object job) {
        if (job == null) return "";
        try {
            String company = (String) job.getClass().getMethod("getCompany").invoke(job);
            String role = (String) job.getClass().getMethod("getRole").invoke(job);
            String location = (String) job.getClass().getMethod("getLocation").invoke(job);
            String salary = (String) job.getClass().getMethod("getSalary").invoke(job);
            String experience = (String) job.getClass().getMethod("getExperience").invoke(job);
            String description = (String) job.getClass().getMethod("getDescription").invoke(job);
            return generateFingerprint(company, role, location, salary, experience, description);
        } catch (Exception e) {
            return "";
        }
    }

    public static String generateFingerprint(String company, String role, String location, String salary, String experience, String description) {
        String normCompany = normalizeText(company);
        String normRole = normalizeText(role);
        String normLocation = normalizeText(location);
        String normSalary = normalizeText(salary);
        String normExperience = normalizeText(experience);

        String rawDesc = description != null ? description : "";
        String normDesc = normalizeText(rawDesc.substring(0, Math.min(rawDesc.length(), 100)));

        return String.format("%s|%s|%s|%s|%s|%s", normCompany, normRole, normLocation, normSalary, normExperience, normDesc);
    }
}
