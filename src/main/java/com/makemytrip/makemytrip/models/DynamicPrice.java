package com.makemytrip.makemytrip.models;

import java.util.ArrayList;
import java.util.List;

public class DynamicPrice {
    private String flightId;
    private String flightName;
    private String from;
    private String to;
    private double basePrice;
    private double currentPrice;
    private double demandFactor;
    private double seasonFactor;
    private double changePercent;
    private String trend;      // up, down, stable
    private boolean peak;
    private int availableSeats;
    private String lastUpdated;
    private List<PricePoint> history = new ArrayList<>();

    public String getFlightId() { return flightId; }
    public void setFlightId(String flightId) { this.flightId = flightId; }
    public String getFlightName() { return flightName; }
    public void setFlightName(String flightName) { this.flightName = flightName; }
    public String getFrom() { return from; }
    public void setFrom(String from) { this.from = from; }
    public String getTo() { return to; }
    public void setTo(String to) { this.to = to; }
    public double getBasePrice() { return basePrice; }
    public void setBasePrice(double basePrice) { this.basePrice = basePrice; }
    public double getCurrentPrice() { return currentPrice; }
    public void setCurrentPrice(double currentPrice) { this.currentPrice = currentPrice; }
    public double getDemandFactor() { return demandFactor; }
    public void setDemandFactor(double demandFactor) { this.demandFactor = demandFactor; }
    public double getSeasonFactor() { return seasonFactor; }
    public void setSeasonFactor(double seasonFactor) { this.seasonFactor = seasonFactor; }
    public double getChangePercent() { return changePercent; }
    public void setChangePercent(double changePercent) { this.changePercent = changePercent; }
    public String getTrend() { return trend; }
    public void setTrend(String trend) { this.trend = trend; }
    public boolean isPeak() { return peak; }
    public void setPeak(boolean peak) { this.peak = peak; }
    public int getAvailableSeats() { return availableSeats; }
    public void setAvailableSeats(int availableSeats) { this.availableSeats = availableSeats; }
    public String getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(String lastUpdated) { this.lastUpdated = lastUpdated; }
    public List<PricePoint> getHistory() { return history; }
    public void setHistory(List<PricePoint> history) { this.history = history; }
}
