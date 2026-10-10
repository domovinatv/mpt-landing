import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { pagePaths } from "@/components/site";

const BASE = "https://mpt.hr";

export default function sitemap(): MetadataRoute.Sitemap {
	return Object.values(pagePaths).flatMap((path) =>
		locales.map((locale) => ({
			url: `${BASE}/${locale}${path}`,
			changeFrequency: "weekly" as const,
			priority: path === "" ? 1 : 0.7,
			alternates: {
				languages: Object.fromEntries(locales.map((l) => [l, `${BASE}/${l}${path}`])),
			},
		})),
	);
}
