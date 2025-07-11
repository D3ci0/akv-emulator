import { describe, test, expect, beforeEach } from 'vitest';
const request = require('supertest');
const express = require('express');
import keysRouter from '../../src/routes/keys';

describe('Key Routes', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.locals.keyVaultKeys = [];
        app.use('/keys', keysRouter);
    });

    test('test_get_latest_key_by_name', async () => {
        const key1 = {
            properties: {
                name: 'testkey',
                version: 'v1',
                createdOn: '2022-01-01T10:00:00Z'
            },
            value: 'key1',
            toJSON() { return { ...this }; }
        };
        const key2 = {
            properties: {
                name: 'testkey',
                version: 'v2',
                createdOn: '2023-01-01T10:00:00Z'
            },
            value: 'key2',
            toJSON() { return { ...this }; }
        };
        app.locals.keyVaultKeys = [key1, key2];

        const res = await request(app).get('/keys/testkey');
        expect(res.status).toBe(200);
        expect(res.body.properties.version).toBe('v2');
        expect(res.body.value).toBe('key2');
    });

    test('test_get_latest_key_by_version', async () => {
        const key1 = {
            properties: {
                name: 'testkey',
                version: 'v1',
                createdOn: '2022-01-01T10:00:00Z'
            },
            value: 'key1',
            toJSON() { return { ...this }; }
        };
        const key2 = {
            properties: {
                name: 'testkey',
                version: 'v2',
                createdOn: '2023-01-01T10:00:00Z'
            },
            value: 'key2',
            toJSON() { return { ...this }; }
        };
        app.locals.keyVaultKeys = [key1, key2];

        const res = await request(app).get('/keys/testkey/v2');
        expect(res.status).toBe(200);
        expect(res.body.properties.version).toBe('v2');
        expect(res.body.value).toBe('key2');
    });

    test('test_get_key_by_name_not_found', async () => {
        app.locals.keyVaultKeys = [
            {
                properties: {
                    name: 'otherkey',
                    version: 'v1',
                    createdOn: '2022-01-01T10:00:00Z'
                },
                value: 'key1'
            }
        ];

        const res = await request(app).get('/keys/testkey');
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ error: 'Key not found' });
    });

    test('test_get_key_by_name_and_version_not_found', async () => {
        app.locals.keyVaultKeys = [
            {
                properties: {
                    name: 'otherkey',
                    version: 'v1',
                    createdOn: '2022-01-01T10:00:00Z'
                },
                value: 'key1'
            }
        ];

        const res = await request(app).get('/keys/testkey/v2');
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ error: 'Key not found' });
    });
});