package com.mascotasperdidas.service;

import com.mascotasperdidas.dto.response.StatsResponse;
import com.mascotasperdidas.entity.Report;
import com.mascotasperdidas.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final ReportRepository reportRepository;

    @Transactional(readOnly = true)
    public StatsResponse getStats() {
        long lost = reportRepository.countByStatusAndActiveTrue(Report.Status.LOST);
        long found = reportRepository.countByStatusAndActiveTrue(Report.Status.FOUND);
        long total = reportRepository.countByActiveTrue();
        return new StatsResponse(lost, found, total);
    }
}
