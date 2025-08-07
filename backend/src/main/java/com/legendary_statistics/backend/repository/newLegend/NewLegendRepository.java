package com.legendary_statistics.backend.repository.newLegend;

import com.legendary_statistics.backend.dto.newLegend.GetNewLegendListRes;
import com.legendary_statistics.backend.entity.NewLegendEntity;
import com.legendary_statistics.backend.repository.newLegend.custom.NewLegendRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewLegendRepository extends JpaRepository<NewLegendEntity, Long>, NewLegendRepositoryCustom {

    @Query("SELECT new com.legendary_statistics.backend.dto.newLegend.GetNewLegendListRes(n.id, n.name, n.rateEntity.id) " +
            "FROM NewLegendEntity n WHERE n.deleted = false ORDER BY n.createdAt DESC")
    List<GetNewLegendListRes> findAllNamesOrderByCreatedAt();

}
