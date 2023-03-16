const db = require('./index');

const sql = `
CREATE TABLE IF NOT EXISTS public.users
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    fullname character varying(40) COLLATE pg_catalog."default" NOT NULL,
    nickname character varying(40) COLLATE pg_catalog."default" NOT NULL,
    email character varying(40) COLLATE pg_catalog."default" NOT NULL,
    password character varying(200) COLLATE pg_catalog."default" NOT NULL,
    "socketId" character varying(40) COLLATE pg_catalog."default",
    CONSTRAINT users_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to superuser;

CREATE TABLE IF NOT EXISTS public.sessions
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    "userId" integer NOT NULL,
    "deviceId" character varying(100) COLLATE pg_catalog."default" NOT NULL,
    "refreshToken" character varying(200) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT sessions_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.sessions
    OWNER to superuser;
`;

module.exports = function initDb() {
  return db.query(sql);
};
