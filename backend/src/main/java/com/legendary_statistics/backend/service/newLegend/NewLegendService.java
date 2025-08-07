package com.legendary_statistics.backend.service.newLegend;

import com.legendary_statistics.backend.dto.newLegend.*;

import java.security.Principal;
import java.util.List;

public interface NewLegendService {

    List<GetNewLegendListRes> getNewLegendList();

    GetNewLegendRes getNewLegendDetail(Long id);

    void voteNewLegend(PostVoteReq request);

    List<GetNewLegendCommentRes> getNewLegendComments(Long id);

    void postNewLegendComment(PostNewLegendCommentReq postNewLegendCommentReq, Principal principal);

    void deleteNewLegendComment(Long commentId, Principal principal);

    GetNewLegendRes getNewLegendLast();
}
