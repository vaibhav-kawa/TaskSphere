package com.mit.tasksphere.Gateway;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

@SpringBootApplication
public class GatewayApplication {

	private static final Logger logger = LoggerFactory.getLogger(GatewayApplication.class);

	public static void main(String[] args) {
		logger.info("🚀 GATEWAY STARTING: TaskSphere API Gateway");
		SpringApplication.run(GatewayApplication.class, args);
	}

	@EventListener(ApplicationReadyEvent.class)
	public void onApplicationReady() {
		logger.info("✅ GATEWAY READY: TaskSphere API Gateway is running on port 8090");
		logger.info("🔍 GATEWAY ROUTES: /api/users/** -> UserService:8086, /api/tasks/** -> TaskService:8087");
		logger.info("📊 GATEWAY MONITORING: All requests will be logged with trace IDs");
	}
}
