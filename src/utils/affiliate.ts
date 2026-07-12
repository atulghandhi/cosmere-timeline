const DEFAULT_TAG = 'sanderson-timeline-20';

export function getAffiliateUrl(url: string): string {
  const amazonTag = import.meta.env.VITE_AMAZON_AFFILIATE_TAG || DEFAULT_TAG;
  const audibleTag = import.meta.env.VITE_AUDIBLE_AFFILIATE_TAG || DEFAULT_TAG;

  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('amazon.') || urlObj.hostname.includes('amzn.to')) {
      urlObj.searchParams.set('tag', amazonTag);
      return urlObj.toString();
    }
    if (urlObj.hostname.includes('audible.')) {
      urlObj.searchParams.set('tag', audibleTag);
      return urlObj.toString();
    }
    return url;
  } catch {
    return url;
  }
}
