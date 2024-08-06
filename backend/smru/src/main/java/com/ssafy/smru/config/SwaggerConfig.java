// package com.ssafy.smru.config;

// import io.swagger.v3.oas.models.OpenAPI;
// import io.swagger.v3.oas.models.info.Info;
// import org.springdoc.core.models.GroupedOpenApi;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import springfox.documentation.builders.ParameterBuilder;
// import springfox.documentation.builders.PathSelectors;
// import springfox.documentation.builders.RequestHandlerSelectors;
// import springfox.documentation.schema.ModelRef;
// import springfox.documentation.service.ApiInfo;
// import springfox.documentation.service.Contact;
// import springfox.documentation.spi.DocumentationType;
// import springfox.documentation.spring.web.plugins.Docket;

// import java.util.Collections;

// @Configuration

// public class SwaggerConfig {

//     @Bean
//     public GroupedOpenApi publicApi() {
//         return GroupedOpenApi.builder()
//                 .group("springdoc-public")
//                 .pathsToMatch("/**")
//                 .build();
//     }

//     @Bean
//     public OpenAPI customOpenAPI() {
//         return new OpenAPI()
//                 .info(new Info()
//                         .title("SMRU")
//                         .version("v1")
//                         .description("구급어쩌고팀 API 명세서"));
//     }
//     @Bean
//     public Docket api() {
//         return new Docket(DocumentationType.SWAGGER_2)
//                 .select()
//                 .apis(RequestHandlerSelectors.basePackage("com.ssafy.smru.controller"))
//                 .paths(PathSelectors.any())
//                 .build()
//                 .globalOperationParameters(
//                         Collections.singletonList(new ParameterBuilder()
//                                 .name("Authorization")
//                                 .description("Bearer Token")
//                                 .modelRef(new ModelRef("string"))
//                                 .parameterType("header")
//                                 .required(false)
//                                 .build()))
//                 .apiInfo(apiInfo());
//     }

//     private ApiInfo apiInfo() {
//         return new ApiInfo(
//                 "SMRU API 문서",
//                 "API 설명",
//                 "v1",
//                 "Terms of service",
//                 new Contact("이름", "웹사이트 URL", "이메일"),
//                 "License",
//                 "License URL",
//                 Collections.emptyList());
//     }}