const CONFIG = 'nta';
const APP_TITLE = 'NTA Journey Planner';
const APP_DESCRIPTION =
  'Journey planning pilot for the National Transport Authority (Ireland)';

// Our own OTP instance (see ../otp/OTP-FRONTEND.md — same host, same
// `/otp` Apache ProxyPass otp-react-redux already uses). `config.URL.OTP`
// gets `gtfs/v1` appended by app/server code, so this must end in `/`
// and point at OTP 2's combined GraphQL router, not a bare host.
const OTP_URL = process.env.OTP_URL || 'https://projects.bibby.ie/otp/';

// tiraimsitheoir's Pelias-shaped geocoder (../tiraimsitheoir/) — same
// base URL already proven working against otp-react-redux
// (../otp-react-redux/ireland-config.yml). Built here (rather than left to
// config.default.js's own GEOCODING_BASE_URL handling) so the HSL demo
// `API_SUBSCRIPTION_TOKEN` query param — baked into config.default.js's
// PELIAS/PELIAS_REVERSE_GEOCODER/PELIAS_PLACE URLs before this file's
// `hasAPISubscriptionQueryParameter: false` below can take effect — never
// gets appended to requests tiraimsitheoir doesn't expect.
const GEOCODING_BASE_URL =
  process.env.GEOCODING_BASE_URL ||
  'https://projects.bibby.ie/tiraimsitheoir/pelias/v1';

// Third-party raster tiles (CONTEXT.md's "prerequisites" section) — CARTO's
// free, no-API-key Positron basemap, same provider already used for
// otp-react-redux (though there as a MapLibre vector style; digitransit-ui
// only ever consumes raster PNGs, see RESEARCH.md's "Map tiles" section).
// Self-hosting (../openfreemap/) is parked until digitransit-ui's own
// MapLibre migration ships.
const MAP_URL = process.env.MAP_URL || 'https://basemaps.cartocdn.com';

export default {
  CONFIG,
  title: APP_TITLE,

  URL: {
    OTP: OTP_URL,

    // CARTO serves standard 256px tiles (with native `@2x` retina variants,
    // matching the `{size}` token app/component/map/Map.jsx substitutes) —
    // not HSL's own 512px hsl-map-server tiles, so `map.tileSize`/
    // `map.zoomOffset` below are overridden to match.
    MAP: {
      default: `${MAP_URL}/light_all/`,
    },

    // Dropped the `?digitransit-subscription-key=...` query param
    // config.default.js's own PELIAS/PELIAS_REVERSE_GEOCODER/PELIAS_PLACE
    // bake in unconditionally — tiraimsitheoir needs no auth and doesn't
    // expect it.
    PELIAS: `${GEOCODING_BASE_URL}/search`,
    PELIAS_REVERSE_GEOCODER: `${GEOCODING_BASE_URL}/reverse`,
    PELIAS_PLACE: `${GEOCODING_BASE_URL}/place`,
  },

  // No API subscription — this points at our own OTP/tiraimsitheoir, not
  // HSL's metered API.
  hasAPISubscriptionQueryParameter: false,

  // Placeholder branding — no NTA logo asset exists yet, so keep this
  // dormant (as config.kela.js does) rather than pointing at a file that
  // isn't there.
  textLogo: true,
  logo: null,
  favicon: './app/client/images/default/default-favicon.png',

  timeZone: 'Europe/Dublin',
  availableLanguages: ['en'],
  defaultLanguage: 'en',

  defaultEndpoint: {
    address: 'Dublin',
    lat: 53.3498,
    lon: -6.2603,
  },
  defaultMapZoom: 7,

  map: {
    tileSize: 256,
    zoomOffset: 0,
    areaBounds: {
      // Ireland + Northern Ireland, same bbox already proven against
      // tiraimsitheoir via ../otp-react-redux/ireland-config.yml.
      corner1: [55.5, -10.5],
      corner2: [51.3, -5.9],
    },
    attribution:
      '&copy; <a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a>',
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
    copyright: { label: '© NTA' },
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
          'This is a pilot journey planner for the National Transport Authority (Ireland), built on the open-source Digitransit platform.',
          'This service is a modified fork of Digitransit-UI, licensed under the GNU Affero General Public License v3 (or later), also available under the European Union Public Licence v1.2. The complete source code corresponding to this running version is published at <a href="https://github.com/tbibby/digitransit-ui/tree/nta" target="_blank" rel="noreferrer">github.com/tbibby/digitransit-ui</a>.',
        ],
      },
    ],
  },
};
