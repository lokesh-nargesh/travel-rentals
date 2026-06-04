// User Management and Authentication Module

const Auth = {
  // Get active session user
  getCurrentUser() {
    const user = localStorage.getItem("tr_current_user");
    return user ? JSON.parse(user) : null;
  },

  // Set active session user
  setCurrentUser(user) {
    localStorage.setItem("tr_current_user", JSON.stringify(user));
  },

  // Register a new user
  register(name, email, password) {
    const usersStr = localStorage.getItem("tr_users");
    const users = usersStr ? JSON.parse(usersStr) : [];
    
    // Check if email already exists
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: "Email is already registered!" };
    }
    
    const newUser = {
      id: "usr_" + Date.now(),
      name,
      email,
      passwordHash: password, // In a mock app, plain string is fine, but styled as hash
      paymentCards: [], // Tokenized cards
      dateJoined: new Date().toLocaleDateString()
    };
    
    users.push(newUser);
    localStorage.setItem("tr_users", JSON.stringify(users));
    
    // Auto log in after registration
    this.setCurrentUser(newUser);
    return { success: true, user: newUser };
  },

  // Log in a user
  login(email, password) {
    const usersStr = localStorage.getItem("tr_users");
    const users = usersStr ? JSON.parse(usersStr) : [];
    
    const user = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === password
    );
    
    if (!user) {
      return { success: false, message: "Invalid email or password!" };
    }
    
    this.setCurrentUser(user);
    return { success: true, user };
  },

  // Log out current user
  logout() {
    localStorage.removeItem("tr_current_user");
    // Clear cart on logout to prevent mixups
    DB.clearCart();
    // Redirect to home
    window.location.href = "index.html";
  },

  // Update profile
  updateProfile(name, email, newPassword) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return { success: false, message: "No active user session!" };
    
    const usersStr = localStorage.getItem("tr_users");
    const users = usersStr ? JSON.parse(usersStr) : [];
    
    const userIdx = users.findIndex(u => u.id === currentUser.id);
    if (userIdx === -1) return { success: false, message: "User not found!" };
    
    // Check if new email conflicts with another user
    if (users.some((u, i) => i !== userIdx && u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: "Email is already taken by another account!" };
    }
    
    users[userIdx].name = name;
    users[userIdx].email = email;
    if (newPassword) {
      users[userIdx].passwordHash = newPassword;
    }
    
    localStorage.setItem("tr_users", JSON.stringify(users));
    
    // Sync current session
    this.setCurrentUser(users[userIdx]);
    return { success: true, user: users[userIdx] };
  },

  // Stored Payment Methods (Tokenization)
  getSavedCards() {
    const user = this.getCurrentUser();
    if (!user) return [];
    
    const usersStr = localStorage.getItem("tr_users");
    const users = usersStr ? JSON.parse(usersStr) : [];
    const dbUser = users.find(u => u.id === user.id);
    return dbUser ? dbUser.paymentCards || [] : [];
  },

  saveCard(cardHolder, cardNumber, expiry, cardType) {
    const user = this.getCurrentUser();
    if (!user) return { success: false, message: "Please log in to save a payment method!" };
    
    const usersStr = localStorage.getItem("tr_users");
    const users = usersStr ? JSON.parse(usersStr) : [];
    const userIdx = users.findIndex(u => u.id === user.id);
    
    if (userIdx === -1) return { success: false, message: "User not found!" };
    
    const last4 = cardNumber.replace(/\s+/g, "").slice(-4);
    const token = "tok_" + cardType.toLowerCase() + "_" + Math.random().toString(36).substr(2, 6);
    
    const newCard = {
      id: "card_" + Date.now(),
      cardHolder,
      last4,
      expiry,
      cardType, // e.g. Visa, Mastercard, AMEX
      token
    };
    
    if (!users[userIdx].paymentCards) {
      users[userIdx].paymentCards = [];
    }
    
    users[userIdx].paymentCards.push(newCard);
    localStorage.setItem("tr_users", JSON.stringify(users));
    
    // Sync current session
    this.setCurrentUser(users[userIdx]);
    return { success: true, card: newCard };
  },

  deleteCard(cardId) {
    const user = this.getCurrentUser();
    if (!user) return { success: false };
    
    const usersStr = localStorage.getItem("tr_users");
    const users = usersStr ? JSON.parse(usersStr) : [];
    const userIdx = users.findIndex(u => u.id === user.id);
    
    if (userIdx === -1) return { success: false };
    
    users[userIdx].paymentCards = (users[userIdx].paymentCards || []).filter(c => c.id !== cardId);
    localStorage.setItem("tr_users", JSON.stringify(users));
    
    // Sync current session
    this.setCurrentUser(users[userIdx]);
    return { success: true };
  }
};

// Global expose
window.Auth = Auth;
