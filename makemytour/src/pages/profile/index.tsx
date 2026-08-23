import React, { useState, useEffect } from "react";
import {
  User,
  Phone,
  Mail,
  Edit2,
  MapPin,
  Calendar,
  CreditCard,
  X,
  Check,
  LogOut,
  Plane,
  Building2,
  Ban,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { clearUser, setUser } from "@/store";
import { editprofile, cancelbooking } from "@/api";
import BackButton from "@/components/BackButton";
const index = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);
  const router = useRouter();
  const [now, setNow] = useState(0);
  const [cancelIndex, setCancelIndex] = useState<number | null>(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [cancelling, setCancelling] = useState(false);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const REASONS = [
    "Change of plans",
    "Found a better price",
    "Travel dates changed",
    "Booked by mistake",
    "Personal/medical reasons",
    "Other",
  ];
  const doCancel = async (i: number) => {
    if (!selectedReason) {
      alert("Please select a reason for cancellation.");
      return;
    }
    setCancelling(true);
    const res = await cancelbooking(user?.id, i, selectedReason);
    setCancelling(false);
    if (res && res.success) {
      dispatch(setUser(res.user));
      setCancelIndex(null);
      setSelectedReason("");
    } else {
      alert(
        "Cancellation failed: " +
          (res && res.error ? res.error : "please try again in a moment.")
      );
    }
  };

  const logout = () => {
    dispatch(clearUser());
    router.push("/");
  };
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    firstName: user?.firstName ? user?.firstName : "",
    lastName: user?.lastName ? user?.lastName : "",
    email: user?.email ? user?.email : "",
    phoneNumber: user?.phoneNumber ? user?.phoneNumber : "",
    gender: user?.gender ? user?.gender : "",
    bookings: [
      {
        type: "Flight",
        bookingId: "F123456",
        date: "2024-03-25",
        quantity: 2,
        totalPrice: 12499,
        details: {
          from: "Delhi",
          to: "Mumbai",
          airline: "IndiGo",
        },
      },
      {
        type: "Hotel",
        bookingId: "H789012",
        date: "2024-04-15",
        quantity: 1,
        totalPrice: 8999,
        details: {
          name: "Taj Palace",
          location: "Goa",
          nights: 3,
        },
      },
    ],
  });

  const [editForm, setEditForm] = useState({ ...userData });
  const handleSave = async () => {
    try {
      const data = await editprofile(
        user?.id,
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.phoneNumber,
        userData.gender
      );
      dispatch(setUser(data));
      setIsEditing(false);
    } catch (error) {
      setUserData(editForm);
      setIsEditing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };
  const handleEditFormChange = (field:any, value:any) => {
    setUserData((prevState) => ({
        ...prevState,
        [field]: value, // Update the specific field dynamically
      }));
  };
  return (
    <div className="min-h-screen bg-gray-50 pt-8 px-4">
      <div className="max-w-6xl mx-auto">
        <BackButton />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">Profile</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-red-600 flex items-center space-x-1 hover:text-red-700"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                )}
              </div>
              <div className="flex justify-center mb-4">
                <div
                  className={
                    "w-24 h-24 rounded-full flex items-center justify-center text-5xl font-bold " +
                    (user?.gender === "Female"
                      ? "bg-pink-100 text-pink-600"
                      : user?.gender === "Male"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-500")
                  }
                >
                  {user?.gender === "Female"
                    ? "\u2640"
                    : user?.gender === "Male"
                    ? "\u2642"
                    : user?.firstName?.charAt(0) || "?"}
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={userData.firstName}
                      onChange={(e) => handleEditFormChange("firstName", e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={userData.lastName}
                      onChange={(e) => handleEditFormChange("lastName", e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={userData.email}
                      onChange={(e) => handleEditFormChange("email", e.target.value)}
                      
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={userData.phoneNumber}
                      onChange={(e) => handleEditFormChange("phoneNumber", e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      value={userData.gender}
                      onChange={(e) => handleEditFormChange("gender", e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="">Select...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSave}
                      className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditForm({ ...user });
                      }}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">
                        {user?.firstName} {user?.lastName}
                      </p>
                      {/* <p className="text-sm text-gray-500">{userData.role}</p> */}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <p>{user?.email}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <p>{user?.phoneNumber}</p>
                  </div>
                  <button
                    className="w-full mt-4 flex items-center justify-center space-x-2 text-red-600 hover:text-red-700"
                    onClick={logout}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bookings Section */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">My Bookings</h2>
              <div className="space-y-6">
                {user?.bookings && user.bookings.length > 0 ? (
                  user.bookings.map((booking: any, index: any) => {
                    const cancelled = booking?.status === "CANCELLED";
                    return (
                      <div
                        key={index}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            {booking?.type === "Flight" ? (
                              <div className="bg-blue-100 p-2 rounded-lg">
                                <Plane className="w-6 h-6 text-blue-600" />
                              </div>
                            ) : (
                              <div className="bg-green-100 p-2 rounded-lg">
                                <Building2 className="w-6 h-6 text-green-600" />
                              </div>
                            )}
                            <div>
                              <h3 className="font-semibold flex items-center gap-2">
                                {booking?.type}
                                {cancelled && (
                                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                                    Cancelled
                                  </span>
                                )}
                              </h3>
                              <p className="text-sm text-gray-500">
                                Booking ID: {booking?.bookingId}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className={
                                "font-semibold " +
                                (cancelled ? "line-through text-gray-400" : "")
                              }
                            >
                              ₹ {booking?.totalPrice?.toLocaleString("en-IN")}
                            </p>
                            <p className="text-sm text-gray-500">{booking?.type}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(booking?.date)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <CreditCard className="w-4 h-4" />
                            <span>{cancelled ? "Refund initiated" : "Paid"}</span>
                          </div>
                        </div>

                        {!cancelled && (
                          <div className="mt-4">
                            {cancelIndex === index ? (
                              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <label className="block text-sm font-medium mb-1">
                                  Reason for cancellation
                                </label>
                                <select
                                  value={selectedReason}
                                  onChange={(e) => setSelectedReason(e.target.value)}
                                  className="w-full border rounded-lg px-3 py-2 mb-2"
                                >
                                  <option value="">Select a reason...</option>
                                  {REASONS.map((r) => (
                                    <option key={r} value={r}>
                                      {r}
                                    </option>
                                  ))}
                                </select>
                                <p className="text-xs text-gray-600 mb-3">
                                  Refund policy: 50% back if cancelled within 24 hours
                                  of booking, otherwise 25%.
                                </p>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => doCancel(index)}
                                    disabled={cancelling}
                                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-60"
                                  >
                                    {cancelling ? "Cancelling..." : "Confirm Cancellation"}
                                  </button>
                                  <button
                                    onClick={() => {
                                      setCancelIndex(null);
                                      setSelectedReason("");
                                    }}
                                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
                                  >
                                    Keep Booking
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => setCancelIndex(index)}
                                className="text-red-600 text-sm font-medium hover:text-red-700 flex items-center gap-1"
                              >
                                <Ban className="w-4 h-4" /> Cancel Booking
                              </button>
                            )}
                          </div>
                        )}

                        {cancelled && (
                          <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-3">
                            <div className="flex flex-wrap justify-between text-sm mb-2 gap-2">
                              <span className="text-gray-600">
                                Reason: {booking?.cancellationReason || "N/A"}
                              </span>
                              <span className="font-semibold text-green-700">
                                Refund: ₹
                                {booking?.refundAmount?.toLocaleString("en-IN")} (
                                {booking?.refundPercent}%)
                              </span>
                            </div>
                            <RefundTracker
                              cancelledAt={booking?.cancelledAt}
                              now={now}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500">You have no bookings yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const refundStage = (cancelledAt: string, now: number) => {
  const t = new Date(cancelledAt).getTime();
  const elapsed = (now - t) / 1000;
  if (isNaN(t))
    return { step: 1, note: "Refund initiated." };
  if (elapsed < 20)
    return {
      step: 1,
      note: "Refund initiated. Expected within 5-7 business days.",
    };
  if (elapsed < 60)
    return {
      step: 2,
      note: "Refund processed. Will reflect in 3-5 business days.",
    };
  return {
    step: 3,
    note: "Refund completed and credited to your account.",
  };
};

const RefundTracker = ({ cancelledAt, now }: any) => {
  const stage = refundStage(cancelledAt, now);
  const steps = ["Pending", "Processed", "Completed"];
  return (
    <div className="mt-2">
      <div className="flex items-center">
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center">
              <div
                className={
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold " +
                  (i + 1 <= stage.step
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-500")
                }
              >
                {i + 1}
              </div>
              <span className="text-xs mt-1">{s}</span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={
                  "flex-1 h-1 mx-1 " +
                  (i + 1 < stage.step ? "bg-green-600" : "bg-gray-200")
                }
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <p className="text-xs text-gray-600 mt-2">{stage.note}</p>
    </div>
  );
};

export default index;
