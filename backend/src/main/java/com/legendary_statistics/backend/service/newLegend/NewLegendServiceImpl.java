package com.legendary_statistics.backend.service.newLegend;

import com.legendary_statistics.backend.auth.config.JwtAuthentication;
import com.legendary_statistics.backend.dto.newLegend.*;
import com.legendary_statistics.backend.entity.NewLegendCommentEntity;
import com.legendary_statistics.backend.entity.NewLegendEntity;
import com.legendary_statistics.backend.global.exception.legend.LegendNotFoundException;
import com.legendary_statistics.backend.global.exception.newLegend.NewLegendNotFoundException;
import com.legendary_statistics.backend.global.exception.standard.ForbiddenException;
import com.legendary_statistics.backend.global.exception.user.UserNotFoundException;
import com.legendary_statistics.backend.module.RecaptchaValidator;
import com.legendary_statistics.backend.repository.newLegend.NewLegendCommentRepository;
import com.legendary_statistics.backend.repository.newLegend.NewLegendRepository;
import com.legendary_statistics.backend.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class NewLegendServiceImpl implements NewLegendService {

    private final UserRepository userRepository;
    private final NewLegendRepository newLegendRepository;
    private final NewLegendCommentRepository newLegendCommentRepository;
    private final RecaptchaValidator recaptchaValidator;

    @Override
    public List<GetNewLegendListRes> getNewLegendList() {
        return newLegendRepository.findAllNamesOrderByCreatedAt();
    }

    @Override
    public GetNewLegendRes getNewLegendDetail(Long id) {
        NewLegendEntity newLegendEntity = newLegendRepository.findById(id).orElseThrow(LegendNotFoundException::new);

        GetNewLegendRes newLegendRes = new GetNewLegendRes();

        newLegendRes.setId(newLegendEntity.getId());
        newLegendRes.setName(newLegendEntity.getName());
        newLegendRes.setRateId(newLegendEntity.getRateEntity().getId());
        newLegendRes.setPrice(newLegendEntity.getPrice());
        newLegendRes.setVideoUrl(newLegendEntity.getVideoUrl());
        newLegendRes.setGood(newLegendEntity.getGood());
        newLegendRes.setBad(newLegendEntity.getBad());
        newLegendRes.setCreatedAt(newLegendEntity.getCreatedAt());

        return newLegendRes;
    }

    @Override
    @Transactional
    public void voteNewLegend(PostVoteReq request) {
        boolean verified = recaptchaValidator.verifyToken(request.getToken());
        if (!verified) throw new RuntimeException("Recaptcha 인증 실패");

        NewLegendEntity newLegendEntity = newLegendRepository.findById(request.getId())
                .orElseThrow(LegendNotFoundException::new);

        if (request.getType().equals("good")) newLegendEntity.setGood(newLegendEntity.getGood() + 1);
        else if (request.getType().equals("bad")) newLegendEntity.setBad(newLegendEntity.getBad() + 1);
        else throw new RuntimeException("잘못된 요청입니다.");

        newLegendRepository.save(newLegendEntity);
    }

    @Override
    public List<GetNewLegendCommentRes> getNewLegendComments(Long id) {
        return newLegendRepository.findCommentsByNewLegendId(id);
    }

    @Override
    @Transactional
    public void postNewLegendComment(PostNewLegendCommentReq postNewLegendCommentReq, Principal principal) {
        newLegendCommentRepository.save(NewLegendCommentEntity.builder()
                .newLegendEntity(newLegendRepository.findById(postNewLegendCommentReq.getId())
                        .orElseThrow(NewLegendNotFoundException::new))
                .userEntity(userRepository.findById(JwtAuthentication.getUserId(principal))
                        .orElseThrow(UserNotFoundException::new))
                .content(postNewLegendCommentReq.getComment())
                .build());
    }

    @Override
    @Transactional
    public void deleteNewLegendComment(Long commentId, Principal principal) {
        NewLegendCommentEntity newLegendCommentEntity = newLegendCommentRepository.findById(commentId).orElseThrow(NewLegendNotFoundException::new);
        long userId = JwtAuthentication.getUserId(principal);
        if (!newLegendCommentEntity.getUserEntity().getId().equals(userId)) throw new ForbiddenException();
        else newLegendCommentRepository.delete(newLegendCommentEntity);
    }
}
