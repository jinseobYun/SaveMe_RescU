package com.ssafy.smru.exception;

public class EntityExistsException extends RuntimeException {
    public EntityExistsException(String message) {
        super(message);
    }

    public EntityExistsException() {
        super("엔티티가 이미 존재합니다.");
    }
}