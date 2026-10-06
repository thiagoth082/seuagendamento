create table negocios (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  slug text not null unique,
  fuso_horario text not null default 'America/Sao_Paulo',
  status text not null default 'trial' check (status in ('trial', 'ativo', 'suspenso')),
  trial_fim timestamptz default (now() + interval '14 days'),
  created_at timestamptz not null default now()
);

create table usuarios_negocios (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references auth.users(id) on delete cascade,
  negocio_id uuid not null references negocios(id) on delete cascade,
  papel text not null check (papel in ('dono', 'profissional')),
  created_at timestamptz not null default now(),
  unique (usuario_id, negocio_id)
);

create table profissionais (
  id uuid primary key default gen_random_uuid(),
  negocio_id uuid not null references negocios(id) on delete cascade,
  usuario_id uuid references auth.users(id) on delete set null,
  nome text not null,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

create table servicos (
  id uuid primary key default gen_random_uuid(),
  negocio_id uuid not null references negocios(id) on delete cascade,
  nome text not null,
  duracao_minutos integer not null check (duracao_minutos > 0),
  tempo_preparo_minutos integer not null default 0,
  preco numeric(10,2) not null default 0,
  categoria text,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

create table profissionais_servicos (
  profissional_id uuid not null references profissionais(id) on delete cascade,
  servico_id uuid not null references servicos(id) on delete cascade,
  primary key (profissional_id, servico_id)
);

create table clientes (
  id uuid primary key default gen_random_uuid(),
  negocio_id uuid not null references negocios(id) on delete cascade,
  nome text not null,
  telefone text not null,
  observacoes text,
  created_at timestamptz not null default now()
);

drop table if exists agendamentos;

create table agendamentos (
  id uuid primary key default gen_random_uuid(),
  negocio_id uuid not null references negocios(id) on delete cascade,
  profissional_id uuid not null references profissionais(id) on delete cascade,
  servico_id uuid not null references servicos(id) on delete cascade,
  cliente_id uuid not null references clientes(id) on delete cascade,
  inicio timestamptz not null,
  fim timestamptz not null,
  status text not null default 'agendado' check (status in ('agendado', 'confirmado', 'concluido', 'cancelado', 'faltou')),
  created_at timestamptz not null default now(),
  check (fim > inicio),
  exclude using gist (
    profissional_id with =,
    tstzrange(inicio, fim) with &&
  ) where (status not in ('cancelado'))
);

alter table negocios enable row level security;
alter table usuarios_negocios enable row level security;
alter table profissionais enable row level security;
alter table servicos enable row level security;
alter table profissionais_servicos enable row level security;
alter table clientes enable row level security;
alter table agendamentos enable row level security;

-- Qualquer pessoa (mesmo sem login) pode ver negócios, serviços e profissionais ativos
-- (necessário para a página pública de agendamento funcionar)
create policy "negocios_publico_select" on negocios
  for select using (true);

create policy "servicos_publico_select" on servicos
  for select using (ativo = true);

create policy "profissionais_publico_select" on profissionais
  for select using (ativo = true);

create policy "profissionais_servicos_publico_select" on profissionais_servicos
  for select using (true);

  -- Dono/profissional só vê e edita dados do(s) negócio(s) a que pertence
create policy "usuarios_negocios_proprio" on usuarios_negocios
  for select using (usuario_id = auth.uid());

create policy "profissionais_gerenciar" on profissionais
  for all using (
    negocio_id in (
      select negocio_id from usuarios_negocios where usuario_id = auth.uid()
    )
  );

create policy "servicos_gerenciar" on servicos
  for all using (
    negocio_id in (
      select negocio_id from usuarios_negocios where usuario_id = auth.uid()
    )
  );

create policy "clientes_gerenciar" on clientes
  for all using (
    negocio_id in (
      select negocio_id from usuarios_negocios where usuario_id = auth.uid()
    )
  );

create policy "agendamentos_gerenciar" on agendamentos
  for all using (
    negocio_id in (
      select negocio_id from usuarios_negocios where usuario_id = auth.uid()
    )
  );

  