package com.ssafy.smru.service.elasticsearch;

import co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.TermQuery;
import com.ssafy.smru.entity.app.MedicineEs;
import com.ssafy.smru.repository.app.MedicineRepository;
import com.ssafy.smru.repository.elasticsearch.ElasticSearchRepository;
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
public class ElasticSearchService {

    private final ElasticSearchRepository elasticSearchRepository;

    private final ElasticsearchOperations elasticsearchOperations;
    private final MedicineRepository medicineRepository;

    public MedicineEs searchByMedicineID(Long medicineId) {
        MedicineEs es = elasticSearchRepository.findByMedicineId(medicineId);
        return es;
    }

    public NativeQuery createNativeQuery(String keyword) {
        BoolQuery boolQuery = BoolQuery.of(b -> b
                .should(TermQuery.of(t -> t.field("medicine_name").value(keyword))._toQuery())
                .should(TermQuery.of(t -> t.field("medicine_name.ngram").value(keyword))._toQuery())
        );

        return NativeQuery.builder()
                .withQuery(q -> q.bool(boolQuery))
                .withPageable(Pageable.ofSize(10))
                .build();
    }

    public List<MedicineEs> searchByMedicineName(String medicineName) {
        SearchHits<MedicineEs> searchHits = elasticsearchOperations.search(createNativeQuery(medicineName), MedicineEs.class);
        List<MedicineEs> contentList = searchHits.getSearchHits().stream()
                .map(SearchHit::getContent)
                .collect(Collectors.toList());
        return contentList;
    }


    public List<MedicineEs> searchByMedicineIds(List<Long> medicineIds) {
        List<MedicineEs> result = (List<MedicineEs>) elasticSearchRepository.findAllById(medicineIds);

        return result;
    }
}
