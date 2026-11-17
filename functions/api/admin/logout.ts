import { clearSessionCookie, getDatabase, hashToken, json, requireSameOrigin } from '../_utils';
import type { Env, PagesFunction } from '../_utils';

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const originError = requireSameOrigin(request);
  if (originError) return originError;
  try {
    const token = request.headers.get('Cookie')?.split(';')
      .map(value => value.trim())
      .find(value => value.startsWith('sardaar_admin_session='))
      ?.slice('sardaar_admin_session='.length);
    if (token) {
      await getDatabase(env).then(db => db.collection('admin_sessions').deleteOne({ tokenHash: hashToken(token) }));
    }
    return new Response(null, {
      status: 204,
      headers: {
        'Cache-Control': 'no-store',
        'Set-Cookie': clearSessionCookie(request),
      },
    });
  } catch (error) {
    console.error('Could not end admin session', error);
    return json({ message: 'Could not sign out. Please try again.' }, 503);
  }
};
