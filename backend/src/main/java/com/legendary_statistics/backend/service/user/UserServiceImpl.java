package com.legendary_statistics.backend.service.user;

import com.legendary_statistics.backend.auth.config.JwtAuthentication;
import com.legendary_statistics.backend.dto.user.ChangeMyPasswordReq;
import com.legendary_statistics.backend.dto.user.FindPasswordReq;
import com.legendary_statistics.backend.dto.user.GetMyInfoRes;
import com.legendary_statistics.backend.dto.user.SignUpByEmailReq;
import com.legendary_statistics.backend.entity.UserEntity;
import com.legendary_statistics.backend.global.exception.standard.DuplicationException;
import com.legendary_statistics.backend.global.exception.user.PassWordIncorrectException;
import com.legendary_statistics.backend.global.exception.user.UserNotFoundException;
import com.legendary_statistics.backend.repository.user.UserRepository;
import com.legendary_statistics.backend.util.RandomString;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.UnsupportedEncodingException;
import java.security.Principal;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RandomString randomString;
    private final JavaMailSender mailSender;

    @Override
    @Transactional
    public void signUp(SignUpByEmailReq req, HttpServletResponse response) {
        if (userRepository.existsByEmail(req.getEmail()))
            throw new DuplicationException("이메일이 중복되었습니다.");

        UserEntity user = UserEntity.builder()
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .name(req.getName())
                .build();

        userRepository.save(user);
    }

    @Override
    @Transactional
    public void findPassword(FindPasswordReq req) throws MessagingException, UnsupportedEncodingException {
        UserEntity user = userRepository.findByEmailAndName(req.getEmail(), req.getName())
                .orElseThrow(UserNotFoundException::new);

        String newRandomPassword = randomString.generate(12, RandomString.RandomStringType.LOWERCASE, RandomString.RandomStringType.NUMBER);
        user.setPassword(passwordEncoder.encode(newRandomPassword));

        log.info("Email sent to " + req.getEmail());
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper set = new MimeMessageHelper(message, true, "UTF-8");
        set.setSubject("임시 비밀번호 발급");
        set.setText(
                "<b>임시 비밀번호 : [" + newRandomPassword + "]</b><br>로그인 후 비밀번호를 변경해주세요." +
                        "<br><br>" +
                        "<b>본 메일은 발신전용 입니다.</b>"
                , true);
        set.setFrom("mean702000@gmail.com", "[TFT] 임시 비밀번호 발급");
        set.setTo(req.getEmail());
        mailSender.send(message);

        userRepository.save(user);
    }

    @Override
    public GetMyInfoRes getMyInfo(Principal principal) {
        long userId = JwtAuthentication.getUserId(principal);
        UserEntity userEntity = userRepository.findById(userId)
                .orElseThrow(UserNotFoundException::new);

        return GetMyInfoRes.builder()
                .id(userEntity.getId())
                .name(userEntity.getName())
                .email(userEntity.getEmail())
                .build();
    }

    @Override
    @Transactional
    public void changePassword(ChangeMyPasswordReq req, Principal principal) {
        long userId = JwtAuthentication.getUserId(principal);
        UserEntity userEntity = userRepository.findById(userId)
                .orElseThrow(UserNotFoundException::new);

        if (!passwordEncoder.matches(req.getOldPassword(), userEntity.getPassword()))
            throw new PassWordIncorrectException();

        userEntity.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(userEntity);
    }

    @Override
    @Transactional
    public void withdrawal(Principal principal) {
        long userId = JwtAuthentication.getUserId(principal);
        UserEntity userEntity = userRepository.findById(userId)
                .orElseThrow(UserNotFoundException::new);

        userRepository.delete(userEntity);
    }
}
