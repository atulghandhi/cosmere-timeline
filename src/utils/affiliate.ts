export function getAffiliateUrl(url: string | undefined): string {
  if (!url) return "";
  const metaEnv = (import.meta as any).env || {};
  const amazonTag = metaEnv.VITE_AMAZON_AFFILIATE_TAG || "sanderson-timeline-20";
  const audibleTag = metaEnv.VITE_AUDIBLE_AFFILIATE_TAG || "sanderson-timeline-20";

  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes("amazon.com") || urlObj.hostname.includes("amzn.to")) {
      urlObj.searchParams.set("tag", amazonTag);
      return urlObj.toString();
    }
    if (urlObj.hostname.includes("audible.")) {
      urlObj.searchParams.set("tag", audibleTag);
      return urlObj.toString();
    }
    return url;
  } catch (e) {
    return url;
  }
}
