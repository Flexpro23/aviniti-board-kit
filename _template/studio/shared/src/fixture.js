/* Fixture — the ONE source of names, numbers, prices, dates and statuses for every board of this project.
 * Every human-facing string is {ar, en} (use FX.b). Digits are Western 0-9 in both languages; amounts, phones and codes
 * render as LTR isolates. Screens never invent a value: add it here first.
 *
 * Keys the engine reads (keep them, change the values):
 *   project { name, nameAr, tagline, url, boardDate } · now { date, time } · cur · currencies [{ code, dec }] · phoneCountry
 *   MONTHS · MONTHS_SHORT · DAYS · DAYS_SHORT ({ ar: [...], en: [...] }) · people + person(id) · user (person id)
 *   nav { phone, desktop, tablet } (shell defaults) · status { kind: { state: { ar, en, icon, tone } } } · versions
 * Everything else is project data: add whatever the boards need below "Project data".
 */
const FX = (() => {
  const b = (ar, en) => ({ ar, en });

  const project = {
    name: 'Project', nameAr: 'المشروع',
    tagline: b('وصف المشروع في جملة واحدة.', 'What the product does, in one sentence.'),
    url: 'app.example.com', boardDate: '01/01/2026',
  };
  // "Now" for every live screen
  const now = { date: '2026-01-15', time: '09:30' };
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

  // People shown in avatars and lists. ini = initials per language.
  const people = [
    { id: 'me', name: b('المستخدم', 'You'), ini: b('م', 'Y'), role: b('صاحب الحساب', 'Account owner') },
    { id: 'p2', name: b('عضو الفريق', 'Team member'), ini: b('ع', 'T'), role: b('موظف', 'Staff') },
  ];
  const person = id => people.find(p => p.id === id);
  const user = 'me';

  // Shell navigation defaults (screens may pass tabs / sidebar / rail props instead)
  const nav = {
    phone: [{ id: 'home', i: 'home', l: b('الرئيسية', 'Home') }, { id: 'search', i: 'search', l: b('بحث', 'Search') }, { id: 'new', i: 'plus', l: b('جديد', 'New'), fab: true }, { id: 'inbox', i: 'inbox', l: b('الوارد', 'Inbox') }, { id: 'me', i: 'user', l: b('حسابي', 'Me') }],
    desktop: [{ g: b('العمل', 'Work'), items: [{ id: 'home', i: 'home', l: b('الرئيسية', 'Home') }, { id: 'list', i: 'list', l: b('القائمة', 'Items'), badge: 4 }, { id: 'calendar', i: 'calendar', l: b('التقويم', 'Calendar') }] }, { g: b('الإدارة', 'Admin'), items: [{ id: 'reports', i: 'chart', l: b('التقارير', 'Reports') }, { id: 'settings', i: 'settings', l: b('الإعدادات', 'Settings') }] }],
    tablet: [{ id: 'home', i: 'home', l: b('الرئيسية', 'Home') }, { id: 'list', i: 'list', l: b('القائمة', 'Items') }, { id: 'calendar', i: 'calendar', l: b('التقويم', 'Calendar') }, { id: 'settings', i: 'settings', l: b('الإعدادات', 'Settings') }],
  };

  // Status vocabulary for <StatusPill kind s/>: one word per state, an icon, and a tone
  // (neutral · primary · accent · success · warning · alert · info). Red (alert) only for things that went wrong.
  const L = (ar, en, icon, tone) => ({ ar, en, icon, tone });
  const status = {
    item: { draft: L('مسودة', 'Draft', 'edit', 'neutral'), pending: L('بالانتظار', 'Pending', 'hourglass', 'warning'), active: L('نشط', 'Active', 'checkCircle', 'success'), done: L('مكتمل', 'Done', 'checks', 'info'), failed: L('فشل', 'Failed', 'alertCircle', 'alert') },
  };
  const versions = { v1: 'v1', v2: 'v2 · phase two' };

  // ── Project data ──────────────────────────────────────────────────────────
  const items = [
    { id: 'i1', name: b('العنصر الأول', 'First item'), amount: 12.5, s: 'active' },
    { id: 'i2', name: b('العنصر الثاني', 'Second item'), amount: 40, s: 'pending' },
  ];

  return { b, project, now, cur, currencies, phoneCountry, MONTHS, MONTHS_SHORT, DAYS, DAYS_SHORT, people, person, user, nav, status, versions, items };
})();
