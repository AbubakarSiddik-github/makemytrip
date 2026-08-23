package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.models.DynamicPrice;
import com.makemytrip.makemytrip.models.PriceFreeze;
import com.makemytrip.makemytrip.services.PricingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pricing")
@CrossOrigin(origins = "*")
public class PricingController {

    @Autowired
    private PricingService pricingService;

    @GetMapping
    public List<DynamicPrice> getAll() {
        return pricingService.getAll();
    }

    @GetMapping("/{flightId}")
    public DynamicPrice get(@PathVariable String flightId) {
        return pricingService.get(flightId);
    }

    @PostMapping("/freeze")
    public ResponseEntity<PriceFreeze> freeze(@RequestParam String userId, @RequestParam String flightId) {
        PriceFreeze fz = pricingService.freeze(userId, flightId);
        if (fz == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(fz);
    }

    @GetMapping("/freeze/{userId}")
    public List<PriceFreeze> freezes(@PathVariable String userId) {
        return pricingService.getActiveFreezes(userId);
    }
}
