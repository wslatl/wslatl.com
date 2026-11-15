'use client'

import { createContext, useContext, useMemo } from 'react'
import type { Locale } from '../../i18n/config'
import { englishText, translatorFor, type AdminMessages, type AdminText } from '../text'

type Value = { locale: Locale; t: AdminText }

const AdminTextContext = createContext<Value | null>(null)

const english: Value = { locale: 'en', t: englishText }

/**
 * Hands the admin's words in one language to the admin's client components.
 * The admin's layouts put it around every page, with the admin's language
 * and only the admin's part of the messages.
 */
export function AdminTextProvider({ locale, messages, children }: { locale: Locale; messages: AdminMessages; children: React.ReactNode }) {
  const value = useMemo(() => ({ locale, t: translatorFor(locale, messages) }), [locale, messages])
  return <AdminTextContext value={value}>{children}</AdminTextContext>
}

/** The admin's words, and their language, in a client component. In English when nothing hands it any, as in a test. */
export function useAdminText(): Value {
  return useContext(AdminTextContext) ?? english
}
