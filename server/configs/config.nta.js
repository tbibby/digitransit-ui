const CONFIG = 'nta';
const APP_TITLE = 'National Journey Planner';
const APP_DESCRIPTION =
  'This is a pilot journey planner for Ireland, built on the open-source Digitransit platform.';

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

// Self-hosted raster tiles from golearscail (tileserver-gl rendering our own
// OpenMapTiles style, English and Irish variants). digitransit-ui only ever
// consumes raster PNGs. 512px tiles with `map.zoomOffset: -1` below; no token.
const MAP_URL =
  process.env.MAP_URL ||
  'https://golearscail.bibby.ie/styles/positron-stock/512';
const MAP_URL_GA =
  process.env.MAP_URL_GA ||
  'https://golearscail.bibby.ie/styles/positron-ga/512';

export default {
  CONFIG,
  title: APP_TITLE,

  URL: {
    OTP: OTP_URL,

    // Self-hosted Inter (static/assets/fonts/inter, copied to _static by
    // webpack.config.js) instead of config.default.js's Google Fonts URL.
    FONT: '/assets/fonts/inter/inter.css',

    // `getLayerBaseUrl` (utils/client/mapLayerUtils.js) does
    // `urlOrUrlMap[lang] || urlOrUrlMap.default` — config.default.js's own
    // `URL.MAP.en` (HSL's tile server) would otherwise win over our
    // `.default` override here, since configMerger deep-merges per key.
    // Every language key we support needs its own override.
    MAP: {
      default: `${MAP_URL}/`,
      en: `${MAP_URL}/`,
      ga: `${MAP_URL_GA}/`,
    },

    // Dropped the `?digitransit-subscription-key=...` query param
    // config.default.js's own PELIAS/PELIAS_REVERSE_GEOCODER/PELIAS_PLACE
    // bake in unconditionally — tiraimsitheoir needs no auth and doesn't
    // expect it.
    PELIAS: `${GEOCODING_BASE_URL}/search`,
    PELIAS_REVERSE_GEOCODER: `${GEOCODING_BASE_URL}/reverse`,
    PELIAS_PLACE: `${GEOCODING_BASE_URL}/place`,
  },

  // Tiles are self-hosted and need no token, so no query param is appended.
  hasAPISubscriptionQueryParameter: false,

  // Brand mode icons (leaf badges + glyphs from the brand guidelines): the
  // default sprite with six symbols swapped, see static/assets/svg-sprite.nta.svg.
  sprites: 'assets/svg-sprite.nta.svg',

  // Placeholder logo: a plain leaf-shaped green tile with no text or artwork,
  // so the official logo can replace it by swapping this one asset.
  textLogo: true,
  logo: 'nta/logo-placeholder.svg',
  favicon: './app/client/images/default/default-favicon.png',

  timeZone: 'Europe/Dublin',
  // 'ga' added 2026-09-25 (task 12) as a first-pass, machine-translation-
  // quality Gaeilge translation — not yet reviewed by a native speaker or
  // checked against Irish public-transport terminology conventions. Shipped as an
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
    tileSize: 512,
    zoomOffset: -1,
    areaBounds: {
      // Ireland + Northern Ireland, same bbox already proven against
      // tiraimsitheoir via ../otp-react-redux/ireland-config.yml.
      corner1: [55.5, -10.5],
      corner2: [51.3, -5.9],
    },
    attribution:
      '&copy; <a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a>',
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

  // Mode colours match sass/themes/nta/_theme.scss. `primary` is used for
  // text-bearing icons, so it is the contrast-safe teal, not the brand green.
  colors: {
    primary: '#0F3E51',
    caution: '#E0134F',
    airplane: '#3F5865',
    bus: '#00A651',
    'replacement-bus': '#E0134F',
    tram: '#4F3695',
    subway: '#F35B0F',
    rail: '#0024A8',
    ferry: '#1260BF',
    citybike: '#5175BE',
    taxi: '#C1CD23',
    carpark: '#00A651',
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
    // app/translations/ga.js: needs a native-speaker/terminology review
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
