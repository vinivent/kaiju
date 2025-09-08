package com.cesar.kaiju.exception;

public class UsernameAlreadyUsedExcpetion extends RuntimeException {
    public UsernameAlreadyUsedExcpetion(String message) {
        super(message);
    }
}