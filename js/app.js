// Core Application Controller

document.addEventListener("DOMContentLoaded", () => {
  // Initialize navigation state
  updateNavbar();
  
  // Set up flight alerts if price tracking is active
  initPriceAlertSimulator();
});

// 1. Update Nav bar based on auth status
function updateNavbar() {
  const nav = document.getElementById("navbar");
  if (!nav) return;
  
  const currentUser = Auth.getCurrentUser();
  
  // Check if login/dashboard exists in nav
  let authLink = nav.querySelector(".auth-link");
  if (authLink) authLink.remove();
  
  const cart = DB.getCart();
  let cartCount = 0;
  if (cart.flight) cartCount++;
  if (cart.hotel) cartCount++;
  if (cart.car) cartCount++;
  
  let cartBadge = cartCount > 0 ? ` <span class="cart-badge">${cartCount}</span>` : "";
  
  // Create login/dashboard links
  if (currentUser) {
    // Add Dashboard & Logout links
    const dashboardLink = document.createElement("a");
    dashboardLink.href = "dashboard.html";
    dashboardLink.className = "auth-link";
    dashboardLink.innerHTML = `👤 Dashboard`;
    if (window.location.pathname.includes("dashboard.html")) {
      dashboardLink.className += " active";
    }
    
    const checkoutLink = document.createElement("a");
    checkoutLink.href = "checkout.html";
    checkoutLink.className = "auth-link checkout-nav-btn";
    checkoutLink.innerHTML = `🛒 Checkout${cartBadge}`;
    if (window.location.pathname.includes("checkout.html")) {
      checkoutLink.className += " active";
    }
    
    const logoutBtn = document.createElement("a");
    logoutBtn.href = "#";
    logoutBtn.className = "auth-link logout-btn";
    logoutBtn.innerText = "Logout";
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      Auth.logout();
    });
    
    nav.appendChild(dashboardLink);
    nav.appendChild(checkoutLink);
    nav.appendChild(logoutBtn);
  } else {
    // Add Login link
    const loginLink = document.createElement("a");
    loginLink.href = "login.html";
    loginLink.className = "auth-link";
    loginLink.innerText = "Login / Sign Up";
    if (window.location.pathname.includes("login.html")) {
      loginLink.className += " active";
    }
    nav.appendChild(loginLink);
  }
}

// 2. Date Utilities
function getDaysDiff(date1Str, date2Str) {
  if (!date1Str || !date2Str) return 1;
  const d1 = new Date(date1Str);
  const d2 = new Date(date2Str);
  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays || 1;
}

// 3. Price tracking alert simulator
function initPriceAlertSimulator() {
  const currentUser = Auth.getCurrentUser();
  if (!currentUser) return;
  
  const alerts = DB.getPriceAlerts(currentUser.id);
  if (alerts.length === 0) return;
  
  // Every 25 seconds, simulate a random price change notification
  setInterval(() => {
    const alertsList = DB.getPriceAlerts(currentUser.id);
    if (alertsList.length === 0) return;
    
    // Pick a random alert
    const randomIdx = Math.floor(Math.random() * alertsList.length);
    const alert = alertsList[randomIdx];
    
    // Price fluctuation (-10% to +10%)
    const changePct = (Math.random() * 20 - 10) / 100;
    const diff = Math.round(alert.currentPrice * changePct);
    
    if (diff === 0) return;
    
    const oldPrice = alert.currentPrice;
    const newPrice = oldPrice + diff;
    
    // Update db
    const allAlerts = JSON.parse(localStorage.getItem("tr_price_alerts") || "[]");
    const dbAlertIdx = allAlerts.findIndex(a => a.id === alert.id);
    if (dbAlertIdx !== -1) {
      allAlerts[dbAlertIdx].currentPrice = newPrice;
      localStorage.setItem("tr_price_alerts", JSON.stringify(allAlerts));
    }
    
    // Display popup alert on screen
    showToastNotification(alert.search, oldPrice, newPrice);
  }, 25000);
}

// Toast notification UI helper
function showToastNotification(searchStr, oldP, newP) {
  // Create toast container if not exists
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.style.position = "fixed";
    container.style.bottom = "20px";
    container.style.left = "20px";
    container.style.zIndex = "9999";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "10px";
    document.body.appendChild(container);
  }
  
  const toast = document.createElement("div");
  toast.className = "price-toast";
  toast.style.background = "rgba(15, 23, 42, 0.95)";
  toast.style.color = "#fff";
  toast.style.padding = "15px 20px";
  toast.style.borderRadius = "10px";
  toast.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.3)";
  toast.style.borderLeft = newP < oldP ? "5px solid #10b981" : "5px solid #ef4444";
  toast.style.transition = "all 0.5s ease";
  toast.style.opacity = "0";
  toast.style.transform = "translateY(20px)";
  
  const icon = newP < oldP ? "📉" : "📈";
  const action = newP < oldP ? "dropped" : "rose";
  const color = newP < oldP ? "#10b981" : "#ef4444";
  
  toast.innerHTML = `
    <div style="font-weight: 600; font-size: 14px; margin-bottom: 3px;">
      ${icon} Flight Price Alert!
    </div>
    <div style="font-size: 13px; color: #cbd5e1;">
      Prices for <strong>${searchStr}</strong> have ${action} from <span style="text-decoration: line-through;">₹${oldP}</span> to <span style="color:${color}; font-weight:700;">₹${newP}</span>.
    </div>
  `;
  
  container.appendChild(toast);
  
  // Animate in
  setTimeout(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  }, 100);
  
  // Remove after 6 seconds
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-20px)";
    setTimeout(() => {
      toast.remove();
    }, 500);
  }, 6000);
}

// Global expose
window.updateNavbar = updateNavbar;
window.getDaysDiff = getDaysDiff;
window.showToastNotification = showToastNotification;
