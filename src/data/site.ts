/**
 * Build-time facts about what's actually present in the repo.
 *
 * §S01's edge case: if the CV is missing, the control becomes disabled with
 * "coming soon" rather than shipping a link that 404s. The file now exists at
 * /public/R-Ruby-CV-2026.pdf, so the download is live.
 */
export const CV_AVAILABLE = true
