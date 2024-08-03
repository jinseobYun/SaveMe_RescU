package com.ssafy.smru;

import com.ssafy.smru.util.StunServer;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class SmruApplication {

	public static void main(String[] args) {
		SpringApplication.run(SmruApplication.class, args);
	}

	@Bean
	public CommandLineRunner run(StunServer stunServer) {
		return args -> {
			new Thread(stunServer).start(); // STUN 서버 스레드 시작
		};
	}


	//0: 성공 (정상 처리)
	//1: 일반적인 오류 (예: 예기치 않은 오류)
	//2: 유효성 검사 실패 (입력 값이 유효하지 않음)
	//3: 데이터 없음 (요청한 데이터가 존재하지 않음)
	//4: 권한 없음 (사용자가 해당 작업을 수행할 권한이 없음)
	//5: 중복 데이터 (예: 이미 존재하는 사용자)
}
