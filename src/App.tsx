import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, ArrowRight, Check, ChevronDown, ChevronUp,
  Star, ShieldCheck, Truck, Sparkles, Phone, Mail, Send,
  Globe, Shield, Ruler, Package, Heart, ShoppingCart
} from 'lucide-react';
import { LangProvider, useLang } from './i18n';
import { AdminPanel } from './AdminPanel';
import { registerUser, submitMessage, trackVisitor, SUPPORT_PHONE, SUPPORT_EMAIL, maskEmail, getProducts } from './services';

/* ------------------------------------------------------------------ */
/*  LANGUAGE SWITCHER                                                    */
/* ------------------------------------------------------------------ */
function LanguageSwitcher() {
  const { lang, setLang } = useLang();
  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
      className="flex items-center gap-1.5 text-xs font-medium text-parchment/60 hover:text-cream transition-colors px-3 py-1.5 rounded-full border border-white/10 hover:border-white/20"
      aria-label="Switch language"
    >
      <Globe className="w-3.5 h-3.5" />
      {lang === 'en' ? 'العربية' : 'English'}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  NAVBAR                                                              */
/* ------------------------------------------------------------------ */
function Navbar({ onOpenAdmin }: { onOpenAdmin: () => void }) {
  const { t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: t('products.tag'), href: '#products' },
    { label: t('nav.features'), href: '#features' },
    { label: t('nav.showcase'), href: '#showcase' },
    { label: t('nav.pricing'), href: '#pricing' },
    { label: t('nav.support'), href: '#support' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'py-3 glass' : 'py-5 bg-transparent'
        }`}
        aria-label="Main navigation"
      >
        <div className="mx-auto max-w-7xl px-6 md:px-10 flex items-center justify-between gap-3">
          <a href="#" className="flex items-center gap-2.5 group shrink-0" aria-label="Woodcraft home">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber to-amber-deep flex items-center justify-center shadow-[0_0_20px_rgba(194,136,58,0.3)] group-hover:shadow-[0_0_25px_rgba(194,136,58,0.45)] transition-shadow">
              <Sparkles className="w-4.5 h-4.5 text-ink-soft" strokeWidth={2.5} />
            </div>
            <span className="font-display text-xl tracking-tight text-cream">Woodcraft</span>
          </a>

          <div className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-parchment/70 hover:text-cream transition-colors underline-elegant relative"
              >
                {l.label}
              </a>
            ))}
            <LanguageSwitcher />
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 text-xs font-medium text-parchment/60 hover:text-amber transition-colors px-3 py-1.5 rounded-full border border-white/10 hover:border-amber/30"
              aria-label="Admin panel"
            >
              <Shield className="w-3.5 h-3.5" />
              {t('nav.admin')}
            </button>
          </div>

          <div className="hidden md:block">
            <a
              href="#pricing"
              className="inline-flex items-center gap-2 rounded-full bg-cream text-ink px-5 py-2.5 text-sm font-semibold hover:bg-amber-soft transition-colors shadow-[0_4px_24px_rgba(246,242,234,0.1)] hover:shadow-[0_8px_32px_rgba(246,242,234,0.2)]"
            >
              {t('nav.getStarted')} <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-cream p-2 hover:text-amber transition-colors"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-ink-soft/95 backdrop-blur-xl md:hidden pt-24 px-8"
          >
            <div className="flex flex-col gap-6">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-2xl font-display text-cream hover:text-amber transition-colors"
                >
                  {l.label}
                </a>
              ))}
              <div className="flex gap-3 pt-4">
                <LanguageSwitcher />
                <button
                  onClick={() => { onOpenAdmin(); setMobileOpen(false); }}
                  className="flex items-center gap-1.5 text-sm font-medium text-parchment/60 hover:text-amber transition-colors px-3 py-1.5 rounded-full border border-white/10"
                >
                  <Shield className="w-4 h-4" />
                  {t('nav.admin')}
                </button>
              </div>
              <a
                href="#pricing"
                onClick={() => setMobileOpen(false)}
                className="mt-4 inline-flex items-center justify-center rounded-full bg-amber text-ink px-6 py-3.5 text-base font-semibold"
              >
                {t('nav.getStarted')}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  HERO                                                                */
/* ------------------------------------------------------------------ */
function Hero() {
  const { t } = useLang();
  return (
    <section id="hero" className="relative min-h-[100dvh] flex items-center overflow-hidden">
      <div className="glow-amber w-[600px] h-[600px] bg-amber-deep/40 top-[-20%] left-[-10%]" />
      <div className="glow-amber w-[500px] h-[500px] bg-amber/20 bottom-[-15%] right-[-10%]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 pt-32 pb-20 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-6 items-center">
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="inline-block text-xs uppercase tracking-[0.2em] text-amber font-medium mb-6">
                {t('hero.badge')}
              </span>
            </motion.div>

            <motion.h1
              className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[0.95] tracking-tight text-cream mb-8"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {t('hero.title1')}
              <br />
              <span className="italic text-amber-soft">{t('hero.title2')}</span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-parchment/70 leading-relaxed max-w-lg mb-10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              {t('hero.desc')}
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <a
                href="#pricing"
                className="inline-flex items-center gap-2.5 rounded-full bg-cream text-ink px-7 py-3.5 text-sm font-semibold hover:bg-amber-soft transition-all duration-300 shadow-[0_8px_32px_rgba(246,242,234,0.12)] hover:shadow-[0_12px_40px_rgba(246,242,234,0.22)] hover:-translate-y-0.5"
              >
                {t('hero.cta1')} <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#showcase"
                className="inline-flex items-center gap-2.5 rounded-full border border-cream/15 text-cream px-7 py-3.5 text-sm font-medium hover:bg-white/5 hover:border-cream/25 transition-all duration-300"
              >
                {t('hero.cta2')}
              </a>
            </motion.div>
          </div>

          <motion.div
            className="lg:col-span-6 relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-[0_40px_80px_-20px_rgba(194,136,58,0.2)]">
              <img
                src="/images/hero-wood.jpg"
                alt="Handcrafted wooden pieces"
                className="w-full h-auto object-cover aspect-[4/5] md:aspect-[4/3] hover:scale-[1.02] transition-transform duration-700"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-ink/10 pointer-events-none" />
            </div>
            <motion.div
              className="absolute -bottom-6 -left-4 md:left-8 glass rounded-2xl px-5 py-4 shadow-2xl"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber/20 flex items-center justify-center">
                  <Star className="w-5 h-5 text-amber" fill="currentColor" />
                </div>
                <div>
                  <p className="text-xs text-parchment/50">{t('hero.ratingLabel')}</p>
                  <p className="text-lg font-display text-cream">4.9 / 5.0</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  SOCIAL PROOF                                                        */
/* ------------------------------------------------------------------ */
function SocialProof() {
  const { t } = useLang();
  const stats = [
    { value: '12K+', label: t('social.stat1') },
    { value: '87', label: t('social.stat2') },
    { value: '28', label: t('social.stat3') },
    { value: '4.9', label: t('social.stat4') },
  ];

  return (
    <section className="relative z-10 -mt-8 mx-auto max-w-7xl px-6 md:px-10">
      <div className="glass rounded-3xl px-8 md:px-12 py-10 md:py-12 shadow-2xl">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="text-center md:text-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <p className="font-display text-4xl md:text-5xl text-cream tracking-tight">{s.value}</p>
              <p className="text-sm text-parchment/50 mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 pt-8 border-t border-white/5 flex flex-wrap items-center justify-center gap-6 md:gap-12 text-parchment/30 text-sm font-medium tracking-wide uppercase">
          <span>{t('social.featured')}</span>
          {['Architectural Digest', 'Dwell', 'Wallpaper*', 'Monocle'].map((n) => (
            <span key={n} className="hover:text-parchment/60 transition-colors cursor-default">{n}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  FEATURES                                                            */
/* ------------------------------------------------------------------ */
function Features() {
  const { t } = useLang();
  const features = [
    { icon: Sparkles, title: t('features.f1.title'), desc: t('features.f1.desc') },
    { icon: ShieldCheck, title: t('features.f2.title'), desc: t('features.f2.desc') },
    { icon: Truck, title: t('features.f3.title'), desc: t('features.f3.desc') },
  ];

  return (
    <section id="features" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="max-w-2xl mb-16 md:mb-24">
          <span className="text-xs uppercase tracking-[0.2em] text-amber font-medium mb-4 block">{t('features.tag')}</span>
          <h2 className="font-display text-4xl md:text-6xl tracking-tight text-cream leading-[1.05] mb-6">
            {t('features.title1')} <span className="italic text-amber-soft">{t('features.title2')}</span> {t('features.title3')}
          </h2>
          <p className="text-lg text-parchment/60 leading-relaxed">{t('features.subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.a
              href="#pricing"
              key={f.title}
              className="group relative block glass rounded-3xl p-8 md:p-10 glass-hover transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(194,136,58,0.08)]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber/20 to-amber-deep/10 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                <f.icon className="w-6 h-6 text-amber" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-2xl text-cream mb-4">{f.title}</h3>
              <p className="text-parchment/60 leading-relaxed">{f.desc}</p>
              <div className="mt-6 flex items-center gap-2 text-amber text-sm font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                {t('features.learnMore')} <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  PRODUCTS SECTION - PROMINENT                                         */
/* ------------------------------------------------------------------ */
function ProductsSection() {
  const { t, lang } = useLang();
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

  const rawProducts = getProducts();
  const products = rawProducts.map(p => ({
    id: parseInt(p.id.replace(/\D/g, ''), 10) || Math.random(),
    title: lang === 'ar' ? p.titleAr : p.title,
    category: lang === 'ar' ? p.categoryAr : p.category,
    price: p.price,
    img: p.img,
    description: lang === 'ar' ? p.descriptionAr : p.description,
    material: lang === 'ar' ? p.materialAr : p.material,
    dimensions: lang === 'ar' ? p.dimensionsAr : p.dimensions,
    care: lang === 'ar' ? p.careAr : p.care,
    status: p.status,
    featured: p.featured,
  }));

  return (
    <section id="products" className="relative py-28 md:py-36 overflow-hidden">
      <div className="glow-amber w-[600px] h-[600px] bg-amber-deep/20 top-[-10%] right-[-10%]" />
      <div className="glow-amber w-[500px] h-[500px] bg-amber/15 bottom-[10%] left-[-10%]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10">
        <div className="text-center mb-16 md:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-xs uppercase tracking-[0.2em] text-amber font-medium mb-4"
          >
            {t('products.tag')}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-6xl lg:text-7xl tracking-tight text-cream leading-[1.05] mb-6"
          >
            {t('products.title1')} <span className="italic text-amber-soft">{t('products.title2')}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-parchment/60 max-w-2xl mx-auto leading-relaxed"
          >
            {t('products.subtitle')}
          </motion.p>
        </div>

        {/* Featured Products - Large Cards */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {products.filter(p => p.featured).map((product, i) => (
            <motion.div
              key={product.id}
              className="group relative glass rounded-3xl overflow-hidden border border-white/5 hover:border-amber/20 transition-all duration-500"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
            >
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative overflow-hidden aspect-square md:aspect-auto">
                  <img
                    src={product.img}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {product.status === 'limited' && (
                      <span className="px-3 py-1 rounded-full bg-amber text-ink text-xs font-bold uppercase tracking-wider">
                        {t('products.limited')}
                      </span>
                    )}
                    {product.status === 'inStock' && (
                      <span className="px-3 py-1 rounded-full bg-emerald-500/80 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                        {t('products.inStock')}
                      </span>
                    )}
                    {product.status === 'madeToOrder' && (
                      <span className="px-3 py-1 rounded-full bg-sky-500/80 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                        {t('products.madeToOrder')}
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-amber/70 font-medium">{product.category}</span>
                    <h3 className="font-display text-3xl text-cream mt-2 mb-3">{product.title}</h3>
                    <p className="text-parchment/60 text-sm leading-relaxed mb-4">{product.description}</p>
                    <p className="font-display text-4xl text-amber-soft mb-6">{product.price}</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm text-parchment/50">
                      <Package className="w-4 h-4 text-amber" />
                      <span>{t('products.material')}: <span className="text-cream">{product.material}</span></span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-parchment/50">
                      <Ruler className="w-4 h-4 text-amber" />
                      <span>{t('products.dimensions')}: <span className="text-cream" dir="ltr">{product.dimensions}</span></span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-parchment/50">
                      <Heart className="w-4 h-4 text-amber" />
                      <span>{t('products.care')}: <span className="text-cream">{product.care}</span></span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <a
                      href="#pricing"
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-amber text-ink px-5 py-3 text-sm font-bold hover:bg-amber-soft transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {t('products.addToCart')}
                    </a>
                    <button
                      onClick={() => setSelectedProduct(selectedProduct === product.id ? null : product.id)}
                      className="px-5 py-3 rounded-full border border-cream/15 text-cream hover:bg-white/5 transition-colors"
                    >
                      {t('products.viewDetails')}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {selectedProduct === product.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="overflow-hidden border-t border-white/5 bg-white/2"
                  >
                    <div className="p-6 md:p-8">
                      <h4 className="font-display text-xl text-cream mb-4">{lang === 'ar' ? 'تفاصيل إضافية' : 'Additional Details'}</h4>
                      <p className="text-parchment/60 text-sm leading-relaxed mb-4">
                        {lang === 'ar'
                          ? 'كل قطعة مصنوعة يدوياً بواسطة حرفيين مهرة في ورشتنا بفيرمونت. نستخدم فقط الخشب المستدام المعتمد من FSC. كل لوحة فريدة بنمط حبيباتها الخاص.'
                          : 'Each piece is handcrafted by master artisans in our Vermont workshop. We use only FSC-certified sustainable wood. Every board is unique with its own grain pattern.'}
                      </p>
                      <div className="flex flex-wrap gap-4 text-xs text-parchment/40">
                        <span className="px-3 py-1 rounded-full bg-white/5">{lang === 'ar' ? 'ضمان مدى الحياة' : 'Lifetime Warranty'}</span>
                        <span className="px-3 py-1 rounded-full bg-white/5">{lang === 'ar' ? 'شحن مجاني' : 'Free Shipping'}</span>
                        <span className="px-3 py-1 rounded-full bg-white/5">{lang === 'ar' ? 'إرجاع خلال 30 يوم' : '30-Day Returns'}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Additional Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.filter(p => !p.featured).map((product, i) => (
            <motion.div
              key={product.id}
              className="group glass rounded-3xl overflow-hidden border border-white/5 hover:border-amber/20 transition-all duration-500 hover:-translate-y-1"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={product.img}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="text-xs uppercase tracking-wider text-amber/70 font-medium">{product.category}</span>
                  <h3 className="font-display text-xl text-cream mt-1 mb-2">{product.title}</h3>
                  <div className="flex items-center justify-between">
                    <p className="font-display text-2xl text-amber-soft">{product.price}</p>
                    {product.status === 'limited' && (
                      <span className="px-2 py-1 rounded-full bg-amber/20 text-amber text-[10px] font-bold uppercase">
                        {t('products.limited')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-5">
                <p className="text-parchment/50 text-sm mb-4">{product.description}</p>
                <a
                  href="#pricing"
                  className="inline-flex items-center gap-2 text-amber text-sm font-medium hover:text-amber-soft transition-colors group/link"
                >
                  {t('products.viewDetails')} <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  PRODUCT SHOWCASE (Simplified - kept for compatibility)               */
/* ------------------------------------------------------------------ */
function ProductShowcase() {
  const { t } = useLang();
  const products = [
    { title: t('showcase.cat1') + ' Board', category: t('showcase.cat1'), price: '$245', img: '/images/product-1.jpg', description: 'Sanded to 400 grit, food-safe finish.' },
    { title: t('showcase.cat2') + ' Board', category: t('showcase.cat2'), price: '$195', img: '/images/product-2.jpg', description: 'End-grain construction, carved handle.' },
    { title: 'Maple ' + t('showcase.cat3'), category: t('showcase.cat3'), price: '$320', img: '/images/product-3.jpg', description: 'Brass hinges, velvet-lined interior.' },
  ];

  return (
    <section id="showcase" className="relative py-28 md:py-36 overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-deep/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16 md:mb-20">
          <div className="max-w-xl">
            <span className="text-xs uppercase tracking-[0.2em] text-amber font-medium mb-4 block">{t('showcase.tag')}</span>
            <h2 className="font-display text-4xl md:text-6xl tracking-tight text-cream leading-[1.05]">
              {t('showcase.title1')} <span className="italic text-amber-soft">{t('showcase.title2')}</span>
            </h2>
          </div>
          <a href="#pricing" className="inline-flex items-center gap-2 text-amber hover:text-cream transition-colors font-medium group">
            {t('showcase.viewAll')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {products.map((p, i) => (
            <motion.div
              key={p.title}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
            >
              <a href="#products" className="block relative overflow-hidden rounded-3xl shadow-xl">
                <img src={p.img} alt={p.title} className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-[1.06]" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/10 text-cream text-[10px] uppercase tracking-wider font-medium backdrop-blur-sm mb-3">{p.category}</span>
                  <h3 className="font-display text-2xl text-cream mb-1">{p.title}</h3>
                  <p className="text-parchment/50 text-sm mb-2">{p.price}</p>
                  <p className="text-parchment/40 text-xs leading-relaxed">{p.description}</p>
                </div>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  REGISTRATION SECTION                                                */
/* ------------------------------------------------------------------ */
function RegistrationSection() {
  const { t, lang } = useLang();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error' | ''; msg: string }>({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const result = registerUser(name, email, phone);
      if (result.success) {
        setStatus({ type: 'success', msg: t('register.success') });
        setName(''); setEmail(''); setPhone('');
      } else {
        setStatus({ type: 'error', msg: t('register.existing') });
      }
      setLoading(false);
      setTimeout(() => setStatus({ type: '', msg: '' }), 5000);
    }, 800);
  };

  return (
    <section id="register" className="relative py-28 md:py-36 overflow-hidden">
      <div className="glow-amber w-[500px] h-[500px] bg-amber/20 top-[10%] left-[-10%]" />
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            <span className="text-xs uppercase tracking-[0.2em] text-amber font-medium mb-4 block">
              {lang === 'ar' ? 'مجتمع وودكرافت' : 'Woodcraft Community'}
            </span>
            <h2 className="font-display text-4xl md:text-6xl tracking-tight text-cream leading-[1.05] mb-6">
              {t('register.title')}
            </h2>
            <p className="text-lg text-parchment/60 leading-relaxed mb-8">
              {t('register.subtitle')}
            </p>
            <div className="space-y-3">
              {[
                lang === 'ar' ? 'عروض حصرية للأعضاء' : 'Exclusive member offers',
                lang === 'ar' ? 'وصول مبكر للمجموعات الجديدة' : 'Early access to new collections',
                lang === 'ar' ? 'تحديثات مباشرة للموقع' : 'Direct site updates',
                lang === 'ar' ? 'دعم فني مخصص' : 'Dedicated support',
              ].map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber/10 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-amber" strokeWidth={3} />
                  </div>
                  <p className="text-parchment/70">{f}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="glass rounded-3xl p-8 md:p-10"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-parchment/50 mb-2">{t('register.name')}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-parchment/30 focus:outline-none focus:border-amber/40 transition-colors"
                  placeholder={lang === 'ar' ? 'اسمك الكامل' : 'Your full name'}
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-parchment/50 mb-2">{t('register.email')}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-parchment/30 focus:outline-none focus:border-amber/40 transition-colors"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-parchment/50 mb-2">{t('register.phone')}</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-parchment/30 focus:outline-none focus:border-amber/40 transition-colors"
                  placeholder="+20 100 000 0000"
                />
              </div>
              {status.msg && (
                <p className={`text-sm ${status.type === 'success' ? 'text-emerald-300' : 'text-red-400'}`}>
                  {status.msg}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-amber text-ink px-6 py-3.5 text-sm font-bold hover:bg-amber-soft transition-colors disabled:opacity-60 shadow-[0_8px_32px_rgba(194,136,58,0.2)]"
              >
                {loading ? t('support.sending') : t('register.submit')}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  SUPPORT SECTION                                                     */
/* ------------------------------------------------------------------ */
function SupportSection() {
  const { t, lang } = useLang();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      submitMessage(name, email, message);
      setName(''); setEmail(''); setMessage('');
      setSent(true);
      setLoading(false);
      setTimeout(() => setSent(false), 5000);
    }, 800);
  };

  return (
    <section id="support" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="text-center mb-16 md:mb-20">
          <span className="text-xs uppercase tracking-[0.2em] text-amber font-medium mb-4 block">{t('support.tag')}</span>
          <h2 className="font-display text-4xl md:text-6xl tracking-tight text-cream leading-[1.05] mb-6">
            {t('support.title1')} <span className="italic text-amber-soft">{t('support.title2')}</span>
          </h2>
          <p className="text-parchment/50 max-w-xl mx-auto leading-relaxed">{t('support.subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.a
            href={`tel:${SUPPORT_PHONE}`}
            className="glass rounded-3xl p-8 glass-hover transition-all hover:-translate-y-1 text-center group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber/20 to-amber-deep/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Phone className="w-6 h-6 text-amber" />
            </div>
            <h3 className="font-display text-xl text-cream mb-2">{t('support.phone')}</h3>
            <p className="text-amber text-lg font-medium tracking-wide dir-ltr" dir="ltr">{SUPPORT_PHONE}</p>
            <p className="text-xs text-parchment/40 mt-2">{t('support.phoneDesc')}</p>
          </motion.a>

          <motion.a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="glass rounded-3xl p-8 glass-hover transition-all hover:-translate-y-1 text-center group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber/20 to-amber-deep/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Mail className="w-6 h-6 text-amber" />
            </div>
            <h3 className="font-display text-xl text-cream mb-2">{t('support.email')}</h3>
            <p className="text-amber text-sm font-medium" dir="ltr">{maskEmail(SUPPORT_EMAIL)}</p>
            <p className="text-xs text-parchment/40 mt-2">{t('support.emailDesc')}</p>
          </motion.a>

          <motion.a
            href="https://wa.me/201080188406"
            target="_blank"
            rel="noopener noreferrer"
            className="glass rounded-3xl p-8 glass-hover transition-all hover:-translate-y-1 text-center group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-emerald-600/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Send className="w-6 h-6 text-emerald-300" />
            </div>
            <h3 className="font-display text-xl text-cream mb-2">WhatsApp</h3>
            <p className="text-emerald-300 text-lg font-medium tracking-wide" dir="ltr">{SUPPORT_PHONE}</p>
            <p className="text-xs text-parchment/40 mt-2">{lang === 'ar' ? 'تواصل فوري' : 'Instant chat'}</p>
          </motion.a>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          className="glass rounded-3xl p-8 md:p-10 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="font-display text-2xl text-cream mb-6 text-center">{t('support.form')}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-parchment/50 mb-2">{t('support.name')}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-parchment/30 focus:outline-none focus:border-amber/40"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-parchment/50 mb-2">{t('support.emailInput')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-parchment/30 focus:outline-none focus:border-amber/40"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-parchment/50 mb-2">{t('support.message')}</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-parchment/30 focus:outline-none focus:border-amber/40 resize-none"
              />
            </div>
            {sent && <p className="text-sm text-emerald-300 text-center">{t('support.sent')}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-amber text-ink px-6 py-3.5 text-sm font-bold hover:bg-amber-soft transition-colors disabled:opacity-60 shadow-[0_8px_32px_rgba(194,136,58,0.2)]"
            >
              {loading ? t('support.sending') : t('support.submit')}
              {!loading && <Send className="w-4 h-4" />}
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  TESTIMONIALS                                                         */
/* ------------------------------------------------------------------ */
function Testimonials() {
  const { t } = useLang();
  const quotes = [
    { name: 'Eleanor Whitmore', role: 'Interior Designer, London', text: 'The quality of finish is unlike anything I have handled. My clients always ask where it came from.' },
    { name: 'Marcus Chen', role: 'Executive Chef, San Francisco', text: 'These are the only boards that have lasted more than a year in professional service.' },
    { name: 'Sofia Lindqvist', role: 'Architect, Stockholm', text: 'The simplicity allows the material to speak. It is quiet luxury.' },
  ];

  return (
    <section id="testimonials" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="text-center mb-16 md:mb-24">
          <span className="text-xs uppercase tracking-[0.2em] text-amber font-medium mb-4 block">{t('testimonials.tag')}</span>
          <h2 className="font-display text-4xl md:text-6xl tracking-tight text-cream leading-[1.05]">
            {t('testimonials.title1')} <span className="italic text-amber-soft">{t('testimonials.title2')}</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {quotes.map((q, i) => (
            <motion.div
              key={q.name}
              className="glass rounded-3xl p-8 md:p-10 relative overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
            >
              <div className="absolute top-0 right-0 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">
                <Star className="w-32 h-32 text-amber" fill="currentColor" />
              </div>
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-3.5 h-3.5 text-amber" fill="currentColor" />)}
              </div>
              <blockquote className="font-editorial text-xl md:text-2xl text-cream leading-relaxed mb-8 italic">"{q.text}"</blockquote>
              <div>
                <p className="font-display text-cream">{q.name}</p>
                <p className="text-xs text-parchment/40">{q.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  PRICING — ONE-TIME ONLY (no monthly)                                */
/* ------------------------------------------------------------------ */
function Pricing() {
  const { t } = useLang();
  const plans = [
    {
      name: t('pricing.p1.name'),
      price: '$195',
      subtitle: t('pricing.p1.subtitle'),
      features: [
        'End-grain cutting board',
        'Natural mineral oil finish',
        'Food-safe certification',
        '30-day satisfaction guarantee',
      ],
    },
    {
      name: t('pricing.p2.name'),
      price: '$345',
      subtitle: t('pricing.p2.subtitle'),
      popular: true,
      features: [
        'Serving board + cutting board set',
        'Hand-rubbed beeswax finish',
        'Custom engraving available',
        'Lifetime craftsmanship guarantee',
        'White glove delivery',
      ],
    },
    {
      name: t('pricing.p3.name'),
      price: '$620',
      subtitle: t('pricing.p3.subtitle'),
      features: [
        'Limited edition walnut piece',
        'Signed by the master craftsperson',
        'Premium velvet-lined storage',
        'Private workshop tour included',
        'Priority support & care service',
      ],
    },
  ];

  return (
    <section id="pricing" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="text-center mb-16 md:mb-20">
          <span className="text-xs uppercase tracking-[0.2em] text-amber font-medium mb-4 block">{t('pricing.tag')}</span>
          <h2 className="font-display text-4xl md:text-6xl tracking-tight text-cream leading-[1.05] mb-6">
            {t('pricing.title1')} <span className="italic text-amber-soft">{t('pricing.title2')}</span>
          </h2>
          <p className="text-parchment/50 max-w-lg mx-auto">{t('pricing.subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              className={`relative rounded-3xl p-8 md:p-10 border transition-all duration-500 hover:-translate-y-1 ${
                plan.popular ? 'glass border-amber/20 shadow-[0_0_60px_rgba(194,136,58,0.1)]' : 'glass hover:border-cream/15'
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber text-ink text-[10px] font-bold uppercase tracking-wider">
                  {t('pricing.mostPopular')}
                </span>
              )}
              <h3 className="font-display text-2xl text-cream">{plan.name}</h3>
              <p className="text-sm text-parchment/40 mt-1 mb-6">{plan.subtitle}</p>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="font-display text-5xl text-cream">{plan.price}</span>
                <span className="text-parchment/40 text-sm">{t('pricing.perPiece')}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-parchment/60">
                    <Check className="w-4 h-4 text-amber shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#register"
                className={`block text-center rounded-full py-3.5 text-sm font-semibold transition-all duration-300 ${
                  plan.popular
                    ? 'bg-amber text-ink hover:bg-amber-soft shadow-[0_8px_32px_rgba(194,136,58,0.2)]'
                    : 'border border-cream/15 text-cream hover:bg-white/5 hover:border-cream/25'
                }`}
              >
                {t('pricing.select')} {plan.name}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  FAQ                                                                 */
/* ------------------------------------------------------------------ */
function FAQ() {
  const { t } = useLang();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const items = [
    {
      q: 'How long does each piece take to craft?',
      a: 'Most pieces require between 4 to 7 weeks. Limited editions may take up to 12 weeks. Each piece is made to order, never mass-produced.',
    },
    {
      q: 'Can I customize the engraving or dimensions?',
      a: 'Yes. The Heritage and Collector tiers include custom engraving. Size adjustments within 15% are available at no extra cost.',
    },
    {
      q: 'What wood types do you work with?',
      a: 'We source black walnut, white oak, hard maple, and cherry. All wood is FSC-certified and air-dried for a minimum of 18 months.',
    },
    {
      q: 'Is there a warranty?',
      a: 'Every piece carries a lifetime craftsmanship guarantee. If your wood shows structural failure, we repair or replace it at no charge.',
    },
  ];

  return (
    <section className="relative py-28 md:py-36">
      <div className="mx-auto max-w-4xl px-6 md:px-10">
        <div className="text-center mb-16 md:mb-20">
          <span className="text-xs uppercase tracking-[0.2em] text-amber font-medium mb-4 block">{t('faq.tag')}</span>
          <h2 className="font-display text-4xl md:text-6xl tracking-tight text-cream leading-[1.05]">
            {t('faq.title1')} <span className="italic text-amber-soft">{t('faq.title2')}</span>
          </h2>
        </div>

        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="border-b border-white/5">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between py-6 text-left group"
                aria-expanded={openIndex === i}
              >
                <span className="font-display text-xl text-cream group-hover:text-amber-soft transition-colors">{item.q}</span>
                <span className="ms-6 shrink-0 text-parchment/40 group-hover:text-amber transition-colors">
                  {openIndex === i ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </span>
              </button>
              <motion.div
                initial={false}
                animate={{ height: openIndex === i ? 'auto' : 0, opacity: openIndex === i ? 1 : 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <p className="pb-6 text-parchment/55 leading-relaxed">{item.a}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  CTA                                                                 */
/* ------------------------------------------------------------------ */
function CTA() {
  const { t } = useLang();
  return (
    <section className="relative py-28 md:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/95 to-ink/80 pointer-events-none" />
      <div className="glow-amber w-[700px] h-[700px] bg-amber-deep/15 -top-[200px] -left-[200px]" />
      <div className="glow-amber w-[600px] h-[600px] bg-amber/15 -bottom-[200px] -right-[200px]" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 md:px-10 text-center">
        <h2 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-tight text-cream leading-[0.9] mb-8">
          {t('cta.title1')} <br /><span className="italic text-amber-soft">{t('cta.title2')}</span>
        </h2>
        <p className="text-lg md:text-xl text-parchment/50 max-w-2xl mx-auto mb-10 leading-relaxed">{t('cta.desc')}</p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="#pricing"
            className="inline-flex items-center gap-2.5 rounded-full bg-amber text-ink px-8 py-4 text-base font-bold hover:bg-amber-soft transition-all duration-300 shadow-[0_8px_40px_rgba(194,136,58,0.25)] hover:shadow-[0_12px_48px_rgba(194,136,58,0.35)] hover:-translate-y-0.5"
          >
            {t('cta.startCollection')} <ArrowRight className="w-5 h-5" />
          </a>
          <a
            href="#showcase"
            className="inline-flex items-center gap-2.5 rounded-full border border-cream/15 text-cream px-8 py-4 text-base font-medium hover:bg-white/5 hover:border-cream/25 transition-all duration-300"
          >
            {t('cta.explore')}
          </a>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  FOOTER                                                              */
/* ------------------------------------------------------------------ */
function Footer() {
  const { t } = useLang();
  return (
    <footer className="relative border-t border-white/5 pt-16 md:pt-20 pb-10">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid md:grid-cols-4 gap-12 md:gap-10 mb-16">
          <div className="md:col-span-2">
            <a href="#" className="flex items-center gap-2.5 mb-6" aria-label="Woodcraft home">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber to-amber-deep flex items-center justify-center shadow-[0_0_20px_rgba(194,136,58,0.3)]">
                <Sparkles className="w-4.5 h-4.5 text-ink-soft" strokeWidth={2.5} />
              </div>
              <span className="font-display text-xl tracking-tight text-cream">Woodcraft</span>
            </a>
            <p className="text-sm text-parchment/40 leading-relaxed max-w-sm mb-5">{t('footer.desc')}</p>
            <div className="space-y-2 text-sm">
              <a href={`tel:${SUPPORT_PHONE}`} className="flex items-center gap-2 text-parchment/50 hover:text-amber transition-colors">
                <Phone className="w-3.5 h-3.5" />
                <span dir="ltr">{SUPPORT_PHONE}</span>
              </a>
              <a href={`mailto:${SUPPORT_EMAIL}`} className="flex items-center gap-2 text-parchment/50 hover:text-amber transition-colors">
                <Mail className="w-3.5 h-3.5" />
                <span dir="ltr" className="text-xs">{maskEmail(SUPPORT_EMAIL)}</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.15em] text-amber font-medium mb-5">{t('footer.explore')}</h4>
            <ul className="space-y-3">
              {[
                { label: t('footer.collection'), href: '#showcase' },
                { label: t('nav.features'), href: '#features' },
                { label: t('nav.pricing'), href: '#pricing' },
                { label: t('nav.testimonials'), href: '#testimonials' },
                { label: t('nav.support'), href: '#support' },
              ].map((l) => (
                <li key={l.href}><a href={l.href} className="text-sm text-parchment/40 hover:text-cream transition-colors">{l.label}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.15em] text-amber font-medium mb-5">{t('footer.connect')}</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-parchment/40 hover:text-cream transition-colors">Instagram</a></li>
              <li><a href="#" className="text-sm text-parchment/40 hover:text-cream transition-colors">Pinterest</a></li>
              <li><a href="#register" className="text-sm text-parchment/40 hover:text-cream transition-colors">{t('footer.newsletter')}</a></li>
              <li><a href="#" className="text-sm text-parchment/40 hover:text-cream transition-colors">{t('footer.press')}</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
          <p className="text-xs text-parchment/20">© {new Date().getFullYear()} Woodcraft. {t('footer.rights')}</p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-parchment/20 hover:text-parchment/40 transition-colors">{t('footer.privacy')}</a>
            <a href="#" className="text-xs text-parchment/20 hover:text-parchment/40 transition-colors">{t('footer.terms')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  APP                                                                  */
/* ------------------------------------------------------------------ */
function AppInner() {
  const [adminOpen, setAdminOpen] = useState(false);

  useEffect(() => {
    trackVisitor();
  }, []);

  return (
    <div className="min-h-screen bg-ink text-cream">
      <Navbar onOpenAdmin={() => setAdminOpen(true)} />
      <main>
        <Hero />
        <ProductsSection />
        <SocialProof />
        <Features />
        <ProductShowcase />
        <RegistrationSection />
        <Testimonials />
        <Pricing />
        <FAQ />
        <SupportSection />
        <CTA />
      </main>
      <Footer />
      <AdminPanel isOpen={adminOpen} onClose={() => setAdminOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <LangProvider>
      <AppInner />
    </LangProvider>
  );
}
