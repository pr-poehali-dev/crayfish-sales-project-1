import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMG = "https://cdn.poehali.dev/projects/4f1d68ad-91ae-4948-b91f-052f12e92afa/files/840813bb-9865-4ea2-992d-56323e48e376.jpg";

const NAV_LINKS = [
  { id: "home", label: "Главная" },
  { id: "catalog", label: "Каталог" },
  { id: "delivery", label: "Доставка" },
  { id: "reviews", label: "Отзывы" },
  { id: "contacts", label: "Контакты" },
];

const PRODUCTS = [
  {
    id: 1,
    name: "Раки средние",
    size: "8–10 см",
    price: 450,
    priceUnit: "кг",
    emoji: "🦞",
    badge: "Хит продаж",
    desc: "Классика жанра — упругие, сочные, идеально вареные",
  },
  {
    id: 2,
    name: "Раки крупные",
    size: "10–12 см",
    price: 650,
    priceUnit: "кг",
    emoji: "🦀",
    badge: "Популярное",
    desc: "Отборные особи с мясистыми клешнями, настоящий деликатес",
  },
  {
    id: 3,
    name: "Раки XXL",
    size: "12–15 см",
    price: 900,
    priceUnit: "кг",
    emoji: "🦞",
    badge: "Премиум",
    desc: "Гигантские раки для особых случаев и корпоративов",
  },
  {
    id: 4,
    name: "Набор «Вечеринка»",
    size: "3 кг ассорти",
    price: 1800,
    priceUnit: "набор",
    emoji: "🎉",
    badge: "Выгодно",
    desc: "Ассорти размеров + специи в подарок, идеально для компании",
  },
];

const REVIEWS = [
  {
    name: "Алексей К.",
    stars: 5,
    text: "Заказывал трижды — каждый раз свежие и вкусные. Доставка строго по времени!",
    date: "15 апреля 2026",
    avatar: "А",
  },
  {
    name: "Марина В.",
    stars: 5,
    text: "Брали на день рождения 5 кг — гости в восторге. Раки огромные, мясистые!",
    date: "10 апреля 2026",
    avatar: "М",
  },
  {
    name: "Дмитрий Р.",
    stars: 5,
    text: "Лучший магазин раков в городе. Уже не представляю пятницу без их заказа",
    date: "3 апреля 2026",
    avatar: "Д",
  },
  {
    name: "Светлана О.",
    stars: 5,
    text: "Качество на высоте. Раки живые, упаковка надёжная, курьер вежливый.",
    date: "28 марта 2026",
    avatar: "С",
  },
];

const DELIVERY_ZONES = [
  { zone: "Центр", time: "30–45 мин", price: 200 },
  { zone: "Ближний район", time: "45–60 мин", price: 300 },
  { zone: "Дальний район", time: "60–90 мин", price: 400 },
  { zone: "Пригород", time: "90–120 мин", price: 500 },
];

function useScrollSpy() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.getElementById(l.id));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { threshold: 0.4 }
    );
    sections.forEach((s) => s && observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return active;
}

function useAnimateOnScroll() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.classList.add("visible");
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useAnimateOnScroll();
  return (
    <div ref={ref} className={`section-enter ${className}`}>
      {children}
    </div>
  );
}

function DeliveryCalculator() {
  const [weight, setWeight] = useState(2);
  const [zone, setZone] = useState(0);
  const [productType, setProductType] = useState(0);

  const productPrices = [450, 650, 900];

  const productCost = productPrices[productType] * weight;
  const deliveryCost = DELIVERY_ZONES[zone].price;
  const total = productCost + deliveryCost;

  return (
    <div className="card-dark rounded-2xl p-6 md:p-8 transition-all duration-300">
      <h3 className="font-oswald text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="text-2xl">🧮</span>
        Калькулятор стоимости
      </h3>

      <div className="space-y-6">
        <div>
          <label className="text-sm text-white/60 mb-2 block">Вид раков</label>
          <div className="grid grid-cols-3 gap-2">
            {["Средние", "Крупные", "XXL"].map((name, i) => (
              <button
                key={i}
                onClick={() => setProductType(i)}
                className={`py-2 px-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  productType === i
                    ? "bg-flame text-white glow-flame-sm"
                    : "bg-white/5 text-white/70 hover:bg-white/10"
                }`}
                style={productType === i ? { backgroundColor: '#ff5500' } : {}}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm text-white/60 mb-3 block">
            Вес заказа: <span className="text-flame font-semibold text-base" style={{ color: '#ff5500' }}>{weight} кг</span>
          </label>
          <input
            type="range"
            min="1"
            max="20"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #ff5500 0%, #ff5500 ${((weight - 1) / 19) * 100}%, rgba(255,255,255,0.1) ${((weight - 1) / 19) * 100}%, rgba(255,255,255,0.1) 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-white/40 mt-1">
            <span>1 кг</span>
            <span>20 кг</span>
          </div>
        </div>

        <div>
          <label className="text-sm text-white/60 mb-2 block">Зона доставки</label>
          <div className="grid grid-cols-2 gap-2">
            {DELIVERY_ZONES.map((z, i) => (
              <button
                key={i}
                onClick={() => setZone(i)}
                className={`py-2.5 px-4 rounded-xl text-sm text-left transition-all duration-200 ${
                  zone === i
                    ? "text-white glow-flame-sm"
                    : "bg-white/5 text-white/70 hover:bg-white/10"
                }`}
                style={zone === i ? { backgroundColor: '#ff5500' } : {}}
              >
                <div className="font-medium">{z.zone}</div>
                <div className="text-xs opacity-75">{z.time}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-5 space-y-2">
          <div className="flex justify-between text-white/60 text-sm">
            <span>Раки ({weight} кг)</span>
            <span>{productCost.toLocaleString()} ₽</span>
          </div>
          <div className="flex justify-between text-white/60 text-sm">
            <span>Доставка ({DELIVERY_ZONES[zone].zone})</span>
            <span>{deliveryCost} ₽</span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-white font-semibold text-lg">Итого</span>
            <span className="text-gradient-flame font-oswald text-3xl font-bold">
              {total.toLocaleString()} ₽
            </span>
          </div>
        </div>

        <button
          className="w-full text-white font-oswald font-semibold text-lg py-4 rounded-xl hover:opacity-90 transition-all duration-200 glow-flame-sm hover:glow-flame"
          style={{ background: 'linear-gradient(135deg, #ff7520, #ff5500, #c72700)' }}
        >
          Оформить заказ
        </button>
      </div>
    </div>
  );
}

const Index = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const activeSection = useScrollSpy();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-mesh font-golos">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5" style={{ background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <button onClick={() => scrollTo("home")} className="font-oswald font-bold text-xl text-white flex items-center gap-2">
            <span className="text-2xl animate-float">🦞</span>
            <span>Раки<span className="text-gradient-flame">Маркет</span></span>
          </button>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`nav-link text-sm font-medium transition-colors duration-200 ${
                  activeSection === link.id ? "text-white active" : "text-white/60 hover:text-white"
                }`}
                style={activeSection === link.id ? { color: '#ff5500' } : {}}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <a href="tel:+78001234567" className="flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors">
              <Icon name="Phone" size={16} style={{ color: '#ff5500' }} />
              8 800 123-45-67
            </a>
            <button
              className="text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-all glow-flame-sm"
              style={{ background: 'linear-gradient(135deg, #ff7520, #ff5500, #c72700)' }}
            >
              Заказать
            </button>
          </div>

          <button
            className="md:hidden text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Icon name={menuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-white/10 px-4 py-4 space-y-1" style={{ background: 'rgba(10,10,10,0.97)' }}>
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="block w-full text-left px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all text-sm"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-2 border-t border-white/10 mt-2">
              <a href="tel:+78001234567" className="flex items-center gap-2 px-4 py-3 text-white/70 text-sm">
                <Icon name="Phone" size={16} style={{ color: '#ff5500' }} />
                8 800 123-45-67
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img
            src={HERO_IMG}
            alt="Раки"
            className="w-full h-full object-cover opacity-30"
            style={{ filter: 'saturate(1.5)' }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.7) 50%, rgba(10,10,10,0.9) 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 70% 50%, rgba(255,85,0,0.08) 0%, transparent 60%)' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 animate-fade-in" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,85,0,0.3)' }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#ff5500' }} />
              <span className="text-sm font-medium" style={{ color: '#ff5500' }}>Живые раки • Доставка за 45 минут</span>
            </div>

            <h1 className="font-oswald font-bold leading-none mb-6 animate-fade-in" style={{ animationDelay: '0.1s', fontSize: 'clamp(3rem, 8vw, 6rem)' }}>
              <span className="text-white">СВЕЖИЕ</span>
              <br />
              <span className="text-gradient-flame">РАКИ</span>
              <br />
              <span className="text-white">С ДОСТАВКОЙ</span>
            </h1>

            <p className="text-white/60 text-lg md:text-xl mb-8 max-w-xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Живые раки прямо из водоёма — на ваш стол. Варим свежими, доставляем горячими. Минимальный заказ от 1 кг.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <button
                onClick={() => scrollTo("catalog")}
                className="text-white font-oswald font-semibold text-lg px-8 py-4 rounded-xl hover:opacity-90 transition-all glow-flame flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #ff7520, #ff5500, #c72700)' }}
              >
                <Icon name="ShoppingCart" size={20} />
                Выбрать раков
              </button>
              <button
                onClick={() => scrollTo("delivery")}
                className="bg-white/5 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <Icon name="Calculator" size={20} />
                Рассчитать доставку
              </button>
            </div>

            <div className="flex flex-wrap gap-6 mt-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              {[
                { icon: "Star", label: "4.9", sub: "рейтинг" },
                { icon: "Package", label: "2000+", sub: "заказов" },
                { icon: "Clock", label: "45 мин", sub: "доставка" },
                { icon: "Shield", label: "100%", sub: "свежесть" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,85,0,0.1)', border: '1px solid rgba(255,85,0,0.2)' }}>
                    <Icon name={stat.icon} size={18} style={{ color: '#ff5500' }} />
                  </div>
                  <div>
                    <div className="text-white font-oswald font-bold text-lg leading-none">{stat.label}</div>
                    <div className="text-white/40 text-xs">{stat.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => scrollTo("catalog")}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 hover:text-white transition-colors animate-bounce"
        >
          <Icon name="ChevronDown" size={32} />
        </button>
      </section>

      {/* CATALOG */}
      <section id="catalog" className="py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-14">
              <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: '#ff5500' }}>Наш ассортимент</span>
              <h2 className="font-oswald font-bold text-4xl md:text-5xl text-white mt-2">
                Каталог <span className="text-gradient-flame">раков</span>
              </h2>
              <p className="text-white/50 mt-3 max-w-md mx-auto">
                Все раки варятся при заказе — никакой заморозки и хранения
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {PRODUCTS.map((product, i) => (
              <AnimatedSection key={product.id}>
                <div
                  className="card-dark rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 cursor-pointer group relative overflow-hidden"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="absolute top-0 right-0 left-0 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(255,85,0,0.3), transparent)' }} />

                  <div className="flex items-start justify-between mb-4">
                    <span className="text-5xl animate-float" style={{ animationDelay: `${i * 0.3}s` }}>{product.emoji}</span>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ background: 'rgba(255,85,0,0.2)', color: '#ff5500', border: '1px solid rgba(255,85,0,0.3)' }}>
                      {product.badge}
                    </span>
                  </div>

                  <h3 className="font-oswald font-bold text-xl text-white mb-1">{product.name}</h3>
                  <p className="text-white/40 text-xs mb-3">{product.size}</p>
                  <p className="text-white/60 text-sm mb-5 leading-relaxed">{product.desc}</p>

                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-gradient-flame font-oswald font-bold text-2xl">
                        {product.price} ₽
                      </span>
                      <span className="text-white/40 text-sm">/{product.priceUnit}</span>
                    </div>
                    <button
                      className="w-10 h-10 rounded-xl flex items-center justify-center hover:opacity-90 transition-all glow-flame-sm"
                      style={{ background: 'linear-gradient(135deg, #ff7520, #ff5500, #c72700)' }}
                    >
                      <Icon name="Plus" size={18} className="text-white" />
                    </button>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection>
            <div className="mt-8 card-dark rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4 justify-between">
              <div className="flex items-center gap-4">
                <span className="text-4xl">📦</span>
                <div>
                  <div className="text-white font-oswald font-bold text-lg">Оптовые заказы от 10 кг</div>
                  <div className="text-white/50 text-sm">Специальные цены для кафе, ресторанов и мероприятий</div>
                </div>
              </div>
              <button className="bg-white/5 border border-white/20 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-all whitespace-nowrap">
                Узнать цену
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* DELIVERY */}
      <section id="delivery" className="py-24 px-4 md:px-8 relative">
        <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(ellipse at center, rgba(255,85,0,0.05) 0%, transparent 70%)' }} />
        <div className="max-w-7xl mx-auto relative">
          <AnimatedSection>
            <div className="text-center mb-14">
              <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: '#ff5500' }}>Быстро и надёжно</span>
              <h2 className="font-oswald font-bold text-4xl md:text-5xl text-white mt-2">
                Доставка & <span className="text-gradient-flame">Цены</span>
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AnimatedSection>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {[
                    { icon: "Zap", title: "Быстро", desc: "От 30 минут для центра города" },
                    { icon: "Thermometer", title: "Горячими", desc: "Доставляем сразу после варки" },
                    { icon: "Clock", title: "Ежедневно", desc: "Работаем с 10:00 до 23:00" },
                    { icon: "CreditCard", title: "Онлайн оплата", desc: "Картой или наличными курьеру" },
                  ].map((feat) => (
                    <div key={feat.title} className="card-dark rounded-xl p-4 transition-all duration-300">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: 'rgba(255,85,0,0.1)' }}>
                        <Icon name={feat.icon} size={20} style={{ color: '#ff5500' }} />
                      </div>
                      <div className="text-white font-semibold mb-1">{feat.title}</div>
                      <div className="text-white/50 text-sm">{feat.desc}</div>
                    </div>
                  ))}
                </div>

                <h3 className="font-oswald text-xl font-bold text-white mb-3">Зоны доставки</h3>
                {DELIVERY_ZONES.map((zone, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 card-dark rounded-xl transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(255,85,0,0.1)', color: '#ff5500' }}>
                        {i + 1}
                      </div>
                      <div>
                        <div className="text-white font-medium text-sm">{zone.zone}</div>
                        <div className="text-white/40 text-xs">{zone.time}</div>
                      </div>
                    </div>
                    <span className="font-oswald font-bold" style={{ color: '#ff5500' }}>{zone.price} ₽</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <DeliveryCalculator />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-14">
              <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: '#ff5500' }}>Нас уже любят</span>
              <h2 className="font-oswald font-bold text-4xl md:text-5xl text-white mt-2">
                Отзывы <span className="text-gradient-flame">клиентов</span>
              </h2>
              <div className="flex items-center justify-center gap-2 mt-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <span className="text-white font-bold text-xl">4.9</span>
                <span className="text-white/40 text-sm">из 5 (2000+ отзывов)</span>
              </div>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {REVIEWS.map((review, i) => (
              <AnimatedSection key={i}>
                <div className="card-dark rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-oswald font-bold text-lg" style={{ background: 'linear-gradient(135deg, #ff7520, #ff5500, #c72700)' }}>
                        {review.avatar}
                      </div>
                      <div>
                        <div className="text-white font-semibold">{review.name}</div>
                        <div className="text-white/40 text-xs">{review.date}</div>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(review.stars)].map((_, j) => (
                        <span key={j} className="text-yellow-400 text-sm">★</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">"{review.text}"</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection>
            <div className="mt-8 text-center">
              <button className="bg-white/5 border border-white/20 text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition-all">
                Читать все отзывы
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-24 px-4 md:px-8 relative">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,85,0,0.03), transparent)' }} />
        <div className="max-w-7xl mx-auto relative">
          <AnimatedSection>
            <div className="text-center mb-14">
              <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: '#ff5500' }}>Свяжитесь с нами</span>
              <h2 className="font-oswald font-bold text-4xl md:text-5xl text-white mt-2">
                Контакты
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {[
              {
                icon: "Phone",
                title: "Телефон",
                value: "8 800 123-45-67",
                sub: "Бесплатно, ежедневно 10:00–23:00",
                link: "tel:+78001234567",
              },
              {
                icon: "MessageCircle",
                title: "WhatsApp / Telegram",
                value: "+7 (900) 123-45-67",
                sub: "Ответим в течение 5 минут",
                link: "#",
              },
              {
                icon: "MapPin",
                title: "Самовывоз",
                value: "ул. Речная, 14",
                sub: "Ежедневно с 10:00 до 22:00",
                link: "#",
              },
            ].map((contact, i) => (
              <AnimatedSection key={i}>
                <a
                  href={contact.link}
                  className="card-dark rounded-2xl p-7 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 block no-underline"
                >
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 glow-flame-sm" style={{ background: 'linear-gradient(135deg, #ff7520, #ff5500, #c72700)' }}>
                    <Icon name={contact.icon} size={28} className="text-white" />
                  </div>
                  <div className="text-white/50 text-sm mb-1">{contact.title}</div>
                  <div className="text-white font-oswald font-bold text-xl mb-2">{contact.value}</div>
                  <div className="text-white/40 text-sm">{contact.sub}</div>
                </a>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection>
            <div className="card-dark rounded-2xl p-8">
              <h3 className="font-oswald font-bold text-2xl text-white text-center mb-6">
                Оставить заявку
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  placeholder="Ваше имя"
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none transition-colors"
                  style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                />
                <input
                  placeholder="Номер телефона"
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none transition-colors"
                />
                <textarea
                  placeholder="Ваш заказ (вид раков, вес, зона доставки)"
                  rows={3}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none transition-colors md:col-span-2 resize-none"
                />
                <div className="md:col-span-2">
                  <button
                    className="w-full text-white font-oswald font-semibold text-lg py-4 rounded-xl hover:opacity-90 transition-all glow-flame-sm hover:glow-flame"
                    style={{ background: 'linear-gradient(135deg, #ff7520, #ff5500, #c72700)' }}
                  >
                    Отправить заявку
                  </button>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t py-8 px-4 md:px-8" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-oswald font-bold text-lg">
            <span>🦞</span>
            <span className="text-white">Раки<span className="text-gradient-flame">Маркет</span></span>
          </div>
          <div className="flex gap-6">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="text-white/40 hover:text-white text-sm transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
          <div className="text-white/30 text-sm">© 2026 РакиМаркет</div>
        </div>
      </footer>

    </div>
  );
};

export default Index;