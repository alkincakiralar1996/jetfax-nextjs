import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  jsonb,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";

// Anonymous, device-scoped user. No login — identity is the device_id.
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  deviceId: text("device_id").notNull().unique(),
  platform: text("platform"), // 'ios' | 'android'
  osVersion: text("os_version"),
  deviceModel: text("device_model"),
  deviceModelName: text("device_model_name"),
  appVersion: text("app_version"),
  locale: text("locale"), // 'en-US'
  region: text("region"), // 'US' (country)
  timezone: text("timezone"),
  segment: text("segment"), // medical|legal|business|tax|other
  hasOnboardingComplete: boolean("has_onboarding_complete").default(false).notNull(),
  notificationStatus: boolean("notification_status"),
  attStatus: text("att_status"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  lastOpenedAt: timestamp("last_opened_at", { withTimezone: true }),
});

// Generic analytics event log.
export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  props: jsonb("props"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Singleton app config (row id = 1).
export const settings = pgTable("settings", {
  id: integer("id").primaryKey().default(1),
  appStoreUrl: text("app_store_url"),
  privacyUrl: text("privacy_url"),
  termsUrl: text("terms_url"),
  supportUrl: text("support_url"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// User feedback + contact-support submissions from the Settings screen.
export const feedback = pgTable("feedback", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  kind: text("kind").default("feedback").notNull(), // 'feedback' | 'support'
  subject: text("subject"),
  message: text("message").notNull(),
  email: text("email"),
  resolved: boolean("resolved").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Current subscription state — one row per subscription, upserted by
// original_transaction_id on each RevenueCat webhook event.
export const purchases = pgTable("purchases", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  appUserId: text("app_user_id"), // RevenueCat app_user_id (= our users.id)
  productId: text("product_id"),
  plan: text("plan"), // weekly|monthly
  entitlement: text("entitlement"), // 'pro'
  status: text("status"), // active|cancelled|expired|billing_issue
  isActive: boolean("is_active").default(false).notNull(),
  store: text("store"), // APP_STORE
  environment: text("environment"), // SANDBOX|PRODUCTION
  eventType: text("event_type"), // last event applied
  price: numeric("price"),
  currency: text("currency"),
  usdPrice: numeric("usd_price"),
  countryCode: text("country_code"),
  originalTransactionId: text("original_transaction_id").unique(),
  transactionId: text("transaction_id"),
  purchasedAt: timestamp("purchased_at", { withTimezone: true }),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  unsubscribeDetectedAt: timestamp("unsubscribe_detected_at", {
    withTimezone: true,
  }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Append-only RevenueCat event log. Idempotency key = event_id. Drives
// daily-sales analytics (count INITIAL_PURCHASE) + full audit trail.
export const purchaseEvents = pgTable("purchase_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: text("event_id").notNull().unique(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  appUserId: text("app_user_id"),
  originalTransactionId: text("original_transaction_id"),
  type: text("type").notNull(), // INITIAL_PURCHASE|RENEWAL|CANCELLATION|EXPIRATION|...
  productId: text("product_id"),
  store: text("store"),
  environment: text("environment"),
  priceUsd: numeric("price_usd"),
  countryCode: text("country_code"),
  raw: jsonb("raw"),
  eventAt: timestamp("event_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Fax METADATA only. Page image bytes never touch the server — they live on
// the sending device (expo-file-system). Real transmission (Telnyx) lands later.
export const faxes = pgTable("faxes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  recipientLabel: text("recipient_label"),
  recipientNumber: text("recipient_number").notNull(),
  recipientCountry: text("recipient_country"),
  pageCount: integer("page_count").notNull(),
  hasCover: boolean("has_cover").default(false).notNull(),
  cover: jsonb("cover"), // { to, from, subject, message }
  status: text("status").notNull(), // delivered | pending | failed
  confirmationNumber: text("confirmation_number"),
  failureReason: text("failure_reason"),
  durationSeconds: integer("duration_seconds"),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  deliveredAt: timestamp("delivered_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Help-center FAQ content, managed from the admin panel, read by the app.
export const faq = pgTable("faq", {
  id: uuid("id").primaryKey().defaultRandom(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category"),
  sortOrder: integer("sort_order").default(0).notNull(),
  published: boolean("published").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Event = typeof events.$inferSelect;
export type Settings = typeof settings.$inferSelect;
export type Feedback = typeof feedback.$inferSelect;
export type Purchase = typeof purchases.$inferSelect;
export type NewPurchase = typeof purchases.$inferInsert;
export type PurchaseEvent = typeof purchaseEvents.$inferSelect;
export type NewPurchaseEvent = typeof purchaseEvents.$inferInsert;
export type Fax = typeof faxes.$inferSelect;
export type NewFax = typeof faxes.$inferInsert;
export type Faq = typeof faq.$inferSelect;
export type NewFaq = typeof faq.$inferInsert;
