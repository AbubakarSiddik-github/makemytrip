package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.models.FlightStatus;
import com.makemytrip.makemytrip.services.FlightStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/flight-status")
@CrossOrigin(origins = "*")
public class FlightStatusController {

    @Autowired
    private FlightStatusService flightStatusService;

    @GetMapping
    public List<FlightStatus> getAllStatuses() {
        return flightStatusService.getAll();
    }

    @GetMapping("/{flightId}")
    public FlightStatus getStatus(@PathVariable String flightId) {
        return flightStatusService.get(flightId);
    }
}
