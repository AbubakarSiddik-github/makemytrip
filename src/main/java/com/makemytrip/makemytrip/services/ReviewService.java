package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.Review;
import com.makemytrip.makemytrip.repositories.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    public Review createReview(Review review) {
        review.setId(null);
        review.setCreatedAt(LocalDateTime.now().toString());
        review.setHelpfulCount(0);
        review.setFlagCount(0);
        review.setFlagged(false);
        review.setHidden(false);
        review.setReplies(new ArrayList<>());
        if (review.getRating() < 1) review.setRating(1);
        if (review.getRating() > 5) review.setRating(5);
        return reviewRepository.save(review);
    }

    public List<Review> getReviews(String itemId, String itemType, String sort) {
        List<Review> list = new ArrayList<>();
        for (Review r : reviewRepository.findByItemIdAndItemType(itemId, itemType)) {
            if (!r.isHidden()) list.add(r);
        }
        Comparator<Review> cmp;
        if ("newest".equals(sort)) {
            cmp = Comparator.comparing(Review::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed();
        } else if ("highest".equals(sort)) {
            cmp = Comparator.comparingInt(Review::getRating).reversed();
        } else if ("lowest".equals(sort)) {
            cmp = Comparator.comparingInt(Review::getRating);
        } else {
            cmp = Comparator.comparingInt(Review::getHelpfulCount).reversed();
        }
        list.sort(cmp);
        return list;
    }

    public Review addReply(String id, Review.Reply reply) {
        Optional<Review> ro = reviewRepository.findById(id);
        if (ro.isEmpty()) throw new RuntimeException("Review not found");
        Review r = ro.get();
        reply.setCreatedAt(LocalDateTime.now().toString());
        r.getReplies().add(reply);
        return reviewRepository.save(r);
    }

    public Review markHelpful(String id) {
        Review r = reviewRepository.findById(id).orElseThrow(() -> new RuntimeException("Review not found"));
        r.setHelpfulCount(r.getHelpfulCount() + 1);
        return reviewRepository.save(r);
    }

    public Review flag(String id) {
        Review r = reviewRepository.findById(id).orElseThrow(() -> new RuntimeException("Review not found"));
        r.setFlagCount(r.getFlagCount() + 1);
        r.setFlagged(true);
        return reviewRepository.save(r);
    }

    public List<Review> getFlagged() {
        List<Review> list = new ArrayList<>();
        for (Review r : reviewRepository.findByFlaggedTrue()) {
            if (!r.isHidden()) list.add(r);
        }
        return list;
    }

    public Review moderateRemove(String id) {
        Review r = reviewRepository.findById(id).orElseThrow(() -> new RuntimeException("Review not found"));
        r.setHidden(true);
        return reviewRepository.save(r);
    }

    public Review moderateKeep(String id) {
        Review r = reviewRepository.findById(id).orElseThrow(() -> new RuntimeException("Review not found"));
        r.setFlagged(false);
        r.setFlagCount(0);
        return reviewRepository.save(r);
    }
}
