import { getflightstatus } from "@/api";
import { Button } from "@/components/ui/button";
import { Bell, Plane, Clock, MapPin, AlertTriangle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const STATUS_STYLES: any = {
  "On Time": "bg-green-100 text-green-700 border-green-300",
  Delayed: "bg-red-100 text-red-700 border-red-300",
  Boarding: "bg-blue-100 text-blue-700 border-blue-300",
  "In Air": "bg-indigo-100 text-indigo-700 border-indigo-300",
  Arrived: "bg-gray-200 text-gray-700 border-gray-300",
};

const formatTime = (iso: string) => {
  if (!iso) return "--";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "--";
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
};

const formatDelay = (mins: number) => {
  if (!mins || mins <= 0) return "";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return (h > 0 ? h + "h " : "") + (m > 0 ? m + "m" : "").trim();
};

const countdown = (iso: string, now: number) => {
  if (!iso) return "--";
  const target = new Date(iso).getTime();
  if (isNaN(target)) return "--";
  const diff = target - now;
  if (diff <= 0) return "Landed";
  const totalMin = Math.floor(diff / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return "in " + (h > 0 ? h + "h " : "") + m + "m";
};

export default function FlightStatusPage() {
  const [statuses, setStatuses] = useState<any[]>([]);
  const [tracked, setTracked] = useState<string[]>([]);
  const [now, setNow] = useState<number>(0);
  const [notifOn, setNotifOn] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const prevRef = useRef<any>({});
  const trackedRef = useRef<string[]>([]);

  // load tracked list + notification state
  useEffect(() => {
    setNow(Date.now());
    try {
      const saved = localStorage.getItem("trackedFlights");
      if (saved) {
        const arr = JSON.parse(saved);
        setTracked(arr);
        trackedRef.current = arr;
      }
    } catch (e) {}
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") setNotifOn(true);
    }
  }, []);

  useEffect(() => {
    trackedRef.current = tracked;
    try {
      localStorage.setItem("trackedFlights", JSON.stringify(tracked));
    } catch (e) {}
  }, [tracked]);

  const notify = (title: string, body: string) => {
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      try {
        new Notification(title, { body });
      } catch (e) {}
    }
  };

  const checkChanges = (fresh: any[]) => {
    const prev = prevRef.current;
    fresh.forEach((s) => {
      if (!trackedRef.current.includes(s.flightId)) return;
      const old = prev[s.flightId];
      if (!old) return;
      if (old.status !== s.status) {
        if (s.status === "Boarding")
          notify(s.flightName + " — Boarding", "Now boarding at gate " + s.gate);
        else if (s.status === "In Air")
          notify(s.flightName + " — Departed", s.from + " to " + s.to + " has departed.");
        else if (s.status === "Arrived")
          notify(s.flightName + " — Arrived", "Flight has arrived at " + s.to + ".");
        else if (s.status === "Delayed")
          notify(
            s.flightName + " — Delayed",
            "Delayed by " + formatDelay(s.delayMinutes) + ". " + (s.reason || "")
          );
      } else if (s.delayMinutes > (old.delayMinutes || 0)) {
        notify(
          s.flightName + " — More delay",
          "Now delayed by " + formatDelay(s.delayMinutes) +
            ". Reason: " + (s.reason || "operational") +
            ". New departure: " + formatTime(s.estimatedDeparture) +
            ", est. arrival: " + formatTime(s.estimatedArrival)
        );
      }
    });
    const map: any = {};
    fresh.forEach((s) => (map[s.flightId] = s));
    prevRef.current = map;
  };

  // poll backend every 10s
  useEffect(() => {
    let active = true;
    const load = async () => {
      const data = await getflightstatus();
      if (!active) return;
      const arr = Array.isArray(data) ? data : [];
      checkChanges(arr);
      setStatuses(arr);
      setLoaded(true);
    };
    load();
    const poll = setInterval(load, 10000);
    return () => {
      active = false;
      clearInterval(poll);
    };
  }, []);

  // local clock every second for countdowns
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const enableNotifications = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      alert("Your browser does not support notifications.");
      return;
    }
    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      setNotifOn(true);
      notify("Notifications enabled", "You will be alerted about your tracked flights.");
    }
  };

  const toggleTrack = (id: string) => {
    setTracked((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const trackedStatuses = statuses.filter((s) => tracked.includes(s.flightId));

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <Plane className="w-7 h-7 text-blue-600" /> Live Flight Status
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Real-time updates refresh every few seconds.
            </p>
          </div>
          <Button
            onClick={enableNotifications}
            variant={notifOn ? "outline" : "default"}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <Bell className="w-4 h-4" />
            {notifOn ? "Notifications On" : "Enable Notifications"}
          </Button>
        </div>

        {/* Tracked flights dashboard */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">
            Tracking ({trackedStatuses.length})
          </h2>
          {trackedStatuses.length === 0 ? (
            <p className="text-gray-500">
              You are not tracking any flights yet. Add flights from the list below.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trackedStatuses.map((s) => (
                <div
                  key={s.flightId}
                  className="bg-white rounded-xl shadow-md p-5 border border-gray-100"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-lg">{s.flightName}</h3>
                      <p className="text-gray-500 text-sm flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {s.from} → {s.to}
                      </p>
                    </div>
                    <span
                      className={
                        "text-xs font-semibold px-3 py-1 rounded-full border " +
                        (STATUS_STYLES[s.status] || "bg-gray-100 text-gray-700")
                      }
                    >
                      {s.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                    <div>
                      <p className="text-gray-400">Scheduled Departure</p>
                      <p className="font-semibold">
                        {formatTime(s.scheduledDeparture)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Estimated Departure</p>
                      <p
                        className={
                          "font-semibold " +
                          (s.delayMinutes > 0 ? "text-red-600" : "text-green-600")
                        }
                      >
                        {formatTime(s.estimatedDeparture)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Gate</p>
                      <p className="font-semibold">{s.gate}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Est. Arrival</p>
                      <p className="font-semibold flex items-center gap-1">
                        <Clock className="w-4 h-4 text-blue-500" />
                        {formatTime(s.estimatedArrival)}{" "}
                        <span className="text-blue-500">
                          ({countdown(s.estimatedArrival, now)})
                        </span>
                      </p>
                    </div>
                  </div>

                  {s.delayMinutes > 0 && (
                    <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
                      <p className="text-red-700 font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        Delayed by {formatDelay(s.delayMinutes)}
                      </p>
                      {s.reason && (
                        <p className="text-red-600 mt-1">Reason: {s.reason}</p>
                      )}
                      <p className="text-gray-600 mt-1">
                        Revised: departs {formatTime(s.estimatedDeparture)}, arrives{" "}
                        {formatTime(s.estimatedArrival)}
                      </p>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => toggleTrack(s.flightId)}
                  >
                    Stop Tracking
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* All flights list */}
        <section>
          <h2 className="text-xl font-semibold mb-4">All Flights</h2>
          {!loaded ? (
            <p className="text-gray-500">Loading live flight data...</p>
          ) : statuses.length === 0 ? (
            <p className="text-gray-500">
              No live flight data. Make sure the backend is running and has flights.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {statuses.map((s) => (
                <div
                  key={s.flightId}
                  className="bg-white rounded-lg shadow p-4 border border-gray-100"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold">{s.flightName}</h3>
                    <span
                      className={
                        "text-xs font-semibold px-2 py-1 rounded-full border " +
                        (STATUS_STYLES[s.status] || "bg-gray-100 text-gray-700")
                      }
                    >
                      {s.status}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">
                    {s.from} → {s.to}
                  </p>
                  <p className="text-sm mt-2">
                    Departs:{" "}
                    <span
                      className={s.delayMinutes > 0 ? "text-red-600" : "text-gray-800"}
                    >
                      {formatTime(s.estimatedDeparture)}
                    </span>
                  </p>
                  <Button
                    variant={tracked.includes(s.flightId) ? "outline" : "default"}
                    className="w-full mt-3"
                    onClick={() => toggleTrack(s.flightId)}
                  >
                    {tracked.includes(s.flightId) ? "Tracking ✓" : "Track Flight"}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
