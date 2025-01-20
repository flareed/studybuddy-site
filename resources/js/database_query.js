
DEFAULT_QUERY_ALL_USERS = `
    SELECT *
    FROM public.users AS USERS
`;

DEFAULT_INSERT_USER_QUERY = `
    INSERT INTO public.users (username, email, password)
    VALUES ($1, $2, $3)
    RETURNING *;
`;

DEFAULT_UPDATE_USER_PASSWORD_QUERY = `
    UPDATE public.users
    SET password = $2 
    WHERE username = $1;
`
