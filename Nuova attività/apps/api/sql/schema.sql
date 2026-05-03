create table if not exists telegram_users (
    id varchar(36) primary key,
    telegram_user_id bigint not null unique,
    chat_id bigint not null,
    username varchar(255),
    first_name varchar(255),
    last_name varchar(255),
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists documents (
    id varchar(36) primary key,
    user_id varchar(36) not null references telegram_users(id) on delete cascade,
    telegram_file_id varchar(255) not null,
    file_name varchar(255) not null,
    mime_type varchar(120) not null,
    tipo_documento varchar(80) not null,
    fornitore varchar(255),
    importo numeric(12,2),
    data_documento date,
    data_scadenza date,
    categoria varchar(80),
    azione_consigliata text,
    raw_extraction jsonb not null,
    reminder_status varchar(40) not null default 'not_requested',
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_documents_user_id on documents(user_id);
create index if not exists idx_documents_data_scadenza on documents(data_scadenza);

create table if not exists reminders (
    id varchar(36) primary key,
    document_id varchar(36) not null references documents(id) on delete cascade,
    user_id varchar(36) not null references telegram_users(id) on delete cascade,
    remind_at timestamptz not null,
    status varchar(40) not null default 'pending',
    sent_at timestamptz,
    message text not null,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_reminders_document_id on reminders(document_id);
create index if not exists idx_reminders_user_id on reminders(user_id);
create index if not exists idx_reminders_status_remind_at on reminders(status, remind_at);
