package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.*;
import com.makemytrip.makemytrip.repositories.FlightRepository;
import com.makemytrip.makemytrip.repositories.HotelRepository;
import com.makemytrip.makemytrip.repositories.RecFeedbackRepository;
import com.makemytrip.makemytrip.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    @Autowired private UserRepository userRepository;
    @Autowired private FlightRepository flightRepository;
    @Autowired private HotelRepository hotelRepository;
    @Autowired private RecFeedbackRepository feedbackRepository;

    private static final Map<String, List<String>> CITY_TAGS = new HashMap<>();
    static {
        CITY_TAGS.put("Goa", Arrays.asList("beach"));
        CITY_TAGS.put("Mumbai", Arrays.asList("city", "beach"));
        CITY_TAGS.put("Chennai", Arrays.asList("city", "beach"));
        CITY_TAGS.put("Kochi", Arrays.asList("beach", "backwater"));
        CITY_TAGS.put("Shimla", Arrays.asList("hill"));
        CITY_TAGS.put("Srinagar", Arrays.asList("hill"));
        CITY_TAGS.put("Jaipur", Arrays.asList("heritage"));
        CITY_TAGS.put("Delhi", Arrays.asList("city", "heritage"));
        CITY_TAGS.put("Bengaluru", Arrays.asList("city"));
        CITY_TAGS.put("Hyderabad", Arrays.asList("city", "heritage"));
        CITY_TAGS.put("Kolkata", Arrays.asList("city", "heritage"));
    }

    private static class Dest {
        String name, tag, image, blurb;
        Dest(String n, String t, String i, String b) { name = n; tag = t; image = i; blurb = b; }
    }

    private static final List<Dest> DESTINATIONS = Arrays.asList(
        new Dest("Bali", "beach", "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800", "Island beaches & temples"),
        new Dest("Maldives", "beach", "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800", "Overwater villas & lagoons"),
        new Dest("Andaman Islands", "beach", "https://images.unsplash.com/photo-1589979481223-deb893043163?auto=format&fit=crop&w=800", "Pristine beaches & diving"),
        new Dest("Manali", "hill", "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800", "Snow peaks & adventure"),
        new Dest("Munnar", "hill", "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800", "Tea gardens & misty hills"),
        new Dest("Darjeeling", "hill", "https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?auto=format&fit=crop&w=800", "Himalayan views & toy train"),
        new Dest("Udaipur", "heritage", "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800", "City of lakes & palaces"),
        new Dest("Agra", "heritage", "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800", "Taj Mahal & Mughal heritage"),
        new Dest("Dubai", "city", "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800", "Skyscrapers & luxury shopping"),
        new Dest("Singapore", "city", "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800", "Gardens, food & city life")
    );

    private static final String[] TREND_REASONS = {
        "Trending now - popular with travelers this week.",
        "Great value fare on a popular route.",
        "Frequently booked by travelers like you.",
        "Top pick - one of our best-selling routes.",
        "Hot deal - limited seats left at this price.",
        "Popular this season - book before it fills up."
    };

    public List<Recommendation> generate(String userId) {
        Users user = (userId != null && !userId.isEmpty())
                ? userRepository.findById(userId).orElse(null) : null;

        Set<String> dismissed = new HashSet<>();
        Set<String> helpfulTags = new HashSet<>();
        if (userId != null && !userId.isEmpty()) {
            for (RecFeedback fb : feedbackRepository.findByUserId(userId)) {
                if (!fb.isHelpful()) {
                    dismissed.add(fb.getRecKey());
                } else if (fb.getTag() != null) {
                    helpfulTags.add(fb.getTag());
                }
            }
        }

        Map<String, Integer> tagCounts = new HashMap<>();
        Set<String> bookedCities = new HashSet<>();
        Set<String> bookedItemKeys = new HashSet<>();
        if (user != null && user.getBookings() != null) {
            for (Users.Booking b : user.getBookings()) {
                if ("CANCELLED".equals(b.getStatus())) continue;
                String city = null;
                if ("Flight".equalsIgnoreCase(b.getType())) {
                    Flight f = flightRepository.findById(b.getBookingId()).orElse(null);
                    if (f != null) { city = f.getTo(); bookedItemKeys.add("flight:" + f.getId()); }
                } else if ("Hotel".equalsIgnoreCase(b.getType())) {
                    Hotel h = hotelRepository.findById(b.getBookingId()).orElse(null);
                    if (h != null) { city = h.getLocation(); bookedItemKeys.add("hotel:" + h.getId()); }
                }
                if (city != null) {
                    bookedCities.add(city);
                    for (String tag : CITY_TAGS.getOrDefault(city, Collections.emptyList())) {
                        tagCounts.merge(tag, 1, Integer::sum);
                    }
                }
            }
        }

        boolean coldStart = tagCounts.isEmpty();
        List<Recommendation> recs = new ArrayList<>();
        List<String> prefTags = tagCounts.entrySet().stream()
                .sorted((a, b) -> b.getValue() - a.getValue())
                .map(Map.Entry::getKey).collect(Collectors.toList());

        // 1) Content-based destination discovery
        if (!coldStart) {
            for (String tag : prefTags) {
                for (Dest d : DESTINATIONS) {
                    if (!d.tag.equals(tag) || bookedCities.contains(d.name)) continue;
                    String key = "dest:" + d.name;
                    if (dismissed.contains(key)) continue;
                    Recommendation r = base(key, "destination", d.name, d.name, d.blurb);
                    r.setImage(d.image);
                    r.setTags(Arrays.asList(tag));
                    r.setReason("You liked " + tag + " destinations! Try " + d.name + ".");
                    r.setScore(6 + tagCounts.getOrDefault(tag, 0));
                    recs.add(r);
                }
            }
        }

        // 2) Content-based bookable flights/hotels matching preferred tags
        if (!coldStart) {
            for (Flight f : flightRepository.findAll()) {
                String key = "flight:" + f.getId();
                if (bookedItemKeys.contains(key) || dismissed.contains(key)) continue;
                List<String> ctags = CITY_TAGS.getOrDefault(f.getTo(), Collections.emptyList());
                int match = 0; String mt = null;
                for (String t : ctags) if (tagCounts.containsKey(t)) { match += tagCounts.get(t); if (mt == null) mt = t; }
                if (match > 0) {
                    Recommendation r = base(key, "flight", f.getId(),
                            f.getFlightName() + " to " + f.getTo(), f.getFrom() + " to " + f.getTo());
                    r.setPrice(f.getPrice()); r.setTags(ctags);
                    r.setReason("Because you enjoy " + mt + " trips like " + f.getTo() + ".");
                    r.setScore(4 + match);
                    recs.add(r);
                }
            }
            for (Hotel h : hotelRepository.findAll()) {
                String key = "hotel:" + h.getId();
                if (bookedItemKeys.contains(key) || dismissed.contains(key)) continue;
                List<String> ctags = CITY_TAGS.getOrDefault(h.getLocation(), Collections.emptyList());
                int match = 0; String mt = null;
                for (String t : ctags) if (tagCounts.containsKey(t)) { match += tagCounts.get(t); if (mt == null) mt = t; }
                if (match > 0) {
                    Recommendation r = base(key, "hotel", h.getId(), h.gethotelName(), h.getLocation());
                    r.setPrice(h.getPricePerNight()); r.setTags(ctags);
                    r.setReason("A " + mt + " stay in " + h.getLocation() + ", matching your taste.");
                    r.setScore(4 + match);
                    recs.add(r);
                }
            }
        }

        // 3) Collaborative filtering: users who share destinations with you
        if (user != null && !bookedCities.isEmpty()) {
            Map<String, Integer> cfScore = new HashMap<>();
            Map<String, Object[]> cfItem = new HashMap<>();
            for (Users other : userRepository.findAll()) {
                if (other.getId() != null && other.getId().equals(userId)) continue;
                if (other.getBookings() == null) continue;
                Set<String> otherCities = new HashSet<>();
                for (Users.Booking b : other.getBookings()) {
                    if ("Flight".equalsIgnoreCase(b.getType())) {
                        Flight f = flightRepository.findById(b.getBookingId()).orElse(null);
                        if (f != null) otherCities.add(f.getTo());
                    } else if ("Hotel".equalsIgnoreCase(b.getType())) {
                        Hotel h = hotelRepository.findById(b.getBookingId()).orElse(null);
                        if (h != null) otherCities.add(h.getLocation());
                    }
                }
                int sim = 0;
                for (String c : otherCities) if (bookedCities.contains(c)) sim++;
                if (sim == 0) continue;
                for (Users.Booking b : other.getBookings()) {
                    if ("Flight".equalsIgnoreCase(b.getType())) {
                        Flight f = flightRepository.findById(b.getBookingId()).orElse(null);
                        if (f == null) continue;
                        String key = "flight:" + f.getId();
                        if (bookedItemKeys.contains(key) || dismissed.contains(key)) continue;
                        cfScore.merge(key, sim, Integer::sum);
                        cfItem.put(key, new Object[]{"flight", f});
                    } else if ("Hotel".equalsIgnoreCase(b.getType())) {
                        Hotel h = hotelRepository.findById(b.getBookingId()).orElse(null);
                        if (h == null) continue;
                        String key = "hotel:" + h.getId();
                        if (bookedItemKeys.contains(key) || dismissed.contains(key)) continue;
                        cfScore.merge(key, sim, Integer::sum);
                        cfItem.put(key, new Object[]{"hotel", h});
                    }
                }
            }
            for (Map.Entry<String, Integer> e : cfScore.entrySet()) {
                String key = e.getKey();
                if (recs.stream().anyMatch(r -> r.getRecKey().equals(key))) continue;
                Object[] it = cfItem.get(key);
                Recommendation r;
                if ("flight".equals(it[0])) {
                    Flight f = (Flight) it[1];
                    r = base(key, "flight", f.getId(), f.getFlightName() + " to " + f.getTo(), f.getFrom() + " to " + f.getTo());
                    r.setPrice(f.getPrice());
                } else {
                    Hotel h = (Hotel) it[1];
                    r = base(key, "hotel", h.getId(), h.gethotelName(), h.getLocation());
                    r.setPrice(h.getPricePerNight());
                }
                r.setReason("Travelers with similar taste also booked this.");
                r.setScore(3 + e.getValue());
                recs.add(r);
            }
        }

        // 4) Cold-start / fill with trending items and popular destinations
        if (coldStart || recs.size() < 4) {
            List<Flight> flights = new ArrayList<>(flightRepository.findAll());
            flights.sort(Comparator.comparingInt(Flight::getAvailableSeats));
            for (Flight f : flights) {
                String key = "flight:" + f.getId();
                if (bookedItemKeys.contains(key) || dismissed.contains(key)) continue;
                if (recs.stream().anyMatch(r -> r.getRecKey().equals(key))) continue;
                Recommendation r = base(key, "flight", f.getId(), f.getFlightName() + " to " + f.getTo(), f.getFrom() + " to " + f.getTo());
                r.setPrice(f.getPrice());
                r.setReason(TREND_REASONS[recs.size() % TREND_REASONS.length]);
                r.setScore(1);
                recs.add(r);
                if (recs.size() >= 8) break;
            }
            for (Dest d : DESTINATIONS) {
                String key = "dest:" + d.name;
                if (dismissed.contains(key)) continue;
                if (recs.stream().anyMatch(r -> r.getRecKey().equals(key))) continue;
                Recommendation r = base(key, "destination", d.name, d.name, d.blurb);
                r.setImage(d.image);
                r.setTags(Arrays.asList(d.tag));
                r.setReason("A popular destination to explore.");
                r.setScore(0.5);
                recs.add(r);
                if (recs.size() >= 10) break;
            }
        }

        // Feedback loop: boost recommendations matching tags the user liked
        if (!helpfulTags.isEmpty()) {
            for (Recommendation r : recs) {
                if (r.getTags() != null) {
                    for (String t : r.getTags()) {
                        if (helpfulTags.contains(t)) { r.setScore(r.getScore() + 3); break; }
                    }
                }
            }
        }

        recs.sort((a, b) -> Double.compare(b.getScore(), a.getScore()));
        return recs.stream().limit(10).collect(Collectors.toList());
    }

    private Recommendation base(String key, String type, String refId, String title, String subtitle) {
        Recommendation r = new Recommendation();
        r.setRecKey(key); r.setType(type); r.setRefId(refId);
        r.setTitle(title); r.setSubtitle(subtitle);
        return r;
    }

    public void recordFeedback(String userId, String recKey, String tag, boolean helpful) {
        RecFeedback fb = new RecFeedback();
        fb.setUserId(userId);
        fb.setRecKey(recKey);
        fb.setTag(tag);
        fb.setHelpful(helpful);
        fb.setCreatedAt(LocalDateTime.now().toString());
        feedbackRepository.save(fb);
    }
}
