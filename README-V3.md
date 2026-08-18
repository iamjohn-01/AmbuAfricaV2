# AmbuAfrica V3 — Real MVP Foundation

This build keeps the approved AmbuAfrica V2 visual template and adds the production architecture needed for real GPS, real-time dispatch and real payments.

## What is now prepared

- Real browser GPS permission and continuous location watching.
- Google Maps adapter.
- Separate private Admin entry point at `/admin/`.
- Supabase production database schema for patients, drivers, hospitals, ambulances, emergency requests, location updates and payments.
- Paystack checkout adapter for card payments.
- Bank-transfer settings model controlled by Admin.
- No fake hospitals are seeded in the production schema.
- No raw card details are stored by AmbuAfrica.

## Required configuration

Edit `config.js`:

- `supabaseUrl`
- `supabasePublishableKey`
- `googleMapsApiKey`
- `paystackPublicKey`

Never put Supabase service-role keys, Paystack secret keys, or webhook secrets in frontend files.

## Google Maps

Create/restrict a Google Maps browser API key and enable the required Maps JavaScript API. Billing is required by Google for Maps JavaScript API usage.

## Supabase

1. Create a Supabase project.
2. Run `backend/schema.sql`.
3. Configure Auth email/password.
4. Add proper Row Level Security policies for each role.
5. Add the database tables to Realtime as needed.
6. Create protected Edge Functions for payment verification, admin actions and any privileged operations.

## Payments

The browser only starts a Paystack transaction. The server/Edge Function must verify the transaction before marking a payment as paid.

For bank transfer:
1. Admin enters the official AmbuAfrica bank account in the admin console.
2. Patient sees the configured transfer details for a selected emergency.
3. Patient submits transfer reference/proof.
4. Admin verifies it.
5. Backend marks the payment as paid.

## Important production rule

GPS and emergency dispatch are sensitive. Do not launch with demo/localStorage authentication or unverified dispatch logic. The next implementation step is wiring the existing V2 pages to Supabase Auth + RLS + Realtime and replacing the local demo state with database calls.
