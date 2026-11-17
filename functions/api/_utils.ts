import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { MongoClient, type Db } from 'mongodb';

export type Env = {
  MONGODB_URI?: string;
  MONGODB_DATABASE?: string;
  ADMIN_USERNAME?: string;
  ADMIN_PASSWORD_HASH?: string;
};

export type PagesFunction<Bindings> = (context: {
  request: Request;
  env: Bindings;
}) => Response | Promise<Response>;

type AdminSession = {
  tokenHash: string;
  username: string;
  createdAt: Date;
  expiresAt: Date;
};

const sessionCookie = 'sardaar_admin_session';
const sessionDurationMs = 8 * 60 * 60 * 1000;
let mongoClient: MongoClient | undefined;
let mongoConnection: Promise<MongoClient> | undefined;

export function json(data: unknown, status = 200, headers?: HeadersInit) {
  const responseHeaders = new Headers(headers);
  responseHeaders.set('Content-Type', 'application/json; charset=utf-8');
  responseHeaders.set('Cache-Control', 'no-store');
  return new Response(JSON.stringify(data), { status, headers: responseHeaders });
}

export function requireSameOrigin(request: Request) {
  const origin = request.headers.get('Origin');
  if (!origin || origin !== new URL(request.url).origin) {
    return json({ message: 'Request origin is not allowed.' }, 403);
  }
  return undefined;
}

export async function readJson(request: Request): Promise<Record<string, unknown> | Response> {
  const contentLength = Number(request.headers.get('Content-Length') ?? 0);
  if (contentLength > 10_240) return json({ message: 'Request body is too large.' }, 413);
  if (!request.headers.get('Content-Type')?.toLowerCase().includes('application/json')) {
    return json({ message: 'Content-Type must be application/json.' }, 415);
  }
  try {
    const body = await request.text();
    if (new TextEncoder().encode(body).byteLength > 10_240) {
      return json({ message: 'Request body is too large.' }, 413);
    }
    const parsed: unknown = JSON.parse(body);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return json({ message: 'Request body must be a JSON object.' }, 400);
    }
    return parsed as Record<string, unknown>;
  } catch {
    return json({ message: 'Request body must contain valid JSON.' }, 400);
  }
}

export async function getDatabase(env: Env): Promise<Db> {
  if (!env.MONGODB_URI) throw new Error('MONGODB_URI is not configured.');
  if (!mongoClient) {
    mongoClient = new MongoClient(env.MONGODB_URI, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 8_000,
      connectTimeoutMS: 8_000,
    });
    mongoConnection = mongoClient.connect();
  }
  const client = mongoClient;
  const connection = mongoConnection;
  if (!client || !connection) throw new Error('MongoDB connection could not be initialized.');
  try {
    await connection;
    return client.db(env.MONGODB_DATABASE || 'sardaar_ji_dhaba');
  } catch (error) {
    if (mongoClient === client) {
      mongoClient = undefined;
      mongoConnection = undefined;
    }
    await client.close().catch(() => undefined);
    throw error;
  }
}

export function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export function verifyPassword(password: string, stored: string) {
  const separator = stored.indexOf(':');
  if (separator <= 0) return false;
  const salt = stored.slice(0, separator);
  const expectedHex = stored.slice(separator + 1);
  if (!/^[a-f0-9]{32,128}$/i.test(salt) || !/^[a-f0-9]{128}$/i.test(expectedHex)) return false;
  const expected = Buffer.from(expectedHex, 'hex');
  const actual = scryptSync(password, salt, expected.length);
  return timingSafeEqual(actual, expected);
}

export function createSessionToken() {
  return randomBytes(32).toString('base64url');
}

export function makeSessionCookie(request: Request, token: string) {
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return `${sessionCookie}=${token}; HttpOnly; SameSite=Strict; Path=/api; Max-Age=${sessionDurationMs / 1000}${secure}`;
}

export function clearSessionCookie(request: Request) {
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return `${sessionCookie}=; HttpOnly; SameSite=Strict; Path=/api; Max-Age=0${secure}`;
}

function getCookie(request: Request, name: string) {
  const cookies = request.headers.get('Cookie')?.split(';') ?? [];
  const cookie = cookies.map(value => value.trim()).find(value => value.startsWith(`${name}=`));
  return cookie?.slice(name.length + 1);
}

export async function requireAdmin(request: Request, env: Env) {
  const token = getCookie(request, sessionCookie);
  if (!token) return json({ message: 'Admin authentication required.' }, 401);
  const db = await getDatabase(env);
  const session = await db.collection<AdminSession>('admin_sessions').findOne({
    tokenHash: hashToken(token),
    expiresAt: { $gt: new Date() },
  });
  if (!session) return json({ message: 'Admin session expired.' }, 401);
  return { db, session };
}
