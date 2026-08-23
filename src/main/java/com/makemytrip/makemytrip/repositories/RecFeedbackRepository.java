package com.makemytrip.makemytrip.repositories;

import com.makemytrip.makemytrip.models.RecFeedback;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface RecFeedbackRepository extends MongoRepository<RecFeedback, String> {
    List<RecFeedback> findByUserId(String userId);
}
