# Fernly — page inventory

Source of truth for what every board contains. Builders build exactly this; anything missing is logged, not invented.
Run `python3 _tools/pages2index.py` after any change here: it rewrites the screens in `Boards/index.json`.

Format per screen: `ID · Name (EN) · الاسم (AR) · version · device` then **On it** (what the screen shows), **States** (rendered as a StateRow, both languages), **Leads to** (ScreenFrame leadsTo). `[P]` = the desktop screen also gets a phone frame (id suffix `p`, e.g. `1.2p`). Cross-board links use `B1:` / `B2:`. Devices: `desktop` (browser 1440×900), `tablet` (1194×834), `phone` (390×844).

Versions: **v1** = launch. **v2** = phase two (online payment, subscriptions for plant care). Every frame carries its version.

"Now" for every live screen: Wednesday 18/11/2026, 10:20, customer Najwa Barghouti (Jabal Al-Luweibdeh). Use fixture data only (`FX`).

Canonical facts (reconcile every board to these):
- Order ORD-2026-1187: Monstera 60 cm JOD 18.000 + Golden pothos 25 cm JOD 7.250 + terracotta pot 20 cm JOD 3.500 = JOD 28.750, delivery Central Amman JOD 2.000, total JOD 30.750, cash on delivery.
- Delivery Thursday 19/11, slot 16:00–18:00; courier Issa Halabi; tracking depicts 16:12 with ETA 16:40.
- At home already: Snake plant (living room) and Rosemary (kitchen balcony) due today; Peace lily next on 21/11 and sold out in the shop until 24/11.
- Reminders from this order: Monstera and Golden pothos every 7 days from 26/11.

## B1 · Customer app — phone first, web shop on desktop

### Ch1 · Order a plant — اطلب نبتة
- narrative: title "The reminder sells the plant." · lede "Najwa opens the shop to two thirsty plants, picks a Monstera, books a two-hour slot and leaves with its watering already scheduled." · lane "The care strip leads the shop because people come back for reminders, not catalogues. Checkout asks only what delivery needs; payment is on delivery at launch. Tracking ends by turning the order into reminders."
- **1.1 · Shop · المتجر · v1 · phone** — On it: search (plant names and spots at home), the "Two plants need water today" strip (Snake plant · Rosemary) with Watered both and Remind me later, category chips with counts (All 38 · Foliage 14 · Succulents 9 · Flowering 6 · Herbs 5 · Indoor trees 4), Popular this week grid (Monstera, Golden pothos, Snake plant, Peace lily sold out), tab bar Shop · Care · Cart · Orders · Me. States: loading skeleton matching the layout, no results ("pink cactus" · Ask Wafa), offline with the saved copy from 09:58. Leads to: 1.2, 1.2p.
- **1.2 · Plant detail · تفاصيل النبتة · v1 · desktop [P]** — On it: web shop header, Monstera photo stand-in with four thumbnails, breadcrumb Shop › Foliage, name and Latin name, JOD 18.000, rating 4.8, 6 in stock, size 40 · 60 · 90 cm (60 selected), care facts (bright indirect light, water every 7 days when the topsoil is dry, keep away from cats and dogs), terracotta pot add-on pre-ticked (+ JOD 3.500), quantity, Add to cart, delivery note (order by 14:00 for tomorrow, JOD 2.000). Phone: the same with a 56 px sticky Add to cart. States: Peace lily sold out with "Back on Tuesday 24 Nov" and Notify me (desktop and phone). Leads to: 1.3.
- **1.3 · Checkout · إتمام الطلب · v1 · phone** — On it: address card (Home · Central Amman · 14 Nadim Al-Mallah St.), delivery time for Thursday 19 Nov (10:00–12:00 full · 12:00–14:00 2 left · 16:00–18:00 selected · 18:00–20:00), payment (cash on delivery selected · card on delivery with the courier's reader · pay online marked Soon), "Remind me to water them" toggle on, totals (plants and pot 28.750 · delivery 2.000 · total 30.750), sticky Place order · JOD 30.750. States: slot filled while choosing, address outside the delivery zone (Marj Al-Hamam, button disabled), placing the order (loading). Leads to: 1.4.
- **1.4 · Order on its way · طلبك في الطريق · v1 · phone** — On it (19/11 16:12): status On the way, arriving around 16:40, steps Placed · Packed · On the way · Delivered, courier Issa Halabi with message and call, the three lines with the total paid on delivery, watering reminders (Monstera and Golden pothos every 7 days from 26 Nov). States: delivered at 16:44 with the "Reminders are on" toast, not delivered (nobody home at 16:35 · Pick a new time · I will collect it). Leads to: 1.1.
