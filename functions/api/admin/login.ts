import {
  createSessionToken,
  getDatabase,
  hashToken,
  json,
  makeSessionCookie,
  readJson,
  requireSameOrigin,
  verifyPassword,
} from '../_utils';
import type { Env, PagesFunction } from '../_utils';

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const originError = requireSameOrigin(request);
  if (originError) return originError;
  const body = await readJson(request);
  if (body instanceof Response) return body;

  const username = env.ADMIN_USERNAME;
  const passwordHash = env.ADMIN_PASSWORD_HASH;
  if (!username || !passwordHash) {
    return json({ message: 'Admin authentication is not configured.' }, 503);
  }
  if (body.username !== username || typeof body.password !== 'string' || !verifyPassword(body.password, passwordHash)) {
    return json({ message: 'Invalid admin credentials.' }, 401);
  }

  try {
    const token = createSessionToken();
    const db = await getDatabase(env);
    await db.collection('admin_sessions').insertOne({
      tokenHash: hashToken(token),
      username,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000),
    });
    return json({ status: 'authenticated' }, 200, { 'Set-Cookie': makeSessionCookie(request, token) });
  } catch (error) {
    console.error('Could not create admin session', error);
    return json({ message: 'Admin sign-in is temporarily unavailable. Check the database connection.' }, 503);
  }
};
