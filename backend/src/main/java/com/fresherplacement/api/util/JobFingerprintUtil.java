package com.fresherplacement.api.util;

import com.fresherplacement.api.entity.Job;

public class JobFingerprintUtil {

    public static String normalizeText(String text) {
        if (text == null) return "";
        return text.toLowerCase().replaceAll("[^a-z0-9]", "").trim();
    }

    public static String generateFingerprint(Job job) {
        if (job == null) return "";
        return generateFingerprint(
            job.getCompany(),
            job.getRole(),
            job.getLocation(),
            job.getSalary(),
            job.getExperience(),
            job.getDescription()
        );
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
