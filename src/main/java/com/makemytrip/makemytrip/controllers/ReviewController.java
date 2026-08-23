package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.models.Review;
import com.makemytrip.makemytrip.services.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public Review create(@RequestBody Review review) {
        return reviewService.createReview(review);
    }

    @GetMapping
    public List<Review> list(@RequestParam String itemId,
                             @RequestParam String itemType,
                             @RequestParam(required = false, defaultValue = "helpful") String sort) {
        return reviewService.getReviews(itemId, itemType, sort);
    }

    @PostMapping("/{id}/reply")
    public Review reply(@PathVariable String id, @RequestBody Review.Reply reply) {
        return reviewService.addReply(id, reply);
    }

    @PostMapping("/{id}/helpful")
    public Review helpful(@PathVariable String id) {
        return reviewService.markHelpful(id);
    }

    @PostMapping("/{id}/flag")
    public Review flag(@PathVariable String id) {
        return reviewService.flag(id);
    }

    @GetMapping("/flagged")
    public List<Review> flagged() {
        return reviewService.getFlagged();
    }

    @PostMapping("/{id}/remove")
    public Review remove(@PathVariable String id) {
        return reviewService.moderateRemove(id);
    }

    @PostMapping("/{id}/keep")
    public Review keep(@PathVariable String id) {
        return reviewService.moderateKeep(id);
    }
}
