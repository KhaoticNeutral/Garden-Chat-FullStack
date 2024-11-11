// src/main/java/com/example/gardenchat/repository/UserRepository.java
package com.example.gardenchat.repository;

import com.example.gardenchat.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
    User findByUsername(String username);
}


