package com.ssafy.smru.entity.app;


// 투야 정보의 ElasticSearch 인덱스

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.*;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Document(indexName = "medicine")
@Mapping(mappingPath = "static/es-mapping.json")
@Setting(settingPath = "static/es-setting.json")
public class MedicineEs {

    @Id
    @Field(type = FieldType.Integer,name = "medicine_id")
    private Long medicineId;
    @Field(type = FieldType.Text,name = "medicine_name")
    private String medicineName;


    public Medicine toMedicine(){
        return new Medicine(medicineId,medicineName);
    }
}
