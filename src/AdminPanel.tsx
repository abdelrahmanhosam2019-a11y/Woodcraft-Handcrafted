import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Lock, Mail, User, Eye, EyeOff, Users, MessageSquare,
  Send, Activity, LogOut, Shield, RefreshCw, Package, Plus, Trash2, Edit3, Save, Star
} from 'lucide-react';
import { useLang } from './i18n';
import {
  isAdminLoggedIn, adminLogin, adminLogout,
  getVisitorCount, getUsers, getMessages, getAdminEmailLog,
  getSiteUpdates, broadcastUpdate, getVisitorLog,
  maskEmail, getProducts, addProduct, updateProduct, deleteProduct
} from './services';
import type { Product } from './services';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const { t, lang } = useLang();
  const [loggedIn, setLoggedIn] = useState(isAdminLoggedIn());
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLogin(email, password)) {
      setLoggedIn(true);
      setError('');
    } else {
      setError(t('admin.invalid'));
    }
  };

  const handleLogout = () => {
    adminLogout();
    setLoggedIn(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-ink/95 backdrop-blur-xl overflow-y-auto"
        >
          <button
            onClick={onClose}
            className="fixed top-5 right-5 z-50 w-10 h-10 rounded-full glass flex items-center justify-center text-cream hover:text-amber transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="min-h-screen flex items-center justify-center p-6">
            {!loggedIn ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass rounded-3xl p-8 md:p-10 w-full max-w-md"
              >
                <div className="w-14 h-14 rounded-2xl bg-amber/10 flex items-center justify-center mx-auto mb-6">
                  <Lock className="w-7 h-7 text-amber" />
                </div>
                <h2 className="font-display text-3xl text-cream text-center mb-2">{t('admin.login')}</h2>
                <p className="text-sm text-parchment/50 text-center mb-8">
                  {lang === 'ar' ? 'دخول خاص بالمسؤول فقط' : 'Administrator access only'}
                </p>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-parchment/40" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('admin.email')}
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-parchment/30 focus:outline-none focus:border-amber/40 transition-colors"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-parchment/40" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('admin.password')}
                      className="w-full pl-11 pr-11 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-parchment/30 focus:outline-none focus:border-amber/40 transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-parchment/40 hover:text-cream transition-colors"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-amber text-ink font-bold hover:bg-amber-soft transition-colors"
                  >
                    {t('admin.signIn')}
                  </button>
                </form>
              </motion.div>
            ) : (
              <AdminDashboard onLogout={handleLogout} t={t} lang={lang} />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AdminDashboard({ onLogout, t, lang }: { onLogout: () => void; t: (k: string) => string; lang: string }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateMsg, setUpdateMsg] = useState('');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'messages' | 'emails' | 'updates' | 'visitors' | 'products'>('overview');

  const refresh = () => setRefreshKey(k => k + 1);

  useEffect(() => { refresh(); }, []);

  const visitors = getVisitorCount();
  const users = getUsers();
  const messages = getMessages();
  const emails = getAdminEmailLog();
  const updates = getSiteUpdates();
  const visitorLog = getVisitorLog();

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    broadcastUpdate(updateTitle, updateMsg);
    setUpdateTitle('');
    setUpdateMsg('');
    setBroadcastSuccess(true);
    setTimeout(() => setBroadcastSuccess(false), 3000);
    refresh();
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const tabs = [
    { id: 'overview', label: lang === 'ar' ? 'نظرة عامة' : 'Overview', icon: Activity },
    { id: 'users', label: lang === 'ar' ? 'المستخدمون' : 'Users', icon: Users },
    { id: 'messages', label: lang === 'ar' ? 'الرسائل' : 'Messages', icon: MessageSquare },
    { id: 'emails', label: lang === 'ar' ? 'البريد' : 'Emails', icon: Mail },
    { id: 'visitors', label: lang === 'ar' ? 'الزوار' : 'Visitors', icon: User },
    { id: 'updates', label: lang === 'ar' ? 'الإعلانات' : 'Updates', icon: Send },
    { id: 'products', label: lang === 'ar' ? 'المنتجات' : 'Products', icon: Package },
  ] as const;

  return (
    <div className="w-full max-w-6xl">
      {/* Header */}
      <div className="glass rounded-3xl p-6 md:p-8 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber/20 flex items-center justify-center">
            <Shield className="w-6 h-6 text-amber" />
          </div>
          <div>
            <h2 className="font-display text-2xl text-cream">{t('admin.dashboard')}</h2>
            <p className="text-xs text-parchment/40">abdelrahmanhosam•••••@gmail.com</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={refresh} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-cream transition-colors" aria-label="Refresh">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={onLogout} className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-cream hover:text-red-300 transition-colors flex items-center gap-2 text-sm">
            <LogOut className="w-4 h-4" />
            {t('admin.signOut')}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        {[
          { label: t('admin.visitors'), value: visitors.toLocaleString(), icon: Activity, color: 'from-amber/30 to-amber/5' },
          { label: t('admin.registrations'), value: users.length, icon: Users, color: 'from-emerald-400/20 to-emerald-400/5' },
          { label: t('admin.messages'), value: messages.length, icon: MessageSquare, color: 'from-sky-400/20 to-sky-400/5' },
          { label: t('admin.emails'), value: emails.length, icon: Mail, color: 'from-rose-400/20 to-rose-400/5' },
        ].map((s) => (
          <div key={s.label} className="glass rounded-2xl p-5">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-5 h-5 text-cream" />
            </div>
            <p className="font-display text-3xl text-cream">{s.value}</p>
            <p className="text-xs text-parchment/50 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="glass rounded-3xl p-2 mb-6 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id ? 'bg-amber text-ink' : 'text-parchment/60 hover:text-cream hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="glass rounded-3xl p-6 md:p-8" key={refreshKey}>
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h3 className="font-display text-xl text-cream">{lang === 'ar' ? 'آخر النشاطات' : 'Recent Activity'}</h3>
            <div className="space-y-3">
              {[...users.slice(-3).reverse().map(u => ({ type: 'user' as const, ...u, time: u.registeredAt })),
                ...messages.slice(-3).reverse().map(m => ({ type: 'message' as const, ...m, time: m.sentAt }))]
                .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
                .slice(0, 8)
                .map((item) => (
                  <div key={`${item.type}-${item.id}`} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.type === 'user' ? 'bg-emerald-500/20' : 'bg-sky-500/20'}`}>
                      {item.type === 'user' ? <Users className="w-4 h-4 text-emerald-300" /> : <MessageSquare className="w-4 h-4 text-sky-300" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-cream truncate">
                        {item.type === 'user'
                          ? `${lang === 'ar' ? 'مستخدم جديد:' : 'New user:'} ${item.name}`
                          : `${lang === 'ar' ? 'رسالة من:' : 'Message from:'} ${item.name}`}
                      </p>
                      <p className="text-xs text-parchment/40">{formatDate(item.time)}</p>
                    </div>
                  </div>
                ))}
              {users.length === 0 && messages.length === 0 && (
                <p className="text-sm text-parchment/40 text-center py-8">{t('admin.noData')}</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <h3 className="font-display text-xl text-cream mb-4">{t('admin.regList')} ({users.length})</h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {users.length === 0 ? (
                <p className="text-sm text-parchment/40 text-center py-8">{t('admin.noData')}</p>
              ) : users.map((u) => (
                <div key={u.id} className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <p className="text-cream font-medium">{u.name}</p>
                      <p className="text-xs text-parchment/40">{u.email}</p>
                      <p className="text-xs text-parchment/40">{u.phone || '-'}</p>
                    </div>
                    <p className="text-xs text-parchment/40">{formatDate(u.registeredAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div>
            <h3 className="font-display text-xl text-cream mb-4">{t('admin.msgList')} ({messages.length})</h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-sm text-parchment/40 text-center py-8">{t('admin.noData')}</p>
              ) : messages.slice().reverse().map((m) => (
                <div key={m.id} className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
                    <div>
                      <p className="text-cream font-medium">{m.name}</p>
                      <p className="text-xs text-parchment/40">{m.email}</p>
                    </div>
                    <p className="text-xs text-parchment/40">{formatDate(m.sentAt)}</p>
                  </div>
                  <p className="text-sm text-parchment/70 whitespace-pre-wrap">{m.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'emails' && (
          <div>
            <h3 className="font-display text-xl text-cream mb-4">{t('admin.emailLog')} ({emails.length})</h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {emails.length === 0 ? (
                <p className="text-sm text-parchment/40 text-center py-8">{t('admin.noData')}</p>
              ) : emails.map((e) => (
                <details key={e.id} className="p-4 rounded-xl bg-white/5 border border-white/5 group">
                  <summary className="flex items-start justify-between gap-4 cursor-pointer list-none">
                    <div className="flex-1 min-w-0">
                      <p className="text-cream font-medium truncate">{e.subject}</p>
                      <p className="text-xs text-parchment/40">→ {maskEmail(e.to)}</p>
                    </div>
                    <p className="text-xs text-parchment/40 whitespace-nowrap">{formatDate(e.sentAt)}</p>
                  </summary>
                  <p className="text-sm text-parchment/70 whitespace-pre-wrap mt-3 pt-3 border-t border-white/5">{e.body}</p>
                </details>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'visitors' && (
          <div>
            <h3 className="font-display text-xl text-cream mb-4">{t('admin.visitorLog')} ({visitorLog.length})</h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {visitorLog.length === 0 ? (
                <p className="text-sm text-parchment/40 text-center py-8">{t('admin.noData')}</p>
              ) : visitorLog.slice().reverse().map((v) => (
                <div key={v.id} className="p-3 rounded-xl bg-white/5 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-cream font-mono">{v.id}</p>
                    <p className="text-xs text-parchment/40">{v.page}</p>
                  </div>
                  <p className="text-xs text-parchment/40">{formatDate(v.timestamp)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'updates' && (
          <div>
            <h3 className="font-display text-xl text-cream mb-4">{t('admin.updateSite')}</h3>
            <form onSubmit={handleBroadcast} className="space-y-3 mb-6">
              <input
                type="text"
                value={updateTitle}
                onChange={(e) => setUpdateTitle(e.target.value)}
                placeholder={t('admin.updateTitle')}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-parchment/30 focus:outline-none focus:border-amber/40"
                required
              />
              <textarea
                value={updateMsg}
                onChange={(e) => setUpdateMsg(e.target.value)}
                placeholder={t('admin.updateMsg')}
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-parchment/30 focus:outline-none focus:border-amber/40 resize-none"
                required
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber text-ink font-semibold hover:bg-amber-soft transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {t('admin.broadcast')}
              </button>
              {broadcastSuccess && (
                <p className="text-sm text-emerald-300">{t('admin.broadcastSuccess')}</p>
              )}
            </form>

            <h4 className="font-display text-lg text-cream mb-3">{lang === 'ar' ? 'سجل الإعلانات' : 'Update History'}</h4>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {updates.length === 0 ? (
                <p className="text-sm text-parchment/40 text-center py-8">{t('admin.noData')}</p>
              ) : updates.map((u) => (
                <div key={u.id} className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-start justify-between gap-4 flex-wrap mb-1">
                    <p className="text-cream font-medium">{u.title}</p>
                    <p className="text-xs text-parchment/40">{formatDate(u.sentAt)}</p>
                  </div>
                  <p className="text-sm text-parchment/60">{u.message}</p>
                  <p className="text-xs text-parchment/40 mt-2">→ {u.recipients} {lang === 'ar' ? 'مستلم' : 'recipients'}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <ProductsTab lang={lang} />
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PRODUCTS TAB                                                        */
/* ------------------------------------------------------------------ */
function ProductsTab({ lang }: { lang: string }) {
  const [products, setProducts] = useState<Product[]>(getProducts());
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const emptyForm: Omit<Product, 'id'> = {
    title: '', titleAr: '',
    category: '', categoryAr: '',
    price: '', img: '/images/product-1.jpg',
    description: '', descriptionAr: '',
    material: '', materialAr: '',
    dimensions: '', dimensionsAr: '',
    care: '', careAr: '',
    status: 'inStock', featured: false,
  };
  const [form, setForm] = useState<Omit<Product, 'id'>>(emptyForm);

  const refresh = () => setProducts(getProducts());

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, form);
    } else {
      addProduct(form);
    }
    setShowForm(false);
    setEditingProduct(null);
    setForm(emptyForm);
    refresh();
  };

  const handleEdit = (p: Product) => {
    setEditingProduct(p);
    setForm({ ...p });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    setConfirmDelete(null);
    refresh();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
    setForm(emptyForm);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h3 className="font-display text-xl text-cream">
          {lang === 'ar' ? 'إدارة المنتجات' : 'Manage Products'} ({products.length})
        </h3>
        {!showForm && (
          <button
            onClick={() => { setEditingProduct(null); setForm(emptyForm); setShowForm(true); }}
            className="px-4 py-2.5 rounded-xl bg-amber text-ink font-semibold hover:bg-amber-soft transition-colors flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            {lang === 'ar' ? 'إضافة منتج' : 'Add Product'}
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="mb-6 p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
          <h4 className="font-display text-lg text-cream">
            {editingProduct
              ? (lang === 'ar' ? 'تعديل منتج' : 'Edit Product')
              : (lang === 'ar' ? 'منتج جديد' : 'New Product')}
          </h4>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-parchment/50 mb-1">Title (EN)</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-cream text-sm focus:outline-none focus:border-amber/40" />
            </div>
            <div>
              <label className="block text-xs text-parchment/50 mb-1">العنوان (AR)</label>
              <input value={form.titleAr} onChange={e => setForm({ ...form, titleAr: e.target.value })} required dir="rtl"
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-cream text-sm focus:outline-none focus:border-amber/40" />
            </div>
            <div>
              <label className="block text-xs text-parchment/50 mb-1">Category (EN)</label>
              <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-cream text-sm focus:outline-none focus:border-amber/40" />
            </div>
            <div>
              <label className="block text-xs text-parchment/50 mb-1">التصنيف (AR)</label>
              <input value={form.categoryAr} onChange={e => setForm({ ...form, categoryAr: e.target.value })} required dir="rtl"
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-cream text-sm focus:outline-none focus:border-amber/40" />
            </div>
            <div>
              <label className="block text-xs text-parchment/50 mb-1">Price</label>
              <input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required placeholder="$0"
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-cream text-sm focus:outline-none focus:border-amber/40" />
            </div>
            <div>
              <label className="block text-xs text-parchment/50 mb-1">Image URL</label>
              <input value={form.img} onChange={e => setForm({ ...form, img: e.target.value })} required
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-cream text-sm focus:outline-none focus:border-amber/40" />
            </div>
            <div>
              <label className="block text-xs text-parchment/50 mb-1">Description (EN)</label>
              <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-cream text-sm focus:outline-none focus:border-amber/40" />
            </div>
            <div>
              <label className="block text-xs text-parchment/50 mb-1">الوصف (AR)</label>
              <input value={form.descriptionAr} onChange={e => setForm({ ...form, descriptionAr: e.target.value })} required dir="rtl"
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-cream text-sm focus:outline-none focus:border-amber/40" />
            </div>
            <div>
              <label className="block text-xs text-parchment/50 mb-1">Material (EN)</label>
              <input value={form.material} onChange={e => setForm({ ...form, material: e.target.value })} required
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-cream text-sm focus:outline-none focus:border-amber/40" />
            </div>
            <div>
              <label className="block text-xs text-parchment/50 mb-1">المادة (AR)</label>
              <input value={form.materialAr} onChange={e => setForm({ ...form, materialAr: e.target.value })} required dir="rtl"
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-cream text-sm focus:outline-none focus:border-amber/40" />
            </div>
            <div>
              <label className="block text-xs text-parchment/50 mb-1">Dimensions (EN)</label>
              <input value={form.dimensions} onChange={e => setForm({ ...form, dimensions: e.target.value })} required
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-cream text-sm focus:outline-none focus:border-amber/40" />
            </div>
            <div>
              <label className="block text-xs text-parchment/50 mb-1">الأبعاد (AR)</label>
              <input value={form.dimensionsAr} onChange={e => setForm({ ...form, dimensionsAr: e.target.value })} required dir="rtl"
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-cream text-sm focus:outline-none focus:border-amber/40" />
            </div>
            <div>
              <label className="block text-xs text-parchment/50 mb-1">Care (EN)</label>
              <input value={form.care} onChange={e => setForm({ ...form, care: e.target.value })} required
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-cream text-sm focus:outline-none focus:border-amber/40" />
            </div>
            <div>
              <label className="block text-xs text-parchment/50 mb-1">العناية (AR)</label>
              <input value={form.careAr} onChange={e => setForm({ ...form, careAr: e.target.value })} required dir="rtl"
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-cream text-sm focus:outline-none focus:border-amber/40" />
            </div>
            <div>
              <label className="block text-xs text-parchment/50 mb-1">Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Product['status'] })}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-cream text-sm focus:outline-none focus:border-amber/40">
                <option value="inStock">{lang === 'ar' ? 'متوفر' : 'In Stock'}</option>
                <option value="limited">{lang === 'ar' ? 'محدود' : 'Limited'}</option>
                <option value="madeToOrder">{lang === 'ar' ? 'حسب الطلب' : 'Made to Order'}</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer py-2.5">
                <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-amber focus:ring-amber/40" />
                <Star className="w-4 h-4 text-amber" />
                <span className="text-sm text-cream">{lang === 'ar' ? 'منتج مميز' : 'Featured'}</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber text-ink font-semibold hover:bg-amber-soft transition-colors flex items-center gap-2 text-sm">
              <Save className="w-4 h-4" />
              {editingProduct ? (lang === 'ar' ? 'حفظ التعديلات' : 'Save Changes') : (lang === 'ar' ? 'إضافة' : 'Add Product')}
            </button>
            <button type="button" onClick={handleCancel}
              className="px-5 py-2.5 rounded-xl bg-white/5 text-cream hover:bg-white/10 transition-colors text-sm">
              {lang === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {products.length === 0 ? (
          <p className="text-sm text-parchment/40 text-center py-8">
            {lang === 'ar' ? 'لا يوجد منتجات' : 'No products yet'}
          </p>
        ) : products.map((p) => (
          <div key={p.id} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-4">
            <img src={p.img} alt={p.title} className="w-16 h-16 rounded-lg object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-cream font-medium truncate">{lang === 'ar' ? p.titleAr : p.title}</p>
                {p.featured && <Star className="w-3 h-3 text-amber shrink-0" fill="currentColor" />}
              </div>
              <p className="text-xs text-parchment/40">{lang === 'ar' ? p.categoryAr : p.category} · {p.price}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  p.status === 'inStock' ? 'bg-emerald-500/20 text-emerald-300'
                  : p.status === 'limited' ? 'bg-amber/20 text-amber'
                  : 'bg-sky-500/20 text-sky-300'
                }`}>
                  {p.status === 'inStock' ? (lang === 'ar' ? 'متوفر' : 'In Stock')
                    : p.status === 'limited' ? (lang === 'ar' ? 'محدود' : 'Limited')
                    : (lang === 'ar' ? 'حسب الطلب' : 'Made to Order')}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => handleEdit(p)}
                className="p-2 rounded-lg bg-white/5 hover:bg-amber/20 text-cream hover:text-amber transition-colors"
                aria-label="Edit">
                <Edit3 className="w-4 h-4" />
              </button>
              {confirmDelete === p.id ? (
                <div className="flex items-center gap-1">
                  <button onClick={() => handleDelete(p.id)}
                    className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 text-xs font-medium hover:bg-red-500/30 transition-colors">
                    {lang === 'ar' ? 'تأكيد' : 'Yes'}
                  </button>
                  <button onClick={() => setConfirmDelete(null)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 text-cream text-xs hover:bg-white/10 transition-colors">
                    {lang === 'ar' ? 'إلغاء' : 'No'}
                  </button>
                </div>
              ) : (
                <button onClick={() => setConfirmDelete(p.id)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-cream hover:text-red-300 transition-colors"
                  aria-label="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
