CREATE TABLE public.users (
    username text NOT NULL,
    email text,
    password text NOT NULL
);

INSERT INTO public.users (username, email, password) VALUES ('test', 'test@example.com', '$2b$10$6rymX1ZOvHixJJ.7B4nH2ORaGui0y7HOE23zcrdO4B5QEXArUVzN2');
INSERT INTO public.users (username, email, password) VALUES ('admin', 'admin@example.com', '$2b$10$A3v4opza04NxDqGU27thwebJ0MmVMaYus6rfqQ2YAOQgaaYGZ05Sy');
INSERT INTO public.users (username, email, password) VALUES ('a', 'a', '$2b$10$EydLLHK6prcGXnn71lkTDukEURuRWHjF8sOtNzBh/aHRsEMDme.S6');

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (username);