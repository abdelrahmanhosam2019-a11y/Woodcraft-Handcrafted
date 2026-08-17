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

export interface Product {
  id: string;
  title: string;
  titleAr: string;
  category: string;
  categoryAr: string;
  price: string;
  img: string;
  description: string;
  descriptionAr: string;
  material: string;
  materialAr: string;
  dimensions: string;
  dimensionsAr: string;
  care: string;
  careAr: string;
  status: 'inStock' | 'limited' | 'madeToOrder';
  featured: boolean;
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
  products: 'wc_products',
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

// --- Products CRUD ---
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'p_1', title: 'Walnut Serving Board', titleAr: 'لوح تقديم الجوز',
    category: 'Serving', categoryAr: 'تقديم', price: '$245', img: '/images/product-1.jpg',
    description: 'Made from premium black walnut, sanded to 400 grit', descriptionAr: 'مصنوع من الجوز الأسود الفاخر، مصقول حتى 400 حبيبة',
    material: 'American Black Walnut', materialAr: 'جوز أسود أمريكي',
    dimensions: '18" × 12" × 0.75"', dimensionsAr: '45 × 30 × 2 سم',
    care: 'Hand wash only, oil monthly', careAr: 'اغسل يدوياً، زيت معدني شهرياً',
    status: 'inStock', featured: true,
  },
  {
    id: 'p_2', title: 'Oak Cutting Board', titleAr: 'لوح تقطيع البلوط',
    category: 'Cutting', categoryAr: 'تقطيع', price: '$195', img: '/images/product-2.jpg',
    description: 'End-grain construction, carved handle', descriptionAr: 'بناء من الحبوب النهائية، مقبض منحوت',
    material: 'White Oak', materialAr: 'بلوط أبيض',
    dimensions: '16" × 12" × 1.5"', dimensionsAr: '40 × 30 × 4 سم',
    care: 'Hand wash, beeswax monthly', careAr: 'اغسل يدوياً، شمع العسل شهرياً',
    status: 'inStock', featured: true,
  },
  {
    id: 'p_3', title: 'Maple Jewelry Box', titleAr: 'صندوق مجوهرات القيقب',
    category: 'Boxes', categoryAr: 'صناديق', price: '$320', img: '/images/product-3.jpg',
    description: 'Brass hinges, velvet-lined interior', descriptionAr: 'مفصلات نحاسية، بطانة مخملية',
    material: 'Hard Maple', materialAr: 'قيقب صلب',
    dimensions: '10" × 8" × 6"', dimensionsAr: '25 × 20 × 15 سم',
    care: 'Wipe with dry cloth', careAr: 'امسح بقطعة قماش جافة',
    status: 'limited', featured: true,
  },
  {
    id: 'p_4', title: 'Cherry Salad Bowl', titleAr: 'سلطة الكرز',
    category: 'Bowls', categoryAr: 'سلطانيات', price: '$185', img: '/images/product-1.jpg',
    description: 'Deep bowl from natural cherry wood', descriptionAr: 'وعاء عميق من خشب الكرز الطبيعي',
    material: 'American Cherry', materialAr: 'كرز أمريكي',
    dimensions: '11" × 5"', dimensionsAr: '28 × 12 سم',
    care: 'Wash immediately by hand', careAr: 'اغسل يدوياً فوراً',
    status: 'inStock', featured: false,
  },
  {
    id: 'p_5', title: 'Utensil Set', titleAr: 'طقم أدوات المائدة',
    category: 'Utensils', categoryAr: 'أدوات', price: '$95', img: '/images/product-2.jpg',
    description: '5-piece walnut set with holder', descriptionAr: '5 قطع من الجوز مع حامل',
    material: 'Walnut & Olive', materialAr: 'جوز وزيتون',
    dimensions: '12" × 3" × 3"', dimensionsAr: '30 × 8 × 8 سم',
    care: 'Hand wash, oil weekly', careAr: 'اغسل يدوياً، زيت أسبوعياً',
    status: 'inStock', featured: false,
  },
  {
    id: 'p_6', title: 'Charcuterie Board', titleAr: 'لوح الجبن الفاخر',
    category: 'Serving', categoryAr: 'تقديم', price: '$275', img: '/images/product-3.jpg',
    description: 'Mixed wood with unique pattern', descriptionAr: 'خشب ممزوج بتصميم فريد',
    material: 'Walnut, Oak & Maple', materialAr: 'جوز وبلوط وقيقب',
    dimensions: '20" × 14" × 0.75"', dimensionsAr: '50 × 35 × 2 سم',
    care: 'Wipe clean, oil monthly', careAr: 'امسح، زيت شهرياً',
    status: 'madeToOrder', featured: false,
  },
];

export function getProducts(): Product[] {
  const stored = localStorage.getItem(STORAGE_KEYS.products);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(DEFAULT_PRODUCTS));
    return DEFAULT_PRODUCTS;
  }
  return JSON.parse(stored);
}

export function addProduct(product: Omit<Product, 'id'>): Product {
  const products = getProducts();
  const newProduct: Product = {
    ...product,
    id: `p_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
  };
  products.push(newProduct);
  localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>): boolean {
  const products = getProducts();
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) return false;
  products[idx] = { ...products[idx], ...updates, id };
  localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
  return true;
}

export function deleteProduct(id: string): boolean {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== id);
  if (filtered.length === products.length) return false;
  localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(filtered));
  return true;
}
