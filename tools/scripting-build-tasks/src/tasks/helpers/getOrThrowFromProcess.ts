// Copyright (c) Mojang AB.  All rights reserved.

/**
 * Checks process.env for the desired key and returns the value if it exists, otherwise throws an error. Generic parameter
 * is used to ensure the correct type is returned
 *
 * @param key - The key to query from process env
 * @param message - Message to include in thrown error on failure
 * @returns Value from process env or throws an error
 */
export function getOrThrowFromProcess<T = string>(key: string, messageOverride?: string): T {
    const value = process.env[key];
    if (value === undefined) {
        throw new Error(messageOverride ?? `Missing environment variable ${key}. Make sure to configure project.`);
    }

    return value as T;
}
