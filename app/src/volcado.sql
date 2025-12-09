--structure
--
-- PostgreSQL database dump
--

\restrict 3C69g1CD8fUC4jiHjCEjKysdWKPrUJg1nB9LUFTTbzSFCW04TDKhTI2bKk6foa1

-- Dumped from database version 15.15
-- Dumped by pg_dump version 16.11 (Ubuntu 16.11-0ubuntu0.24.04.1)

SET statement_timeout = 0;

SET lock_timeout = 0;

SET idle_in_transaction_session_timeout = 0;

SET client_encoding = 'UTF8';

SET standard_conforming_strings = on;

SELECT pg_catalog.set_config ('search_path', '', false);

SET check_function_bodies = false;

SET xmloption = content;

SET client_min_messages = warning;

SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;

ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Access; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Access" (
    id_access integer NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    user_id integer,
    role_id integer
);

ALTER TABLE public."Access" OWNER TO postgres;

--
-- Name: Access_id_access_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Access_id_access_seq" AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public."Access_id_access_seq" OWNER TO postgres;

--
-- Name: Access_id_access_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Access_id_access_seq" OWNED BY public."Access".id_access;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    title character varying NOT NULL,
    description character varying NOT NULL
);

ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;

--
-- Name: clients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clients (
    id integer NOT NULL,
    name character varying NOT NULL,
    company character varying NOT NULL,
    contact_email character varying NOT NULL,
    user_id integer
);

ALTER TABLE public.clients OWNER TO postgres;

--
-- Name: clients_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.clients_id_seq AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public.clients_id_seq OWNER TO postgres;

--
-- Name: clients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.clients_id_seq OWNED BY public.clients.id;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);

ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public.roles_id_seq OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;

--
-- Name: technicians; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.technicians (
    id integer NOT NULL,
    name character varying NOT NULL,
    speciality character varying NOT NULL,
    availability character varying NOT NULL,
    "userId" integer
);

ALTER TABLE public.technicians OWNER TO postgres;

--
-- Name: technicians_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.technicians_id_seq AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public.technicians_id_seq OWNER TO postgres;

--
-- Name: technicians_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.technicians_id_seq OWNED BY public.technicians.id;

--
-- Name: ticket_technician; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ticket_technician (
    id_ticket_technician integer NOT NULL,
    technician_id integer NOT NULL,
    ticket_id integer NOT NULL,
    assigned_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.ticket_technician OWNER TO postgres;

--
-- Name: ticket_technician_id_ticket_technician_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ticket_technician_id_ticket_technician_seq AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public.ticket_technician_id_ticket_technician_seq OWNER TO postgres;

--
-- Name: ticket_technician_id_ticket_technician_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ticket_technician_id_ticket_technician_seq OWNED BY public.ticket_technician.id_ticket_technician;

--
-- Name: tickets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tickets (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    status character varying(50) DEFAULT 'Open'::character varying NOT NULL,
    priority character varying(50) DEFAULT 'Medium'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    category_id integer,
    client_id integer
);

ALTER TABLE public.tickets OWNER TO postgres;

--
-- Name: tickets_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tickets_id_seq AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public.tickets_id_seq OWNER TO postgres;

--
-- Name: tickets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tickets_id_seq OWNED BY public.tickets.id;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying NOT NULL,
    address character varying NOT NULL,
    phone character varying NOT NULL
);

ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq AS integer START
WITH
    1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;

--
-- Name: Access id_access; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Access"
ALTER COLUMN id_access
SET DEFAULT nextval(
    'public."Access_id_access_seq"'::regclass
);

--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
ALTER COLUMN id
SET DEFAULT nextval(
    'public.categories_id_seq'::regclass
);

--
-- Name: clients id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
ALTER COLUMN id
SET DEFAULT nextval(
    'public.clients_id_seq'::regclass
);

--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
ALTER COLUMN id
SET DEFAULT nextval(
    'public.roles_id_seq'::regclass
);

--
-- Name: technicians id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.technicians
ALTER COLUMN id
SET DEFAULT nextval(
    'public.technicians_id_seq'::regclass
);

--
-- Name: ticket_technician id_ticket_technician; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_technician
ALTER COLUMN id_ticket_technician
SET DEFAULT nextval(
    'public.ticket_technician_id_ticket_technician_seq'::regclass
);

--
-- Name: tickets id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tickets
ALTER COLUMN id
SET DEFAULT nextval(
    'public.tickets_id_seq'::regclass
);

--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
ALTER COLUMN id
SET DEFAULT nextval(
    'public.users_id_seq'::regclass
);

--
-- Name: categories PK_24dbc6126a28ff948da33e97d3b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
ADD CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY (id);

--
-- Name: ticket_technician PK_2bafa3acc71ce7906402d156e5a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_technician
ADD CONSTRAINT "PK_2bafa3acc71ce7906402d156e5a" PRIMARY KEY (id_ticket_technician);

--
-- Name: tickets PK_343bc942ae261cf7a1377f48fd0; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tickets
ADD CONSTRAINT "PK_343bc942ae261cf7a1377f48fd0" PRIMARY KEY (id);

--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);

--
-- Name: technicians PK_b14514b23605f79475be53065b3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.technicians
ADD CONSTRAINT "PK_b14514b23605f79475be53065b3" PRIMARY KEY (id);

--
-- Name: Access PK_b1b75ccdbf7a99ed2fef046a325; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Access"
ADD CONSTRAINT "PK_b1b75ccdbf7a99ed2fef046a325" PRIMARY KEY (id_access);

--
-- Name: roles PK_c1433d71a4838793a49dcad46ab; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
ADD CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY (id);

--
-- Name: clients PK_f1ab7cf3a5714dbc6bb4e1c28a4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
ADD CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY (id);

--
-- Name: clients REL_07a7a09b04e7b035c9d90cf498; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
ADD CONSTRAINT "REL_07a7a09b04e7b035c9d90cf498" UNIQUE (user_id);

--
-- Name: Access UQ_17113ca689b8cd2b786d8abe78a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Access"
ADD CONSTRAINT "UQ_17113ca689b8cd2b786d8abe78a" UNIQUE (email);

--
-- Name: roles UQ_648e3f5447f725579d7d4ffdfb7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
ADD CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE (name);

--
-- Name: clients UQ_99e921caf21faa2aab020476e44; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
ADD CONSTRAINT "UQ_99e921caf21faa2aab020476e44" UNIQUE (name);

--
-- Name: users UQ_a000cca60bcf04454e727699490; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
ADD CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE (phone);

--
-- Name: ticket_technician UQ_bcd7354a1fb364a7a2edd478fe1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_technician
ADD CONSTRAINT "UQ_bcd7354a1fb364a7a2edd478fe1" UNIQUE (technician_id, ticket_id);

--
-- Name: clients FK_07a7a09b04e7b035c9d90cf4984; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
ADD CONSTRAINT "FK_07a7a09b04e7b035c9d90cf4984" FOREIGN KEY (user_id) REFERENCES public.users (id);

--
-- Name: Access FK_1a95da13c69e8685aeda0e06b0f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Access"
ADD CONSTRAINT "FK_1a95da13c69e8685aeda0e06b0f" FOREIGN KEY (role_id) REFERENCES public.roles (id);

--
-- Name: tickets FK_32a7f0e4e32a46a094b55f7c25c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tickets
ADD CONSTRAINT "FK_32a7f0e4e32a46a094b55f7c25c" FOREIGN KEY (category_id) REFERENCES public.categories (id) ON DELETE RESTRICT;

--
-- Name: ticket_technician FK_3b29aa8b717704cf3747cc9797a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_technician
ADD CONSTRAINT "FK_3b29aa8b717704cf3747cc9797a" FOREIGN KEY (technician_id) REFERENCES public.technicians (id) ON DELETE RESTRICT;

--
-- Name: technicians FK_8099b6a6478964454f22f7e0f8c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.technicians
ADD CONSTRAINT "FK_8099b6a6478964454f22f7e0f8c" FOREIGN KEY ("userId") REFERENCES public.users (id);

--
-- Name: tickets FK_ab0f4c7161f0a5c178d229e3541; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tickets
ADD CONSTRAINT "FK_ab0f4c7161f0a5c178d229e3541" FOREIGN KEY (client_id) REFERENCES public.clients (id) ON DELETE CASCADE;

--
-- Name: ticket_technician FK_be8d0d9060e8363b3019da6af5a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_technician
ADD CONSTRAINT "FK_be8d0d9060e8363b3019da6af5a" FOREIGN KEY (ticket_id) REFERENCES public.tickets (id) ON DELETE CASCADE;

--
-- Name: Access FK_db2cf2f9a51e24e9b7b9cdafc8d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Access"
ADD CONSTRAINT "FK_db2cf2f9a51e24e9b7b9cdafc8d" FOREIGN KEY (user_id) REFERENCES public.users (id);

--
-- PostgreSQL database dump complete
--

\unrestrict 3C69g1CD8fUC4jiHjCEjKysdWKPrUJg1nB9LUFTTbzSFCW04TDKhTI2bKk6foa1

--Inserts
-- #################################################################
-- 1. ROLES (Base)
-- #################################################################

-- Asegurar que la secuencia de roles comienza después del último valor existente (2)
SELECT pg_catalog.setval ( 'public.roles_id_seq', 3, true );

INSERT INTO
    public.roles (id, name)
VALUES (1, 'Administrator'),
    (3, 'Technician'),
    (4, 'Client');

-- El rol 2 ('Manager') ya existe en tu volcado, lo omitimos.

-- #################################################################
-- 2. USERS (Base)
-- #################################################################

-- Asegurar que la secuencia de usuarios comienza después del último valor existente (2)
SELECT pg_catalog.setval ( 'public.users_id_seq', 3, true );

INSERT INTO
    public.users (id, name, address, phone)
VALUES (
        1,
        'John Admin',
        'Calle Falsa 123, Admin',
        '3001000000'
    ), -- Admin
    (
        3,
        'Tech Leo',
        'Avenida Central 456, Norte',
        '3002000001'
    ), -- Tech
    (
        4,
        'Tech Mia',
        'Carrera 7, Apt 2B',
        '3002000002'
    ), -- Tech
    (
        5,
        'Cliente ABC S.A.S',
        'Carrera 10 #20-30',
        '3103000003'
    ), -- Client
    (
        6,
        'Cliente XYZ Ltda',
        'Vía al Mar, Km 5',
        '3104000004'
    );
-- Client

-- El usuario 2 ('Jane Doe') ya existe en tu volcado, lo omitimos.

-- #################################################################
-- 3. ACCESS (Depende de Roles y Users)
-- #################################################################

-- Hash de contraseña ficticio para '123456'
-- Usaremos este hash para todos los usuarios, pero en producción deben ser únicos.
-- Hash: '$2b$10$yFf6vF5Wj2Qe7O7PjN3o9.mR4h2hT6P0v7I8v5E5p0T6I4o9j8c5O'
SELECT pg_catalog.setval (
        'public."Access_id_access_seq"', 3, true
    );

INSERT INTO
    public."Access" (
        id_access,
        email,
        password,
        user_id,
        role_id
    )
VALUES (
        1,
        'admin@global.com',
        '$2b$10$yFf6vF5Wj2Qe7O7PjN3o9.mR4h2hT6P0v7I8v5E5p0T6I4o9j8c5O',
        1,
        1
    ),
    (
        3,
        'leo.tech@servicios.com',
        '$2b$10$yFf6vF5Wj2Qe7O7PjN3o9.mR4h2hT6P0v7I8v5E5p0T6I4o9j8c5O',
        3,
        3
    ),
    (
        4,
        'mia.tech@servicios.com',
        '$2b$10$yFf6vF5Wj2Qe7O7PjN3o9.mR4h2hT6P0v7I8v5E5p0T6I4o9j8c5O',
        4,
        3
    ),
    (
        5,
        'cliente.abc@empresa.com',
        '$2b$10$yFf6vF5Wj2Qe7O7PjN3o9.mR4h2hT6P0v7I8v5E5p0T6I4o9j8c5O',
        5,
        4
    ),
    (
        6,
        'cliente.xyz@empresa.com',
        '$2b$10$yFf6vF5Wj2Qe7O7PjN3o9.mR4h2hT6P0v7I8v5E5p0T6I4o9j8c5O',
        6,
        4
    );

-- #################################################################
-- 4. CATEGORIES (Base)
-- #################################################################

SELECT pg_catalog.setval ( 'public.categories_id_seq', 4, true );

INSERT INTO
    public.categories (id, title, description)
VALUES (
        1,
        'Hardware Failure',
        'Issues related to physical computer components.'
    ),
    (
        2,
        'Software Bug',
        'Errors in application logic or coding mistakes.'
    ),
    (
        3,
        'Network/Connectivity',
        'Problems related to internet access or internal network.'
    ),
    (
        4,
        'Security Incident',
        'Unauthorized access or data breach.'
    );

-- #################################################################
-- 5. TECHNICIANS (Depende de Users)
-- #################################################################

SELECT pg_catalog.setval ( 'public.technicians_id_seq', 3, true );

INSERT INTO
    public.technicians (
        id,
        name,
        speciality,
        availability,
        "userId"
    )
VALUES (
        1,
        'Tech Leo',
        'Networking',
        'Available',
        3
    ),
    (
        2,
        'Tech Mia',
        'Software',
        'Available',
        4
    );

-- #################################################################
-- 6. CLIENTS (Depende de Users)
-- #################################################################

SELECT pg_catalog.setval ( 'public.clients_id_seq', 3, true );

INSERT INTO
    public.clients (
        id,
        name,
        company,
        contact_email,
        user_id
    )
VALUES (
        1,
        'Cliente ABC S.A.S',
        'ABC Solutions',
        'cliente.abc@empresa.com',
        5
    ),
    (
        2,
        'Cliente XYZ Ltda',
        'XYZ Logistics',
        'cliente.xyz@empresa.com',
        6
    );

-- #################################################################
-- 7. TICKETS (Depende de Categories y Clients)
-- #################################################################

SELECT pg_catalog.setval ( 'public.tickets_id_seq', 7, true );

INSERT INTO
    public.tickets (
        id,
        title,
        description,
        status,
        priority,
        created_at,
        updated_at,
        category_id,
        client_id
    )
VALUES (
        1,
        'Server down at location A',
        'The main production server stopped responding after the last update.',
        'Open',
        'High',
        '2025-09-01 10:00:00+00',
        '2025-09-01 10:00:00+00',
        1,
        1
    ),
    (
        2,
        'Login failed on mobile app',
        'Users cannot log in to the mobile application since 9 AM.',
        'In Progress',
        'High',
        '2025-09-02 11:30:00+00',
        '2025-09-02 14:00:00+00',
        2,
        1
    ),
    (
        3,
        'Printer not connecting',
        'The office printer cannot connect to the Wi-Fi network.',
        'Open',
        'Medium',
        '2025-09-02 15:00:00+00',
        '2025-09-02 15:00:00+00',
        3,
        2
    ),
    (
        4,
        'SQL Injection vulnerability report',
        'Discovered a potential vulnerability in the contact form.',
        'Open',
        'High',
        '2025-09-03 09:00:00+00',
        '2025-09-03 09:00:00+00',
        4,
        2
    ),
    (
        5,
        'User profile bug',
        'When updating the profile, the address field is cleared.',
        'Open',
        'Medium',
        '2025-09-04 10:00:00+00',
        '2025-09-04 10:00:00+00',
        2,
        1
    ),
    (
        6,
        'VPN connection issue',
        'Cannot connect to the VPN from home.',
        'Open',
        'Medium',
        '2025-09-04 11:00:00+00',
        '2025-09-04 11:00:00+00',
        3,
        2
    );

-- #################################################################
-- 8. TICKET_TECHNICIAN (Depende de Tickets y Technicians)
-- #################################################################

SELECT pg_catalog.setval (
        'public.ticket_technician_id_ticket_technician_seq', 4, true
    );

INSERT INTO
    public.ticket_technician (
        id_ticket_technician,
        technician_id,
        ticket_id
    )
VALUES
    -- Leo (Networking) asignado a tickets de Hardware y Red (Open, In Progress, Open)
    (1, 1, 1), -- Hardware, High, Open
    (2, 1, 3), -- Network, Medium, Open
    (3, 1, 6), -- Network, Medium, Open
    -- Mia (Software) asignada a tickets de Software (In Progress)
    (4, 2, 2);
-- Software, High, In Progress

-- #################################################################
-- RESTAURACIÓN DE SECUENCIAS (Asegura el incremento futuro)
-- #################################################################

-- Se asume que las secuencias ya fueron ajustadas en los pasos anteriores,
-- pero se puede forzar el incremento máximo si se desea:
-- SELECT pg_catalog.setval('public."Access_id_access_seq"', 6, true);
-- SELECT pg_catalog.setval('public.clients_id_seq', 2, true);
-- SELECT pg_catalog.setval('public.technicians_id_seq', 2, true);
-- SELECT pg_catalog.setval('public.tickets_id_seq', 6, true);
-- SELECT pg_catalog.setval('public.users_id_seq', 6, true);