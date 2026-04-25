// Initial Data
const initialItems = [
  {
    id: 'headphones', category: 'electronics', icon: '🎧', status: 'found',
    name: 'Sony Headphones', desc: 'Black over-ear headphones, case missing.',
    location: 'Library', date: 'Jan 5', colorClass: 'bg-g', spot: 'Near main entrance',
    reporterId: '2510993585' // Default Admin as reporter for demo
  },
  {
    id: 'id', category: 'id', icon: '🪪', status: 'found',
    name: 'Student ID Card', desc: 'ID card found near cafeteria. Name visible.',
    location: 'Fleming Block', date: 'Jan 4', colorClass: 'bg-y', spot: 'N/A',
    reporterId: '2510993585'
  },
  {
    id: 'keys', category: 'keys', icon: '🔑', status: 'found',
    name: 'Key Bundle', desc: '5-key bundle with a distinctive blue smiley keychain.',
    location: 'Parking Area', date: 'Jan 4', colorClass: 'bg-b', spot: 'N/A',
    reporterId: '2510993585'
  },
  {
    id: 'bag', category: 'accessories', icon: '🎒', status: 'found',
    name: 'Navy Backpack', desc: 'Medium navy backpack with a laptop sleeve inside.',
    location: 'Turing Block', date: 'Jan 3', colorClass: 'bg-o', spot: 'N/A',
    reporterId: '2510993585'
  },
  {
    id: 'phone', category: 'electronics', icon: '📱', status: 'found',
    name: 'iPhone 13 (Black)', desc: 'Locked iPhone 13, no visible damage. Blue case.',
    location: 'Sportorium', date: 'Jan 3', colorClass: 'bg-g', spot: 'N/A',
    reporterId: '2510993585'
  },
  {
    id: 'hoodie', category: 'clothing', icon: '👕', status: 'claimed',
    name: 'Grey Hoodie', desc: 'XL grey hoodie left on a cafeteria chair. No name tag.',
    location: 'Dohful', date: 'Jan 2', colorClass: 'bg-p', spot: 'N/A',
    reporterId: '2510993585'
  },
  {
    id: 'bottle', category: 'accessories', icon: '🍶', status: 'found',
    name: 'Steel Water Bottle', desc: 'Silver insulated bottle with a university sticker.',
    location: 'Darwin Block', date: 'Jan 2', colorClass: 'bg-b', spot: 'N/A',
    reporterId: '2510993585'
  },
  {
    id: 'book', category: 'stationery', icon: '📖', status: 'found',
    name: 'Engineering Notebook', desc: 'Blue spiral notebook, name written on inside cover.',
    location: 'Library — Reading Section', date: 'Jan 1', colorClass: 'bg-y', spot: 'N/A',
    reporterId: '2510993585'
  }
];

// Map CSS pin IDs to readable location names
const pinLocations = {
  'pr-gate': 'Main Gate', 'pr-fleming': 'Fleming Block', 'pr-martin': 'Martin Luther',
  'pr-rock': 'Rockefeller', 'pr-picasso': 'Picasso Block', 'pr-explor': 'Exploratorium',
  'pr-sport': 'Sportorium', 'pr-sq1': 'Square One', 'pr-sq2': 'Square Two',
  'pr-turing': 'Turing Block', 'pr-studio': 'Studio', 'pr-demorgan': 'DeMorgan',
  'pr-library': 'Library', 'pr-darwin': 'Darwin Block', 'pr-tesla': 'Tesla Block',
  'pr-exphub': 'Explore Hub', 'pr-dice': 'Dice Lab', 'pr-hotel': 'Hotel Mgmt',
  'pr-boys': 'Boys Hostel', 'pr-girls': 'Girls Hostel', 'pr-alpha': 'Alpha Zone',
  'pr-beta': 'Beta Zone', 'pr-basket': 'Basketball', 'pr-volley': 'Volleyball',
  'pr-pickle': 'Pickleball', 'pr-football': 'Football', 'pr-parking': 'Parking Area',
  'pr-dohful': 'Dohful', 'pr-gali': 'Gallelio', 'pr-corbu': 'Le Corbusier'
};

const iconMap = {
  'Electronics': '📱', 'Clothing': '👕', 'Stationery / Books': '📚',
  'ID / Cards / Documents': '🪪', 'Keys': '🔑', 'Bags / Accessories': '🎒',
  'Jewellery / Watches': '💍', 'Food / Water Bottles': '🍱', 'Other': '🧩'
};

const catMap = {
  'Electronics': 'electronics', 'Clothing': 'clothing', 'Stationery': 'stationery', 'Stationery / Books': 'stationery',
  'ID': 'id', 'ID / Cards': 'id', 'ID / Cards / Documents': 'id', 'Keys': 'keys', 'Bags': 'accessories', 'Accessories': 'accessories', 'Bags / Accessories': 'accessories',
  'Jewellery': 'accessories', 'Jewellery / Watches': 'accessories', 'Food': 'accessories', 'Food / Water Bottles': 'accessories', 'Other': 'accessories'
};

let items = JSON.parse(localStorage.getItem('findit_items')) || initialItems;
let currentActiveItemId = null;
let currentUser = localStorage.getItem('findit_user');

// ---- ADMIN CONFIGURATION ----
// Add any Roll Numbers here that you want to have Admin access
const adminList = ['2510993585']; 

document.addEventListener('DOMContentLoaded', () => {
  renderItems();
  checkLoginState();
  updateTicker(); // Activate the scrolling radar
  setupForm();
  setupImageUpload();
  setupContactForm();
});


function renderItems() {
  const container = document.getElementById('items-container');
  if (!container) return;

  container.innerHTML = '';

  // Update stats on the page dynamically
  const activeListings = items.filter(i => i.status === 'found').length;
  document.querySelectorAll('.hstat-num, .astat .n').forEach(el => {
    if (el.textContent.includes('38')) {
      el.innerHTML = activeListings;
    }
  });

  items.forEach(item => {
    const isClaimed = item.status === 'claimed';
    const isPending = item.status === 'pending';

    let statusClass = 's-found';
    if (isClaimed) statusClass = 's-claimed';
    if (isPending) statusClass = 's-pending';

    let statusText = item.status.charAt(0).toUpperCase() + item.status.slice(1);
    if (isPending) statusText = 'Claim Pending';

    const btnClass = (isClaimed || isPending) ? 'item-btn-claimed' : '';
    let btnText = 'View & Claim →';
    if (isClaimed) btnText = 'Resolved';
    if (isPending) btnText = 'Verification Pending 🟠';

    let catDisplay = item.category.charAt(0).toUpperCase() + item.category.slice(1);
    if (item.category === 'id') catDisplay = 'ID / Cards';

    const card = document.createElement('a');
    card.href = (isClaimed) ? '#page-browse' : '#item-modal';
    card.className = 'item-card';
    card.dataset.cat = item.category;
    card.dataset.status = item.status;

    if (!isClaimed) {
      card.setAttribute('onclick', `openModal('${item.id}')`);
    }

    let badgeStyle = '';
    if (isPending) badgeStyle = 'background: #fff3cc; color: #b28900;';

    card.innerHTML = `
      <div class="item-img ${item.colorClass}"><span>${item.icon}</span><span class="item-status ${statusClass}" style="${badgeStyle}">${statusText}</span></div>
      <div class="item-body">
        <div class="item-cat">${catDisplay}</div>
        <div class="item-name">${item.name}</div>
        <div class="item-desc">${item.desc}</div>
        <div class="item-footer">
          <div class="item-loc">📍 ${item.location}</div>
          <div class="item-date">${item.date}</div>
        </div>
        <div class="item-btn ${btnClass}">${btnText}</div>
      </div>
    `;
    container.appendChild(card);
  });
}

function updateTicker() {
  const tickerContainer = document.getElementById('ticker-content');
  if (!tickerContainer) return;

  const foundItems = items.filter(i => i.status === 'found').slice(0, 8);
  if (foundItems.length === 0) {
    tickerContainer.innerHTML = '<span class="t-item" style="margin-right:40px;">📡 No new items found recently...</span>';
    return;
  }

  tickerContainer.innerHTML = foundItems.map(item => `
    <span class="t-item" style="margin-right: 40px;">
      <span style="background:var(--green); color:#fff; padding:2px 8px; border-radius:4px; font-size:0.7rem; margin-right:8px;">FOUND</span> 
      Just now: <strong>${item.name}</strong> at ${item.location}
    </span>
  `).join('');
}

function openModal(id) {
  const item = items.find(i => i.id === id);
  if (!item) return;

  logUserActivity("Viewed Item", `Looking at ${item.name} (${item.category})`);

  currentActiveItemId = id;

  const defaultActions = document.getElementById('modal-actions-default');
  const claimForm = document.getElementById('modal-claim-form');
  const pendingMsg = document.getElementById('modal-pending-msg');
  const sidEl = document.getElementById('claim-studentid');
  const proofEl = document.getElementById('claim-proof');

  if (defaultActions) defaultActions.style.display = 'flex';
  if (claimForm) claimForm.style.display = 'none';
  if (pendingMsg) pendingMsg.style.display = 'none';

  if (sidEl) {
    sidEl.value = '';
    sidEl.disabled = false;
    sidEl.style.backgroundColor = '#fff';
  }
  if (proofEl) proofEl.value = '';

  const claimImgEl = document.getElementById('claim-proof-img');
  const claimUploadTxtEl = document.getElementById('claim-upload-text');
  const claimNameEl = document.getElementById('claim-name');
  if (claimNameEl) claimNameEl.value = '';
  if (claimImgEl) claimImgEl.value = '';
  if (claimUploadTxtEl) claimUploadTxtEl.textContent = "Click to upload or take a photo";

  if (item.status === 'pending') {
    if (defaultActions) defaultActions.style.display = 'none';
    if (pendingMsg) pendingMsg.style.display = 'block';
  }

  const iconEl = document.getElementById('modal-icon');

  // Remove existing bg class and add the new one
  const bgClass = Array.from(iconEl.classList).find(c => c.startsWith('bg-'));
  if (bgClass) iconEl.classList.remove(bgClass);
  iconEl.classList.add(item.colorClass);

  iconEl.innerHTML = item.icon;
  document.getElementById('modal-name').textContent = item.name;

  let catDisplay = item.category.charAt(0).toUpperCase() + item.category.slice(1);
  if (item.category === 'id') catDisplay = 'ID / Cards';
  document.getElementById('modal-cat').textContent = catDisplay;

  document.getElementById('modal-date').textContent = item.date;
  document.getElementById('modal-desc').textContent = item.desc;
  document.getElementById('modal-loc-txt').textContent = `📍 ${item.location}`;
  document.getElementById('modal-spot').textContent = `Specific Spot: ${item.spot || 'N/A'}`;
}

function setupForm() {
  const form = document.getElementById('report-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('item-name').value;
    const catSelect = document.getElementById('item-cat').value;
    const date = document.getElementById('item-date').value;
    const desc = document.getElementById('item-desc').value;
    const spot = document.getElementById('item-spot').value;

    let location = 'Campus';
    const pins = document.querySelectorAll('input[name="campus-pin"]');
    for (const pin of pins) {
      if (pin.checked) {
        location = pinLocations[pin.id] || 'Campus';
        break;
      }
    }

    if (!catSelect || !date || !name || !desc) {
      alert("Please fill in all required fields!");
      return;
    }

    const dateObj = new Date(date);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedDate = `${months[dateObj.getMonth()]} ${dateObj.getDate()}`;

    const catStr = catSelect.replace(/[^\w\s/]/g, '').trim(); // Remove emojis more safely
    let mappedCat = 'accessories';
    for (const key in catMap) {
      if (catStr.includes(key)) {
        mappedCat = catMap[key];
        break;
      }
    }
    const icon = iconMap[catStr] || '🧩';

    const colors = ['bg-g', 'bg-y', 'bg-b', 'bg-o', 'bg-p'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newItem = {
      id: 'item_' + Date.now(),
      category: mappedCat,
      icon: icon,
      status: 'found',
      name: name,
      desc: desc,
      location: location,
      date: formattedDate,
      colorClass: randomColor,
      spot: spot,
      reporterId: currentUser // Track who found the item
    };

    items.unshift(newItem);
    localStorage.setItem('findit_items', JSON.stringify(items));

    renderItems();
    updateTicker(); // Show it in the scrolling radar immediately

    alert("Item reported successfully! It has been added to the Browse Items page.");
    form.reset();

    const uploadText = document.querySelector('.upload-zone p');
    if (uploadText) uploadText.textContent = "Click or drag & drop photos here";

    window.location.hash = '#page-browse';
  });
}

function setupImageUpload() {
  const fileInput = document.getElementById('item-photos');
  const uploadText = document.querySelector('.upload-zone p');

  if (fileInput && uploadText) {
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        if (e.target.files.length === 1) {
          uploadText.textContent = e.target.files[0].name;
        } else {
          uploadText.textContent = `${e.target.files.length} files selected`;
        }
      } else {
        uploadText.textContent = "Click or drag & drop photos here";
      }
    });
  }

  const claimFileInput = document.getElementById('claim-proof-img');
  const claimUploadText = document.getElementById('claim-upload-text');

  if (claimFileInput && claimUploadText) {
    claimFileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        claimUploadText.textContent = e.target.files[0].name;
      } else {
        claimUploadText.textContent = "Click to upload or take a photo";
      }
    });
  }
}

function showClaimForm() {
  document.getElementById('modal-actions-default').style.display = 'none';
  document.getElementById('modal-claim-form').style.display = 'block';
}

function submitClaim() {
  const name = document.getElementById('claim-name').value.trim();
  const sid = document.getElementById('claim-studentid').value.trim();
  const proof = document.getElementById('claim-proof').value.trim();

  if (!name || !sid || !proof) {
    alert("Please provide your Full Name, Student ID, and Proof of Ownership.");
    return;
  }

  const itemIndex = items.findIndex(i => i.id === currentActiveItemId);
  if (itemIndex > -1) {
    items[itemIndex].status = 'pending';
    items[itemIndex].claimerId = sid;
    items[itemIndex].claimerName = name;
    localStorage.setItem('findit_items', JSON.stringify(items));

    logUserActivity("Requested Claim", `Claimed ${items[itemIndex].name}. ID: ${sid}, Name: ${name}`);
    
    // NOTIFY THE REPORTER
    const reporterId = items[itemIndex].reporterId;
    if (reporterId) {
      const notifications = JSON.parse(localStorage.getItem('findit_notifications') || '[]');
      notifications.unshift({
        id: Date.now(),
        to: reporterId,
        fromSid: sid,
        fromName: name,
        itemName: items[itemIndex].name,
        date: new Date().toLocaleString(),
        read: false
      });
      localStorage.setItem('findit_notifications', JSON.stringify(notifications));
    }
    
    alert(`Claim requested successfully!\nName: ${name}\nStudent ID: ${sid}\nThe finder has been notified and will contact you to verify your proof of ownership.`);

    window.location.hash = '#page-browse';
    renderItems();
  }
}

// ---- LOGIN LOGIC ----
function checkLoginState() {
  const loginPage = document.getElementById('login-page');
  const appContent = document.getElementById('app-content');
  const navProfileBtn = document.getElementById('nav-profile-btn');
  const mobProfileBtn = document.getElementById('mob-profile-btn');
  const profileSidText = document.getElementById('profile-sid-text');
  const adminBtn = document.getElementById('prof-admin-btn');
  const adminAnalyticsBtn = document.getElementById('prof-admin-analytics-btn');
  const adminClaimsBtn = document.getElementById('prof-admin-claims-btn');

  if (currentUser) {
    if (loginPage) loginPage.style.display = 'none';
    if (appContent) appContent.style.display = 'block';
    if (navProfileBtn) navProfileBtn.innerHTML = `👤 ${currentUser}`;
    if (mobProfileBtn) mobProfileBtn.innerHTML = `👤 ${currentUser}`;
    if (profileSidText) profileSidText.textContent = `Roll No: ${currentUser}`;

    // Only show Admin buttons for specific Roll Numbers
    if (adminBtn) {
      if (adminList.includes(currentUser)) {
        adminBtn.style.display = 'block';
        if (adminAnalyticsBtn) adminAnalyticsBtn.style.display = 'block';
        if (adminClaimsBtn) adminClaimsBtn.style.display = 'block';
      } else {
        adminBtn.style.display = 'none';
        if (adminAnalyticsBtn) adminAnalyticsBtn.style.display = 'none';
        if (adminClaimsBtn) adminClaimsBtn.style.display = 'none';
      }
    }
  } else {
    if (loginPage) loginPage.style.display = 'flex';
    if (appContent) appContent.style.display = 'none';
  }
  loadUserNotifications(); // Always check for notifications on load
}

function handleLogout() {
  if (confirm("Do you want to sign out?")) {
    localStorage.removeItem('findit_user');
    currentUser = null;
    window.location.hash = '#'; // close modal
    checkLoginState();
  }
}

function loadUserNotifications() {
  const container = document.getElementById('user-notifications-container');
  const badge = document.getElementById('notif-badge');
  if(!container) return;
  
  const allNotifs = JSON.parse(localStorage.getItem('findit_notifications') || '[]');
  const myNotifs = allNotifs.filter(n => n.to === currentUser);
  
  const unreadCount = myNotifs.filter(n => !n.read).length;
  if(badge) {
    badge.style.display = unreadCount > 0 ? 'inline-block' : 'none';
    badge.textContent = unreadCount;
  }
  
  if(myNotifs.length === 0) {
    container.innerHTML = '<p style="color:#5a6b7e; text-align:center; padding:20px;">No notifications yet.</p>';
  } else {
    container.innerHTML = myNotifs.map(n => `
      <div style="background:${n.read ? '#f8fafc' : '#fff3f3'}; padding:12px; border-radius:10px; margin-bottom:10px; border-left:4px solid ${n.read ? '#cbd5e1' : '#cc2027'};">
        <div style="font-size:0.75rem; color:#64748b; margin-bottom:4px;">${n.date}</div>
        <div style="font-size:0.9rem; color:var(--navy); line-height:1.4; margin-bottom:8px;">
          <strong>${n.fromName}</strong> (${n.fromSid}) has claimed your reported item: <strong>${n.itemName}</strong>
        </div>
        <a href="https://mail.google.com/mail/?view=cm&fs=1&to=${n.fromSid}@chitkara.edu.in&su=Regarding ${encodeURIComponent(n.itemName)}&body=Hello ${n.fromName},%0D%0A%0D%0AI saw your claim for the ${encodeURIComponent(n.itemName)} I found. Let's meet to verify your proof of ownership." 
           target="_blank" 
           style="display:inline-block; padding:6px 12px; background:var(--navy); color:#fff; text-decoration:none; border-radius:5px; font-size:0.8rem; font-weight:bold;">✉️ Send Email</a>
        <p style="font-size:0.75rem; color:#5a6b7e; margin-top:8px;">Please contact them to verify their proof of ownership.</p>
      </div>
    `).join('');
  }
}

function markNotifsRead() {
  const allNotifs = JSON.parse(localStorage.getItem('findit_notifications') || '[]');
  allNotifs.forEach(n => {
    if(n.to === currentUser) n.read = true;
  });
  localStorage.setItem('findit_notifications', JSON.stringify(allNotifs));
  loadUserNotifications();
}

function handleMainLogin() {
  const sid = document.getElementById('main-login-sid').value.trim();
  const pass = document.getElementById('main-login-pass').value.trim();
  const errorDiv = document.getElementById('login-error');

  // Reset error state
  if (errorDiv) errorDiv.style.display = 'none';

  if (!sid || !pass) {
    if (errorDiv) {
      errorDiv.textContent = "Please enter both Username and Password.";
      errorDiv.style.display = 'block';
    }
    return;
  }

  // --- PROJECT DEMO VALIDATION ---
  let currentValidPass = localStorage.getItem('findit_password') || "CUPunjab";

  if (pass !== currentValidPass) {
    if (errorDiv) {
      errorDiv.textContent = "Invalid password.";
      errorDiv.style.display = 'block';
    }
    return;
  }

  // For project mockup, accept the valid login
  currentUser = sid;
  localStorage.setItem('findit_user', currentUser);

  // Clear fields
  document.getElementById('main-login-sid').value = '';
  document.getElementById('main-login-pass').value = '';

  logUserActivity("Logged In", "Student signed into the portal.");

  window.location.hash = '#page-home';
  checkLoginState();
  loadUserNotifications();
}

// --- CHANGE PASSWORD LOGIC ---
function changePassword() {
  const oldPass = document.getElementById('prof-old-pass').value.trim();
  const newPass = document.getElementById('prof-new-pass').value.trim();
  const msgDiv = document.getElementById('prof-pass-msg');

  let currentValidPass = localStorage.getItem('findit_password') || "CUPunjab";

  if (!oldPass || !newPass) {
    msgDiv.textContent = "Please fill out both fields!";
    msgDiv.style.color = "#c53026";
    msgDiv.style.display = "block";
    return;
  }

  if (oldPass !== currentValidPass) {
    msgDiv.textContent = "Incorrect current password!";
    msgDiv.style.color = "#c53026";
    msgDiv.style.display = "block";
    return;
  }

  if (newPass.length < 5) {
    msgDiv.textContent = "New password must be at least 5 chars.";
    msgDiv.style.color = "#c53026";
    msgDiv.style.display = "block";
    return;
  }

  // Save the new password to browser storage
  localStorage.setItem('findit_password', newPass);

  msgDiv.textContent = "Password updated successfully!";
  msgDiv.style.color = "#22c55e";
  msgDiv.style.display = "block";

  // Clear the inputs
  document.getElementById('prof-old-pass').value = '';
  document.getElementById('prof-new-pass').value = '';
}

function handleForgotPassword() {
  const sid = prompt("Enter your Student ID / Roll No. to reset your password:");
  if (sid) {
    // Reset the password back to the default presentation password
    localStorage.setItem('findit_password', 'CUPunjab');
    alert(`Password reset successfully for Student ID: ${sid}\n\nYour new temporary password has been set to: CUPunjab\n\nPlease log in and change this in your Profile Settings.`);
  }
}

// --- CONTACT FORM & ADMIN INBOX ---
function setupContactForm() {
  const contactForm = document.getElementById('contact-form-ui');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('c-name').value.trim();
    const email = document.getElementById('c-email').value.trim();
    const subject = document.getElementById('c-subject').value;
    const message = document.getElementById('c-msg').value.trim();

    if (!name || !email || !message) {
      alert("Please fill in all required fields!");
      return;
    }

    const messages = JSON.parse(localStorage.getItem('findit_messages') || '[]');
    messages.unshift({
      id: Date.now(),
      name, email, subject, message, date: new Date().toLocaleString()
    });
    localStorage.setItem('findit_messages', JSON.stringify(messages));

    alert("Message sent successfully! The admin will review it shortly.");
    contactForm.reset();
  });
}

function loadAdminInbox() {
  const container = document.getElementById('admin-messages-container');
  if (!container) return;

  const messages = JSON.parse(localStorage.getItem('findit_messages') || '[]');

  if (messages.length === 0) {
    container.innerHTML = '<p style="color:#5a6b7e; text-align:center; padding:20px;">No messages yet.</p>';
  } else {
    container.innerHTML = messages.map(m => `
      <div style="background:#f8fafc; padding:15px; border-radius:10px; margin-bottom:12px; border-left:4px solid var(--navy); position:relative;">
        <div style="font-size:0.8rem; color:#5a6b7e; margin-bottom:4px;">${m.date}</div>
        <div style="font-weight:bold; color:var(--navy); font-size:1rem; margin-bottom:4px;">${m.name} <span style="font-weight:normal; font-size:0.85rem;">(${m.email})</span></div>
        <div style="font-size:0.85rem; font-weight:800; color:#cc2027; margin-bottom:8px; text-transform:uppercase;">Subject: ${m.subject}</div>
        <div style="font-size:0.95rem; color:#334155; line-height:1.5; margin-bottom:12px;">${m.message}</div>
        <div style="display:flex; gap:10px;">
          <a href="https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(m.email)}&su=${encodeURIComponent('Re: ' + m.subject)}&body=${encodeURIComponent('Hello ' + m.name + ',\n\nRegarding your message on FindIt:\n"' + m.message + '"\n\n')}" target="_blank" style="display:inline-block; padding:6px 12px; background:#ea4335; color:#fff; text-decoration:none; border-radius:5px; font-size:0.85rem; font-weight:bold;">✉️ Reply via Gmail</a>
          <button onclick="deleteAdminMessage('${m.id}')" style="padding:6px 12px; background:#e2e8f0; color:#334155; border:none; border-radius:5px; font-size:0.85rem; font-weight:bold; cursor:pointer;">🗑️ Delete</button>
        </div>
      </div>
    `).join('');
  }
}

function deleteAdminMessage(id) {
  if (!confirm("Are you sure you want to delete this message?")) return;

  let messages = JSON.parse(localStorage.getItem('findit_messages') || '[]');
  messages = messages.filter(m => m.id && m.id.toString() !== id.toString());

  localStorage.setItem('findit_messages', JSON.stringify(messages));
  loadAdminInbox();
}

function logUserActivity(action, details) {
  if (!currentUser) return; // Only log logged in users
  let analytics = JSON.parse(localStorage.getItem('findit_analytics') || '[]');
  analytics.unshift({
    sid: currentUser,
    action: action,
    details: details,
    date: new Date().toLocaleString()
  });
  if (analytics.length > 200) analytics.length = 200; // keep last 200
  localStorage.setItem('findit_analytics', JSON.stringify(analytics));
}

function loadAdminAnalytics() {
  const container = document.getElementById('admin-analytics-container');
  if (!container) return;

  const analytics = JSON.parse(localStorage.getItem('findit_analytics') || '[]');

  if (analytics.length === 0) {
    container.innerHTML = '<p style="color:#5a6b7e; text-align:center; padding:20px;">No user activity recorded yet.</p>';
  } else {
    container.innerHTML = analytics.map(a => `
      <div style="background:#f8fafc; padding:10px; border-radius:8px; margin-bottom:8px; border-left:3px solid var(--blue);">
        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
          <strong style="color:var(--navy); font-size:0.9rem;">Roll No: ${a.sid}</strong>
          <span style="font-size:0.75rem; color:#5a6b7e;">${a.date}</span>
        </div>
        <div style="font-size:0.85rem; color:#334155;">
          <span style="background:#e2e8f0; padding:2px 6px; border-radius:4px; font-weight:bold; font-size:0.75rem; display:inline-block; margin-right:5px;">${a.action}</span> 
          ${a.details}
        </div>
      </div>
    `).join('');
  }
}

function clearAnalytics() {
  if (confirm("Are you sure you want to clear all analytics data?")) {
    localStorage.removeItem('findit_analytics');
    loadAdminAnalytics();
  }
}

function loadAdminClaims() {
  const container = document.getElementById('admin-claims-container');
  if(!container) return;
  
  const allNotifs = JSON.parse(localStorage.getItem('findit_notifications') || '[]');
  
  if(allNotifs.length === 0) {
    container.innerHTML = '<p style="color:#5a6b7e; text-align:center; padding:20px;">No claims have been recorded yet.</p>';
  } else {
    container.innerHTML = allNotifs.map(c => `
      <div style="background:#f1f5f9; padding:15px; border-radius:10px; margin-bottom:12px; border-left:5px solid #4f46e5; position:relative;">
        <div style="font-size:0.75rem; color:#64748b; margin-bottom:6px;">🕒 ${c.date}</div>
        <div style="font-size:0.95rem; color:var(--navy); line-height:1.6;">
          <div style="margin-bottom:4px;"><span style="color:#4f46e5; font-weight:800;">👤 Claimed By:</span> ${c.fromName} <span style="font-size:0.85rem; color:#64748b;">(${c.fromSid})</span></div>
          <div style="margin-bottom:4px;"><span style="color:#4f46e5; font-weight:800;">📦 Item:</span> ${c.itemName}</div>
          <div style="margin-top:8px; padding-top:8px; border-top:1px dashed #cbd5e1; color:#cc2027; font-weight:bold;">
            📩 Notification Sent To: <span style="color:var(--navy);">${c.to}</span>
          </div>
        </div>
      </div>
    `).join('');
  }
}

// Hook up Category Filtering Logging
document.addEventListener("DOMContentLoaded", () => {
  const radios = document.querySelectorAll('input[name="cat"]');
  radios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.checked) {
        logUserActivity("Filtered Category", `Selected the ${e.target.id.replace('t-', '')} category tab.`);
      }
    });
  });
});
