package com.legendary_statistics.backend.repository.file;

import com.legendary_statistics.backend.entity.FileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileRepository extends JpaRepository<FileEntity, Long> {

    @Query("SELECT f.path FROM FileEntity f " +
            "WHERE NOT EXISTS (SELECT 1 FROM BoardFileEntity bf WHERE bf.fileEntity = f)")
    List<String> findUnreferencedFilePaths();

    @Modifying
    @Query("DELETE FROM FileEntity f " +
            "WHERE NOT EXISTS (SELECT 1 FROM BoardFileEntity bf WHERE bf.fileEntity = f)")
    int deleteUnreferencedFiles();
}
