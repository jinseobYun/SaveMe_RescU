package com.ssafy.smru.service.elasticsearch;

import co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.MatchQuery;
import com.ssafy.smru.entity.app.CdInfoEs;
import com.ssafy.smru.repository.elasticsearch.CdinfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CdinfoService {

    private final CdinfoRepository cdinfoRepository;

    private final ElasticsearchOperations elasticsearchOperations;

    public CdInfoEs searchByCdInfoId(Long cdInfoId) {
        CdInfoEs es = cdinfoRepository.findByCdInfoId(cdInfoId);
        return es;
    }

    public NativeQuery createNativeQuery(String keyword) {
        BoolQuery boolQuery = BoolQuery.of(b -> b
                .should(MatchQuery.of(m -> m.field("cd_name").query(keyword))._toQuery())
                .should(MatchQuery.of(m -> m.field("cd_name.nori").query(keyword))._toQuery())
                .should(MatchQuery.of(m -> m.field("cd_name.ngram").query(keyword))._toQuery())
                .should(MatchQuery.of(m -> m.field("cd_name.edge").query(keyword))._toQuery())
        );

        return NativeQuery.builder()
                .withQuery(q -> q.bool(boolQuery))
                .withPageable(Pageable.ofSize(10))
                .build();
    }

    public List<CdInfoEs> searchByCdName(String cdName) {
        SearchHits<CdInfoEs> searchHits = elasticsearchOperations.search(createNativeQuery(cdName), CdInfoEs.class);
        List<CdInfoEs> contentList = searchHits.getSearchHits().stream()
                .map(SearchHit::getContent)
                .collect(Collectors.toList());
        return contentList;
    }


    public List<CdInfoEs> searchByMedicineIds(List<Long> cdInfoId) {
        List<CdInfoEs> result = (List<CdInfoEs>) cdinfoRepository.findAllById(cdInfoId);

        return result;
    }
}
