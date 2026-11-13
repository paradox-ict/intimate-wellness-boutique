-- Roles
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "Users read own roles" on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

-- First account ever created becomes the store admin
create or replace function public.handle_new_user_role()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  return new;
end;
$$;
create trigger on_auth_user_created_role after insert on auth.users
  for each row execute function public.handle_new_user_role();

-- Timestamps helper
create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end;
$$;

-- Store settings (single row)
create table public.store_settings (
  id int primary key default 1 check (id = 1),
  stock_count int not null default 500 check (stock_count >= 0),
  low_stock_threshold int not null default 20,
  delivery_fee int not null default 200,
  easypaisa_account_name text not null default 'Sukoon Wellness',
  easypaisa_number text not null default '0300 0000000',
  support_whatsapp text not null default '0300 0000000',
  updated_at timestamptz not null default now()
);
grant select on public.store_settings to anon, authenticated;
grant update on public.store_settings to authenticated;
grant all on public.store_settings to service_role;
alter table public.store_settings enable row level security;
create policy "Anyone can read store settings" on public.store_settings for select to anon, authenticated using (true);
create policy "Admins update store settings" on public.store_settings for update to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create trigger store_settings_touch before update on public.store_settings
  for each row execute function public.touch_updated_at();
insert into public.store_settings (id) values (1);

-- Bundles
create table public.bundles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tagline text,
  pieces int not null check (pieces > 0),
  price int not null check (price >= 0),
  compare_at_price int,
  badge text,
  free_delivery boolean not null default false,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.bundles to anon, authenticated;
grant insert, update, delete on public.bundles to authenticated;
grant all on public.bundles to service_role;
alter table public.bundles enable row level security;
create policy "Anyone reads active bundles" on public.bundles for select to anon, authenticated
  using (is_active or public.has_role(auth.uid(), 'admin'));
create policy "Admins insert bundles" on public.bundles for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins update bundles" on public.bundles for update to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins delete bundles" on public.bundles for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));
create trigger bundles_touch before update on public.bundles
  for each row execute function public.touch_updated_at();

insert into public.bundles (name, tagline, pieces, price, compare_at_price, badge, free_delivery, sort_order) values
  ('Single', 'Try it once', 1, 1499, 1999, null, false, 1),
  ('Trio', 'A full care cycle', 3, 3999, 5997, 'Most loved', true, 2),
  ('Ritual', 'Best value, monthly care', 5, 5999, 9995, 'Best value', true, 3);

-- Orders
create type public.payment_method as enum ('cod', 'easypaisa');
create type public.payment_status as enum ('not_required', 'pending_verification', 'verified', 'rejected');
create type public.order_status as enum ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  phone text not null,
  email text,
  city text not null,
  address text not null,
  notes text,
  bundle_id uuid references public.bundles(id) on delete set null,
  bundle_name text not null,
  bundle_pieces int not null,
  quantity int not null check (quantity > 0),
  total_pieces int not null,
  subtotal int not null,
  delivery_fee int not null default 0,
  total int not null,
  payment_method public.payment_method not null,
  payment_status public.payment_status not null,
  easypaisa_txn_id text,
  easypaisa_sender_number text,
  payment_proof_path text,
  status public.order_status not null default 'pending',
  admin_note text,
  tracking_number text,
  stock_restored boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index orders_created_at_idx on public.orders (created_at desc);
create index orders_phone_idx on public.orders (phone);
grant select, update on public.orders to authenticated;
grant all on public.orders to service_role;
alter table public.orders enable row level security;
create policy "Admins read orders" on public.orders for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));
create policy "Admins update orders" on public.orders for update to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create trigger orders_touch before update on public.orders
  for each row execute function public.touch_updated_at();

create table public.order_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status public.order_status not null,
  payment_status public.payment_status not null,
  note text,
  created_at timestamptz not null default now()
);
create index order_events_order_idx on public.order_events (order_id, created_at);
grant select on public.order_events to authenticated;
grant all on public.order_events to service_role;
alter table public.order_events enable row level security;
create policy "Admins read order events" on public.order_events for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Log status changes + restore stock on cancellation
create or replace function public.log_order_event()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    insert into public.order_events (order_id, status, payment_status, note)
      values (new.id, new.status, new.payment_status, 'Order placed');
  elsif new.status is distinct from old.status or new.payment_status is distinct from old.payment_status then
    insert into public.order_events (order_id, status, payment_status, note)
      values (new.id, new.status, new.payment_status, nullif(new.admin_note, old.admin_note));
  end if;
  return new;
end;
$$;
create trigger orders_log_event after insert or update on public.orders
  for each row execute function public.log_order_event();

create or replace function public.restore_stock_on_cancel()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.status = 'cancelled' and old.status <> 'cancelled' and not old.stock_restored then
    update public.store_settings set stock_count = stock_count + old.total_pieces where id = 1;
    new.stock_restored = true;
  elsif new.status <> 'cancelled' and old.status = 'cancelled' and old.stock_restored then
    update public.store_settings set stock_count = greatest(stock_count - old.total_pieces, 0) where id = 1;
    new.stock_restored = false;
  end if;
  return new;
end;
$$;
create trigger orders_restore_stock before update on public.orders
  for each row execute function public.restore_stock_on_cancel();

-- Atomic order placement (called from the server only)
create or replace function public.place_order(
  _bundle_id uuid, _quantity int, _customer_name text, _phone text, _email text,
  _city text, _address text, _notes text, _payment_method public.payment_method,
  _txn_id text, _sender_number text, _proof_path text
) returns table (order_number text, total int)
language plpgsql security definer set search_path = public as $$
declare
  b public.bundles%rowtype;
  s public.store_settings%rowtype;
  v_pieces int;
  v_subtotal int;
  v_fee int;
  v_number text;
  v_total int;
begin
  if _quantity < 1 or _quantity > 10 then raise exception 'INVALID_QUANTITY'; end if;
  select * into b from public.bundles where id = _bundle_id and is_active;
  if not found then raise exception 'BUNDLE_UNAVAILABLE'; end if;
  select * into s from public.store_settings where id = 1 for update;
  v_pieces := b.pieces * _quantity;
  if s.stock_count < v_pieces then raise exception 'OUT_OF_STOCK'; end if;
  v_subtotal := b.price * _quantity;
  v_fee := case when b.free_delivery then 0 else s.delivery_fee end;
  v_total := v_subtotal + v_fee;
  loop
    v_number := 'SK-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
    exit when not exists (select 1 from public.orders o where o.order_number = v_number);
  end loop;
  update public.store_settings set stock_count = stock_count - v_pieces where id = 1;
  insert into public.orders (
    order_number, customer_name, phone, email, city, address, notes,
    bundle_id, bundle_name, bundle_pieces, quantity, total_pieces,
    subtotal, delivery_fee, total, payment_method, payment_status,
    easypaisa_txn_id, easypaisa_sender_number, payment_proof_path, status
  ) values (
    v_number, _customer_name, _phone, nullif(_email, ''), _city, _address, nullif(_notes, ''),
    b.id, b.name, b.pieces, _quantity, v_pieces,
    v_subtotal, v_fee, v_total, _payment_method,
    case when _payment_method = 'easypaisa' then 'pending_verification'::public.payment_status else 'not_required'::public.payment_status end,
    nullif(_txn_id, ''), nullif(_sender_number, ''), nullif(_proof_path, ''), 'pending'
  );
  return query select v_number, v_total;
end;
$$;
revoke all on function public.place_order from public, anon, authenticated;
grant execute on function public.place_order to service_role;
