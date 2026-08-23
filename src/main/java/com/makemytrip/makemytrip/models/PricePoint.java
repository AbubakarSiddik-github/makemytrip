package com.makemytrip.makemytrip.models;

public class PricePoint {
    private String time;
    private double price;

    public PricePoint() {}

    public PricePoint(String time, double price) {
        this.time = time;
        this.price = price;
    }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
}
