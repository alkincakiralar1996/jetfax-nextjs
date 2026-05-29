#!/usr/bin/env node
/**
 * One-shot RevenueCat v2 provisioning for FaxJet — idempotent.
 *
 * Creates (or reuses) inside the FaxJet RC project:
 *   - the iOS app (bundle com.pyxastudio.faxjet, + App Store shared secret)
 *   - 2 subscription products (weekly / monthly)
 *   - the `pro` entitlement (both products attached)
 *   - the `default` offering with $rc_weekly + $rc_monthly packages
 * then prints the iOS public SDK key for EXPO_PUBLIC_RC_PUBLIC_KEY.
 *
 * Prereqs (dashboard-only, RC API can't do them):
 *   1. The FaxJet PROJECT exists in the RC dashboard.
 *   2. A v2 secret key for it (export REVENUECAT_V2_SECRET_KEY=sk_...).
 *   3. export REVENUECAT_PROJECT_ID=proj... (the FaxJet project id)
 *   4. (optional) export ASC_SHARED_SECRET=... (App Store shared secret)
 *   5. The 2 IAP products must already exist in App Store Connect with the
 *      identifiers below (created via ascelerate).
 *
 *   node scripts/setup-revenuecat.mjs
 */

const API = 'https://api.revenuecat.com/v2';
const SECRET = process.env.REVENUECAT_V2_SECRET_KEY;
const PROJECT_ID = process.env.REVENUECAT_PROJECT_ID;
const SHARED_SECRET = process.env.ASC_SHARED_SECRET || null;

const BUNDLE_ID = 'com.pyxastudio.faxjet';
const PRODUCTS = [
  { lookup: 'weekly', store_id: 'com.pyxastudio.faxjet.pro.weekly', package: '$rc_weekly', name: 'Unlimited Weekly' },
  { lookup: 'monthly', store_id: 'com.pyxastudio.faxjet.pro.monthly', package: '$rc_monthly', name: 'Unlimited Monthly' },
];
const ENTITLEMENT = 'pro';
const OFFERING = 'default';

// ─── Guardrail: never touch Prevena ─────────────────────────────────────────
const PREVENA_PROJECT = 'projbf9391a8';
const PREVENA_KEY_FRAGMENT = 'uQeXbgOelWZDiBPFlWCLpyKtKkcdU';
if (!SECRET || !PROJECT_ID) {
  console.error('✖ Set REVENUECAT_V2_SECRET_KEY and REVENUECAT_PROJECT_ID first.');
  process.exit(1);
}
if (PROJECT_ID === PREVENA_PROJECT || SECRET.includes(PREVENA_KEY_FRAGMENT)) {
  console.error('✖ Refusing to run against the Prevena project/key. FaxJet must use its own RC project.');
  process.exit(1);
}

async function rc(method, path, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${SECRET}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }
  if (!res.ok) {
    const err = new Error(`${method} ${path} → ${res.status}: ${text}`);
    err.status = res.status;
    err.body = json;
    throw err;
  }
  return json;
}

// Paginated list → flat array of items.
async function list(path) {
  const out = [];
  let url = path;
  for (let i = 0; i < 20 && url; i++) {
    const page = await rc('GET', url);
    out.push(...(page.items ?? []));
    url = page.next_page ?? null;
  }
  return out;
}

async function main() {
  console.log(`▸ Project ${PROJECT_ID}`);

  // 1. App ────────────────────────────────────────────────────────────────
  const apps = await list(`/projects/${PROJECT_ID}/apps`);
  let app = apps.find(
    (a) => a.type === 'app_store' && (a.app_store?.bundle_id === BUNDLE_ID || a.bundle_id === BUNDLE_ID),
  );
  if (!app) {
    app = await rc('POST', `/projects/${PROJECT_ID}/apps`, {
      name: 'FaxJet iOS',
      type: 'app_store',
      app_store: { bundle_id: BUNDLE_ID, ...(SHARED_SECRET ? { shared_secret: SHARED_SECRET } : {}) },
    });
    console.log(`  ✓ created app ${app.id}`);
  } else {
    console.log(`  · app exists ${app.id}`);
    if (SHARED_SECRET) {
      await rc('POST', `/projects/${PROJECT_ID}/apps/${app.id}`, {
        app_store: { shared_secret: SHARED_SECRET },
      }).catch((e) => console.log(`    (shared secret update skipped: ${e.status})`));
    }
  }

  // 2. Products ─────────────────────────────────────────────────────────────
  const existingProducts = await list(`/projects/${PROJECT_ID}/products`);
  const productIdByLookup = {};
  for (const p of PRODUCTS) {
    let prod = existingProducts.find((x) => x.store_identifier === p.store_id);
    if (!prod) {
      prod = await rc('POST', `/projects/${PROJECT_ID}/products`, {
        store_identifier: p.store_id,
        app_id: app.id,
        type: 'subscription',
        display_name: p.name,
      });
      console.log(`  ✓ created product ${p.store_id} → ${prod.id}`);
    } else {
      console.log(`  · product exists ${p.store_id} → ${prod.id}`);
    }
    productIdByLookup[p.lookup] = prod.id;
  }
  const allProductIds = Object.values(productIdByLookup);

  // 3. Entitlement ────────────────────────────────────────────────────────
  const ents = await list(`/projects/${PROJECT_ID}/entitlements`);
  let ent = ents.find((e) => e.lookup_key === ENTITLEMENT);
  if (!ent) {
    ent = await rc('POST', `/projects/${PROJECT_ID}/entitlements`, {
      lookup_key: ENTITLEMENT,
      display_name: 'Pro',
    });
    console.log(`  ✓ created entitlement ${ENTITLEMENT} → ${ent.id}`);
  } else {
    console.log(`  · entitlement exists ${ENTITLEMENT} → ${ent.id}`);
  }
  await rc('POST', `/projects/${PROJECT_ID}/entitlements/${ent.id}/actions/attach_products`, {
    product_ids: allProductIds,
  })
    .then(() => console.log('  ✓ products attached to entitlement'))
    .catch((e) => console.log(`    (attach products → ${e.status}; may already be attached)`));

  // 4. Offering + packages ──────────────────────────────────────────────────
  const offerings = await list(`/projects/${PROJECT_ID}/offerings`);
  let offering = offerings.find((o) => o.lookup_key === OFFERING);
  if (!offering) {
    offering = await rc('POST', `/projects/${PROJECT_ID}/offerings`, {
      lookup_key: OFFERING,
      display_name: 'FaxJet Pro',
    });
    console.log(`  ✓ created offering ${OFFERING} → ${offering.id}`);
  } else {
    console.log(`  · offering exists ${OFFERING} → ${offering.id}`);
  }

  const existingPkgs = await list(`/projects/${PROJECT_ID}/offerings/${offering.id}/packages`);
  for (const p of PRODUCTS) {
    let pkg = existingPkgs.find((x) => x.lookup_key === p.package);
    if (!pkg) {
      pkg = await rc('POST', `/projects/${PROJECT_ID}/offerings/${offering.id}/packages`, {
        lookup_key: p.package,
        display_name: p.name,
      });
      console.log(`  ✓ created package ${p.package} → ${pkg.id}`);
    } else {
      console.log(`  · package exists ${p.package} → ${pkg.id}`);
    }
    await rc('POST', `/projects/${PROJECT_ID}/packages/${pkg.id}/actions/attach_products`, {
      products: [{ product_id: productIdByLookup[p.lookup], eligibility_criteria: 'all' }],
    })
      .then(() => console.log(`    ✓ ${p.store_id} attached to ${p.package}`))
      .catch((e) => console.log(`    (attach ${p.package} → ${e.status}; may already be attached)`));
  }

  // 5. Public SDK key ───────────────────────────────────────────────────────
  const keys = await list(`/projects/${PROJECT_ID}/apps/${app.id}/public_api_keys`).catch(
    () => [],
  );
  const publicKey = keys[0]?.key ?? keys[0]?.value ?? null;
  console.log('\n════════════════════════════════════════════');
  if (publicKey) {
    console.log('EXPO_PUBLIC_RC_PUBLIC_KEY=' + publicKey);
  } else {
    console.log('⚠ Could not auto-fetch the public SDK key. Copy it from the');
    console.log('  RC dashboard → Project → API keys → "Public app-specific" (appl_…).');
  }
  console.log('════════════════════════════════════════════');
  console.log('✓ RevenueCat provisioning complete.');
}

main().catch((e) => {
  console.error('\n✖ Failed:', e.message);
  if (e.body) console.error(JSON.stringify(e.body, null, 2));
  process.exit(1);
});
