package com.makemytrip.makemytrip.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "rec_feedback")
public class RecFeedback {
    @Id
    private String _id;
    private String userId;
    private String recKey;
    private String tag;
    private boolean helpful;
    private String createdAt;

    public String getId() { return _id; }
    public void setId(String id) { this._id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getRecKey() { return recKey; }
    public void setRecKey(String recKey) { this.recKey = recKey; }
    public String getTag() { return tag; }
    public void setTag(String tag) { this.tag = tag; }
    public boolean isHelpful() { return helpful; }
    public void setHelpful(boolean helpful) { this.helpful = helpful; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
