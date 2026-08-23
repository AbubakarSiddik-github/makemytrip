package com.makemytrip.makemytrip.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "price_freezes")
public class PriceFreeze {
    @Id
    private String _id;
    private String userId;
    private String flightId;
    private String flightName;
    private double frozenPrice;
    private String createdAt;
    private String expiresAt;

    public String getId() { return _id; }
    public void setId(String id) { this._id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getFlightId() { return flightId; }
    public void setFlightId(String flightId) { this.flightId = flightId; }
    public String getFlightName() { return flightName; }
    public void setFlightName(String flightName) { this.flightName = flightName; }
    public double getFrozenPrice() { return frozenPrice; }
    public void setFrozenPrice(double frozenPrice) { this.frozenPrice = frozenPrice; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    public String getExpiresAt() { return expiresAt; }
    public void setExpiresAt(String expiresAt) { this.expiresAt = expiresAt; }
}
