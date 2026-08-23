package com.makemytrip.makemytrip.config;

import com.makemytrip.makemytrip.models.Flight;
import com.makemytrip.makemytrip.models.Hotel;
import com.makemytrip.makemytrip.repositories.FlightRepository;
import com.makemytrip.makemytrip.repositories.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Override
    public void run(String... args) {
        seedFlights();
        seedHotels();
    }

    private void seedFlights() {
        Set<String> existing = new HashSet<>();
        for (Flight f : flightRepository.findAll()) {
            existing.add(f.getFlightName());
        }
        String[][] data = {
            {"IndiGo 6E-201", "Delhi", "Mumbai", "2026-09-01T08:00", "2026-09-01T10:10", "5200", "60"},
            {"Air India AI-101", "Delhi", "Mumbai", "2026-09-01T13:30", "2026-09-01T15:40", "6100", "40"},
            {"Vistara UK-955", "Delhi", "Mumbai", "2026-09-01T19:00", "2026-09-01T21:15", "6800", "35"},
            {"SpiceJet SG-8155", "Mumbai", "Delhi", "2026-09-02T07:15", "2026-09-02T09:25", "4900", "55"},
            {"IndiGo 6E-5388", "Mumbai", "Delhi", "2026-09-02T17:45", "2026-09-02T19:55", "5300", "48"},
            {"Air India AI-540", "Mumbai", "Bengaluru", "2026-09-02T09:30", "2026-09-02T11:15", "4800", "45"},
            {"IndiGo 6E-6178", "Mumbai", "Bengaluru", "2026-09-02T15:00", "2026-09-02T16:45", "4500", "50"},
            {"Vistara UK-864", "Bengaluru", "Mumbai", "2026-09-03T10:20", "2026-09-03T12:05", "5000", "42"},
            {"Vistara UK-810", "Bengaluru", "Delhi", "2026-09-03T14:00", "2026-09-03T16:45", "6100", "50"},
            {"IndiGo 6E-2043", "Bengaluru", "Delhi", "2026-09-03T20:30", "2026-09-03T23:10", "5900", "38"},
            {"Air India AI-803", "Delhi", "Bengaluru", "2026-09-04T06:45", "2026-09-04T09:25", "6200", "44"},
            {"SpiceJet SG-123", "Delhi", "Kolkata", "2026-09-04T18:20", "2026-09-04T20:40", "5600", "40"},
            {"IndiGo 6E-455", "Delhi", "Kolkata", "2026-09-04T11:10", "2026-09-04T13:30", "5400", "52"},
            {"Vistara UK-707", "Kolkata", "Delhi", "2026-09-05T08:30", "2026-09-05T10:55", "5700", "46"},
            {"IndiGo 6E-333", "Chennai", "Hyderabad", "2026-09-05T07:00", "2026-09-05T08:20", "3900", "70"},
            {"Air India AI-559", "Chennai", "Hyderabad", "2026-09-05T18:15", "2026-09-05T19:35", "4100", "58"},
            {"SpiceJet SG-401", "Hyderabad", "Chennai", "2026-09-06T09:40", "2026-09-06T11:00", "3800", "62"},
            {"Air India AI-670", "Mumbai", "Goa", "2026-09-06T12:00", "2026-09-06T13:10", "4200", "55"},
            {"IndiGo 6E-297", "Mumbai", "Goa", "2026-09-06T16:30", "2026-09-06T17:40", "3990", "60"},
            {"Vistara UK-771", "Goa", "Mumbai", "2026-09-07T19:00", "2026-09-07T20:10", "4300", "48"},
            {"IndiGo 6E-2011", "Delhi", "Jaipur", "2026-09-07T09:00", "2026-09-07T10:00", "3200", "66"},
            {"SpiceJet SG-2960", "Jaipur", "Delhi", "2026-09-08T18:30", "2026-09-08T19:30", "3300", "58"},
            {"Vistara UK-996", "Pune", "Delhi", "2026-09-08T07:20", "2026-09-08T09:35", "5500", "40"},
            {"IndiGo 6E-712", "Chennai", "Bengaluru", "2026-09-09T10:15", "2026-09-09T11:20", "3600", "64"},
            {"Air India AI-503", "Kochi", "Bengaluru", "2026-09-09T14:45", "2026-09-09T16:00", "4000", "50"},
            {"IndiGo 6E-6511", "Hyderabad", "Delhi", "2026-09-10T06:30", "2026-09-10T08:45", "5800", "47"}
        };
        int added = 0;
        for (String[] d : data) {
            if (existing.contains(d[0])) continue;
            Flight f = new Flight();
            f.setFlightName(d[0]);
            f.setFrom(d[1]);
            f.setTo(d[2]);
            f.setDepartureTime(d[3]);
            f.setArrivalTime(d[4]);
            f.setPrice(Double.parseDouble(d[5]));
            f.setAvailableSeats(Integer.parseInt(d[6]));
            flightRepository.save(f);
            added++;
        }
        System.out.println(">>> Flights added this run: " + added);
    }

    private void seedHotels() {
        Set<String> existing = new HashSet<>();
        for (Hotel h : hotelRepository.findAll()) {
            existing.add(h.gethotelName());
        }
        String[][] data = {
            {"The Grand Palace", "Mumbai", "15000", "20", "WiFi, Pool, Spa, Restaurant"},
            {"Sea Crest Hotel", "Mumbai", "9800", "28", "Sea View, WiFi, Gym"},
            {"Comfort Inn", "Delhi", "8000", "30", "WiFi, Breakfast, Parking"},
            {"Imperial Residency", "Delhi", "13500", "18", "WiFi, Pool, Fine Dining"},
            {"Seaside Resort", "Goa", "12000", "15", "Beach View, Pool, Bar"},
            {"Beach Bay Villa", "Goa", "16500", "10", "Private Beach, Pool, Butler"},
            {"Green Valley Hotel", "Bengaluru", "9500", "25", "WiFi, Gym, Restaurant"},
            {"Tech Park Suites", "Bengaluru", "7600", "34", "WiFi, Workspace, Breakfast"},
            {"Pearl Residency", "Hyderabad", "7000", "35", "WiFi, Breakfast, AC"},
            {"Marina Bay Hotel", "Chennai", "8500", "22", "Sea View, Pool, WiFi"},
            {"Heritage Haveli", "Jaipur", "11000", "16", "Heritage, Pool, Cultural Shows"},
            {"Hill Crest Inn", "Shimla", "8800", "20", "Mountain View, Heater, Cafe"}
        };
        int added = 0;
        for (String[] d : data) {
            if (existing.contains(d[0])) continue;
            Hotel h = new Hotel();
            h.sethotelName(d[0]);
            h.setLocation(d[1]);
            h.setPricePerNight(Double.parseDouble(d[2]));
            h.setAvailableRooms(Integer.parseInt(d[3]));
            h.setamenities(d[4]);
            hotelRepository.save(h);
            added++;
        }
        System.out.println(">>> Hotels added this run: " + added);
    }
}
