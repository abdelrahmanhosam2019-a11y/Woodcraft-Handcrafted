import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Lang = 'en' | 'ar';

type Translations = Record<string, Record<Lang, string>>;

const translations: Translations = {
  // NAV
  'nav.features': { en: 'Features', ar: 'المميزات' },
  'nav.showcase': { en: 'Showcase', ar: 'المعرض' },
  'nav.testimonials': { en: 'Testimonials', ar: 'آراء العملاء' },
  'nav.pricing': { en: 'Pricing', ar: 'الأسعار' },
  'nav.support': { en: 'Support', ar: 'الدعم' },
  'nav.getStarted': { en: 'Get Started', ar: 'ابدأ الآن' },
  'nav.viewCraftsmanship': { en: 'View Craftsmanship', ar: 'شاهد الحرفية' },
  'nav.admin': { en: 'Admin', ar: 'المسؤول' },

  // HERO
  'hero.badge': { en: 'Handcrafted Excellence Since 1987', ar: 'حرفية متميزة منذ 1987' },
  'hero.title1': { en: 'Objects that', ar: 'قطع تشعرها' },
  'hero.title2': { en: 'feel like home.', ar: 'بالدفء في بيتك.' },
  'hero.desc': {
    en: 'We craft heirloom-quality wood pieces — from serving boards to jewelry boxes — designed to be passed down through generations, not seasons.',
    ar: 'نصنع قطعاً خشبية بجودة الإرث — من ألواح التقديم إلى صناديق المجوهرات — مصممة لتتوارثها الأجيال، وليس المواسم.'
  },
  'hero.cta1': { en: 'Discover the Collection', ar: 'اكتشف المجموعة' },
  'hero.cta2': { en: 'View Craftsmanship', ar: 'شاهد الحرفية' },
  'hero.ratingLabel': { en: 'Average Rating', ar: 'متوسط التقييم' },

  // SOCIAL PROOF
  'social.featured': { en: 'As Featured In', ar: 'كما ظهرت في' },
  'social.stat1': { en: 'Pieces Crafted', ar: 'قطعة مصنوعة' },
  'social.stat2': { en: 'Countries Served', ar: 'دولة نخدمها' },
  'social.stat3': { en: 'Years of Craft', ar: 'سنة من الحرفية' },
  'social.stat4': { en: 'Customer Rating', ar: 'تقييم العملاء' },

  // FEATURES
  'features.tag': { en: 'Why Woodcraft', ar: 'لماذا وودكرافت' },
  'features.title1': { en: 'Craft is not', ar: 'الحرفية ليست' },
  'features.title2': { en: 'a process.', ar: 'عملية.' },
  'features.title3': { en: 'It is a promise.', ar: 'بل هي وعد.' },
  'features.subtitle': {
    en: 'Every joint, every finish, every edge is considered. We design objects that improve with age, not diminish.',
    ar: 'كل وصلة، كل تشطيب، كل حافة مدروسة. نصمم قطعاً تتحسن مع الزمن، لا تتلاشى.'
  },
  'features.learnMore': { en: 'Learn more', ar: 'اعرف المزيد' },
  'features.f1.title': { en: 'Sustainably Sourced', ar: 'مصادر مستدامة' },
  'features.f1.desc': { en: 'Every board begins as a single, responsibly harvested tree. No fillers, no shortcuts, no compromises.', ar: 'تبدأ كل لوحة بشجرة واحدة محصودة بمسؤولية. بدون حشو، بدون اختصارات، بدون تنازلات.' },
  'features.f2.title': { en: 'Lifetime Guarantee', ar: 'ضمان مدى الحياة' },
  'features.f2.desc': { en: 'We stand behind every grain. If your piece ever fails you, it will be replaced — no questions asked.', ar: 'نقف خلف كل حبة خشب. إذا أخفقت قطعتك يوماً، سيتم استبدالها — دون أسئلة.' },
  'features.f3.title': { en: 'White Glove Delivery', ar: 'توصيل فخم' },
  'features.f3.desc': { en: 'Each item arrives in handcrafted packaging, protected by custom packaging designed for safe transit.', ar: 'تصل كل قطعة في تغليف حرفي، محمية بتغليف مخصص مصمم لسلامة النقل.' },

  // SHOWCASE
  'showcase.tag': { en: 'Curated Collection', ar: 'مجموعة مختارة' },
  'showcase.title1': { en: 'Pieces that', ar: 'قطع' },
  'showcase.title2': { en: 'command a room.', ar: 'تسيطر على المكان.' },
  'showcase.viewAll': { en: 'View All Pieces', ar: 'شاهد كل القطع' },
  'showcase.cat1': { en: 'Serving', ar: 'تقديم' },
  'showcase.cat2': { en: 'Kitchen', ar: 'مطبخ' },
  'showcase.cat3': { en: 'Storage', ar: 'تخزين' },

  // BENEFITS
  'benefits.tag': { en: 'The Difference', ar: 'الفرق' },
  'benefits.title1': { en: 'Built for generations.', ar: 'صُنعت للأجيال.' },
  'benefits.title2': { en: 'Not seasons.', ar: 'وليس للمواسم.' },
  'benefits.badgeNum': { en: '400+', ar: '400+' },
  'benefits.badgeText': { en: 'Hand-selected wood grains used in each design, ensuring consistency and beauty across every piece.', ar: 'حبيبات خشب مختارة يدوياً في كل تصميم، لضمان التناسق والجمال في كل قطعة.' },
  'benefits.b1.title': { en: 'Natural Evolution', ar: 'تطور طبيعي' },
  'benefits.b1.desc': { en: 'As wood ages, it develops a deeper patina, richer color, and more character. Each scratch tells a story.', ar: 'مع تقدم الخشب في العمر، يطور طبقة أعمق ولوناً أغنى وطابعاً أكثر. كل خدش يحكي قصة.' },
  'benefits.b2.title': { en: 'Repairable by Design', ar: 'قابل للإصلاح بالتصميم' },
  'benefits.b2.desc': { en: 'Unlike synthetic materials, wood can be sanded, re-oiled, and restored. A lifetime of renewal in every piece.', ar: 'على عكس المواد الصناعية، يمكن صقل الخشب وإعادة تزييته وتجديده. حياة من التجديد في كل قطعة.' },
  'benefits.b3.title': { en: 'Sensory Luxury', ar: 'فخامة حسية' },
  'benefits.b3.desc': { en: 'The warmth of wood under your hand, the scent of natural oil, the weight of something real — all of it is intentional.', ar: 'دفء الخشب تحت يدك، رائحة الزيت الطبيعي، ثقل شيء حقيقي — كل ذلك مقصود.' },

  // TESTIMONIALS
  'testimonials.tag': { en: 'Testimonials', ar: 'آراء العملاء' },
  'testimonials.title1': { en: 'Words from those who', ar: 'كلمات من' },
  'testimonials.title2': { en: 'live with it.', ar: 'يعيشون بها.' },

  // PRICING
  'pricing.tag': { en: 'Pricing', ar: 'الأسعار' },
  'pricing.title1': { en: 'Invest in', ar: 'استثمر في' },
  'pricing.title2': { en: 'permanence.', ar: 'الديمومة.' },
  'pricing.subtitle': {
    en: 'All pieces are made to order. Each purchase supports our master craftspeople and the sustainable forests we source from.',
    ar: 'جميع القطع تُصنع حسب الطلب. كل عملية شراء تدعم حرفيينا والغابات المستدامة التي نستورد منها.'
  },
  'pricing.perPiece': { en: '/ piece', ar: '/ قطعة' },
  'pricing.mostPopular': { en: 'Most Popular', ar: 'الأكثر شعبية' },
  'pricing.select': { en: 'Select', ar: 'اختر' },
  'pricing.p1.name': { en: 'The Essential', ar: 'الأساسي' },
  'pricing.p1.subtitle': { en: 'For everyday beauty.', ar: 'للجمال اليومي.' },
  'pricing.p2.name': { en: 'The Heritage', ar: 'التراث' },
  'pricing.p2.subtitle': { en: 'Our most selected.', ar: 'الأكثر اختياراً.' },
  'pricing.p3.name': { en: 'The Collector', ar: 'المُجمّع' },
  'pricing.p3.subtitle': { en: 'For the true connoisseur.', ar: 'للهواة الحقيقيين.' },

  // FAQ
  'faq.tag': { en: 'Questions', ar: 'الأسئلة' },
  'faq.title1': { en: 'Before you', ar: 'قبل أن' },
  'faq.title2': { en: 'commit.', ar: 'تلتزم.' },

  // CTA
  'cta.title1': { en: 'Own something', ar: 'امتلك شيئاً' },
  'cta.title2': { en: 'truly yours.', ar: 'هو لك حقاً.' },
  'cta.desc': {
    en: 'The heritage collection is limited. When a piece sells, its design is retired. Begin your collection today.',
    ar: 'مجموعة التراث محدودة. عندما تُباع قطعة، يُتقاعد تصميمها. ابدأ مجموعتك اليوم.'
  },
  'cta.startCollection': { en: 'Start Your Collection', ar: 'ابدأ مجموعتك' },
  'cta.explore': { en: 'Explore Craftsmanship', ar: 'استكشف الحرفية' },

  // FOOTER
  'footer.desc': { en: 'Handcrafted wood pieces made in Vermont, delivered worldwide. Every item carries the fingerprint of its maker.', ar: 'قطع خشبية مصنوعة يدوياً في فيرمونت، تُشحن حول العالم. كل قطعة تحمل بصمة صانعها.' },
  'footer.explore': { en: 'Explore', ar: 'استكشف' },
  'footer.collection': { en: 'The Collection', ar: 'المجموعة' },
  'footer.connect': { en: 'Connect', ar: 'تواصل' },
  'footer.newsletter': { en: 'Newsletter', ar: 'النشرة البريدية' },
  'footer.press': { en: 'Press Kit', ar: 'حزمة الصحافة' },
  'footer.rights': { en: 'All rights reserved.', ar: 'جميع الحقوق محفوظة.' },
  'footer.privacy': { en: 'Privacy Policy', ar: 'سياسة الخصوصية' },
  'footer.terms': { en: 'Terms of Service', ar: 'شروط الخدمة' },

  // SUPPORT SECTION
  'support.tag': { en: 'Support', ar: 'الدعم' },
  'support.title1': { en: "We're here to", ar: 'نحن هنا' },
  'support.title2': { en: 'help you.', ar: 'لمساعدتك.' },
  'support.subtitle': {
    en: 'Reach out to our team for any questions about our craft, your order, or care instructions for your pieces.',
    ar: 'تواصل مع فريقنا لأي أسئلة حول حرفتنا، طلبك، أو تعليمات العناية بقطعك.'
  },
  'support.phone': { en: 'Phone Support', ar: 'دعم هاتفي' },
  'support.phoneDesc': { en: 'Available 9AM - 6PM EET', ar: 'متاح من 9 ص - 6 م بتوقيت مصر' },
  'support.email': { en: 'Email Support', ar: 'دعم بالبريد' },
  'support.emailDesc': { en: 'We reply within 24 hours', ar: 'نرد خلال 24 ساعة' },
  'support.form': { en: 'Send Us a Message', ar: 'أرسل لنا رسالة' },
  'support.name': { en: 'Your Name', ar: 'اسمك' },
  'support.emailInput': { en: 'Your Email', ar: 'بريدك الإلكتروني' },
  'support.message': { en: 'Your Message', ar: 'رسالتك' },
  'support.submit': { en: 'Send Message', ar: 'إرسال الرسالة' },
  'support.sending': { en: 'Sending...', ar: 'جاري الإرسال...' },
  'support.sent': { en: 'Message sent! We will contact you soon.', ar: 'تم إرسال الرسالة! سنتواصل معك قريباً.' },

  // REGISTER
  'register.title': { en: 'Join Our Community', ar: 'انضم إلى مجتمعنا' },
  'register.subtitle': { en: 'Sign up for exclusive offers and updates.', ar: 'سجل للحصول على عروض وتحديثات حصرية.' },
  'register.name': { en: 'Full Name', ar: 'الاسم الكامل' },
  'register.email': { en: 'Email Address', ar: 'عنوان البريد' },
  'register.phone': { en: 'Phone Number', ar: 'رقم الهاتف' },
  'register.submit': { en: 'Register Now', ar: 'سجل الآن' },
  'register.success': { en: 'Registration successful! Check your email.', ar: 'تم التسجيل بنجاح! تحقق من بريدك.' },
  'register.existing': { en: 'This email is already registered.', ar: 'هذا البريد مسجل بالفعل.' },

  // ADMIN
  'admin.login': { en: 'Admin Login', ar: 'دخول المسؤول' },
  'admin.email': { en: 'Email', ar: 'البريد الإلكتروني' },
  'admin.password': { en: 'Password', ar: 'كلمة المرور' },
  'admin.signIn': { en: 'Sign In', ar: 'تسجيل الدخول' },
  'admin.signOut': { en: 'Sign Out', ar: 'تسجيل الخروج' },
  'admin.invalid': { en: 'Invalid credentials', ar: 'بيانات اعتماد غير صحيحة' },
  'admin.dashboard': { en: 'Admin Dashboard', ar: 'لوحة تحكم المسؤول' },
  'admin.visitors': { en: 'Total Visitors', ar: 'إجمالي الزوار' },
  'admin.registrations': { en: 'Registrations', ar: 'التسجيلات' },
  'admin.messages': { en: 'Messages', ar: 'الرسائل' },
  'admin.emails': { en: 'Emails Sent', ar: 'الرسائل المرسلة' },
  'admin.regList': { en: 'Registered Users', ar: 'المستخدمون المسجلون' },
  'admin.msgList': { en: 'Contact Messages', ar: 'رسائل التواصل' },
  'admin.emailLog': { en: 'Email Log', ar: 'سجل البريد' },
  'admin.noData': { en: 'No data yet', ar: 'لا توجد بيانات بعد' },
  'admin.visitorLog': { en: 'Visitor Log', ar: 'سجل الزوار' },
  'admin.updateSite': { en: 'Site Updates & Broadcasts', ar: 'تحديثات الموقع والإعلانات' },
  'admin.updateTitle': { en: 'Update Title', ar: 'عنوان التحديث' },
  'admin.updateMsg': { en: 'Update Message', ar: 'رسالة التحديث' },
  'admin.broadcast': { en: 'Send to All Users', ar: 'إرسال لجميع المستخدمين' },
  'admin.broadcastSuccess': { en: 'Update broadcasted to all registered users.', ar: 'تم إرسال التحديث لجميع المستخدمين المسجلين.' },

  // LANG
  'lang.switch': { en: 'العربية', ar: 'English' },

  // PRODUCTS
  'products.tag': { en: 'Our Collection', ar: 'مجموعتنا' },
  'products.title1': { en: 'Handcrafted', ar: 'مصنوعة' },
  'products.title2': { en: 'with love.', ar: 'بحب.' },
  'products.subtitle': { en: 'Each piece is unique, made by master craftspeople using traditional techniques passed down through generations.', ar: 'كل قطعة فريدة، صنعها حرفيون مهرة باستخدام تقنيات تقليدية توارثتها الأجيال.' },
  'products.viewDetails': { en: 'View Details', ar: 'عرض التفاصيل' },
  'products.addToCart': { en: 'Add to Cart', ar: 'أضف للسلة' },
  'products.dimensions': { en: 'Dimensions', ar: 'الأبعاد' },
  'products.material': { en: 'Material', ar: 'الخامة' },
  'products.care': { en: 'Care Instructions', ar: 'تعليمات العناية' },
  'products.inStock': { en: 'In Stock', ar: 'متوفر' },
  'products.limited': { en: 'Limited Edition', ar: 'طبعة محدودة' },
  'products.madeToOrder': { en: 'Made to Order', ar: 'يصنع حسب الطلب' },
};

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const LangContext = createContext<LangContextType | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem('lang');
    return (saved === 'ar' || saved === 'en') ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const t = (key: string): string => {
    return translations[key]?.[lang] ?? key;
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t, dir: lang === 'ar' ? 'rtl' : 'ltr' }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}
