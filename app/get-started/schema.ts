import { z } from "zod";

/** Slug of the guide offered on /get-started. Stored on each captured lead. */
export const GUIDE_SLUG = "international-buyers-guide";

export const GUIDE_TITLE =
  "The International Buyer's Guide to Importing Chinese Vehicles";

/** Compact label for admin tables, where the full title is too long. */
export const GUIDE_SHORT_TITLE = "The International Buyer's Guide";

/** Public path of the PDF, served from public/guides. */
export const GUIDE_FILE = "/guides/cch-international-buyers-guide.pdf";

/** Filename the browser saves it as. */
export const GUIDE_DOWNLOAD_NAME =
  "CCH-Automobile-International-Buyers-Guide.pdf";

export const guideDownloadSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "Enter your first name")
    .max(80, "That name is too long"),
  email: z.email("Enter a valid email").max(254),
});

export type GuideDownloadInput = z.infer<typeof guideDownloadSchema>;
