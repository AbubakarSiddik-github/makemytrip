import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export const login = async (email, password) => {
  try {
    const url = `${BACKEND_URL}/user/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
    const res = await axios.post(url);
    const data = res.data;
    // console.log(data);
    return data;
  } catch (error) {
    throw error;
  }
};

export const signup = async (
  firstName,
  lastName,
  email,
  phoneNumber,
  password
) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/user/signup`, {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
    });
    const data = res.data;
    // console.log(data);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getuserbyemail = async (email) => {
  try {
    const res = await axios.get(`${BACKEND_URL}/user/email?email=${email}`);
    const data = res.data;
    return data;
  } catch (error) {
    throw error;
  }
};

export const editprofile = async (
  id,
  firstName,
  lastName,
  email,
  phoneNumber
) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/user/edit?id=${id}`, {
      firstName,
      lastName,
      email,
      phoneNumber,
    });
    const data = res.data;
    return data;
  } catch (error) {}
};
export const getflight = async () => {
  try {
    const res = await axios.get(`${BACKEND_URL}/flight`);
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const addflight = async (
  flightName,
  from,
  to,
  departureTime,
  arrivalTime,
  price,
  availableSeats
) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/admin/flight`, {
      flightName,
      from,
      to,
      departureTime,
      arrivalTime,
      price,
      availableSeats,
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const editflight = async (
  id,
  flightName,
  from,
  to,
  departureTime,
  arrivalTime,
  price,
  availableSeats
) => {
  try {
    const res = await axios.put(`${BACKEND_URL}/admin/flight/${id}`, {
      flightName,
      from,
      to,
      departureTime,
      arrivalTime,
      price,
      availableSeats,
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const gethotel = async () => {
  try {
    const res = await axios.get(`${BACKEND_URL}/hotel`);
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const addhotel = async (
  hotelName,
  location,
  pricePerNight,
  availableRooms,
  amenities
) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/admin/hotel`, {
      hotelName,
      location,
      pricePerNight,
      availableRooms,
      amenities,
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const edithotel = async (
  id,
  hotelName,
  location,
  pricePerNight,
  availableRooms,
  amenities
) => {
  try {
    const res = await axios.put(`${BACKEND_URL}/admin/hotel/${id}`, {
      hotelName,
      location,
      pricePerNight,
      availableRooms,
      amenities,
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const handleflightbooking = async (userId, flightId, seats, price) => {
  try {
    const url = `${BACKEND_URL}/booking/flight?userId=${userId}&flightId=${flightId}&seats=${seats}&price=${price}`;
    const res = await axios.post(url);
    const data = res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const handlehotelbooking = async (userId, hotelId, rooms, price) => {
  try {
    const url = `${BACKEND_URL}/booking/hotel?userId=${userId}&hotelId=${hotelId}&rooms=${rooms}&price=${price}`;
    const res = await axios.post(url);
    const data = res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getflightstatus = async () => {
  try {
    const res = await axios.get(`${BACKEND_URL}/flight-status`);
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getpricing = async () => {
  try {
    const res = await axios.get(`${BACKEND_URL}/pricing`);
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const freezeprice = async (userId, flightId) => {
  try {
    const res = await axios.post(
      `${BACKEND_URL}/pricing/freeze?userId=${encodeURIComponent(userId)}&flightId=${encodeURIComponent(flightId)}`
    );
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getfreezes = async (userId) => {
  try {
    const res = await axios.get(`${BACKEND_URL}/pricing/freeze/${encodeURIComponent(userId)}`);
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const cancelbooking = async (userId, index, reason) => {
  try {
    const res = await axios.post(
      `${BACKEND_URL}/booking/cancel?userId=${encodeURIComponent(userId)}&index=${index}&reason=${encodeURIComponent(reason)}`
    );
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getreviews = async (itemId, itemType, sort = "helpful") => {
  try {
    const res = await axios.get(
      `${BACKEND_URL}/reviews?itemId=${encodeURIComponent(itemId)}&itemType=${itemType}&sort=${sort}`
    );
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const addreview = async (review) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/reviews`, review);
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const addreviewreply = async (id, reply) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/reviews/${id}/reply`, reply);
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const markreviewhelpful = async (id) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/reviews/${id}/helpful`);
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const flagreview = async (id) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/reviews/${id}/flag`);
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getflaggedreviews = async () => {
  try {
    const res = await axios.get(`${BACKEND_URL}/reviews/flagged`);
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const removereview = async (id) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/reviews/${id}/remove`);
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const keepreview = async (id) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/reviews/${id}/keep`);
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getrecommendations = async (userId) => {
  try {
    const res = await axios.get(
      `${BACKEND_URL}/recommendations${userId ? `?userId=${encodeURIComponent(userId)}` : ""}`
    );
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const recfeedback = async (userId, recKey, tag, helpful) => {
  try {
    const res = await axios.post(
      `${BACKEND_URL}/recommendations/feedback?userId=${encodeURIComponent(userId)}&recKey=${encodeURIComponent(recKey)}&tag=${encodeURIComponent(tag || "")}&helpful=${helpful}`
    );
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
