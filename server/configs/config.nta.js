const CONFIG = 'nta';
const APP_TITLE = 'National Journey Planner';
const APP_DESCRIPTION =
  'Journey planning pilot for the National Transport Authority (Ireland)';

// Our own OTP instance (see ../otp/OTP-FRONTEND.md — same host, same
// `/otp` Apache ProxyPass otp-react-redux already uses). `config.URL.OTP`
// gets `gtfs/v1` appended by app/server code, so this must end in `/`
// and point at OTP 2's combined GraphQL router, not a bare host.
const OTP_URL = process.env.OTP_URL || 'https://projects.bibby.ie/otp/';

// tiraimsitheoir's Pelias-shaped geocoder (../tiraimsitheoir/) — same
// base URL already proven working against otp-react-redux
// (../otp-react-redux/ireland-config.yml). Built here as complete URLs
// (rather than left to config.default.js's own GEOCODING_BASE_URL handling,
// which bakes in HSL's demo `API_SUBSCRIPTION_TOKEN` query param
// unconditionally) so tiraimsitheoir — which needs no auth and doesn't
// expect that param — never receives it, regardless of this file's own
// `hasAPISubscriptionQueryParameter` (below, `true` for Mapbox's token).
const GEOCODING_BASE_URL =
  process.env.GEOCODING_BASE_URL ||
  'https://projects.bibby.ie/tiraimsitheoir/pelias/v1';

// Third-party raster tiles (CONTEXT.md's "prerequisites" section).
// digitransit-ui only ever consumes raster PNGs (see RESEARCH.md's "Map
// tiles" section — no MapLibre/vector-tile code path in this codebase).
// CARTO's anonymous `basemaps.cartocdn.com` (the original pick here) turned
// out to require an API key after all — it now serves a watermarked
// "API KEY REQUIRED" tile instead of erroring, which wasn't caught until an
// actual visual check (2026-09-25). Switched to Mapbox's Styles API
// (`light-v11`), using the same account/token pattern already proven by
// `../maptan/` (an `access_token` query param, not a path segment or
// header) — see `MAP_TOKEN` below.
const MAP_URL =
  process.env.MAP_URL ||
  'https://api.mapbox.com/styles/v1/mapbox/light-v11/tiles';

// Mapbox requires a token on every tile request. Scoped
// (`https://pleanalaiturais.bibby.ie/*` URL restriction, 2026-09-25) to this
// domain in the Mapbox dashboard — a token without that restriction, or one
// scoped to a different domain (e.g. `../maptan/`'s own token), would 403.
// No hardcoded fallback: this is a credential, not a URL, and must come from
// `.env` (gitignored, see CONTEXT.md's "Fork setup").
const { MAP_TOKEN } = process.env;

export default {
  CONFIG,
  title: APP_TITLE,

  URL: {
    OTP: OTP_URL,

    // Mapbox's Styles API serves native 512px tiles (with `@2x` retina
    // variants, matching the `{size}` token app/component/map/Map.jsx
    // substitutes) — same as HSL's own hsl-map-server, so `map.tileSize`/
    // `map.zoomOffset` below match config.default.js's values rather than
    // needing an override (unlike CARTO's 256px tiles, the original pick
    // here).
    //
    // `getLayerBaseUrl` (utils/client/mapLayerUtils.js) does
    // `urlOrUrlMap[lang] || urlOrUrlMap.default` — config.default.js's own
    // `URL.MAP.en` (HSL's tile server) would otherwise win over our
    // `.default` override here, since configMerger deep-merges per key and
    // `availableLanguages`/`defaultLanguage` below are both `'en'`. Every
    // language key we support needs its own override, not just `.default`.
    MAP: {
      default: `${MAP_URL}/`,
      en: `${MAP_URL}/`,
      ga: `${MAP_URL}/`,
    },

    // Dropped the `?digitransit-subscription-key=...` query param
    // config.default.js's own PELIAS/PELIAS_REVERSE_GEOCODER/PELIAS_PLACE
    // bake in unconditionally — tiraimsitheoir needs no auth and doesn't
    // expect it.
    PELIAS: `${GEOCODING_BASE_URL}/search`,
    PELIAS_REVERSE_GEOCODER: `${GEOCODING_BASE_URL}/reverse`,
    PELIAS_PLACE: `${GEOCODING_BASE_URL}/place`,
  },

  // This is Mapbox's `access_token` query param, not HSL's metered-API
  // subscription key (PELIAS/PELIAS_REVERSE_GEOCODER/PELIAS_PLACE above are
  // built as complete URLs and don't go through this mechanism at all, so
  // turning it on doesn't affect the geocoder). client.jsx and
  // Disruptions.jsx also read this flag and would append the same query
  // param to OTP requests — harmless there, OTP ignores unknown params.
  hasAPISubscriptionQueryParameter: true,
  API_SUBSCRIPTION_QUERY_PARAMETER_NAME: 'access_token',
  API_SUBSCRIPTION_TOKEN: MAP_TOKEN,

  // Placeholder branding — no NTA logo asset exists yet, so keep this
  // dormant (as config.kela.js does) rather than pointing at a file that
  // isn't there.
  textLogo: true,
  logo: null,
  favicon: './app/client/images/default/default-favicon.png',

  timeZone: 'Europe/Dublin',
  // 'ga' added 2026-09-25 (task 12) as a first-pass, machine-translation-
  // quality Gaeilge translation — not yet reviewed by a native speaker or
  // checked against TFI/Irish Rail terminology conventions. Shipped as an
  // additional, opt-in language (defaultLanguage stays 'en') rather than
  // replacing English, both because of that review gap and because OTP-
  // sourced stop/route names and trip headsigns don't localize yet (task
  // 12 item 7 — separate, unimplemented).
  availableLanguages: ['en', 'ga'],
  defaultLanguage: 'en',

  // Without this, LangSelect.jsx's /<lang>/... links do nothing:
  // reittiopasParameterMiddleware.js only strips the language URL prefix and
  // sets the `lang` cookie when this is true (opt-in per config — only
  // config.hsl.js/matka.js/kela.js/waltti.js set it; config.default.js
  // doesn't either). Without it, a request to e.g. /ga/ falls straight
  // through to the app/client/routes.jsx itinerary catch-all route, binding
  // "ga" as the origin (:from) route param instead of switching language —
  // found 2026-09-25 when the language switcher's Irish option populated the
  // origin field with the literal text "ga".
  redirectReittiopasParams: true,

  defaultEndpoint: {
    address: 'Dublin',
    lat: 53.3498,
    lon: -6.2603,
  },
  defaultMapZoom: 7,

  map: {
    // Matches config.default.js's own values — Mapbox's tiles are native
    // 512px, same as HSL's hsl-map-server, so no override needed (unlike
    // CARTO's 256px tiles, the original pick here).
    tileSize: 512,
    zoomOffset: -1,
    areaBounds: {
      // Ireland + Northern Ireland, same bbox already proven against
      // tiraimsitheoir via ../otp-react-redux/ireland-config.yml.
      corner1: [55.5, -10.5],
      corner2: [51.3, -5.9],
    },
    attribution:
      '&copy; <a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors &copy; <a href="https://www.mapbox.com/about/maps/" target="_blank">Mapbox</a>',
  },

  mainMenu: {
    showLoginCreateAccount: false,
    showEmbeddedSearch: false,
  },

  socialMedia: {
    title: APP_TITLE,
    description: APP_DESCRIPTION,
    locale: 'en_IE',
  },

  meta: {
    description: APP_DESCRIPTION,
    keywords: 'nta,journey planner,ireland,transport',
  },

  colors: {
    primary: '#1B3E67',
  },

  menu: {
    copyright: { label: '©' },
    content: [
      {
        name: 'menu-feedback',
        href: 'https://github.com/tbibby/digitransit-ui/issues',
      },
      {
        name: 'about-this-service',
        route: '/tietoja-palvelusta',
      },
      // AGPLv3 §13: this is a modified fork run as a network service, so a
      // reachable link to the Corresponding Source (here: the `nta` branch
      // HEAD, pushed as we go per CONTEXT.md's "Fork setup") must be
      // available to anyone interacting with the running app, not just in
      // our own docs. Explicit `label` (rather than `name` + an i18n
      // message id) since this config is English-only.
      {
        label: 'Source code (AGPLv3 / EUPL v1.2)',
        href: 'https://github.com/tbibby/digitransit-ui/tree/nta',
      },
    ],
  },

  aboutThisService: {
    en: [
      {
        header: 'About this service',
        paragraphs: [
          'This is a pilot journey planner for Ireland, built on the open-source Digitransit platform.',
          'This service is a modified fork of Digitransit-UI, licensed under the GNU Affero General Public License v3 (or later), also available under the European Union Public Licence v1.2. The complete source code corresponding to this running version is published at <a href="https://github.com/tbibby/digitransit-ui/tree/nta" target="_blank" rel="noreferrer">github.com/tbibby/digitransit-ui</a>.',
        ],
      },
    ],
    // Initial machine-translation-assisted pass (2026-09-25) — same caveat as
    // app/translations/ga.js: needs a native-speaker/TFI-terminology review
    // before this ships, see TASKS.md task 12.
    ga: [
      {
        header: 'Maidir leis an tseirbhís seo',
        paragraphs: [
          'Is pleanálaí turais phíolótach é seo d’Éirinn, tógtha ar an ardán foinse oscailte Digitransit.',
          'Is gabhalbhranch modhnaithe de Digitransit-UI í an tseirbhís seo, ceadúnaithe faoin GNU Affero General Public License v3 (nó níos déanaí), atá ar fáil freisin faoin European Union Public Licence v1.2. Foilsítear an bunchód iomlán a fhreagraíonn don leagan reatha seo ag <a href="https://github.com/tbibby/digitransit-ui/tree/nta" target="_blank" rel="noreferrer">github.com/tbibby/digitransit-ui</a>.',
        ],
      },
    ],
  },
};
