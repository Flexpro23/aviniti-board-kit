# Fernly — design brief (fictional example)

## 1 · Product
Fernly is a plant shop in Amman with home delivery and watering reminders. Customers buy house plants and pots online. Each plant they buy is added to "my plants" with a care schedule, so the shop earns repeat visits through reminders rather than a catalogue.

## 2 · Market & language
- Amman, Jordan. Currency JOD with 3 decimals (`JOD 18.000`). Phones +962 7X XXX XXXX.
- Arabic and English carry equal weight. Arabic UI uses plain MSA and addresses the customer in the masculine/neutral form.
- 24-hour times in delivery slots (16:00–18:00). Levantine month names (تشرين الثاني).

## 3 · Rules
1. Payment is on delivery at launch (cash or card with the courier's reader). Online payment is v2 and is shown only as "Soon".
2. Sold-out plants stay visible, carry the word "Sold out" and a restock date, and offer Notify me. They never disappear from the grid.
3. Red is only for things that went wrong: a failed delivery, or an address outside the zone. Form problems are amber.
4. Delivery happens only inside the delivery zone. Addresses outside it block checkout, with the reason shown.
5. Reminders are on by default for plants in an order and start the week after delivery.

## 4 · Roles
| Role | Device | Does | Never sees |
|---|---|---|---|
| Customer | Phone app, web shop on desktop | Browses, orders, tracks, waters | Stock levels beyond "low" / "sold out", courier route |

## 5 · Features (v1)
Shop with a care strip → plant detail (size, care facts, pot add-on) → checkout (address, slot, payment on delivery, reminders) → tracking → reminders.

## 6 · Glossary
| English | العربية | Meaning |
|---|---|---|
| Order | طلب | One checkout, one delivery |
| Slot | موعد التوصيل | A two-hour delivery window |
| Reminder | تذكير | A watering prompt for one plant |
| Sold out | نفدت الكمية | Zero in stock; restock date shown |

## 7 · Brand
Fern green on warm paper, with terracotta as the accent (the pot). IBM Plex Sans + IBM Plex Sans Arabic.

## 8 · Out of scope
The courier app, the shop's admin, and subscriptions (v2).
