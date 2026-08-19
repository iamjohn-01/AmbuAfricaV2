-- AmbuAfrica V3 production foundation
-- Run in Supabase SQL Editor. Review RLS policies with your backend/security lead
-- before production launch.

create extension if not exists pgcrypto;

create type public.user_role as enum ('patient','driver','hospital','admin');
create type public.account_status as enum ('pending','active','suspended','rejected');
create type public.ambulance_status as enum ('offline','available','assigned','en_route','on_scene','transporting','maintenance');
create type public.emergency_status as enum ('requested','accepted','en_route','arrived','transporting','completed','cancelled','rejected');
create type public.payment_status as enum ('pending','paid','failed','refunded','manual_review');
create type public.payment_method as enum ('card','bank_transfer');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'patient',
  full_name text not null,
  phone text,
  status public.account_status not null default 'pending',
  created_at timestamptz not null default now()
);

create table public.hospitals (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id),
  name text not null,
  phone text,
  email text,
  address text,
  latitude double precision,
  longitude double precision,
  verified boolean not null default false,
  status public.account_status not null default 'pending',
  created_at timestamptz not null default now()
);

create table public.ambulances (
  id uuid primary key default gen_random_uuid(),
  hospital_id uuid references public.hospitals(id),
  driver_id uuid references public.profiles(id),
  vehicle_number text unique not null,
  ambulance_type text not null,
  status public.ambulance_status not null default 'offline',
  latitude double precision,
  longitude double precision,
  last_location_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.emergency_requests (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id),
  ambulance_id uuid references public.ambulances(id),
  hospital_id uuid references public.hospitals(id),
  status public.emergency_status not null default 'requested',
  emergency_type text,
  pickup_address text,
  pickup_latitude double precision not null,
  pickup_longitude double precision not null,
  destination_address text,
  destination_latitude double precision,
  destination_longitude double precision,
  estimated_fare numeric(12,2),
  created_at timestamptz not null default now(),
  accepted_at timestamptz,
  completed_at timestamptz
);

create table public.location_updates (
  id bigint generated always as identity primary key,
  emergency_id uuid references public.emergency_requests(id) on delete cascade,
  actor_id uuid references public.profiles(id),
  latitude double precision not null,
  longitude double precision not null,
  accuracy double precision,
  recorded_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  emergency_id uuid not null references public.emergency_requests(id),
  patient_id uuid not null references public.profiles(id),
  amount numeric(12,2) not null,
  method public.payment_method not null,
  status public.payment_status not null default 'pending',
  provider_reference text unique,
  proof_url text,
  verified_by uuid references public.profiles(id),
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.payment_settings (
  id boolean primary key default true,
  bank_name text,
  account_name text,
  account_number text,
  updated_by uuid references public.profiles(id),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.hospitals enable row level security;
alter table public.ambulances enable row level security;
alter table public.emergency_requests enable row level security;
alter table public.location_updates enable row level security;
alter table public.payments enable row level security;
alter table public.payment_settings enable row level security;

-- Realtime: enable only the tables you actually need.
alter publication supabase_realtime add table public.emergency_requests;
alter publication supabase_realtime add table public.ambulances;
alter publication supabase_realtime add table public.location_updates;
alter publication supabase_realtime add table public.payments;

-- NOTE:
-- Do not use service-role keys in the browser.
-- Add role-aware RLS policies before production.
-- Admin operations should be performed through protected server/Edge Functions.
