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
}
