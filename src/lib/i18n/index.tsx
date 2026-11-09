"use client";

/**
 * Tanak `useT()` adapter za komponente prenesene iz energy.domovina.ai
 * (`components/beta/*`): isti ugovor `t(key, vars)`, ali jezik dolazi iz rute
 * (`/hr`, `/en`) preko `<I18nProvider locale>`, ne iz localStoragea.
 * Ostatak mpt.hr koristi `src/i18n/dictionaries.ts`.
 */
import { createContext, useContext, useMemo, type ReactNode } from "react";
import { hr, type Catalog, type MessageKey } from "./hr";
import { en } from "./en";

export type Locale = "hr" | "en";

const CATALOGS: Record<Locale, Catalog> = { hr, en };

interface I18nValue {
	readonly locale: Locale;
	readonly t: (key: MessageKey, vars?: Readonly<Record<string, string | number>>) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

/** `{ime}` se zamjenjuje vrijednošću; nepoznata varijabla ostaje doslovno. */
function interpolate(template: string, vars: Readonly<Record<string, string | number>> | undefined): string {
	if (vars === undefined) return template;
	return template.replace(/\{(\w+)\}/g, (match, name: string) => {
		const value = vars[name];
		return value === undefined ? match : String(value);
	});
}

export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
	const value = useMemo<I18nValue>(() => {
		const catalog = CATALOGS[locale];
		return { locale, t: (key, vars) => interpolate(catalog[key] ?? hr[key] ?? key, vars) };
	}, [locale]);
	return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useT(): I18nValue {
	const ctx = useContext(I18nContext);
	if (ctx === null) throw new Error("useT se mora koristiti unutar <I18nProvider>");
	return ctx;
}

export type { MessageKey };
