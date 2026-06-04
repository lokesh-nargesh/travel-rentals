// Mock Database Module for Travel Rentals Platform

// 1. Cars Database
const CARS_DATA = [
  {
    id: "car_innova",
    name: "Toyota Innova Crysta",
    type: "SUV",
    seats: 7,
    pricePerDay: 1500, // ₹ per day base
    ratePerKm: 15,
    transmission: "Automatic",
    fuel: "Diesel",
    ac: true,
    image: "cars/innova.avif",
    locations: ["Delhi", "Mumbai", "Bangalore", "Goa", "Jaipur", "Kerala"]
  },
  {
    id: "car_dzire",
    name: "Maruti Suzuki Dzire",
    type: "Sedan",
    seats: 4,
    pricePerDay: 1000,
    ratePerKm: 12,
    transmission: "Manual",
    fuel: "Petrol",
    ac: true,
    image: "cars/marutisuzuki-dzire.jpeg",
    locations: ["Delhi", "Mumbai", "Goa", "Jaipur"]
  },
  {
    id: "car_xuv",
    name: "Mahindra XUV700",
    type: "SUV",
    seats: 7,
    pricePerDay: 2000,
    ratePerKm: 20,
    transmission: "Automatic",
    fuel: "Petrol",
    ac: true,
    image: "cars/mahendra-xuv.jpg",
    locations: ["Delhi", "Mumbai", "Bangalore", "Goa", "Kerala"]
  },
  {
    id: "car_ertiga",
    name: "Maruti Suzuki Ertiga",
    type: "MUV",
    seats: 7,
    pricePerDay: 1300,
    ratePerKm: 13,
    transmission: "Manual",
    fuel: "Petrol",
    ac: true,
    image: "cars/maruti-ertiga.jpg",
    locations: ["Delhi", "Mumbai", "Bangalore", "Kerala", "Jaipur"]
  },
  {
    id: "car_nexon",
    name: "Tata Nexon EV",
    type: "Hatchback",
    seats: 5,
    pricePerDay: 1200,
    ratePerKm: 10,
    transmission: "Automatic",
    fuel: "Electric",
    ac: true,
    image: "cars/uk hills.webp", // Fallback to uk hills since Nexon is EV and good for hills
    locations: ["Delhi", "Mumbai", "Bangalore", "Goa"]
  }
];

// 2. Hotels Database
const HOTELS_DATA = [
  {
    id: "hotel_grand",
    name: "The Grand Plaza",
    stars: 5,
    rating: 4.8,
    reviewsCount: 340,
    location: "Delhi",
    image: "cars/Resorts-near-Delhi.jpg",
    amenities: ["Wi-Fi", "AC", "Pool", "Gym", "Restaurant", "Spa"],
    roomTypes: [
      { type: "Standard Room", price: 4500, description: "Queen bed, City view, Free Wi-Fi" },
      { type: "Deluxe Suite", price: 6500, description: "King bed, Separate lounge, Mini bar, AC" },
      { type: "Presidential Suite", price: 12000, description: "Premium luxury, Double bedrooms, Jacuzzi, Balcony" }
    ]
  },
  {
    id: "hotel_beachfront",
    name: "Resort De Goa & Spa",
    stars: 4,
    rating: 4.5,
    reviewsCount: 512,
    location: "Goa",
    image: "cars/kerala_images1.jpg",
    amenities: ["Wi-Fi", "AC", "Pool", "Beach Access", "Bar", "Restaurant"],
    roomTypes: [
      { type: "Standard Room", price: 5000, description: "Double bed, Pool View, Free Wi-Fi" },
      { type: "Ocean View Room", price: 7500, description: "King bed, Ocean balcony, Mini bar, AC" },
      { type: "Luxury Cottage", price: 14000, description: "Private sit-out, Beachfront, Premium amenities" }
    ]
  },
  {
    id: "hotel_royal",
    name: "Royal Heritage Palace",
    stars: 5,
    rating: 4.9,
    reviewsCount: 198,
    location: "Jaipur",
    image: "cars/desret.jpg",
    amenities: ["Wi-Fi", "AC", "Pool", "Spa", "Heritage Garden", "Bar"],
    roomTypes: [
      { type: "Deluxe Heritage Room", price: 7000, description: "Royal decor, King bed, Courtyard view" },
      { type: "Maharani Suite", price: 18000, description: "Historic suite, Antique furniture, Butler service" }
    ]
  },
  {
    id: "hotel_backwater",
    name: "Whispering Backwaters Retreat",
    stars: 4,
    rating: 4.7,
    reviewsCount: 224,
    location: "Kerala",
    image: "cars/kerala_images.jpg",
    amenities: ["Wi-Fi", "AC", "Boating", "Ayurvedic Spa", "Restaurant"],
    roomTypes: [
      { type: "Lakeview Room", price: 6000, description: "Double bed, Backwater balcony, AC" },
      { type: "Luxury Houseboat Villa", price: 11000, description: "Traditional design, Premium comfort, Private deck" }
    ]
  }
];

// Helper to generate flights dynamically (so searching between ANY locations works!)
function getFlights(from, to, date) {
  if (!from || !to) return [];
  
  // Deterministic generator based on string hashes to keep results stable for the same route
  const hash = (from + to + date).split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const airlines = [
    { name: "IndiGo", code: "6E", logo: "✈️" },
    { name: "Air India", code: "AI", logo: "🇮🇳" },
    { name: "Vistara", code: "UK", logo: "✨" },
    { name: "SpiceJet", code: "SG", logo: "🌶️" }
  ];
  
  const flights = [];
  const numFlights = 3 + (hash % 2); // 3 or 4 flights
  
  for (let i = 0; i < numFlights; i++) {
    const airlineIdx = (hash + i) % airlines.length;
    const airline = airlines[airlineIdx];
    const flightNum = 100 + ((hash * (i + 1)) % 900);
    
    // Times
    const depHour = (6 + i * 4 + (hash % 3)) % 24;
    const depMin = ((hash + i * 15) % 4) * 15;
    const durationMin = 60 + ((hash + i * 35) % 150); // 1h to 3.5h
    
    const depTime = `${depHour.toString().padStart(2, "0")}:${depMin.toString().padStart(2, "0")}`;
    
    const arrTotalMin = depHour * 60 + depMin + durationMin;
    const arrHour = Math.floor(arrTotalMin / 60) % 24;
    const arrMin = arrTotalMin % 60;
    const arrTime = `${arrHour.toString().padStart(2, "0")}:${arrMin.toString().padStart(2, "0")}`;
    
    const durationStr = `${Math.floor(durationMin / 60)}h ${durationMin % 60}m`;
    
    // Pricing based on route length/hash
    const basePrice = 3000 + ((hash + i * 1250) % 6000);
    
    flights.push({
      id: `flight_${airline.code.toLowerCase()}_${flightNum}`,
      airline: airline.name,
      code: `${airline.code}-${flightNum}`,
      logo: airline.logo,
      from: from.toUpperCase(),
      to: to.toUpperCase(),
      departure: depTime,
      arrival: arrTime,
      duration: durationStr,
      stops: i % 3 === 0 ? "1 Stop (BOM)" : "Non-stop",
      status: i % 4 === 0 ? "Delayed (15m)" : "On Time",
      prices: {
        Economy: basePrice,
        Business: Math.round(basePrice * 2.2),
        First: Math.round(basePrice * 4.5)
      }
    });
  }
  
  return flights;
}

// 3. LocalStorage Helpers for state management
const DB = {
  // Get active cart
  getCart() {
    const cart = localStorage.getItem("tr_cart");
    return cart ? JSON.parse(cart) : { flight: null, hotel: null, car: null };
  },

  // Save active cart
  saveCart(cart) {
    localStorage.setItem("tr_cart", JSON.stringify(cart));
  },

  // Add item to cart
  addToCart(type, item) {
    const cart = this.getCart();
    cart[type] = item;
    this.saveCart(cart);
  },

  // Remove single type from cart
  removeFromCart(type) {
    const cart = this.getCart();
    cart[type] = null;
    this.saveCart(cart);
  },

  // Clear entire cart
  clearCart() {
    localStorage.removeItem("tr_cart");
  },

  // Get user bookings list
  getBookings(userId) {
    const allBookings = localStorage.getItem("tr_bookings");
    const bookings = allBookings ? JSON.parse(allBookings) : [];
    return bookings.filter(b => b.userId === userId);
  },

  // Create new booking
  createBooking(bookingData) {
    const allBookings = localStorage.getItem("tr_bookings");
    const bookings = allBookings ? JSON.parse(allBookings) : [];
    
    // Generate confirmation code
    const confCode = "TR-" + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    const newBooking = {
      bookingId: confCode,
      date: new Date().toLocaleDateString(),
      status: "Confirmed",
      ...bookingData
    };
    
    bookings.push(newBooking);
    localStorage.setItem("tr_bookings", JSON.stringify(bookings));
    return newBooking;
  },

  // Get price alerts
  getPriceAlerts(userId) {
    const alerts = localStorage.getItem("tr_price_alerts");
    return alerts ? JSON.parse(alerts).filter(a => a.userId === userId) : [];
  },

  // Add price alert
  addPriceAlert(userId, searchDetails, basePrice) {
    const alertsStr = localStorage.getItem("tr_price_alerts");
    const alerts = alertsStr ? JSON.parse(alertsStr) : [];
    
    const newAlert = {
      id: "alert_" + Date.now(),
      userId,
      search: searchDetails, // e.g. "DEL to BOM (Economy)"
      initialPrice: basePrice,
      currentPrice: basePrice,
      active: true
    };
    
    alerts.push(newAlert);
    localStorage.setItem("tr_price_alerts", JSON.stringify(alerts));
    return newAlert;
  },

  // Remove price alert
  removePriceAlert(alertId) {
    const alertsStr = localStorage.getItem("tr_price_alerts");
    if (!alertsStr) return;
    const alerts = JSON.parse(alertsStr).filter(a => a.id !== alertId);
    localStorage.setItem("tr_price_alerts", JSON.stringify(alerts));
  }
};

// Global expose for ease of access in script tags
window.CARS_DATA = CARS_DATA;
window.HOTELS_DATA = HOTELS_DATA;
window.getFlights = getFlights;
window.DB = DB;
