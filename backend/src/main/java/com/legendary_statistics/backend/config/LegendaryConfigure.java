package com.legendary_statistics.backend.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "legendary")
@Data
public class LegendaryConfigure {
    private String fileUploadPath;
}
