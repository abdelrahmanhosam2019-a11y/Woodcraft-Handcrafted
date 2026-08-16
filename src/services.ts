// Simulated backend services using localStorage
// In production, these would call a real API/backend

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  registeredAt: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  sentAt: string;
}

export interface EmailLog {
  id: string;
  to: string;
  subject: string;
  body: string;
  sentAt: string;
}

export interface SiteUpdate {
  id: string;
  title: string;
  message: string;
  sentAt: string;
  recipients: number;
}

export interface VisitorSession {
  id: string;
  timestamp: string;
  page: string;
}

const STORAGE_KEYS = {
  users: 'wc_users',
  messages: 'wc_messages',
  emailLog: 'wc_email_log',
  siteUpdates: 'wc_site_updates',
  visitors: 'wc_visitors',
  adminAuth: 'wc_admin_auth',
  visitorCount: 'wc_visitor_count',
  sessionTracked: 'wc_session_tracked',
};

// ADMIN CREDENTIALS
export const ADMIN_EMAIL = 'abdelrahmanhosam2019@gmail.com';
export const ADMIN_PASSWORD = 'Boda@2006';

// SUPPORT CONTACTS
export const SUPPORT_PHONE = '01080188406';
export const SUPPORT_EMAIL = 'abdelrahmanhosam2019@gmail.com';

// --- Admin Auth ---
export function isAdminLoggedIn(): boolean {
  return localStorage.getItem(STORAGE_KEYS.adminAuth) === 'true';
}

export function adminLogin(email: string, password: string): boolean {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    localStorage.setItem(STORAGE_KEYS.adminAuth, 'true');
    return true;
  }
  return false;
}

export function adminLogout() {
  localStorage.removeItem(STORAGE_KEYS.adminAuth);
}

// --- Visitor Counter ---
export function trackVisitor() {
  const tracked = localStorage.getItem(STORAGE_KEYS.sessionTracked);
  const sessionId = sessionStorage.getItem('wc_session_id');
  
  if (!tracked && !sessionId) {
    // New visitor/session
    const newId = `s_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem('wc_session_id', newId);
    localStorage.setItem(STORAGE_KEYS.sessionTracked, 'true');
    
    // Increment counter
    const current = parseInt(localStorage.getItem(STORAGE_KEYS.visitorCount) || '0', 10);
    localStorage.setItem(STORAGE_KEYS.visitorCount, String(current + 1));
    
    // Log visit
    const visits: VisitorSession[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.visitors) || '[]');
    visits.push({
      id: newId,
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
    });
    localStorage.setItem(STORAGE_KEYS.visitors, JSON.stringify(visits));
  }
}

export function getVisitorCount(): number {
  return parseInt(localStorage.getItem(STORAGE_KEYS.visitorCount) || '0', 10);
}

export function getVisitorLog(): VisitorSession[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.visitors) || '[]');
}

// --- Users / Registrations ---
export function getUsers(): User[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.users) || '[]');
}

export function registerUser(name: string, email: string, phone: string): { success: boolean; message: string } {
  const users = getUsers();
  const normalizedEmail = email.toLowerCase().trim();
  
  if (users.some(u => u.email.toLowerCase() === normalizedEmail)) {
    return { success: false, message: 'This email is already registered.' };
  }
  
  const newUser: User = {
    id: `u_${Date.now()}`,
    name: name.trim(),
    email: normalizedEmail,
    phone: phone.trim(),
    registeredAt: new Date().toISOString(),
  };
  
  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
  
  // Send welcome email
  sendEmail(
    normalizedEmail,
    'Welcome to Woodcraft — Welcome aboard',
    `Hello ${newUser.name},\n\nThank you for joining Woodcraft. We're thrilled to have you in our community of craft enthusiasts.\n\nYou'll receive updates about our new collections, exclusive offers, and craft stories.\n\nWarm regards,\nThe Woodcraft Team`
  );
  
  // Notify admin
  sendEmail(
    ADMIN_EMAIL,
    `New Registration: ${newUser.name}`,
    `A new user has registered:\n\nName: ${newUser.name}\nEmail: ${newUser.email}\nPhone: ${newUser.phone}\nTime: ${newUser.registeredAt}`
  );
  
  return { success: true, message: 'Registration successful!' };
}

// --- Messages ---
export function getMessages(): Message[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.messages) || '[]');
}

export function submitMessage(name: string, email: string, message: string) {
  const newMsg: Message = {
    id: `m_${Date.now()}`,
    name: name.trim(),
    email: email.toLowerCase().trim(),
    message: message.trim(),
    sentAt: new Date().toISOString(),
  };
  
  const msgs = getMessages();
  msgs.push(newMsg);
  localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(msgs));
  
  // Confirmation email to customer
  sendEmail(
    newMsg.email,
    'Woodcraft — We received your message',
    `Hello ${newMsg.name},\n\nThank you for reaching out. We've received your message and our support team will respond within 24 hours.\n\nYour message:\n"${newMsg.message}"\n\nBest regards,\nWoodcraft Support Team\nPhone: ${SUPPORT_PHONE}\nEmail: ${SUPPORT_EMAIL}`
  );
  
  // Notify admin
  sendEmail(
    ADMIN_EMAIL,
    `New Support Message from ${newMsg.name}`,
    `From: ${newMsg.name} (${newMsg.email})\n\n${newMsg.message}`
  );
}

// --- Email System (simulated Gmail integration) ---
export function getAdminEmailLog(): EmailLog[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.emailLog) || '[]');
}

function sendEmail(to: string, subject: string, body: string) {
  const log: EmailLog = {
    id: `e_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    to,
    subject,
    body,
    sentAt: new Date().toISOString(),
  };
  
  const logs = getAdminEmailLog();
  logs.unshift(log);
  // Keep last 500 emails
  localStorage.setItem(STORAGE_KEYS.emailLog, JSON.stringify(logs.slice(0, 500)));
  
  // In production, this would call a backend API like:
  // fetch('/api/send-email', { method: 'POST', body: JSON.stringify(log) })
  // which would then use Gmail SMTP via a service like SendGrid, Mailgun, or Gmail API
  console.log(`[Email System] To: ${to} | Subject: ${subject}`);
}

// --- Site Updates / Broadcasts ---
export function getSiteUpdates(): SiteUpdate[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.siteUpdates) || '[]');
}

export function broadcastUpdate(title: string, message: string): number {
  const users = getUsers();
  
  const update: SiteUpdate = {
    id: `upd_${Date.now()}`,
    title: title.trim(),
    message: message.trim(),
    sentAt: new Date().toISOString(),
    recipients: users.length,
  };
  
  const updates = getSiteUpdates();
  updates.unshift(update);
  localStorage.setItem(STORAGE_KEYS.siteUpdates, JSON.stringify(updates));
  
  // Send to all registered users
  users.forEach(user => {
    sendEmail(
      user.email,
      `Woodcraft Update: ${update.title}`,
      `Hello ${user.name},\n\n${update.message}\n\n— The Woodcraft Team`
    );
  });
  
  return users.length;
}

// --- Mask email helper ---
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (local.length <= 2) return email;
  const masked = local[0] + '•'.repeat(Math.min(local.length - 2, 8)) + local.slice(-1);
  return `${masked}@${domain}`;
}
