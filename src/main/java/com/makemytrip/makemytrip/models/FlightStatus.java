package com.makemytrip.makemytrip.models;

public class FlightStatus {
    private String flightId;
    private String flightName;
    private String from;
    private String to;
    private String status;            // On Time, Delayed, Boarding, In Air, Arrived
    private int delayMinutes;
    private String reason;
    private String gate;
    private String scheduledDeparture;
    private String estimatedDeparture;
    private String scheduledArrival;
    private String estimatedArrival;
    private String lastUpdated;

    public String getFlightId() { return flightId; }
    public void setFlightId(String flightId) { this.flightId = flightId; }
    public String getFlightName() { return flightName; }
    public void setFlightName(String flightName) { this.flightName = flightName; }
    public String getFrom() { return from; }
    public void setFrom(String from) { this.from = from; }
    public String getTo() { return to; }
    public void setTo(String to) { this.to = to; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public int getDelayMinutes() { return delayMinutes; }
    public void setDelayMinutes(int delayMinutes) { this.delayMinutes = delayMinutes; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public String getGate() { return gate; }
    public void setGate(String gate) { this.gate = gate; }
    public String getScheduledDeparture() { return scheduledDeparture; }
    public void setScheduledDeparture(String scheduledDeparture) { this.scheduledDeparture = scheduledDeparture; }
    public String getEstimatedDeparture() { return estimatedDeparture; }
    public void setEstimatedDeparture(String estimatedDeparture) { this.estimatedDeparture = estimatedDeparture; }
    public String getScheduledArrival() { return scheduledArrival; }
    public void setScheduledArrival(String scheduledArrival) { this.scheduledArrival = scheduledArrival; }
    public String getEstimatedArrival() { return estimatedArrival; }
    public void setEstimatedArrival(String estimatedArrival) { this.estimatedArrival = estimatedArrival; }
    public String getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(String lastUpdated) { this.lastUpdated = lastUpdated; }
}
