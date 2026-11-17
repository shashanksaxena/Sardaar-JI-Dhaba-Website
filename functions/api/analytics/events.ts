import { getDatabase, json, readJson, requireSameOrigin } from '../_utils';
import type { Env, PagesFunction } from '../_utils';

const allowedEvents = new Set([
  'menu_click',
  'phone_click',
  'whatsapp_click',
  'directions_click',
  'order_click',
  'contact_submission',
  'page_view',
  'consulting_form_cta_click',
  'consulting_lead_submission',
  'franchise_cta_click',
  'franchise_form_submission',
]);

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const originError = requireSameOrigin(request);
  if (originError) return originError;
  const body = await readJson(request);
  if (body instanceof Response) return body;
  const { name, path, consent } = body;
  if (typeof name !== 'string' || !allowedEvents.has(name) || typeof path !== 'string' || path.length > 300 || consent !== true) {
    return json({ message: 'Invalid analytics event.' }, 400);
  }
  try {
    await getDatabase(env).then(db => db.collection('analytics_events').insertOne({
      name,
      path: path.slice(0, 300),
      createdAt: new Date(),
    }));
    return json({ status: 'accepted' }, 202);
  } catch (error) {
    console.error('Could not save analytics event', error);
    return json({ message: 'The event could not be saved.' }, 503);
  }
};
