package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.models.Recommendation;
import com.makemytrip.makemytrip.services.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/recommendations")
@CrossOrigin(origins = "*")
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    @GetMapping
    public List<Recommendation> get(@RequestParam(required = false) String userId) {
        return recommendationService.generate(userId);
    }

    @PostMapping("/feedback")
    public String feedback(@RequestParam String userId,
                           @RequestParam String recKey,
                           @RequestParam(required = false) String tag,
                           @RequestParam boolean helpful) {
        recommendationService.recordFeedback(userId, recKey, tag, helpful);
        return "ok";
    }
}
