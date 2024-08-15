package com.ssafy.smru.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.elasticsearch.client.ClientConfiguration;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchConfiguration;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;

@Configuration
@PropertySource(value="classpath:/elastic.properties")
@EnableElasticsearchRepositories(basePackages = "org.springframework.data.elasticsearch.repository")
public class ElasticSearchConfig extends ElasticsearchConfiguration {
    @Value("${elasticsearch.username}")
    private String name;

    @Value("${elasticsearch.password}")
    private String password;

    @Value("${elasticsearch.uris}")
    private String uris;
    @Override
    public ClientConfiguration clientConfiguration() {
        return ClientConfiguration.builder()
                .connectedTo(uris)
                .withBasicAuth(name,password)
                .build();
    }
}