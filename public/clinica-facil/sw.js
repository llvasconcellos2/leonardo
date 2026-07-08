/*
 * sw.js — Clínica Fácil static-app service worker.
 *
 * Strategy: cache-first for all app shell + data files so the app works fully offline.
 * Bump CACHE_NAME whenever vendor/shim/template files change to force a fresh install.
 */

var CACHE_NAME = "clinica-facil-rip-v10"; // v10: ANVISA controlled-prescription document models

var PRECACHE_URLS = [
  // App shell
  "./index.html",
  "./styles.css",
  "./manifest.json",

  // Shim
  "./shim/store.js",
  "./shim/persistence.js",
  "./shim/data-source.js",
  "./shim/methods.js",
  "./shim/shim-core.js",
  "./shim/shim-util.js",
  "./shim/shim-dashboard.js",
  "./shim/shim-patients-list-form.js",
  "./shim/shim-patients-records.js",
  "./shim/shim-patients-evolution.js",
  "./shim/shim-drugs.js",
  "./shim/shim-icd10.js",
  "./shim/shim-specialties.js",
  "./shim/shim-doctors.js",
  "./shim/shim-exam-catalog.js",
  "./shim/shim-document-models.js",
  "./shim/shim-form-models.js",
  "./shim/shim-users.js",
  "./shim/shim-settings.js",
  "./shim/shim-reports.js",
  "./shim/shim-schedule.js",
  "./shim/shim-import.js",
  "./shim/router.js",

  // Vendor JS
  "./vendor/jquery-1.11.2.min.js",
  "./vendor/jquery-ui.min.js",
  "./vendor/bootstrap-3.3.6.min.js",
  "./vendor/jquery.metisMenu.js",
  "./vendor/jquery.mask.js",
  "./vendor/handlebars-4.0.5.min.js",
  "./vendor/moment-with-locales.min.js",
  "./vendor/Chart.min.js",
  "./vendor/jquery-datatables.js",
  "./vendor/jquery.highlight.js",
  "./vendor/dataTables.searchHighlight.min.js",
  "./vendor/accent-neutralize.js",
  "./vendor/fullcalendar.js",
  "./vendor/locale-all.js",
  "./vendor/scheduler.js",
  "./vendor/chosen.jquery.js",
  "./vendor/jquery.qtip.js",
  "./vendor/toastr.min.js",
  "./vendor/bootstrap-datepicker.js",
  "./vendor/bootstrap-datepicker.pt-BR.min.js",
  "./vendor/summernote.js",
  "./vendor/sweetalert.min.js",
  "./vendor/clockpicker.js",
  "./vendor/form-builder.js",
  "./vendor/form-render.js",
  "./vendor/papaparse.js",
  "./vendor/randomColor.js",

  // Vendor CSS
  "./vendor/jquery-datatables.css",
  "./vendor/fullcalendar.css",
  "./vendor/scheduler.css",
  "./vendor/chosen.css",
  "./vendor/jquery.qtip.css",
  "./vendor/toastr.min.css",
  "./vendor/datepicker3.css",
  "./vendor/summernote.css",
  "./vendor/sweetalert.css",
  "./vendor/clockpicker.css",
  "./vendor/jquery-ui.min.css",
  "./vendor/form-builder.css",
  "./vendor/form-render.css",

  // Vendor fonts (Summernote)
  "./vendor/font/summernote.eot",
  "./vendor/font/summernote.ttf",
  "./vendor/font/summernote.woff",

  // Vendor sprites
  "./vendor/chosen-sprite.png",
  "./vendor/chosen-sprite@2x.png",

  // App fonts (Font Awesome)
  "./fonts/fontawesome-webfont.woff",
  "./fonts/fontawesome-webfont.woff2",
  "./fonts/fontawesome-webfont.ttf",
  "./fonts/fontawesome-webfont.eot",
  "./fonts/fontawesome-webfont.svg",
  "./fonts/FontAwesome.otf",

  // iCheck sprites
  "./green.png",
  "./green@2x.png",
  "./chosen-sprite.png",
  "./chosen-sprite@2x.png",

  // Templates (partials)
  "./templates/navigation.hbs",
  "./templates/topNavbar.hbs",
  "./templates/footer.hbs",
  "./templates/loading.hbs",
  "./templates/pageHeading.hbs",

  // Templates (content pages)
  "./templates/content-dashboard.hbs",
  "./templates/content-patientList.hbs",
  "./templates/content-patientCreate.hbs",
  "./templates/content-patientEdit.hbs",
  "./templates/content-schedule.hbs",
  "./templates/content-doctorList.hbs",
  "./templates/content-doctorForm.hbs",
  "./templates/content-drugList.hbs",
  "./templates/content-drugForm.hbs",
  "./templates/content-icd10List.hbs",
  "./templates/content-specialtyList.hbs",
  "./templates/content-specialtyForm.hbs",
  "./templates/content-examCatalogList.hbs",
  "./templates/content-examCatalogForm.hbs",
  "./templates/content-documentModelList.hbs",
  "./templates/content-documentModelForm.hbs",
  "./templates/content-formModelsList.hbs",
  "./templates/content-formModelsForm.hbs",
  "./templates/content-reportAppointments.hbs",
  "./templates/content-reportPatients.hbs",
  "./templates/content-reportProduction.hbs",
  "./templates/content-settingsForm.hbs",
  "./templates/content-users.hbs",
  "./templates/content-import.hbs",
  "./templates/content-logout.hbs",

  // Data fixtures (JSON)
  "./data/patients.json",
  "./data/appointments.json",
  "./data/schedule.json",
  "./data/patient-records.json",
  "./data/patient-exams.json",
  "./data/drugs.json",
  "./data/icd10.json",
  "./data/specialties.json",
  "./data/exam-catalog.json",
  "./data/document-models.json",
  "./data/form-models.json",
  "./data/settings.json",
  "./data/users.json",
  "./data/images-meta.json",
  "./data/datatables-pt-BR.json",
  "./data/i18n/pt-BR.json",

  // Static assets
  "./images/logo.svg",
  "./images/default-user-image.png",
  "./images/drugs.png",
  "./images/flags/32/Brazil.png",
  "./images/flags/32/United-Kingdom.png",
  "./images/flags/32/Spain.png",

  // ANVISA controlled-prescription letterhead backgrounds (never printed -
  // browsers omit CSS background-image from print output by default; shown
  // on-screen only, as a placement guide over the pre-printed paper form)
  "./receitas/anvisa-a-300-pt.png",
  "./receitas/anvisa-b-300-pt.png",
  "./receitas/anvisa-b2-300-pt.png",
  "./receitas/anvisa-retinoides-300-pt.png",
  "./receitas/anvisa-talidomida-300-pt.png",
  "./receitas/anvisa-controle-especial-300-pt.png",

  // PWA icons / title-bar logo
  "./favicon.svg",
  "./favicon.ico",
  "./favicon-96x96.png",
  "./apple-touch-icon.png",
  "./web-app-manifest-192x192.png",
  "./web-app-manifest-512x512.png",
];

// ---------------------------------------------------------------------------
// Install: precache all known assets
// ---------------------------------------------------------------------------
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      // Cache individually so one bad URL doesn't abort the whole install
      return Promise.all(
        PRECACHE_URLS.map(function (url) {
          return cache.add(url).catch(function (e) {
            console.warn("[sw] precache miss:", url, e.message);
          });
        })
      );
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

// ---------------------------------------------------------------------------
// Activate: delete old caches
// ---------------------------------------------------------------------------
self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE_NAME; })
            .map(function (k) { return caches.delete(k); })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

// ---------------------------------------------------------------------------
// Fetch: cache-first for same-origin; network passthrough for cross-origin
// (Gravatar avatars, etc.)
// ---------------------------------------------------------------------------
self.addEventListener("fetch", function (event) {
  var url = new URL(event.request.url);

  // Let cross-origin requests (Gravatar, external CDNs) go straight to network
  if (url.origin !== location.origin) return;

  event.respondWith(
    caches.match(event.request).then(function (cached) {
      if (cached) return cached;

      // Not cached: fetch from network and cache the response for next time
      return fetch(event.request).then(function (response) {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, clone);
        });
        return response;
      });
    })
  );
});
