import { json, requireAdmin } from '../_utils';
import type { Env, PagesFunction } from '../_utils';

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const access = await requireAdmin(request, env);
    if (access instanceof Response) return access;
    const [inquiries, events, recentInquiries, eventCounts] = await Promise.all([
      access.db.collection('inquiries').countDocuments(),
      access.db.collection('analytics_events').countDocuments(),
      access.db.collection('inquiries').find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).limit(50).toArray(),
      access.db.collection('analytics_events').aggregate([
        { $group: { _id: '$name', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]).toArray(),
    ]);
    return json({ inquiries, events, eventCounts, recentInquiries });
  } catch (error) {
    console.error('Could not load admin summary', error);
    return json({ message: 'Admin data is temporarily unavailable. Check the database connection.' }, 503);
  }
};
