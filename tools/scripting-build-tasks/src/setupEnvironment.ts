// Copyright (c) Mojang AB.  All rights reserved.

import dotenv from 'dotenv';

/**
 * Loads the environment variables.
 * @param envPath - path to the .env file.
 */
export function setupEnvironment(envPath: string) {
    dotenv.config({ path: envPath });
}
