package com.legendary_statistics.backend.service.board;

import com.legendary_statistics.backend.auth.config.JwtAuthentication;
import com.legendary_statistics.backend.dto.board.*;
import com.legendary_statistics.backend.entity.*;
import com.legendary_statistics.backend.entity.enums.BoardCategoryType;
import com.legendary_statistics.backend.global.exception.board.BoardNotFoundException;
import com.legendary_statistics.backend.global.exception.file.FileNotFoundException;
import com.legendary_statistics.backend.global.exception.standard.ForbiddenException;
import com.legendary_statistics.backend.global.exception.user.UserNotFoundException;
import com.legendary_statistics.backend.repository.board.BoardCommentRepository;
import com.legendary_statistics.backend.repository.board.BoardFileRepository;
import com.legendary_statistics.backend.repository.board.BoardRepository;
import com.legendary_statistics.backend.repository.board.custom.BoardRepositoryCustomImpl;
import com.legendary_statistics.backend.repository.file.FileRepository;
import com.legendary_statistics.backend.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BoardServiceImpl implements BoardService {

    private final BoardRepository boardRepository;
    private final FileRepository fileRepository;
    private final UserRepository userRepository;
    private final BoardFileRepository boardFileRepository;
    private final BoardCommentRepository boardCommentRepository;
    private final BoardRepositoryCustomImpl boardRepositoryDsl;

    @Override
    public Page<GetBoardListRes> getBoardList(Pageable pageable, String category, String keyword) {
        PageRequest orderedPageable = PageRequest.of(pageable.getPageNumber(),
                10, Sort.by("id").descending());
        return boardRepository.findAllByCategoryAndKeyword(orderedPageable, category, keyword);
    }

    @Override
    public List<GetBoardCategoryRes> getBoardCategories() {
        return Arrays.stream(BoardCategoryType.values())
                .map(cat -> new GetBoardCategoryRes(cat.name(), cat.getDisplayName()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void writeBoard(PostBoardReq postBoardReq, Principal principal) {
        long userId = JwtAuthentication.getUserId(principal);
        UserEntity userEntity = userRepository.findById(userId).orElseThrow(UserNotFoundException::new);

        BoardEntity save = boardRepository.save(BoardEntity.builder()
                .title(postBoardReq.getTitle())
                .content(postBoardReq.getContent())
                .category(BoardCategoryType.fromApiName(postBoardReq.getCategory()))
                .userEntity(userEntity)
                .build());

        List<BoardFileEntity> boardFileEntities = new ArrayList<>();

        fileRepository.findAllById(postBoardReq.getFileIds()).forEach(file ->
                boardFileEntities.add(BoardFileEntity.builder()
                        .boardEntity(save)
                        .fileEntity(file)
                        .build())
        );

        boardFileRepository.saveAll(boardFileEntities);
    }

    @Override
    public GetBoardRes getBoardDetail(Long id) {
        BoardEntity boardEntity = boardRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        List<GetFileRes> getFileResList = boardFileRepository.findAllByBoardEntity(boardEntity).stream()
                .map(boardFile -> {
                    FileEntity file = fileRepository.findById(boardFile.getFileEntity().getId())
                            .orElseThrow(FileNotFoundException::new);
                    return GetFileRes.builder()
                            .id(file.getId())
                            .actualFileName(file.getActualFileName())
                            .size(file.getSize())
                            .build();
                })
                .toList();

        return GetBoardRes.builder()
                .id(boardEntity.getId())
                .title(boardEntity.getTitle())
                .content(boardEntity.getContent())
                .category(boardEntity.getCategory().name())
                .userId(boardEntity.getUserEntity().getId())
                .userName(boardEntity.getUserEntity().getName())
                .createdAt(boardEntity.getCreatedAt())
                .files(getFileResList)
                .build();
    }

    @Override
    public Map<String, String> getLastTimeInquiry() {
        return boardRepositoryDsl.findAllLastBoardByCategory();
    }

    @Override
    public List<GetBoardCommentRes> getBoardComments(Long boardId) {
        return boardRepositoryDsl.findCommentsByBoardId(boardId);
    }

    @Override
    @Transactional
    public void postBoardComment(PostBoardCommentReq postBoardCommentReq, Principal principal) {
        boardCommentRepository.save(BoardCommentEntity.builder()
                .boardEntity(boardRepository.findById(postBoardCommentReq.getBoardId())
                        .orElseThrow(BoardNotFoundException::new))
                .userEntity(userRepository.findById(JwtAuthentication.getUserId(principal))
                        .orElseThrow(UserNotFoundException::new))
                .content(postBoardCommentReq.getComment())
                .build());
    }

    @Override
    @Transactional
    public void deleteBoardComment(Long commentId, Principal principal) {
        BoardCommentEntity boardCommentEntity = boardCommentRepository.findById(commentId).orElseThrow(BoardNotFoundException::new);
        long userId = JwtAuthentication.getUserId(principal);
        if (!boardCommentEntity.getUserEntity().getId().equals(userId)) throw new ForbiddenException();
        else boardCommentRepository.delete(boardCommentEntity);
    }

    @Override
    @Transactional
    public void deleteBoard(Long boardId, Principal principal) {
        BoardEntity boardEntity = boardRepository.findById(boardId).orElseThrow(BoardNotFoundException::new);
        long userId = JwtAuthentication.getUserId(principal);
        if (!boardEntity.getUserEntity().getId().equals(userId)) throw new ForbiddenException();
        else boardRepository.delete(boardEntity);
    }

    @Override
    public Page<GetBoardListRes> getMyBoardList(Pageable pageable, String keyword, Principal principal) {
        long userId = JwtAuthentication.getUserId(principal);
        PageRequest orderedPageable = PageRequest.of(pageable.getPageNumber(),
                10, Sort.by("id").descending());
        return boardRepository.findAllByUserIdAndKeyword(orderedPageable, userId, keyword);
    }
}
