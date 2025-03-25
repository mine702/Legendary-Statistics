package com.legendary_statistics.backend.repository.file;

import com.legendary_statistics.backend.entity.FileLegendEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FileLegendRepository extends JpaRepository<FileLegendEntity, Long> {
}
