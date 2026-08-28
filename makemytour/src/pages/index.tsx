import { getflight, gethotel } from "@/api";
import { SearchSelect } from "@/components/SearchSelect";
import Recommendations from "@/components/Recommendations";
import FlashSaleBanner from "@/components/FlashSaleBanner";
import PickAVibe from "@/components/PickAVibe";
import DealsSection from "@/components/DealsSection";
import WishlistButton from "@/components/WishlistButton";
import RatingBadge from "@/components/RatingBadge";
import { Button } from "@/components/ui/button";
import {
  Bus,
  Calendar,
  Car,
  CreditCard,
  HomeIcon,
  Loader2,
  Hotel,
  MapPin,
  Plane,
  QrCode,
  Shield,
  Train,
  Umbrella,
  Users,
} from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

// Categories that search by From -> To
const FALLBACK_IMG =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='400' height='300' fill='%23bfdbfe'/></svg>";
const handleImgError = (e: any) => {
  e.currentTarget.onerror = null;
  e.currentTarget.src = FALLBACK_IMG;
};

const routeTypes = ["flights", "trains", "buses", "cabs"];
// Categories that search by a single City / Location
const cityTypes = ["hotels", "homestays", "holidays"];

// Frontend sample data for the categories the backend does not store
const sampleData: any = {
  trains: [
    { id: "t1", name: "Rajdhani Express", from: "Delhi", to: "Mumbai", departureTime: "16:55", arrivalTime: "08:15", price: 2200 },
    { id: "t2", name: "Shatabdi Express", from: "Bengaluru", to: "Chennai", departureTime: "06:00", arrivalTime: "11:00", price: 1200 },
    { id: "t3", name: "Duronto Express", from: "Kolkata", to: "Delhi", departureTime: "20:00", arrivalTime: "10:00", price: 1900 },
    { id: "t4", name: "Garib Rath Express", from: "Mumbai", to: "Goa", departureTime: "22:30", arrivalTime: "07:30", price: 900 },
  ],
  buses: [
    { id: "b1", name: "VRL Volvo AC Sleeper", from: "Bengaluru", to: "Hyderabad", departureTime: "21:00", price: 1100 },
    { id: "b2", name: "SRS Travels", from: "Chennai", to: "Bengaluru", departureTime: "23:00", price: 700 },
    { id: "b3", name: "Orange Tours", from: "Mumbai", to: "Pune", departureTime: "18:30", price: 450 },
    { id: "b4", name: "KSRTC Airavat", from: "Bengaluru", to: "Goa", departureTime: "20:00", price: 950 },
  ],
  cabs: [
    { id: "c1", name: "Sedan - Swift Dzire", from: "Delhi", to: "Airport", price: 600 },
    { id: "c2", name: "SUV - Toyota Innova", from: "Bengaluru", to: "Mysuru", price: 3200 },
    { id: "c3", name: "Hatchback - WagonR", from: "Mumbai", to: "Pune", price: 2800 },
    { id: "c4", name: "Luxury - Toyota Camry", from: "Hyderabad", to: "Airport", price: 1500 },
  ],
  homestays: [
    { id: "h1", name: "Cozy Hill Cottage", location: "Shimla", pricePerNight: 3500 },
    { id: "h2", name: "Beachside Villa", location: "Goa", pricePerNight: 6000 },
    { id: "h3", name: "Heritage Haveli", location: "Jaipur", pricePerNight: 2800 },
    { id: "h4", name: "Backwater Retreat", location: "Kochi", pricePerNight: 4200 },
  ],
  holidays: [
    { id: "p1", name: "Goa Beach Package (3N/4D)", location: "Goa", price: 18000 },
    { id: "p2", name: "Kashmir Valley Tour (5N/6D)", location: "Srinagar", price: 32000 },
    { id: "p3", name: "Kerala Backwaters (4N/5D)", location: "Kochi", price: 26000 },
    { id: "p4", name: "Rajasthan Heritage (6N/7D)", location: "Jaipur", price: 35000 },
  ],
  forex: [
    { id: "f1", name: "USD - US Dollar", price: 88 },
    { id: "f2", name: "EUR - Euro", price: 95 },
    { id: "f3", name: "GBP - British Pound", price: 112 },
    { id: "f4", name: "AED - UAE Dirham", price: 24 },
  ],
  insurance: [
    { id: "i1", name: "Domestic Travel Insurance", price: 299 },
    { id: "i2", name: "International Travel Insurance", price: 1499 },
    { id: "i3", name: "Family Floater Plan", price: 2499 },
    { id: "i4", name: "Student Travel Plan", price: 999 },
  ],
};

export default function Home() {
  const [bookingtype, setbookingtype] = useState("flights");
  const [from, setfrom] = useState("");
  const [to, setto] = useState("");
  const [date, setdate] = useState("");
  const [travelers, settravelers] = useState(1);
  const [searchresults, setsearchresult] = useState<any[]>([]);
  const [hotel, sethotel] = useState<any[]>([]);
  const [loading, setloading] = useState(true);
  const [flight, setflight] = useState<any[]>([]);
  const [searched, setsearched] = useState(false);
  const [tripType, setTripType] = useState("round");
  const user = useSelector((state: any) => state.user.user);
  const router = useRouter();

  const offers = [
    {
      title: "Domestic Flights",
      description: "Get up to 20% off on domestic flights",
      imageUrl:
        "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800",
      type: "flights",
    },
    {
      title: "International Hotels",
      description: "Book luxury hotels worldwide",
      imageUrl:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800",
      type: "hotels",
    },
    {
      title: "Holiday Packages",
      description: "Exclusive deals on holiday packages",
      imageUrl:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800",
      type: "holidays",
    },
  ];

  const collections = [
    {
      title: "Stays in & Around Delhi",
      imageUrl:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800",
      tag: "TOP 8",
    },
    {
      title: "Stays in & Around Mumbai",
      imageUrl:
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800",
      tag: "TOP 8",
    },
    {
      title: "Stays in & Around Bangalore",
      imageUrl:
        "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800",
      tag: "TOP 9",
    },
    {
      title: "Beach Destinations",
      imageUrl:
        "https://images.unsplash.com/photo-1520454974749-611b7248ffdb?auto=format&fit=crop&w=800",
      tag: "TOP 11",
    },
  ];

  const wonders = [
    {
      title: "Shimla's Best Kept Secret",
      imageUrl:
        "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800",
    },
    {
      title: "Tamil Nadu's Charming Hill Town",
      imageUrl:
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800",
    },
    {
      title: "Quaint Little Hill Station in Gujarat",
      imageUrl:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800",
    },
    {
      title: "A pleasant summer retreat",
      imageUrl:
        "https://images.unsplash.com/photo-1593181629936-11c609b8db9b?auto=format&fit=crop&w=800",
    },
  ];

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const data = await gethotel();
        sethotel(Array.isArray(data) ? data : []);
        const flightdata = await getflight();
        setflight(Array.isArray(flightdata) ? flightdata : []);
      } catch (error) {
        console.error(error);
      } finally {
        setloading(false);
      }
    };
    fetchdata();
  }, [user]);

  const baseCities = [
    "Delhi", "Mumbai", "Bengaluru", "Hyderabad", "Chennai",
    "Kolkata", "Goa", "Pune", "Ahmedabad", "Jaipur", "Kochi", "Shimla",
  ];
  const cityOptions = useMemo(() => {
    const cities = new Set<string>(baseCities);
    flight.forEach((f) => {
      if (f.from) cities.add(f.from);
      if (f.to) cities.add(f.to);
    });
    hotel.forEach((h) => {
      if (h.location) cities.add(h.location);
    });
    return Array.from(cities)
      .filter(Boolean)
      .map((city) => ({ value: city, label: city }));
  }, [flight, hotel]);

  const getDataForType = (type: string) => {
    if (type === "flights") return flight;
    if (type === "hotels") return hotel;
    return sampleData[type] || [];
  };


  const handlesearch = () => {
    setsearched(true);
    const data = getDataForType(bookingtype);
    let results = data;
    if (routeTypes.includes(bookingtype)) {
      results = data.filter(
        (item: any) =>
          (!from || (item.from || "").toLowerCase().includes(from.toLowerCase())) &&
          (!to || (item.to || "").toLowerCase().includes(to.toLowerCase()))
      );
    } else if (cityTypes.includes(bookingtype)) {
      results = data.filter(
        (item: any) =>
          !to || (item.location || "").toLowerCase().includes(to.toLowerCase())
      );
    } else {
      results = data.filter(
        (item: any) =>
          !to || (item.name || "").toLowerCase().includes(to.toLowerCase())
      );
    }
    setsearchresult(results);
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return d.toLocaleString("en-US", options);
  };

  const handlebooknow = (result: any) => {
    if (bookingtype === "flights") {
      router.push(`/book-flight/${result.id}`);
    } else if (bookingtype === "hotels") {
      router.push(`/book-hotel/${result.id}`);
    } else {
      const name = result.name || result.flightName || result.hotelName;
      alert("Booking confirmed for " + name + "! (demo)");
    }
  };

  const changeType = (type: string) => {
    setbookingtype(type);
    setsearched(false);
    setsearchresult([]);
    setfrom("");
    setto("");
  };

  const handleVibePick = (city: string) => {
    setbookingtype("hotels");
    setto(city);
    setsearched(false);
    if (typeof window !== "undefined")
      window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const shownResults = searched ? searchresults : [];
  const showFrom = routeTypes.includes(bookingtype);
  const showTo = routeTypes.includes(bookingtype) || cityTypes.includes(bookingtype);
  const toLabel = routeTypes.includes(bookingtype)
    ? "To"
    : cityTypes.includes(bookingtype)
    ? "City"
    : "Search";

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          'url("https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80")',
      }}
    >
      <FlashSaleBanner />
      <main className="container mx-auto px-4 py-6">
        <nav className="bg-white rounded-xl shadow-lg mx-auto max-w-5xl mb-6 p-4 overflow-x-auto">
          <div className="flex justify-between items-center min-w-max space-x-8">
            <NavItem icon={<Plane />} text="Flights" active={bookingtype === "flights"} onClick={() => changeType("flights")} />
            <NavItem icon={<Hotel />} text="Hotels" active={bookingtype === "hotels"} onClick={() => changeType("hotels")} />
            <NavItem icon={<HomeIcon />} text="Homestays" active={bookingtype === "homestays"} onClick={() => changeType("homestays")} />
            <NavItem icon={<Umbrella />} text="Holiday" active={bookingtype === "holidays"} onClick={() => changeType("holidays")} />
            <NavItem icon={<Train />} text="Trains" active={bookingtype === "trains"} onClick={() => changeType("trains")} />
            <NavItem icon={<Bus />} text="Buses" active={bookingtype === "buses"} onClick={() => changeType("buses")} />
            <NavItem icon={<Car />} text="Cabs" active={bookingtype === "cabs"} onClick={() => changeType("cabs")} />
            <NavItem icon={<CreditCard />} text="Forex" active={bookingtype === "forex"} onClick={() => changeType("forex")} />
            <NavItem icon={<Shield />} text="Insurance" active={bookingtype === "insurance"} onClick={() => changeType("insurance")} />
          </div>
        </nav>

        <div className="bg-white rounded-xl shadow-lg mx-auto max-w-5xl p-6">
          {bookingtype === "flights" && (
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                { k: "round", label: "Round trip" },
                { k: "oneway", label: "One way" },
                { k: "multi", label: "Multi-city" },
              ].map((t) => (
                <button
                  key={t.k}
                  onClick={() => setTripType(t.k)}
                  className={
                    "px-3 py-1 rounded-full text-sm font-medium " +
                    (tripType === t.k
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200")
                  }
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {showFrom && (
              <div className="col-span-1">
                <SearchSelect
                  options={cityOptions}
                  placeholder="From"
                  value={from}
                  onChange={setfrom}
                  icon={<MapPin className="text-gray-400" />}
                  subtitle="Enter city"
                />
              </div>
            )}

            {showTo && (
              <div className="col-span-1">
                <SearchSelect
                  options={cityOptions}
                  placeholder={toLabel}
                  value={to}
                  onChange={setto}
                  icon={<MapPin className="text-gray-400" />}
                  subtitle="Enter city"
                />
              </div>
            )}

            <div className="col-span-1">
              <SearchInput
                icon={<Calendar className="text-gray-400" />}
                placeholder="Date"
                value={date}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setdate(e.target.value)
                }
                subtitle="Select a date"
                type="date"
              />
            </div>

            <div className="col-span-1">
              <SearchInput
                icon={<Users className="text-gray-400" />}
                placeholder="Travelers"
                value={travelers.toString()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  settravelers(parseInt(e.target.value) || 1)
                }
                subtitle="Number of travelers"
                type="number"
              />
            </div>

            <Button className="col-span-1 h-full" onClick={handlesearch}>
              SEARCH
            </Button>
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 capitalize">
              {bookingtype} Results
            </h2>
            {!searched ? (
              <p className="text-gray-600">
                Enter your details above and press SEARCH to see available{" "}
                {bookingtype}.
              </p>
            ) : loading &&
              (bookingtype === "flights" || bookingtype === "hotels") ? (
              <div className="flex items-center gap-2 text-gray-600 py-2">
                <Loader2 className="animate-spin w-5 h-5 text-blue-600" />
                <span>
                  Loading {bookingtype}... (first load can take a few seconds
                  while the server wakes up)
                </span>
              </div>
            ) : shownResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {shownResults.map((result: any) => (
                  <div
                    key={result.id}
                    className="relative bg-white rounded-lg shadow p-4 border border-gray-200"
                  >
                    <div className="absolute top-2 right-2 z-10">
                      <WishlistButton
                        item={{
                          id: result.id,
                          type: bookingtype,
                          title: result.flightName || result.hotelName,
                          subtitle: result.from
                            ? result.from + " to " + result.to
                            : result.location,
                          price: result.price ?? result.pricePerNight,
                        }}
                      />
                    </div>
                    {bookingtype === "flights" ? (
                      <>
                        <p className="font-semibold text-lg">
                          {result.flightName}
                        </p>
                        <h3 className="font-semibold text-lg">
                          {result.from} to {result.to}
                        </h3>
                        <RatingBadge id={result.id} />
                        <p className="text-gray-600">
                          Departure: {formatDate(result.departureTime)}
                        </p>
                        <p className="text-gray-600">
                          Arrival: {formatDate(result.arrivalTime)}
                        </p>
                        <p className="text-lg font-bold mt-2">₹{result.price}</p>
                        <Button
                          className="w-full mt-4"
                          onClick={() => handlebooknow(result)}
                        >
                          Book Now
                        </Button>
                      </>
                    ) : bookingtype === "hotels" ? (
                      <>
                        <h3 className="font-semibold text-lg">
                          {result.hotelName}
                        </h3>
                        <p className="text-gray-600">City: {result.location}</p>
                        <RatingBadge id={result.id} />
                        <p className="text-lg font-bold mt-2">
                          ₹{result.pricePerNight} per night
                        </p>
                        <Button
                          className="w-full mt-4"
                          onClick={() => handlebooknow(result)}
                        >
                          Book Now
                        </Button>
                      </>
                    ) : (
                      <>
                        <h3 className="font-semibold text-lg">{result.name}</h3>
                        {result.from && result.to && (
                          <p className="text-gray-600">
                            {result.from} to {result.to}
                          </p>
                        )}
                        {result.location && (
                          <p className="text-gray-600">
                            Location: {result.location}
                          </p>
                        )}
                        {result.departureTime && (
                          <p className="text-gray-600">
                            Departure: {result.departureTime}
                            {result.arrivalTime
                              ? " • Arrival: " + result.arrivalTime
                              : ""}
                          </p>
                        )}
                        <p className="text-lg font-bold mt-2">
                          ₹{result.price}
                          {bookingtype === "homestays" ? " per night" : ""}
                          {bookingtype === "forex" ? " per unit" : ""}
                        </p>
                        <Button
                          className="w-full mt-4"
                          onClick={() => handlebooknow(result)}
                        >
                          Book Now
                        </Button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">
                Result not found. Please try different options.
              </p>
            )}
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4">
          <Recommendations />
          <DealsSection />
          <PickAVibe onPick={handleVibePick} />

          {/* Offers Section */}
          <section className="my-16">
            <h2 className="text-2xl font-bold mb-8 text-white">Best Offers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {offers.map((offer, index) => (
                <OfferCard
                  key={index}
                  {...offer}
                  onBook={() => {
                    changeType(offer.type);
                    if (typeof window !== "undefined")
                      window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              ))}
            </div>
          </section>

          {/* Collections Section */}
          <section className="my-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">
                Handpicked Collections for You
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {collections.map((collection, index) => (
                <CollectionCard key={index} {...collection} />
              ))}
            </div>
          </section>

          {/* Wonders Section */}
          <section className="my-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">
                Unlock Lesser-Known <span></span> Wonders of India
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wonders.map((wonder, index) => (
                <WonderCard key={index} {...wonder} />
              ))}
            </div>
          </section>

          {/* Download App Section */}
          <DownloadApp />
        </div>
      </main>
    </div>
  );
}
const OfferCard = ({ title, description, imageUrl, onBook }: any) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img src={imageUrl} alt={title} className="w-full h-48 object-cover bg-blue-100" onError={handleImgError} />
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
        <button
          onClick={onBook}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

const CollectionCard = ({ title, imageUrl, tag }: any) => {
  return (
    <div className="relative group cursor-pointer overflow-hidden rounded-lg">
      <img
        src={imageUrl}
        alt={title}
        onError={handleImgError}
        className="w-full h-64 object-cover bg-blue-100 transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70">
        <div className="absolute top-4 left-4">
          <span className="bg-white text-black text-sm font-semibold px-2 py-1 rounded">
            {tag}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white text-lg font-semibold">{title}</h3>
        </div>
      </div>
    </div>
  );
};
const DownloadApp = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-7xl mx-auto my-12">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="mb-6 md:mb-0">
          <h3 className="text-xl font-bold mb-2">Download App Now!</h3>
          <p className="text-gray-600 mb-4">
            Get India's #1 travel super app with best deals on flights
          </p>
          <div className="flex space-x-4">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
              alt="App Store"
              className="h-10"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
              alt="Play Store"
              className="h-10"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <QrCode className="w-24 h-24" />
          <p className="text-sm text-gray-600">
            Scan QR code to download the app
          </p>
        </div>
      </div>
    </div>
  );
};

const WonderCard = ({ title, imageUrl }: any) => {
  return (
    <div className="relative group cursor-pointer overflow-hidden rounded-lg">
      <img
        src={imageUrl}
        alt={title}
        onError={handleImgError}
        className="w-full h-64 object-cover bg-blue-100 transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70">
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white text-lg font-semibold">{title}</h3>
        </div>
      </div>
    </div>
  );
};
function NavItem({ icon, text, active = false, onClick }: any) {
  return (
    <button
      className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
        active ? "text-blue-500" : "text-gray-600 hover:text-blue-500"
      }`}
      onClick={onClick}
    >
      {icon}
      <span className="text-sm mt-1 whitespace-nowrap">{text}</span>
    </button>
  );
}

function SearchInput({
  icon,
  placeholder,
  value,
  onChange,
  subtitle,
  type = "text",
}: any) {
  return (
    <div className="border rounded-lg p-3 hover:border-blue-500 cursor-pointer h-full">
      <div className="flex items-center space-x-2">
        {icon}
        <div className="flex-1 min-w-0">
          <div className="text-sm text-gray-500 truncate">{placeholder}</div>
          <input
            type={type}
            value={value}
            onChange={onChange}
            className="font-semibold w-full bg-transparent outline-none"
            placeholder={placeholder}
          />
          <div className="text-xs text-gray-400 truncate">{subtitle}</div>
        </div>
      </div>
    </div>
  );
}
