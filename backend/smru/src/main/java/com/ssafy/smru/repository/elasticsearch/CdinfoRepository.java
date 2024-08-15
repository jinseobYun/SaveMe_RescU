package com.ssafy.smru.repository.elasticsearch;

import com.ssafy.smru.entity.app.CdInfoEs;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CdinfoRepository extends ElasticsearchRepository<CdInfoEs,Long>, CrudRepository<CdInfoEs,Long> {

    CdInfoEs findByCdInfoId(Long medicineId);

}
