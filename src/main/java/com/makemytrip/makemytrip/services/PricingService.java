package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.DynamicPrice;
import com.makemytrip.makemytrip.models.Flight;
import com.makemytrip.makemytrip.models.PriceFreeze;
import com.makemytrip.makemytrip.models.PricePoint;
import com.makemytrip.makemytrip.repositories.FlightRepository;
import com.makemytrip.makemytrip.repositories.PriceFreezeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PricingService {

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private PriceFreezeRepository priceFreezeRepository;

    private final Map<String, DynamicPrice> prices = new ConcurrentHashMap<>();
    private final Random random = new Random();
    private boolean initialized = false;

    // Holidays / peak dates as MM-dd (prices +20% on these days)
    private final Set<String> holidays = new HashSet<>(Arrays.asList(
            "01-01", "01-26", "08-15", "10-02", "11-01", "12-25", "12-31"
    ));

    private synchronized void initIfNeeded() {
        if (initialized) {
            return;
        }
        List<Flight> flights = flightRepository.findAll();
        if (flights.isEmpty()) {
            return;
        }
        for (Flight f : flights) {
            prices.put(f.getId(), createInitial(f));
        }
        initialized = true;
    }

    private DynamicPrice createInitial(Flight f) {
        DynamicPrice p = new DynamicPrice();
        p.setFlightId(f.getId());
        p.setFlightName(f.getFlightName());
        p.setFrom(f.getFrom());
        p.setTo(f.getTo());
        p.setBasePrice(f.getPrice());
        p.setAvailableSeats(f.getAvailableSeats());

        // Seed history with ~12 past points so the graph is not empty
        List<PricePoint> hist = new ArrayList<>();
        LocalDateTime t = LocalDateTime.now().minusHours(12);
        for (int i = 0; i < 12; i++) {
            double factor = 0.9 + random.nextDouble() * 0.35;
            double val = Math.round((f.getPrice() * factor) / 10.0) * 10;
            hist.add(new PricePoint(t.plusHours(i).toString(), val));
        }
        p.setHistory(hist);

        computeCurrent(p);
        return p;
    }

    private boolean isPeak() {
        LocalDate d = LocalDate.now();
        String md = String.format("%02d-%02d", d.getMonthValue(), d.getDayOfMonth());
        if (holidays.contains(md)) {
            return true;
        }
        DayOfWeek dow = d.getDayOfWeek();
        return dow == DayOfWeek.SATURDAY || dow == DayOfWeek.SUNDAY;
    }

    private void computeCurrent(DynamicPrice p) {
        double base = p.getBasePrice();
        int seats = p.getAvailableSeats();

        // Demand: fewer seats -> higher price
        double demand = seats < 20 ? 1.25 : seats < 40 ? 1.10 : 1.0;
        // Season / holiday: +20% on peak days
        boolean peak = isPeak();
        double season = peak ? 1.20 : 1.0;
        // Real-time market fluctuation
        double rt = 0.95 + random.nextDouble() * 0.15;

        double raw = base * demand * season * rt;
        double rounded = Math.round(raw / 10.0) * 10;

        double prev = p.getCurrentPrice();
        p.setDemandFactor(Math.round(demand * 100.0) / 100.0);
        p.setSeasonFactor(Math.round(season * 100.0) / 100.0);
        p.setPeak(peak);
        p.setCurrentPrice(rounded);
        p.setChangePercent(Math.round((rounded - base) / base * 1000.0) / 10.0);
        if (prev > 0) {
            p.setTrend(rounded > prev ? "up" : rounded < prev ? "down" : "stable");
        } else {
            p.setTrend("stable");
        }
        p.setLastUpdated(LocalDateTime.now().toString());
    }

    @Scheduled(fixedRate = 12000)
    public void tick() {
        initIfNeeded();
        if (!initialized) {
            return;
        }
        for (DynamicPrice p : prices.values()) {
            computeCurrent(p);
            List<PricePoint> h = p.getHistory();
            h.add(new PricePoint(LocalDateTime.now().toString(), p.getCurrentPrice()));
            while (h.size() > 40) {
                h.remove(0);
            }
        }
    }

    public List<DynamicPrice> getAll() {
        initIfNeeded();
        return new ArrayList<>(prices.values());
    }

    public DynamicPrice get(String flightId) {
        initIfNeeded();
        return prices.get(flightId);
    }

    public PriceFreeze freeze(String userId, String flightId) {
        initIfNeeded();
        DynamicPrice p = prices.get(flightId);
        if (p == null) {
            return null;
        }
        PriceFreeze fz = new PriceFreeze();
        fz.setUserId(userId);
        fz.setFlightId(flightId);
        fz.setFlightName(p.getFlightName());
        fz.setFrozenPrice(p.getCurrentPrice());
        LocalDateTime now = LocalDateTime.now();
        fz.setCreatedAt(now.toString());
        fz.setExpiresAt(now.plusMinutes(15).toString());
        return priceFreezeRepository.save(fz);
    }

    public List<PriceFreeze> getActiveFreezes(String userId) {
        List<PriceFreeze> all = priceFreezeRepository.findByUserId(userId);
        List<PriceFreeze> active = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        for (PriceFreeze fz : all) {
            try {
                if (LocalDateTime.parse(fz.getExpiresAt()).isAfter(now)) {
                    active.add(fz);
                }
            } catch (Exception ignored) {
            }
        }
        return active;
    }
}
