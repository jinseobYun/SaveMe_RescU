package com.ssafy.smru.entity.app;

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
@Document(indexName = "cdinfos")
@Mapping(mappingPath = "static/cdinfos-mapping.json")
@Setting(settingPath = "static/cdinfos-setting.json")
public class CdInfoEs {
    @Id
    @Field(type = FieldType.Integer,name = "cd_info_id")
    private Long cdInfoId;

    @Field(type = FieldType.Text,name = "cd_name")
    private String cdName;
}
