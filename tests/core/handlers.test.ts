// @vitest-environment node
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { HandlerRegistry } from '../../src/core/handlers.js';

const server = setupServer(
  http.get('http://api.test/users', () => HttpResponse.json({ from: 'mock-users' })),
  http.get('http://api.test/posts', () => HttpResponse.json({ from: 'mock-posts' })),
);

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterAll(() => server.close());

const get = async (path: string) => {
  try {
    const res = await fetch(`http://api.test${path}`);
    return await res.json();
  } catch {
    return 'network';
  }
};

describe('HandlerRegistry', () => {
  it('lists handlers with method and path', () => {
    const registry = new HandlerRegistry(server as any);
    expect(registry.list()).toEqual([
      { id: 'GET http://api.test/users', method: 'GET', path: 'http://api.test/users' },
      { id: 'GET http://api.test/posts', method: 'GET', path: 'http://api.test/posts' },
    ]);
  });

  it('skips only the disabled handler', async () => {
    const registry = new HandlerRegistry(server as any);
    registry.apply(['GET http://api.test/users']);
    expect(await get('/posts')).toEqual({ from: 'mock-posts' });
    expect(await get('/users')).toBe('network');

    registry.apply([]);
    expect(await get('/users')).toEqual({ from: 'mock-users' });
  });

  it('keeps everything off when all handlers are disabled', async () => {
    const registry = new HandlerRegistry(server as any);
    registry.apply(registry.list().map((h) => h.id));
    expect(await get('/users')).toBe('network');
    expect(await get('/posts')).toBe('network');
    registry.apply([]);
  });
});
