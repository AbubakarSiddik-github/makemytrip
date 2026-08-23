package com.makemytrip.makemytrip.config;

import com.makemytrip.makemytrip.models.Flight;
import com.makemytrip.makemytrip.models.Hotel;
import com.makemytrip.makemytrip.repositories.FlightRepository;
import com.makemytrip.makemytrip.repositories.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Override
    public void run(String... args) {
        if (flightRepository.count() == 0) {
            flightRepository.save(makeFlight("IndiGo 6E-201", "Delhi", "Mumbai", "2026-09-01T08:00", "2026-09-01T10:10", 5200, 60));
            flightRepository.save(makeFlight("Air India AI-540", "Mumbai", "Bengaluru", "2026-09-02T09:30", "2026-09-02T11:15", 4800, 45));
            flightRepository.save(makeFlight("Vistara UK-810", "Bengaluru", "Delhi", "2026-09-03T14:00", "2026-09-03T16:45", 6100, 50));
            flightRepository.save(makeFlight("SpiceJet SG-123", "Delhi", "Kolkata", "2026-09-04T18:20", "2026-09-04T20:40", 5600, 40));
            flightRepository.save(makeFlight("IndiGo 6E-333", "Chennai", "Hyderabad", "2026-09-05T07:00", "2026-09-05T08:20", 3900, 70));
            flightRepository.save(makeFlight("Air India AI-670", "Mumbai", "Goa", "2026-09-06T12:00", "2026-09-06T13:10", 4200, 55));
            System.out.println(">>> Sample flights added");
        } else {
            System.out.println(">>> Flights already present, skipping seed");
        }

        if (hotelRepository.count() == 0) {
            hotelRepository.save(makeHotel("The Grand Palace", "Mumbai", 15000, 20, "WiFi, Pool, Spa, Restaurant"));
            hotelRepository.save(makeHotel("Comfort Inn", "Delhi", 8000, 30, "WiFi, Breakfast, Parking"));
            hotelRepository.save(makeHotel("Seaside Resort", "Goa", 12000, 15, "Beach View, Pool, Bar"));
            hotelRepository.save(makeHotel("Green Valley Hotel", "Bengaluru", 9500, 25, "WiFi, Gym, Restaurant"));
            hotelRepository.save(makeHotel("Pearl Residency", "Hyderabad", 7000, 35, "WiFi, Breakfast, AC"));
            hotelRepository.save(makeHotel("Marina Bay Hotel", "Chennai", 8500, 22, "Sea View, Pool, WiFi"));
            System.out.println(">>> Sample hotels added");
        } else {
            System.out.println(">>> Hotels already present, skipping seed");
        }
    }

    private Flight makeFlight(String name, String from, String to, String dep, String arr, double price, int seats) {
        Flight f = new Flight();
        f.setFlightName(name);
        f.setFrom(from);
        f.setTo(to);
        f.setDepartureTime(dep);
        f.setArrivalTime(arr);
        f.setPrice(price);
        f.setAvailableSeats(seats);
        return f;
    }

    private Hotel makeHotel(String name, String location, double price, int rooms, String amenities) {
        Hotel h = new Hotel();
        h.sethotelName(name);
        h.setLocation(location);
        h.setPricePerNight(price);
        h.setAvailableRooms(rooms);
        h.setamenities(amenities);
        return h;
    }
}
