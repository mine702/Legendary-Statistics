package com.legendary_statistics.backend.service.board;

import com.legendary_statistics.backend.dto.board.GetBoardListRes;
import com.legendary_statistics.backend.repository.board.BoardRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BoardServiceImpl implements BoardService {

    private final BoardRepository boardRepository;

    @Override
    public Page<GetBoardListRes> getBoardList(Pageable pageable, String category, String keyword) {
        PageRequest orderedPageable = PageRequest.of(pageable.getPageNumber(),
                10, Sort.by("id").descending());
        return boardRepository.findAllByCategoryAndKeyword(orderedPageable, category, keyword);
    }
}
