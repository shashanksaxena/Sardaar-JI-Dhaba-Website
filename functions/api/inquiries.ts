import { getDatabase, json, readJson, requireSameOrigin } from './_utils';
import type { Env, PagesFunction } from './_utils';

function isInquiry(inquiry: Record<string, unknown>) {
  if (inquiry.website !== undefined && typeof inquiry.website !== 'string') return false;
  if (typeof inquiry.website === 'string' && inquiry.website.trim().length > 0) return false;
  if (inquiry.source !== undefined && (typeof inquiry.source !== 'string' || inquiry.source.length > 100)) return false;
  const validBase = (inquiry.kind === 'contact' || inquiry.kind === 'franchise' || inquiry.kind === 'consulting') &&
    typeof inquiry.name === 'string' && inquiry.name.trim().length > 1 && inquiry.name.length <= 100 &&
    typeof inquiry.email === 'string' && inquiry.email.length <= 160 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiry.email) &&
    typeof inquiry.message === 'string' && inquiry.message.trim().length > 3 && inquiry.message.length <= 2000;
  if (!validBase) return false;
  if (inquiry.phone !== undefined && (typeof inquiry.phone !== 'string' || inquiry.phone.length > 20)) return false;
  if (inquiry.city !== undefined && (typeof inquiry.city !== 'string' || inquiry.city.length > 100)) return false;
  if (inquiry.state !== undefined && (typeof inquiry.state !== 'string' || inquiry.state.trim().length < 2 || inquiry.state.length > 100)) return false;
  if (inquiry.franchiseFormat !== undefined && (typeof inquiry.franchiseFormat !== 'string' || inquiry.franchiseFormat.length > 80)) return false;
  if (inquiry.ownsCommercialProperty !== undefined && (typeof inquiry.ownsCommercialProperty !== 'string' || inquiry.ownsCommercialProperty.length > 60)) return false;
  if (inquiry.openingTimeline !== undefined && (typeof inquiry.openingTimeline !== 'string' || inquiry.openingTimeline.length > 60)) return false;
  if (inquiry.kind === 'consulting') {
    return typeof inquiry.phone === 'string' && inquiry.phone.trim().length >= 7 &&
      typeof inquiry.restaurantName === 'string' && inquiry.restaurantName.trim().length > 1 && inquiry.restaurantName.length <= 120 &&
      typeof inquiry.city === 'string' && inquiry.city.trim().length > 1 &&
      typeof inquiry.service === 'string' && inquiry.service.trim().length > 1 && inquiry.service.length <= 100 &&
      inquiry.consent === true;
  }
  if (inquiry.kind === 'franchise') {
    const validFranchiseDetails = inquiry.source !== 'franchise-application' || (
      typeof inquiry.state === 'string' && inquiry.state.trim().length >= 2 &&
      ['Express Dhaba', 'Classic Dhaba', 'Premium Dhaba'].includes(String(inquiry.franchiseFormat)) &&
      ['Yes', 'No', 'In the process of identifying'].includes(String(inquiry.ownsCommercialProperty)) &&
      ['Within 3 months', '3–6 months', '6–12 months', 'More than 12 months', 'Not decided'].includes(String(inquiry.openingTimeline))
    );
    return validFranchiseDetails &&
      typeof inquiry.phone === 'string' && inquiry.phone.trim().length >= 7 &&
      typeof inquiry.city === 'string' && inquiry.city.trim().length > 1 &&
      typeof inquiry.investmentRange === 'string' && inquiry.investmentRange.trim().length > 1 && inquiry.investmentRange.length <= 100 &&
      (inquiry.state === undefined || (typeof inquiry.state === 'string' && inquiry.state.trim().length > 1)) &&
      (inquiry.franchiseFormat === undefined || (typeof inquiry.franchiseFormat === 'string' && inquiry.franchiseFormat.trim().length > 0)) &&
      (inquiry.experience === undefined || (typeof inquiry.experience === 'string' && inquiry.experience.length <= 120)) &&
      (inquiry.employmentStatus === undefined || (typeof inquiry.employmentStatus === 'string' && inquiry.employmentStatus.trim().length > 1 && inquiry.employmentStatus.length <= 100)) &&
      (inquiry.availableTime === undefined || (typeof inquiry.availableTime === 'string' && inquiry.availableTime.trim().length > 1 && inquiry.availableTime.length <= 100)) &&
      inquiry.consent === true;
  }
  return inquiry.consent === true;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const originError = requireSameOrigin(request);
  if (originError) return originError;
  const body = await readJson(request);
  if (body instanceof Response) return body;
  if (!isInquiry(body)) return json({ message: 'Please provide a valid name, email and message.' }, 400);

  const inquiry = { ...body };
  delete inquiry.website;
  try {
    await getDatabase(env).then(db => db.collection('inquiries').insertOne({
      ...inquiry,
      name: String(body.name).trim(),
      email: String(body.email).trim().toLowerCase(),
      message: String(body.message).trim(),
      createdAt: new Date(),
      consentGivenAt: new Date(),
      consentNoticeVersion: '2026-10-31-v1',
    }));
    return json({ status: 'saved' }, 201);
  } catch (error) {
    console.error('Could not persist inquiry', error);
    return json({ message: 'The enquiry could not be saved. Please call the dhaba directly.' }, 503);
  }
};
