(() => {
  // B1 · Ch1 · Order a plant — reference chapter: file structure, density, states, callouts, flow strip.
  // Local components live inside this IIFE (parts are inlined into one script; only the chapter is registered).

  // Plant stand-in: a drawn pot and leaves on the category tint (no stock photos). Shape varies by plant id.
  const PlantArt = ({ p, w = 160, h = 160, r = R.lg, style }) => {
    const C = useC(); const k = C.cat[p.cat] || C.cat.foliage; const rnd = rng(p.id); const n = 5 + Math.floor(rnd() * 3);
    const leaves = Array.from({ length: n }).map((_, i) => { const a = -70 + (140 / (n - 1)) * i + (rnd() * 10 - 5); const len = 30 + rnd() * 16; return <ellipse key={i} cx="50" cy={62 - len / 2} rx={p.cat === 'succulents' ? 5 : 9} ry={len / 2} fill={k.bar} opacity={0.75 + rnd() * 0.25} transform={`rotate(${a} 50 62)`} />; });
    return <span aria-hidden="true" style={{ width: w, height: h, borderRadius: r, background: k.bg, display: 'grid', placeItems: 'center', flexShrink: 0, overflow: 'hidden', ...style }}>
      <svg width="78%" height="78%" viewBox="0 0 100 100">{leaves}<path d="M33 64h34l-4 26H37z" fill={k.border} /><rect x="30" y="60" width="40" height="7" rx="2" fill={k.text} opacity=".55" /></svg>
    </span>;
  };
  const CatName = ({ cat }) => { const { tr } = useL(); const c = FX.cats.find(x => x.id === cat); return c ? tr(c.l) : cat; };
  const stockOf = p => (p.stock === 0 ? 'out' : p.stock <= 3 ? 'low' : 'in_stock');
  const PlantCard = ({ p }) => {
    const C = useC(); const { tr, $ } = useL(); const out = p.stock === 0;
    return <Card pad={10} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ position: 'relative' }}><PlantArt p={p} w="100%" h={118} r={R.md} style={{ opacity: out ? 0.55 : 1 }} />
        <IconBtn icon="heart" label={$('أضف إلى المفضلة', 'Add to favourites')} size={32} v="secondary" style={{ position: 'absolute', top: 6, insetInlineEnd: 6 }} /></div>
      <Col gap={2}>
        <Tx r="bodyStrong" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tr(p.name)}</Tx>
        <Row gap={4} style={{ color: C.textSecondary }}><Ic n={p.light === 'low' ? 'moon' : 'sun'} s={14} /><Tx r="caption" c={C.textSecondary}>{$(`كل ${p.water} أيام`, `Every ${p.water} days`)}</Tx></Row>
      </Col>
      <Row justify="space-between" align="center">{out ? <StatusPill kind="stock" s="out" size="sm" /> : <Money v={p.price} r="bodyStrong" />}{!out && <IconBtn icon="plus" label={$('أضف إلى السلة', 'Add to cart')} size={32} v="tonal" />}</Row>
    </Card>;
  };
  const tabs = FX.nav.phone;

  // ── 1.1 Shop ────────────────────────────────────────────────────────────────
  const S11 = ({ loading, empty, offline }) => {
    const C = useC(); const { $, tr } = useL(); const due = FX.home.filter(h => h.s === 'due_today');
    return <PhoneApp title={$('المتجر', 'Shop')} sub={$('التوصيل في عمّان', 'Delivering in Amman')} tabs={tabs} active="shop" bell={false}
      banner={offline && <Banner compact tone="warning" icon="wifiOff" body={$('لا يوجد اتصال · نعرض ما حُفظ عند 09:58', 'No connection · showing what was saved at 09:58')} style={{ borderRadius: 0, borderInline: 'none', borderTop: 'none' }} />}>
      <Search placeholder={$('ابحث عن نبتة أو مكان في البيت', 'Search plants or a spot at home')} value={empty ? $('صبار وردي', 'pink cactus') : undefined} clear={!!empty} />
      {empty ? <Card pad={0}><Empty icon="sprout" title={$('لا نبتة بهذا الاسم', 'No plant by that name')} body={$('جرّب اسماً أقصر، أو اسأل خبيرتنا وستقترح عليك ما يناسب مكانك.', 'Try a shorter name, or ask our adviser and she will suggest what suits your spot.')} action={<Btn v="secondary" icon="message">{$('اسأل وفاء', 'Ask Wafa')}</Btn>} /></Card> : <>
        {loading ? <Card pad={14}><Row gap={12}><Skel w={44} h={44} r={22} /><Col gap={6} style={{ flex: 1 }}><Skel w="70%" /><Skel w="45%" h={12} /></Col></Row></Card>
          : <Card pad={14} tone="warning" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Row gap={10}><IconTile n="droplet" tone="warning" size={36} /><Col gap={0} style={{ flex: 1 }}><Tx r="bodyStrong">{$('نبتتان تحتاجان السقاية اليوم', 'Two plants need water today')}</Tx><Tx r="caption" c={C.textSecondary}>{due.map(h => tr(FX.plant(h.plant).name)).join(' · ')}</Tx></Col></Row>
            <Row gap={8}><Btn size="sm" v="secondary" icon="check" style={{ flex: 1 }}>{$('سقيتهما', 'Watered both')}</Btn><Btn size="sm" v="ghost">{$('ذكّرني لاحقاً', 'Remind me later')}</Btn></Row>
          </Card>}
        <Row gap={8} style={{ overflow: 'hidden', flexWrap: 'nowrap' }}>{FX.cats.map((c, i) => <Chip key={c.id} on={i === 0} count={c.n}>{tr(c.l)}</Chip>)}</Row>
        <SectionHead title={$('الأكثر طلباً هذا الأسبوع', 'Popular this week')} action={<Btn v="link" size="sm">{$('الكل', 'See all')}</Btn>} style={{ marginBottom: 0 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {loading ? [0, 1, 2, 3].map(i => <Card key={i} pad={10}><Col gap={8}><Skel h={118} r={R.md} /><Skel w="70%" /><Skel w="40%" h={12} /></Col></Card>)
            : ['p1', 'p6', 'p2', 'p3'].map(id => <PlantCard key={id} p={FX.plant(id)} />)}
        </div>
      </>}
    </PhoneApp>;
  };

  // ── 1.2 Plant detail (desktop shop + phone) ──────────────────────────────────
  const CareFacts = ({ p, compact }) => {
    const C = useC(); const { $, tr } = useL();
    const row = (icon, l, v, tone) => [<Row gap={8} style={{ color: C.textSecondary }}><Ic n={icon} s={18} /><span>{l}</span></Row>, <Tx r={compact ? 'bodySm' : 'body'} c={tone || C.text}>{v}</Tx>];
    return <DL gap={compact ? '8px 12px' : '10px 20px'} rows={[row('sun', $('الضوء', 'Light'), tr(FX.lightWord[p.light])), row('droplet', $('السقاية', 'Water'), $(`كل ${p.water} أيام، حين يجفّ أعلى التربة`, `Every ${p.water} days, when the topsoil is dry`)), row('alert', $('الحيوانات', 'Pets'), p.pets ? $('آمنة للقطط والكلاب', 'Safe for cats and dogs') : $('أبعدها عن القطط والكلاب', 'Keep away from cats and dogs'), p.pets ? undefined : C.warningText)]} />;
  };
  const PotAddOn = ({ on = true }) => {
    const C = useC(); const { $, tr } = useL();
    return <Card pad={12} selected={on} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Check on={on} /><span aria-hidden="true" style={{ width: 36, height: 36, borderRadius: R.md, background: C.accentSubtle, display: 'grid', placeItems: 'center' }}><svg width="22" height="22" viewBox="0 0 24 24"><path d="M5 8h14l-2 12H7z" fill={C.accent} /><rect x="4" y="5" width="16" height="4" rx="1" fill={C.accent} /></svg></span>
      <Col gap={0} style={{ flex: 1 }}><Tx r="bodyStrong">{tr(FX.pot.name)}</Tx><Tx r="caption" c={C.textSecondary}>{$('مع ثقوب تصريف وصحن', 'With drainage holes and a saucer')}</Tx></Col>
      <Money v={FX.pot.price} sign />
    </Card>;
  };
  const SizePick = ({ p, full }) => { const { $ } = useL(); return <Segmented full={full} value={p.size} items={p.sizes.map(s => ({ v: s, label: $(`${s} سم`, `${s} cm`) }))} />; };
  const StoreTop = () => {
    const C = useC(); const { $, tr } = useL(); const u = FX.person(FX.user);
    return <div style={{ height: 68, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 28, padding: '0 40px', background: C.surface, borderBottom: `1px solid ${C.border}` }}>
      <Wordmark size={26} />
      <Row gap={24}>{[['المتجر', 'Shop', true], ['دليل العناية', 'Care guides'], ['طلباتي', 'Orders']].map(([a, e, on]) => <Tx key={e} r="bodyStrong" c={on ? C.primaryText : C.textSecondary} style={{ borderBottom: on ? `2px solid ${C.primary}` : 'none', paddingBottom: 2 }}>{$(a, e)}</Tx>)}</Row>
      <div style={{ flex: 1 }} /><Search size="sm" placeholder={$('ابحث عن نبتة', 'Search plants')} style={{ width: 300 }} />
      <IconBtn icon="cart" label={$('السلة', 'Cart')} /><Avatar ini={tr(u.ini)} name={tr(u.name)} size={36} />
    </div>;
  };
  const S12 = ({ out }) => {
    const C = useC(); const { $, tr, date } = useL(); const p = FX.plant(out ? 'p3' : 'p1');
    return <DesktopBlank>
      <StoreTop />
      <div className="bk-body" style={{ flex: 1, minHeight: 0, overflow: 'hidden', padding: '28px 40px', display: 'grid', gridTemplateColumns: '600px 1fr', gap: 48, alignContent: 'start' }}>
        <Col gap={12}><PlantArt p={p} w={600} h={560} r={R.xl} style={{ opacity: out ? 0.6 : 1 }} /><Row gap={12}>{[0, 1, 2, 3].map(i => <PlantArt key={i} p={{ ...p, id: p.id + i }} w={138} h={96} r={R.md} style={{ outline: i === 0 ? `2px solid ${C.primary}` : 'none', outlineOffset: 2 }} />)}</Row></Col>
        <Col gap={18}>
          <Row gap={6} style={{ color: C.textSecondary }}><Tx r="bodySm" c={C.textSecondary}>{$('المتجر', 'Shop')}</Tx><Ic n="chevR" s={14} /><Tx r="bodySm" c={C.textSecondary}><CatName cat={p.cat} /></Tx></Row>
          <Col gap={4}><Tx r="display" style={{ fontFamily: useL().isAr ? DISPLAY_AR : DISPLAY, fontSize: 44, lineHeight: '52px' }}>{tr(p.name)}</Tx><Tx r="body" c={C.textSecondary} style={{ fontStyle: 'italic' }} lang="en">{p.latin}</Tx></Col>
          <Row gap={14}><Money v={p.price} r="moneyXL" /><Row gap={4} style={{ color: C.textSecondary }}><Ic n="star" s={16} fill={C.warning} c={C.warning} /><Num r="bodySm" c={C.textSecondary}>{p.rating}</Num></Row>{out ? <StatusPill kind="stock" s="out" /> : <Pill tone="success" icon="checkCircle">{$(`${p.stock} قطع متوفرة`, `${p.stock} in stock`)}</Pill>}</Row>
          <Col gap={8}><Tx r="label" upper c={C.textSecondary}>{$('الحجم', 'Size')}</Tx><SizePick p={p} /></Col>
          <Card pad={18}><CareFacts p={p} /></Card>
          {out ? <Banner tone="info" icon="bell" title={$(`تعود في ${date(p.restock, { dow: true })}`, `Back on ${date(p.restock, { dow: true })}`)} body={$('نرسل لك رسالة حين تصل، ونحجز لك واحدة ليوم كامل.', 'We message you when it arrives and hold one for you for a day.')} action={<Btn>{$('أعلمني', 'Notify me')}</Btn>} />
            : <><PotAddOn />
              <Row gap={12}><QtyStepper v={1} min={1} /><Btn size="lg" icon="cart" style={{ flex: 1 }}>{$('أضف إلى السلة', 'Add to cart')}</Btn><IconBtn icon="heart" label={$('أضف إلى المفضلة', 'Add to favourites')} v="secondary" size={48} /></Row>
              <Row gap={8} style={{ color: C.textSecondary }}><Ic n="truck" s={18} /><Tx r="bodySm" c={C.textSecondary}>{$('اطلب قبل 14:00 ليصلك غداً في وسط عمّان · التوصيل', 'Order by 14:00 for delivery tomorrow in Central Amman · delivery')} <Money v={FX.zones[0].fee} r="bodySm" c={C.textSecondary} /></Tx></Row></>}
        </Col>
      </div>
    </DesktopBlank>;
  };
  const S12p = ({ out }) => {
    const C = useC(); const { $, tr, date } = useL(); const p = FX.plant(out ? 'p3' : 'p1');
    return <PhoneApp back title={tr(p.name)} actions={<IconBtn icon="heart" label={$('أضف إلى المفضلة', 'Add to favourites')} size={44} />} pad={0} gap={0}
      bottom={out ? <Btn size="xl" full v="secondary" icon="bell">{$(`أعلمني حين تعود · ${date(p.restock)}`, `Notify me · back ${date(p.restock)}`)}</Btn> : <Btn size="xl" full icon="cart">{$('أضف إلى السلة', 'Add to cart')}</Btn>}>
      <PlantArt p={p} w="100%" h={250} r={0} style={{ opacity: out ? 0.6 : 1 }} />
      <Col gap={14} style={{ padding: 16 }}>
        <Row justify="space-between" align="flex-start"><Col gap={0}><Tx r="title" style={{ fontFamily: useL().isAr ? DISPLAY_AR : DISPLAY }}>{tr(p.name)}</Tx><Tx r="bodySm" c={C.textSecondary} style={{ fontStyle: 'italic' }} lang="en">{p.latin}</Tx></Col><Money v={p.price} r="moneyL" /></Row>
        {out ? <StatusPill kind="stock" s="out" /> : <SizePick p={p} full />}
        <Card pad={14}><CareFacts p={p} compact /></Card>
        {!out && <PotAddOn />}
      </Col>
    </PhoneApp>;
  };

  // ── 1.3 Checkout ────────────────────────────────────────────────────────────
  const S13 = ({ slotGone, outOfZone, placing }) => {
    const C = useC(); const { $, tr, date } = useL(); const o = FX.order; const a = FX.addresses.find(x => x.id === (outOfZone ? 'a2' : o.address));
    const zone = FX.zones.find(z => z.id === a.zone);
    return <PhoneApp back title={$('إتمام الطلب', 'Checkout')} sub={$('3 قطع', '3 items')} actions={<span />}
      bottom={<Btn size="xl" full loading={placing} disabled={outOfZone}>{placing ? $('جارٍ إرسال الطلب', 'Placing order') : <>{$('أرسل الطلب', 'Place order')} · <Money v={o.total} r="money" c={outOfZone ? C.textDisabled : C.onPrimary} codeC={outOfZone ? C.textDisabled : C.onPrimary} /></>}</Btn>}>
      <Card pad={14} style={{ display: 'flex', gap: 12 }}>
        <IconTile n="mapPin" tone={outOfZone ? 'warning' : 'primary'} size={36} />
        <Col gap={2} style={{ flex: 1 }}><Row gap={8}><Tx r="bodyStrong">{tr(a.label)}</Tx>{zone && <Pill size="sm" tone="neutral">{tr(zone.name)}</Pill>}</Row><Tx r="bodySm" c={C.textSecondary}>{tr(a.line)}</Tx></Col>
        <Btn v="link" size="sm">{$('تغيير', 'Change')}</Btn>
      </Card>
      {outOfZone && <Banner tone="warning" title={$('لا نوصل إلى مرج الحمام بعد', 'We do not deliver to Marj Al-Hamam yet')} body={$('اختر عنوان البيت، أو استلم الطلب من المشتل في اللويبدة.', 'Choose your home address, or pick the order up at our nursery in Luweibdeh.')} />}
      <Col gap={8}>
        <Row justify="space-between"><Tx r="label" upper c={C.textSecondary}>{$('موعد التوصيل', 'Delivery time')}</Tx><Tx r="bodySm" c={C.textSecondary}>{date(o.deliver, { dow: true })}</Tx></Row>
        {slotGone && <Banner compact tone="warning" body={$('امتلأ موعد 16:00–18:00 للتو. اختر وقتاً آخر.', '16:00–18:00 just filled up. Pick another time.')} />}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>{FX.slots.map(s => { const full = s.left === 0 || (slotGone && s.t === o.slot); const on = !slotGone && s.t === o.slot; return <div key={s.t} style={{ position: 'relative', padding: '10px 12px', borderRadius: R.md, border: `1px solid ${on ? C.primary : full ? C.border : C.controlBorder}`, background: on ? C.primarySubtle : full ? C.surface2 : C.surface, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Num r="bodyStrong" c={full ? C.textDisabled : on ? C.primaryText : C.text}>{s.t}</Num>
          <Tx r="caption" c={full ? C.textSecondary : s.left <= 2 ? C.warningText : C.textSecondary}>{full ? $('ممتلئ', 'Full') : s.left <= 2 ? $(`بقي ${s.left === 2 ? 'مكانان' : 'مكان واحد'}`, `${s.left} left`) : $('متاح', 'Available')}</Tx>
          {on && <Ic n="checkCircle" s={18} c={C.primary} style={{ position: 'absolute', top: 10, insetInlineEnd: 10 }} />}
        </div>; })}</div>
      </Col>
      <Col gap={0}>
        <Tx r="label" upper c={C.textSecondary} style={{ marginBottom: 4 }}>{$('الدفع', 'Payment')}</Tx>
        {FX.payMethods.map((m, i) => <LRow key={m.id} pad={0} h={48} divider={i < FX.payMethods.length - 1} lead={<Radio on={m.id === o.pay} disabled={m.soon} />} title={<Row gap={8}><Ic n={m.i} s={18} c={m.soon ? C.textDisabled : C.textSecondary} /><Tx r="body" c={m.soon ? C.textSecondary : C.text}>{tr(m.l)}</Tx>{m.soon && <Pill size="sm" tone="info">{$('قريباً', 'Soon')}</Pill>}</Row>} sub={m.sub && tr(m.sub)} />)}
      </Col>
      <Card pad={14} onSurface style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <IconTile n="droplet" tone="primary" size={36} />
        <Col gap={0} style={{ flex: 1 }}><Tx r="bodyStrong">{$('ذكّرني بسقايتها', 'Remind me to water them')}</Tx><Tx r="caption" c={C.textSecondary}>{$('المونستيرا والبوتس، كل 7 أيام', 'Monstera and pothos, every 7 days')}</Tx></Col>
        <Toggle on />
      </Card>
      <TotalsBlock rows={[{ l: $('النباتات والأصيص', 'Plants and pot'), v: o.subtotal }, { l: $('التوصيل', 'Delivery'), v: o.delivery, sub: tr(FX.zones[0].name) }]} total={{ l: $('المجموع', 'Total'), v: o.total }} />
    </PhoneApp>;
  };

  // ── 1.4 Order on its way ────────────────────────────────────────────────────
  const S14 = ({ delivered, failed }) => {
    const C = useC(); const { $, tr, date } = useL(); const o = FX.order; const c = FX.person(o.courier);
    const steps = [$('تم الطلب', 'Placed'), $('تم التجهيز', 'Packed'), $('في الطريق', 'On the way'), $('وصل', 'Delivered')];
    return <PhoneApp back title={o.no} sub={date(o.deliver, { dow: true }) + ' · ' + iso(o.slot)} clock={delivered ? '16:44' : failed ? '16:38' : o.trackAt} date={o.deliver} actions={<IconBtn icon="help" label={$('مساعدة', 'Help')} size={44} />}
      overlay={delivered && <Toast icon="droplet" tone="success" bottom={110}>{$('بدأت التذكيرات: أول سقاية يوم 26 تشرين الثاني.', 'Reminders are on: first watering on 26 Nov.')}</Toast>}>
      <Card pad={16} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Row justify="space-between"><StatusPill kind="order" s={delivered ? 'delivered' : failed ? 'failed' : o.s} /><Num r="caption" c={C.textSecondary}>{o.no}</Num></Row>
        {failed ? <Col gap={2}><Tx r="title">{$('لم نجد أحداً في البيت', 'Nobody was home')}</Tx><Tx r="bodySm" c={C.textSecondary}>{$('حاول عيسى الاتصال بك عند 16:35. النباتات عادت إلى المشتل وهي بخير.', 'Issa tried to call you at 16:35. The plants are back at the nursery and doing fine.')}</Tx></Col>
          : <Col gap={2}><Tx r="bodySm" c={C.textSecondary}>{delivered ? $('وصل الطلب عند', 'Delivered at') : $('يصل نحو', 'Arriving around')}</Tx><Num r="moneyXL" c={C.text}>{delivered ? '16:44' : o.eta}</Num></Col>}
        <Steps at={delivered ? 4 : failed ? 3 : 2} error={failed ? 3 : undefined} items={steps} />
      </Card>
      {failed ? <Col gap={10}><Btn size="lg" full icon="calendar">{$('اختر موعداً جديداً', 'Pick a new time')}</Btn><Btn size="lg" full v="secondary" icon="store">{$('سأستلمه من المشتل', 'I will collect it')}</Btn></Col>
        : <Card pad={0}><LRow lead={<Avatar ini={tr(c.ini)} name={tr(c.name)} size={40} status={delivered ? undefined : 'on'} />} title={tr(c.name)} sub={tr(c.role)} divider={false} trail={!delivered && <Row gap={4}><IconBtn icon="message" label={$('مراسلة', 'Message')} v="secondary" /><IconBtn icon="phone" label={$('اتصال', 'Call')} v="tonal" /></Row>} /></Card>}
      <Card pad={0}>
        {o.lines.map((l, i) => { const p = l.plant && FX.plant(l.plant); return <LRow key={i} h={60} divider={i < o.lines.length - 1}
          lead={p ? <PlantArt p={p} w={44} h={44} r={R.md} /> : <span aria-hidden="true" style={{ width: 44, height: 44, borderRadius: R.md, background: C.accentSubtle, display: 'grid', placeItems: 'center' }}><svg width="24" height="24" viewBox="0 0 24 24"><path d="M5 8h14l-2 12H7z" fill={C.accent} /><rect x="4" y="5" width="16" height="4" rx="1" fill={C.accent} /></svg></span>}
          title={p ? tr(p.name) : tr(FX.pot.name)} sub={p ? $(`${l.size} سم`, `${l.size} cm`) : undefined} trail={<Money v={l.amount} />} />; })}
        <div style={{ padding: '0 16px 8px' }}><TotalsBlock total={{ l: $('المجموع · نقداً عند الاستلام', 'Total · cash on delivery'), v: o.total }} /></div>
      </Card>
      {!failed && <Card pad={14} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Row gap={8}><Ic n="droplet" s={18} c={C.primaryText} /><Tx r="bodyStrong">{$('تذكيرات السقاية', 'Watering reminders')}</Tx></Row>
        {o.reminders.map(r => <Row key={r.plant} justify="space-between"><Tx r="bodySm">{tr(FX.plant(r.plant).name)}</Tx><Tx r="bodySm" c={C.textSecondary}>{$(`كل ${r.every} أيام · من ${date(r.first)}`, `Every ${r.every} days · from ${date(r.first)}`)}</Tx></Row>)}
      </Card>}
    </PhoneApp>;
  };

  const Ch1 = () => <ChapterBand num={1} name="Order a plant" nameAr="اطلب نبتة" screens={5} layout="phone"
      title="The reminder sells the plant."
      lede="Najwa opens the shop to two thirsty plants, picks a Monstera, books a two-hour slot and leaves with its watering already scheduled."
      lane="The care strip leads the shop because people come back for reminders, not catalogues. Checkout asks only what delivery needs; payment is on delivery at launch. Tracking ends by turning the order into reminders.">
    <ScreenFrame id="1.1" name="Shop" nameAr="المتجر" device="phone" v="v1" leadsTo={['1.2', '1.2p']}
      callouts={[{ x: '92%', y: '18%', text: 'Search covers plant names and spots at home ("bathroom", "north window").' }, { x: '93%', y: '23.5%', text: 'Plants already at home that need water today; "Watered both" logs it and moves the next date.' }, { x: '74%', y: '86%', xAr: '26%', text: 'Sold-out plants stay in the grid with the word, so the layout does not jump; tapping opens Notify me.' }]}><S11 /></ScreenFrame>
    <StateRow of="1.1" device="phone" items={[{ label: 'Loading', el: <S11 loading /> }, { label: 'No results', el: <S11 empty /> }, { label: 'Offline · saved copy', el: <S11 offline /> }]} />
    <ScreenFrame id="1.2" name="Plant detail" nameAr="تفاصيل النبتة" device="desktop" v="v1" leadsTo={['1.3']}
      callouts={[{ x: '50%', y: '37.6%', text: 'Size changes the price and the stock count in place; the default is the size most people buy.' }, { x: '50%', y: '64%', text: 'The pot is pre-ticked as an add-on with its own price; untick it to order the plant alone.' }]}><S12 /></ScreenFrame>
    <StateRow of="1.2" device="desktop" items={[{ label: 'Sold out · notify me', el: <S12 out /> }]} />
    <ScreenFrame id="1.2p" name="Plant detail · phone" nameAr="تفاصيل النبتة" device="phone" v="v1" leadsTo={['1.3']}><S12p /></ScreenFrame>
    <StateRow of="1.2p" device="phone" items={[{ label: 'Sold out · notify me', el: <S12p out /> }]} />
    <ScreenFrame id="1.3" name="Checkout" nameAr="إتمام الطلب" device="phone" v="v1" leadsTo={['1.4']}
      callouts={[{ x: '96%', y: '36%', text: 'Slots show how many places are left; a full slot stays visible but cannot be picked.' }, { x: '84%', y: '69.5%', yAr: '73.8%', text: 'Reminders are on by default for the plants in this order; they start the week after delivery.' }, { x: '7%', y: '93%', text: 'One action with the shop\'s total on it. Nothing is charged now: payment is cash or card on delivery.' }]}><S13 /></ScreenFrame>
    <StateRow of="1.3" device="phone" items={[{ label: 'Slot filled while choosing', el: <S13 slotGone /> }, { label: 'Address outside the delivery zone', el: <S13 outOfZone /> }, { label: 'Placing the order', el: <S13 placing /> }]} />
    <ScreenFrame id="1.4" name="Order on its way" nameAr="طلبك في الطريق" device="phone" v="v1" leadsTo={['1.1']}><S14 /></ScreenFrame>
    <StateRow of="1.4" device="phone" items={[{ label: 'Delivered · reminders on', el: <S14 delivered /> }, { label: 'Not delivered', el: <S14 failed /> }]} />
    <FlowStrip name="Order a plant" steps={['1.1 Shop', '1.2 Plant detail', '1.3 Checkout', '1.4 Order on its way']} />
  </ChapterBand>;
  window.BOARD_PARTS.B1 = { ...(window.BOARD_PARTS.B1 || {}), 1: Ch1 };
})();
