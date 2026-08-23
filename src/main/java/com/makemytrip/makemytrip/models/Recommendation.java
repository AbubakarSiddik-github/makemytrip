package com.makemytrip.makemytrip.models;

import java.util.ArrayList;
import java.util.List;

public class Recommendation {
    private String recKey;      // e.g. flight:<id>, hotel:<id>, dest:<name>
    private String type;        // flight, hotel, destination
    private String refId;
    private String title;
    private String subtitle;
    private String reason;      // "Why this recommendation?"
    private String image;
    private List<String> tags = new ArrayList<>();
    private double price;
    private double score;

    public String getRecKey() { return recKey; }
    public void setRecKey(String recKey) { this.recKey = recKey; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getRefId() { return refId; }
    public void setRefId(String refId) { this.refId = refId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getSubtitle() { return subtitle; }
    public void setSubtitle(String subtitle) { this.subtitle = subtitle; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public double getScore() { return score; }
    public void setScore(double score) { this.score = score; }
}
