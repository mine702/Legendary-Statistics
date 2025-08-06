package com.legendary_statistics.backend.repository.newLegend;

import com.legendary_statistics.backend.dto.newLegend.GetNewLegendListRes;
import com.legendary_statistics.backend.entity.NewLegendEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewLegendRepository extends JpaRepository<NewLegendEntity, Long> {

    @Query("SELECT new com.legendary_statistics.backend.dto.newLegend.GetNewLegendListRes(n.id, n.name) " +
            "FROM NewLegendEntity n WHERE n.deleted = false ORDER BY n.createdAt DESC")
    List<GetNewLegendListRes> findAllNamesOrderByCreatedAt();

}
