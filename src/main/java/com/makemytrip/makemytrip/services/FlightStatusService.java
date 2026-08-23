package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.Flight;
import com.makemytrip.makemytrip.models.FlightStatus;
import com.makemytrip.makemytrip.repositories.FlightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class FlightStatusService {

    @Autowired
    private FlightRepository flightRepository;

    private final Map<String, FlightStatus> statuses = new ConcurrentHashMap<>();
    private final Random random = new Random();
    private boolean initialized = false;

    private final String[] delayReasons = {
            "Bad weather at destination",
            "Air traffic congestion",
            "Late arrival of incoming aircraft",
            "Technical inspection in progress",
            "Runway congestion at departure",
            "Operational reasons"
    };
    private final String[] gates = {"A1", "A2", "B3", "B4", "C5", "C6", "D7"};

    private synchronized void initIfNeeded() {
        if (initialized) {
            return;
        }
        List<Flight> flights = flightRepository.findAll();
        if (flights.isEmpty()) {
            return; // no flights yet, retry on next call/tick
        }
        for (Flight f : flights) {
            statuses.put(f.getId(), createInitial(f));
        }
        initialized = true;
    }

    private FlightStatus createInitial(Flight f) {
        FlightStatus s = new FlightStatus();
        s.setFlightId(f.getId());
        s.setFlightName(f.getFlightName());
        s.setFrom(f.getFrom());
        s.setTo(f.getTo());
        LocalDateTime dep = LocalDateTime.now().plusMinutes(15 + random.nextInt(120));
        LocalDateTime arr = dep.plusMinutes(60 + random.nextInt(150));
        s.setScheduledDeparture(dep.toString());
        s.setScheduledArrival(arr.toString());
        s.setDelayMinutes(0);
        s.setReason("");
        s.setStatus("On Time");
        s.setGate(gates[random.nextInt(gates.length)]);
        recompute(s);
        return s;
    }

    private void recompute(FlightStatus s) {
        LocalDateTime schedDep = LocalDateTime.parse(s.getScheduledDeparture());
        LocalDateTime schedArr = LocalDateTime.parse(s.getScheduledArrival());
        s.setEstimatedDeparture(schedDep.plusMinutes(s.getDelayMinutes()).toString());
        s.setEstimatedArrival(schedArr.plusMinutes(s.getDelayMinutes()).toString());
        s.setLastUpdated(LocalDateTime.now().toString());
    }

    // Simulate real-time updates every 15 seconds
    @Scheduled(fixedRate = 15000)
    public void tick() {
        initIfNeeded();
        if (!initialized) {
            return;
        }
        LocalDateTime now = LocalDateTime.now();
        for (FlightStatus s : statuses.values()) {
            if ("Arrived".equals(s.getStatus())) {
                continue;
            }
            boolean beforeDeparture = "On Time".equals(s.getStatus())
                    || "Delayed".equals(s.getStatus())
                    || "Boarding".equals(s.getStatus());
            // Occasionally introduce a new delay with a reason
            if (beforeDeparture && random.nextInt(100) < 25) {
                s.setDelayMinutes(s.getDelayMinutes() + (15 + random.nextInt(45)));
                s.setReason(delayReasons[random.nextInt(delayReasons.length)]);
            }
            recompute(s);

            LocalDateTime estDep = LocalDateTime.parse(s.getEstimatedDeparture());
            LocalDateTime estArr = LocalDateTime.parse(s.getEstimatedArrival());

            if (now.isAfter(estArr)) {
                s.setStatus("Arrived");
            } else if (now.isAfter(estDep)) {
                s.setStatus("In Air");
            } else if (now.isAfter(estDep.minusMinutes(30))) {
                s.setStatus("Boarding");
            } else if (s.getDelayMinutes() > 0) {
                s.setStatus("Delayed");
            } else {
                s.setStatus("On Time");
            }
        }
    }

    public List<FlightStatus> getAll() {
        initIfNeeded();
        return new ArrayList<>(statuses.values());
    }

    public FlightStatus get(String flightId) {
        initIfNeeded();
        return statuses.get(flightId);
    }
}
