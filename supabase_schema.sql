-- Copie e cole este código no SQL Editor do seu projeto Supabase para criar o banco de dados

-- Tabela de Categorias
create table public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  image text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabela de Produtos
create table public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  unit text not null,
  quantity numeric not null,
  purchase_price numeric not null,
  selling_price numeric not null,
  discount numeric default 0,
  tax numeric default 0,
  duty numeric default 0,
  image text,
  category_id uuid references public.categories(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabela de Transações (Vendas e Despesas)
create table public.transactions (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  amount numeric not null,
  type text not null, -- 'income' ou 'expense'
  category text not null,
  date date not null,
  product_name text,
  quantity numeric,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabela de Fornecedores
create table public.suppliers (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  product_supplied text not null,
  total_value numeric not null,
  amount_paid numeric not null,
  status text not null, -- 'paid' ou 'debt'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS (Row Level Security) se necessário, mas para iniciar rápido deixaremos aberto ou configurável
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.transactions enable row level security;
alter table public.suppliers enable row level security;

-- Políticas de acesso público (Apenas para desenvolvimento - Ideal restringir depois)
create policy "Enable all access for all users" on public.categories for all using (true) with check (true);
create policy "Enable all access for all users" on public.products for all using (true) with check (true);
create policy "Enable all access for all users" on public.transactions for all using (true) with check (true);
create policy "Enable all access for all users" on public.suppliers for all using (true) with check (true);
