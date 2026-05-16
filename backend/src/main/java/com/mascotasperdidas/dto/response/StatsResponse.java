package com.mascotasperdidas.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StatsResponse {
    private long lostCount;
    private long foundCount;
    private long totalCount;
}
