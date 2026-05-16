package com.mascotasperdidas.repository;

import com.mascotasperdidas.entity.Report;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    @Query("""
        SELECT r FROM Report r
        WHERE r.active = true
          AND (:status IS NULL OR r.status = :status)
          AND (:animalType IS NULL OR r.animalType = :animalType)
          AND (:city IS NULL OR LOWER(r.city) LIKE LOWER(CONCAT('%', :city, '%')))
          AND (:q IS NULL
               OR LOWER(r.name) LIKE LOWER(CONCAT('%', :q, '%'))
               OR LOWER(r.breed) LIKE LOWER(CONCAT('%', :q, '%'))
               OR LOWER(r.description) LIKE LOWER(CONCAT('%', :q, '%'))
               OR LOWER(r.locationText) LIKE LOWER(CONCAT('%', :q, '%')))
        ORDER BY r.createdAt DESC
        """)
    Page<Report> findFiltered(
        @Param("status") Report.Status status,
        @Param("animalType") Report.AnimalType animalType,
        @Param("city") String city,
        @Param("q") String q,
        Pageable pageable
    );

    Page<Report> findByPublishedByIdAndActiveTrue(Long userId, Pageable pageable);

    long countByStatusAndActiveTrue(Report.Status status);
    long countByActiveTrue();
}
