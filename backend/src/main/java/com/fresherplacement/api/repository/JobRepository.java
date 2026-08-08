package com.fresherplacement.api.repository;

import com.fresherplacement.api.entity.Job;
import com.fresherplacement.api.entity.WorkType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    Optional<Job> findByFingerprint(String fingerprint);

    List<Job> findAllByOrderByCreatedAtDesc();

    @Query("SELECT j FROM Job j WHERE " +
           "(:query IS NULL OR LOWER(j.role) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(j.company) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(j.location) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:type IS NULL OR j.type = :type) " +
           "ORDER BY j.createdAt DESC")
    List<Job> searchJobs(@Param("query") String query, @Param("type") WorkType type);

    @Query("SELECT COUNT(DISTINCT LOWER(j.company)) FROM Job j")
    long countUniqueCompanies();
}
