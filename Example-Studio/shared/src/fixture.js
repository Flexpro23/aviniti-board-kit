/* Fixture — the ONE source of names, numbers, prices, dates and statuses for every board of this project.
 * Every human-facing string is {ar, en} (use FX.b). Digits are Western 0-9 in both languages; amounts, phones and codes
 * render as LTR isolates. Screens never invent a value: add it here first.
 *
 * Keys the engine reads (keep them, change the values):
 *   project { name, nameAr, tagline, url, boardDate } · now { date, time } · cur · currencies [{ code, dec }] · phoneCountry
 *   MONTHS · MONTHS_SHORT · DAYS · DAYS_SHORT ({ ar: [...], en: [...] }) · people + person(id) · user (person id)
 *   nav { phone, desktop, tablet } (shell defaults) · status { kind: { state: { ar, en, icon, tone } } } · versions
 * Everything else is project data: add whatever the boards need below "Project data".
 *
 * Fernly (fictional): a plant shop in Amman with home delivery and watering reminders. Customer Najwa Barghouti orders a
 * Monstera and a Golden pothos with a terracotta pot. "Now" = Wednesday 18/11/2026 10:20; delivery is booked for
 * Thursday 19/11 16:00–18:00 and the tracking screen depicts 19/11 16:12.
 */
const FX = (() => {
  const b = (ar, en) => ({ ar, en });

  const project = {
    name: 'Fernly', nameAr: 'فيرنلي',
    tagline: b('نباتات منزلية تصل إلى بابك، ومعها تذكير بالسقاية في موعده.', 'House plants delivered to your door, with a reminder when each one needs water.'),
    url: 'fernly.example/shop', boardDate: '18/11/2026',
  };
  const now = { date: '2026-11-18', time: '10:20' };
  const cur = 'JOD';
  const currencies = [{ code: 'JOD', dec: 3, name: b('دينار أردني', 'Jordanian dinar') }, { code: 'USD', dec: 2, name: b('دولار أمريكي', 'US dollar') }];
  const phoneCountry = 'JO';

  // Levantine month names in Arabic UI copy
  const MONTHS = {
    ar: ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول'],
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  };
  const MONTHS_SHORT = { ar: MONTHS.ar, en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] };
  const DAYS = { ar: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'], en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] };
  const DAYS_SHORT = { ar: ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'], en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] };

  const people = [
    { id: 'najwa', name: b('نجوى البرغوثي', 'Najwa Barghouti'), ini: b('ن', 'NB'), role: b('عميلة منذ آب 2026', 'Customer since Aug 2026'), phone: '+962 79 412 3307' },
    { id: 'issa', name: b('عيسى الحلبي', 'Issa Halabi'), ini: b('ع', 'IH'), role: b('مندوب التوصيل', 'Courier'), phone: '+962 77 508 6620' },
    { id: 'wafa', name: b('وفاء الساكت', 'Wafa Saket'), ini: b('و', 'WS'), role: b('خبيرة العناية بالنباتات', 'Plant care adviser'), phone: '+962 78 230 9145' },
  ];
  const person = id => people.find(p => p.id === id);
  const user = 'najwa';

  const nav = {
    phone: [{ id: 'shop', i: 'store', l: b('المتجر', 'Shop') }, { id: 'care', i: 'droplet', l: b('العناية', 'Care'), badge: 1 }, { id: 'cart', i: 'cart', l: b('السلة', 'Cart') }, { id: 'orders', i: 'box', l: b('طلباتي', 'Orders') }, { id: 'me', i: 'user', l: b('حسابي', 'Me') }],
    desktop: [{ g: null, items: [{ id: 'shop', i: 'store', l: b('المتجر', 'Shop') }, { id: 'care', i: 'droplet', l: b('العناية', 'Care') }, { id: 'orders', i: 'box', l: b('طلباتي', 'Orders') }] }, { g: b('حسابي', 'Account'), items: [{ id: 'addresses', i: 'mapPin', l: b('العناوين', 'Addresses') }, { id: 'settings', i: 'settings', l: b('الإعدادات', 'Settings') }] }],
    tablet: [{ id: 'shop', i: 'store', l: b('المتجر', 'Shop') }, { id: 'care', i: 'droplet', l: b('العناية', 'Care') }, { id: 'orders', i: 'box', l: b('طلباتي', 'Orders') }, { id: 'me', i: 'user', l: b('حسابي', 'Me') }],
  };

  const L = (ar, en, icon, tone) => ({ ar, en, icon, tone });
  const status = {
    order: { placed: L('تم الطلب', 'Placed', 'checkCircle', 'info'), packed: L('تم التجهيز', 'Packed', 'box', 'info'), out_for_delivery: L('في الطريق', 'On the way', 'truck', 'primary'), delivered: L('تم التوصيل', 'Delivered', 'checks', 'success'), failed: L('تعذّر التوصيل', 'Not delivered', 'alertCircle', 'alert'), cancelled: L('ملغى', 'Cancelled', 'x', 'neutral') },
    stock: { in_stock: L('متوفرة', 'In stock', 'checkCircle', 'success'), low: L('كمية قليلة', 'Few left', 'hourglass', 'warning'), out: L('نفدت', 'Sold out', 'ban', 'neutral') },
    care: { due_today: L('تحتاج سقاية اليوم', 'Water today', 'droplet', 'warning'), done: L('تمت السقاية', 'Watered', 'check', 'success'), upcoming: L('قريباً', 'Coming up', 'calendar', 'neutral'), overdue: L('فات موعدها', 'Overdue', 'alertCircle', 'alert') },
  };
  const versions = { v1: 'v1', v2: 'v2 · phase two' };

  // ── Project data ──────────────────────────────────────────────────────────
  // cat → token category (plant family colour). light: 'bright' | 'medium' | 'low'. water = days between waterings.
  const plants = [
    { id: 'p1', name: b('مونستيرا', 'Monstera'), latin: 'Monstera deliciosa', cat: 'foliage', price: 18, sizes: [40, 60, 90], size: 60, light: 'bright', water: 7, pets: false, stock: 6, rating: 4.8 },
    { id: 'p2', name: b('نبتة الثعبان', 'Snake plant'), latin: 'Dracaena trifasciata', cat: 'succulents', price: 12.5, sizes: [40, 60], size: 40, light: 'low', water: 14, pets: false, stock: 11, rating: 4.9 },
    { id: 'p3', name: b('زنبق السلام', 'Peace lily'), latin: 'Spathiphyllum wallisii', cat: 'flowering', price: 9.75, sizes: [30, 50], size: 30, light: 'medium', water: 5, pets: false, stock: 0, rating: 4.6, restock: '2026-11-24' },
    { id: 'p4', name: b('تين الكمان', 'Fiddle-leaf fig'), latin: 'Ficus lyrata', cat: 'trees', price: 32, sizes: [90, 120], size: 90, light: 'bright', water: 7, pets: false, stock: 2, rating: 4.4 },
    { id: 'p5', name: b('إكليل الجبل', 'Rosemary'), latin: 'Salvia rosmarinus', cat: 'herbs', price: 4.5, sizes: [20], size: 20, light: 'bright', water: 3, pets: true, stock: 20, rating: 4.7 },
    { id: 'p6', name: b('بوتس ذهبي', 'Golden pothos'), latin: 'Epipremnum aureum', cat: 'foliage', price: 7.25, sizes: [25, 40], size: 25, light: 'medium', water: 7, pets: false, stock: 9, rating: 4.8 },
  ];
  const plant = id => plants.find(p => p.id === id);
  // size → price for the Monstera size picker on 1.2
  const sizePrice = { p1: { 40: 12, 60: 18, 90: 29 } };
  const cats = [{ id: 'all', l: b('الكل', 'All'), n: 38 }, { id: 'foliage', l: b('أوراق', 'Foliage'), n: 14 }, { id: 'succulents', l: b('صباريات', 'Succulents'), n: 9 }, { id: 'flowering', l: b('مزهرة', 'Flowering'), n: 6 }, { id: 'herbs', l: b('أعشاب', 'Herbs'), n: 5 }, { id: 'trees', l: b('أشجار داخلية', 'Indoor trees'), n: 4 }];
  const lightWord = { bright: b('ضوء ساطع غير مباشر', 'Bright, indirect light'), medium: b('ضوء متوسط', 'Medium light'), low: b('يتحمل الظل', 'Copes with shade') };
  const pot = { id: 'pot20', name: b('أصيص فخار 20 سم', 'Terracotta pot, 20 cm'), price: 3.5 };

  // Plants already at Najwa's home (from her August order) — drive the "Water today" strip
  const home = [
    { plant: 'p2', room: b('غرفة الجلوس', 'Living room'), last: '2026-11-04', next: '2026-11-18', s: 'due_today' },
    { plant: 'p5', room: b('شرفة المطبخ', 'Kitchen balcony'), last: '2026-11-15', next: '2026-11-18', s: 'due_today' },
    { plant: 'p3', room: b('غرفة النوم', 'Bedroom'), last: '2026-11-16', next: '2026-11-21', s: 'upcoming' },
  ];

  const addresses = [
    { id: 'a1', label: b('البيت', 'Home'), line: b('جبل اللويبدة، شارع نديم الملاح 14، الطابق الثاني', '14 Nadim Al-Mallah St., Jabal Al-Luweibdeh, 2nd floor'), zone: 'z1' },
    { id: 'a2', label: b('المكتب', 'Office'), line: b('مرج الحمام، شارع الكرمل 3', '3 Al-Karmel St., Marj Al-Hamam'), zone: null },
  ];
  const zones = [{ id: 'z1', name: b('وسط عمّان', 'Central Amman'), fee: 2, areas: b('اللويبدة · الشميساني · جبل عمّان', 'Luweibdeh · Shmeisani · Jabal Amman') }, { id: 'z2', name: b('ضواحي عمّان', 'Amman suburbs'), fee: 3, areas: b('دابوق · أم أذينة · الرابية', 'Dabouq · Um Uthaina · Rabieh') }];
  // Delivery slots for Thursday 19/11 (left = places left; 0 = full)
  const slots = [{ t: '10:00–12:00', left: 0 }, { t: '12:00–14:00', left: 2 }, { t: '16:00–18:00', left: 5 }, { t: '18:00–20:00', left: 4 }];

  // The order placed on 1.3 and tracked on 1.4. Totals are the shop's, never recomputed on screen.
  const order = {
    no: 'ORD-2026-1187', placed: '2026-11-18 10:26', deliver: '2026-11-19', slot: '16:00–18:00', address: 'a1', courier: 'issa', eta: '16:40', trackAt: '16:12',
    lines: [{ plant: 'p1', size: 60, qty: 1, amount: 18 }, { plant: 'p6', size: 25, qty: 1, amount: 7.25 }, { pot: 'pot20', qty: 1, amount: 3.5 }],
    subtotal: 28.75, delivery: 2, total: 30.75, pay: 'cash', s: 'out_for_delivery',
    reminders: [{ plant: 'p1', every: 7, first: '2026-11-26' }, { plant: 'p6', every: 7, first: '2026-11-26' }],
  };
  const payMethods = [{ id: 'cash', l: b('نقداً عند الاستلام', 'Cash on delivery'), i: 'cash' }, { id: 'card', l: b('بطاقة عند الاستلام', 'Card on delivery'), i: 'card', sub: b('يحمل المندوب جهاز الدفع', 'The courier brings a card reader') }, { id: 'online', l: b('دفع إلكتروني', 'Pay online'), i: 'credit', soon: true }];

  return { b, project, now, cur, currencies, phoneCountry, MONTHS, MONTHS_SHORT, DAYS, DAYS_SHORT, people, person, user, nav, status, versions,
    plants, plant, sizePrice, cats, lightWord, pot, home, addresses, zones, slots, order, payMethods };
})();
