package com.legendary_statistics.backend.service.gameItems;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.legendary_statistics.backend.entity.GameItemsEntity;
import com.legendary_statistics.backend.entity.enums.GameItemType;
import com.legendary_statistics.backend.global.exception.file.JsonFileRuntimeException;
import com.legendary_statistics.backend.repository.gameItems.GameItemsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class GameItemsServiceImpl implements GameItemsService {

    private final GameItemsRepository gameItemsRepository;

    @Override
    @Transactional
    public void filterCommunityDragonItemJson(MultipartFile file) {
        try {
            JsonNode root = new ObjectMapper().readTree(file.getInputStream());
            JsonNode itemsNode = root.get("items");

            if (itemsNode == null || !itemsNode.isArray()) {
                throw new JsonFileRuntimeException();
            }

            List<GameItemsEntity> list = new ArrayList<>();

            for (JsonNode node : itemsNode) {
                if (node.get("apiName") == null) {
                    throw new JsonFileRuntimeException();
                }

                String apiName = node.get("apiName").asText();

                if (gameItemsRepository.existsByApiName(apiName)) {
                    continue;
                }

                GameItemsEntity entity = GameItemsEntity.builder()
                        .apiName(apiName)
                        .name(getString(node, "name"))
                        .description(getString(node, "desc"))
                        .iconPath(transformIconPath(getString(node, "icon")))
                        .associatedTraits(toJsonArrayString(node, "associatedTraits"))
                        .incompatibleTraits(toJsonArrayString(node, "incompatibleTraits"))
                        .tags(toJsonArrayString(node, "tags"))
                        .composition(toJsonArrayString(node, "composition"))
                        .fromItems(toJsonArrayString(node, "from"))
                        .effects(toJsonObjectString(node))
                        .isUnique(node.has("unique") && !node.get("unique").isNull() && node.get("unique").asBoolean())
                        .internalId(getString(node, "id"))
                        .type(GameItemType.fromApiName(apiName))
                        .build();

                list.add(entity);
            }
            if (!list.isEmpty())
                gameItemsRepository.saveAll(list);

        } catch (IOException | RuntimeException e) {
            log.error(e.getMessage());
            throw new JsonFileRuntimeException();
        }
    }


    private String getString(JsonNode node, String field) {
        return node.has(field) && !node.get(field).isNull() ? node.get(field).asText() : null;
    }

    private String toJsonArrayString(JsonNode node, String field) {
        return node.has(field) && !node.get(field).isNull() ? node.get(field).toString() : "[]";
    }

    private String toJsonObjectString(JsonNode node) {
        return node.has("effects") && !node.get("effects").isNull() ? node.get("effects").toString() : "{}";
    }

    private String transformIconPath(String iconPath) {
        if (iconPath == null) return null;
        return iconPath.replaceFirst("^ASSETS/Maps/TFT", "/uploads");
    }
}
