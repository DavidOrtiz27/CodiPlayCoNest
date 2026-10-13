/* eslint-disable prettier/prettier */
export const enviroments = {
    dev: '.env',
    stg: '.stg.env',
    prod: '.prod.env',
};

export const getEnvironmentFile = (env?: string) => {
    const key = (env ?? 'dev') as keyof typeof enviroments;
    return enviroments[key] ?? enviroments.dev;
};
