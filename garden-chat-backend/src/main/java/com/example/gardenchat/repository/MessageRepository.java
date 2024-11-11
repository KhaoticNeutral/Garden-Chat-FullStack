// src/main/java/com/example/gardenchat/repository/MessageRepository.java
package com.example.gardenchat.repository;

import com.example.gardenchat.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findByReceiver(String receiver);
}



