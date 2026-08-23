package com.makemytrip.makemytrip.services;
import com.makemytrip.makemytrip.models.Users;
import com.makemytrip.makemytrip.models.Users.Booking;
import com.makemytrip.makemytrip.models.Flight;
import com.makemytrip.makemytrip.models.Hotel;
import com.makemytrip.makemytrip.repositories.UserRepository;
import com.makemytrip.makemytrip.repositories.FlightRepository;
import com.makemytrip.makemytrip.repositories.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private HotelRepository hotelRepository;

    public Booking bookFlight(String userId,String flightId,int seats,double price){
        Optional<Users> usersOptional =userRepository.findById(userId);
        Optional<Flight> flightOptional =flightRepository.findById(flightId);
        if(usersOptional.isPresent() && flightOptional.isPresent()){
            Users user=usersOptional.get();
            Flight flight=flightOptional.get();
            if(flight.getAvailableSeats() >= seats){
                flight.setAvailableSeats(flight.getAvailableSeats()- seats);
                flightRepository.save(flight);

                Booking booking=new Booking();
                booking.setType("Flight");
                booking.setBookingId(flightId);
                booking.setDate(LocalDate.now().toString());
                booking.setBookedAt(LocalDateTime.now().toString());
                booking.setStatus("BOOKED");
                booking.setQuantity(seats);
                booking.setTotalPrice(price);
                user.getBookings().add(booking);
                userRepository.save(user);
                return booking;
            }else {
                throw new RuntimeException("Not enough seats available");
            }
        }
        throw new RuntimeException("User or flight not found");
    }
    public Booking bookhotel(String userId,String hotelId,int rooms,double price){
        Optional<Users> usersOptional =userRepository.findById(userId);
        Optional<Hotel> hotelOptional = hotelRepository.findById(hotelId);
        if(usersOptional.isPresent() && hotelOptional.isPresent()){
            Users user=usersOptional.get();
            Hotel hotel=hotelOptional.get();
            if(hotel.getAvailableRooms() >= rooms){
                hotel.setAvailableRooms(hotel.getAvailableRooms()- rooms);
                hotelRepository.save(hotel);

                Booking booking=new Booking();
                booking.setType("Hotel");
                booking.setBookingId(hotelId);
                booking.setDate(LocalDate.now().toString());
                booking.setBookedAt(LocalDateTime.now().toString());
                booking.setStatus("BOOKED");
                booking.setQuantity(rooms);
                booking.setTotalPrice(price);
                user.getBookings().add(booking);
                userRepository.save(user);
                return booking;
            }else {
                throw new RuntimeException("Not enough rooms available");
            }
        }
        throw new RuntimeException("User or flight not found");
    }

    public Users cancelBooking(String userId, int index, String reason) {
        Optional<Users> usersOptional = userRepository.findById(userId);
        if (usersOptional.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        Users user = usersOptional.get();
        List<Booking> bookings = user.getBookings();
        if (index < 0 || index >= bookings.size()) {
            throw new RuntimeException("Invalid booking index");
        }
        Booking b = bookings.get(index);
        if ("CANCELLED".equals(b.getStatus())) {
            throw new RuntimeException("Booking already cancelled");
        }
        int percent = withinFreeWindow(b) ? 50 : 25;
        double refund = Math.round(b.getTotalPrice() * percent / 100.0);
        b.setStatus("CANCELLED");
        b.setCancellationReason(reason);
        b.setCancelledAt(LocalDateTime.now().toString());
        b.setRefundPercent(percent);
        b.setRefundAmount(refund);
        b.setRefundStatus("PENDING");
        restoreInventory(b);
        userRepository.save(user);
        return user;
    }

    private boolean withinFreeWindow(Booking b) {
        try {
            String ts = b.getBookedAt();
            LocalDateTime booked;
            if (ts != null && ts.contains("T")) {
                booked = LocalDateTime.parse(ts);
            } else if (b.getDate() != null) {
                booked = LocalDate.parse(b.getDate()).atStartOfDay();
            } else {
                return true;
            }
            return Duration.between(booked, LocalDateTime.now()).toHours() < 24;
        } catch (Exception e) {
            return true;
        }
    }

    private void restoreInventory(Booking b) {
        try {
            if ("Flight".equalsIgnoreCase(b.getType())) {
                flightRepository.findById(b.getBookingId()).ifPresent(f -> {
                    f.setAvailableSeats(f.getAvailableSeats() + b.getQuantity());
                    flightRepository.save(f);
                });
            } else if ("Hotel".equalsIgnoreCase(b.getType())) {
                hotelRepository.findById(b.getBookingId()).ifPresent(h -> {
                    h.setAvailableRooms(h.getAvailableRooms() + b.getQuantity());
                    hotelRepository.save(h);
                });
            }
        } catch (Exception ignored) {
        }
    }
}
