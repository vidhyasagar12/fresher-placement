package com.fresherplacement.api.dto;

import com.fresherplacement.api.entity.WorkType;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobDto {

    private Long id;

    @NotBlank(message = "Company name is required")
    private String company;

    private String logo;

    private String logoColor;

    @NotBlank(message = "Job role is required")
    private String role;

    private String location;

    private WorkType type;

    private String experience;

    private String salary;

    private String posted;

    private String applyLink;

    private String description;

    private List<String> requirements;

    private List<String> tags;

    private Boolean instagramPosted;

    private LocalDateTime createdAt;
}
