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
  maintenanceMode: boolean("maintenance_mode").default(false).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// User feedback from the Settings screen.
export const feedback = pgTable("feedback", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  message: text("message").notNull(),
  email: text("email"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// STUB — schema + admin view only. No write logic until RevenueCat webhook lands.
export const purchases = pgTable("purchases", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  productId: text("product_id"),
  plan: text("plan"), // weekly|monthly|single
  status: text("status"), // active|expired|trial|refunded
  price: numeric("price"),
  currency: text("currency"),
  usdPrice: numeric("usd_price"),
  transactionId: text("transaction_id").unique(),
  countryCode: text("country_code"),
  purchasedAt: timestamp("purchased_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Event = typeof events.$inferSelect;
export type Settings = typeof settings.$inferSelect;
export type Feedback = typeof feedback.$inferSelect;
export type Purchase = typeof purchases.$inferSelect;
