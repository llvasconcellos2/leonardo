/*
 * rip/ shim — minimal stand-ins for the Meteor APIs the cloned templates use.
 * No Meteor, no DDP. Plain jQuery + Handlebars over local data.
 * This file grows as features are brought up; for now it stands up the app frame
 * (navigation / topNavbar / footer) for the dashboard.
 */
(function (global) {
  "use strict";

  // ---------------------------------------------------------------------------
  // md5 (compact, public-domain Joseph Myers implementation) — for Gravatar
  // ---------------------------------------------------------------------------
  var md5 = (function () {
    function safeAdd(x, y) {
      var lsw = (x & 0xffff) + (y & 0xffff);
      var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
      return (msw << 16) | (lsw & 0xffff);
    }
    function bitRol(num, cnt) {
      return (num << cnt) | (num >>> (32 - cnt));
    }
    function cmn(q, a, b, x, s, t) {
      return safeAdd(bitRol(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
    }
    function ff(a, b, c, d, x, s, t) {
      return cmn((b & c) | (~b & d), a, b, x, s, t);
    }
    function gg(a, b, c, d, x, s, t) {
      return cmn((b & d) | (c & ~d), a, b, x, s, t);
    }
    function hh(a, b, c, d, x, s, t) {
      return cmn(b ^ c ^ d, a, b, x, s, t);
    }
    function ii(a, b, c, d, x, s, t) {
      return cmn(c ^ (b | ~d), a, b, x, s, t);
    }
    function coreMd5(x, len) {
      x[len >> 5] |= 0x80 << (len % 32);
      x[(((len + 64) >>> 9) << 4) + 14] = len;
      var a = 1732584193,
        b = -271733879,
        c = -1732584194,
        d = 271733878;
      for (var i = 0; i < x.length; i += 16) {
        var oa = a,
          ob = b,
          oc = c,
          od = d;
        a = ff(a, b, c, d, x[i], 7, -680876936);
        d = ff(d, a, b, c, x[i + 1], 12, -389564586);
        c = ff(c, d, a, b, x[i + 2], 17, 606105819);
        b = ff(b, c, d, a, x[i + 3], 22, -1044525330);
        a = ff(a, b, c, d, x[i + 4], 7, -176418897);
        d = ff(d, a, b, c, x[i + 5], 12, 1200080426);
        c = ff(c, d, a, b, x[i + 6], 17, -1473231341);
        b = ff(b, c, d, a, x[i + 7], 22, -45705983);
        a = ff(a, b, c, d, x[i + 8], 7, 1770035416);
        d = ff(d, a, b, c, x[i + 9], 12, -1958414417);
        c = ff(c, d, a, b, x[i + 10], 17, -42063);
        b = ff(b, c, d, a, x[i + 11], 22, -1990404162);
        a = ff(a, b, c, d, x[i + 12], 7, 1804603682);
        d = ff(d, a, b, c, x[i + 13], 12, -40341101);
        c = ff(c, d, a, b, x[i + 14], 17, -1502002290);
        b = ff(b, c, d, a, x[i + 15], 22, 1236535329);
        a = gg(a, b, c, d, x[i + 1], 5, -165796510);
        d = gg(d, a, b, c, x[i + 6], 9, -1069501632);
        c = gg(c, d, a, b, x[i + 11], 14, 643717713);
        b = gg(b, c, d, a, x[i], 20, -373897302);
        a = gg(a, b, c, d, x[i + 5], 5, -701558691);
        d = gg(d, a, b, c, x[i + 10], 9, 38016083);
        c = gg(c, d, a, b, x[i + 15], 14, -660478335);
        b = gg(b, c, d, a, x[i + 4], 20, -405537848);
        a = gg(a, b, c, d, x[i + 9], 5, 568446438);
        d = gg(d, a, b, c, x[i + 14], 9, -1019803690);
        c = gg(c, d, a, b, x[i + 3], 14, -187363961);
        b = gg(b, c, d, a, x[i + 8], 20, 1163531501);
        a = gg(a, b, c, d, x[i + 13], 5, -1444681467);
        d = gg(d, a, b, c, x[i + 2], 9, -51403784);
        c = gg(c, d, a, b, x[i + 7], 14, 1735328473);
        b = gg(b, c, d, a, x[i + 12], 20, -1926607734);
        a = hh(a, b, c, d, x[i + 5], 4, -378558);
        d = hh(d, a, b, c, x[i + 8], 11, -2022574463);
        c = hh(c, d, a, b, x[i + 11], 16, 1839030562);
        b = hh(b, c, d, a, x[i + 14], 23, -35309556);
        a = hh(a, b, c, d, x[i + 1], 4, -1530992060);
        d = hh(d, a, b, c, x[i + 4], 11, 1272893353);
        c = hh(c, d, a, b, x[i + 7], 16, -155497632);
        b = hh(b, c, d, a, x[i + 10], 23, -1094730640);
        a = hh(a, b, c, d, x[i + 13], 4, 681279174);
        d = hh(d, a, b, c, x[i], 11, -358537222);
        c = hh(c, d, a, b, x[i + 3], 16, -722521979);
        b = hh(b, c, d, a, x[i + 6], 23, 76029189);
        a = hh(a, b, c, d, x[i + 9], 4, -640364487);
        d = hh(d, a, b, c, x[i + 12], 11, -421815835);
        c = hh(c, d, a, b, x[i + 15], 16, 530742520);
        b = hh(b, c, d, a, x[i + 2], 23, -995338651);
        a = ii(a, b, c, d, x[i], 6, -198630844);
        d = ii(d, a, b, c, x[i + 7], 10, 1126891415);
        c = ii(c, d, a, b, x[i + 14], 15, -1416354905);
        b = ii(b, c, d, a, x[i + 5], 21, -57434055);
        a = ii(a, b, c, d, x[i + 12], 6, 1700485571);
        d = ii(d, a, b, c, x[i + 3], 10, -1894986606);
        c = ii(c, d, a, b, x[i + 10], 15, -1051523);
        b = ii(b, c, d, a, x[i + 1], 21, -2054922799);
        a = ii(a, b, c, d, x[i + 8], 6, 1873313359);
        d = ii(d, a, b, c, x[i + 15], 10, -30611744);
        c = ii(c, d, a, b, x[i + 6], 15, -1560198380);
        b = ii(b, c, d, a, x[i + 13], 21, 1309151649);
        a = ii(a, b, c, d, x[i + 4], 6, -145523070);
        d = ii(d, a, b, c, x[i + 11], 10, -1120210379);
        c = ii(c, d, a, b, x[i + 2], 15, 718787259);
        b = ii(b, c, d, a, x[i + 9], 21, -343485551);
        a = safeAdd(a, oa);
        b = safeAdd(b, ob);
        c = safeAdd(c, oc);
        d = safeAdd(d, od);
      }
      return [a, b, c, d];
    }
    function binlMd5(str) {
      var n = str.length,
        x = [];
      for (var i = 0; i < n * 8; i += 8)
        x[i >> 5] |= (str.charCodeAt(i / 8) & 0xff) << (i % 32);
      return coreMd5(x, n * 8);
    }
    function rhex(n) {
      var s = "",
        j;
      for (j = 0; j < 4; j++)
        s +=
          ((n >> (j * 8 + 4)) & 0x0f).toString(16) +
          ((n >> (j * 8)) & 0x0f).toString(16);
      return s;
    }
    function utf8(str) {
      return unescape(encodeURIComponent(str));
    }
    return function (str) {
      var b = binlMd5(utf8(str));
      var out = "";
      for (var i = 0; i < b.length; i++) out += rhex(b[i]);
      return out;
    };
  })();

  // ---------------------------------------------------------------------------
  // Fake current user (the seeded super-admin doctor) + auth/roles stubs
  // ---------------------------------------------------------------------------
  var currentUser = {
    // must be the seeded doctor's real _id — Schedule.resourceId and users.json key off it
    _id: "QTWAByLcNDWsZLDzN",
    profile: {
      firstName: "Leonardo",
      lastName: "Lima de Vasconcellos",
      group: "medical_doctor",
      language: "pt-BR",
    },
    emails: [{ address: "leo.lima.web@gmail.com", verified: true }],
    roles: ["default", "medical_doctor", "super-admin"],
  };

  var Meteor = global.Meteor || (global.Meteor = {});
  Meteor.userId = function () {
    return currentUser._id;
  };
  Meteor.user = function () {
    return currentUser;
  };
  Meteor.Device = {
    isPhone: function () {
      return window.innerWidth < 768;
    },
    isTablet: function () {
      var w = window.innerWidth;
      return w >= 768 && w < 1024;
    },
  };

  global.Roles = {
    userIsInRole: function (userId, roles) {
      var want = Array.isArray(roles) ? roles : String(roles).split(",");
      var have = currentUser.roles || [];
      return want.some(function (r) {
        return have.indexOf(String(r).trim()) >= 0;
      });
    },
  };

  global.Gravatar = {
    imageUrl: function (email, opts) {
      opts = opts || {};
      var hash = md5(
        String(email || "")
          .trim()
          .toLowerCase(),
      );
      var url =
        "https://secure.gravatar.com/avatar/" +
        hash +
        "?size=" +
        (opts.size || 50);
      if (opts.default) url += "&default=" + encodeURIComponent(opts.default);
      return url;
    },
  };

  // Images.link() shim — returns a relative path under data/images/
  // The Store collection is loaded by store.js; we patch each doc with .link() after Store loads.
  Store.onReady(function () {
    if (global.Images) {
      global.Images.find({}).forEach(function (img) {
        img.link = function () {
          return "data/images/" + img._id + "." + (img.extension || "jpg");
        };
      });
      // Patch findOne to always return a doc with .link()
      var _orig = global.Images.findOne.bind(global.Images);
      global.Images.findOne = function (sel, opts) {
        var doc = _orig(sel, opts);
        if (doc && !doc.link) {
          doc.link = function () {
            return "data/images/" + doc._id + "." + (doc.extension || "jpg");
          };
        }
        return doc;
      };
    }
  });

  // ---------------------------------------------------------------------------
  // i18n
  // ---------------------------------------------------------------------------
  var I18N = {};
  function t(key) {
    if (key == null) return "";
    return Object.prototype.hasOwnProperty.call(I18N, key) ? I18N[key] : key;
  }
  global.TAPi18n = {
    __: function (key) {
      return t(key);
    },
    getLanguage: function () {
      return "pt-BR";
    },
    setLanguage: function () {},
  };

  // T9n stub (softwarerero:accounts-t9n field labels used in DataTables column headers)
  var T9N_PT = {
    name: "Nome",
    code: "Código",
    description: "Descrição",
    email: "Email",
    dateOfBirth: "Nasc.",
    phone: "Telefone",
    gender: "Sexo",
    address: "Endereço",
    cpf: "CPF",
    enabled: "Ativo",
    disabled: "Inativo",
    groupMD: "Médico(a)",
    patient: "Paciente",
    start: "Início",
    end: "Fim",
    time: "Tempo",
    status: "Situação",
    records: "Prontuário",
    city: "Cidade",
  };
  global.T9n = {
    get: function (key) {
      return T9N_PT[key] || key;
    },
  };

  // Meteor.users shim — wraps the Users store collection
  Meteor.users = {
    find: function (sel, opts) {
      return Users.find(sel, opts);
    },
    findOne: function (sel, opts) {
      return Users.findOne(sel, opts);
    },
    insert: function (doc) {
      return Users.insert(doc);
    },
    update: function (sel, modifier) {
      return Users.update(sel, modifier);
    },
    remove: function (sel) {
      return Users.remove(sel);
    },
  };

  // ---------------------------------------------------------------------------
  // Routing (hash-based so it works as static files on a CDN)
  // ---------------------------------------------------------------------------
  var routePaths = {
    dashboard: "dashboard",
    schedule: "schedule",
    patientCreate: "patients/create",
    patientList: "patients",
    patientEdit: "patients",
    doctorList: "doctors",
    icd10List: "icd10",
    drugList: "drugs",
    reportAppointments: "reports/appointments",
    reportPatients: "reports/patients",
    reportProduction: "reports/production",
    settingsForm: "settings",
    specialtyList: "specialties",
    examCatalogList: "exam-catalog",
    documentModelList: "document-models",
    formModelsList: "form-models",
    users: "users",
    import: "import",
    logout: "logout",
  };
  function pathFor(route, hash) {
    hash = hash || {};
    var base = "#/" + (routePaths[route] || route || "");
    if (hash._id) base += "/" + hash._id;
    return base;
  }
  function currentPath() {
    return (global.location.hash || "#/dashboard").replace(/^#\/?/, "");
  }

  // ---------------------------------------------------------------------------
  // Handlebars helpers
  // ---------------------------------------------------------------------------
  var H = global.Handlebars;
  H.registerHelper("_", function (key) {
    return t(key);
  });
  H.registerHelper("isInRole", function (csv) {
    return Roles.userIsInRole(currentUser._id, csv);
  });
  H.registerHelper("pathFor", function (a, b) {
    // {{pathFor 'logout'}} (positional) or {{pathFor route='x' _id=y}} (hash)
    var opts = b === undefined ? a : b;
    var hash = (opts && opts.hash) || {};
    var route = typeof a === "string" ? a : hash.route;
    return pathFor(route, hash);
  });
  H.registerHelper("isActivePath", function (opts) {
    var hash = (opts && opts.hash) || {};
    var cls = hash.className || "active";
    try {
      return new RegExp(hash.regex || "").test(currentPath()) ? cls : "";
    } catch (e) {
      return "";
    }
  });
  H.registerHelper("eventsCount", function (events) {
    return (events && events.length) || 0;
  });
  H.registerHelper("langActive", function (lang) {
    return TAPi18n.getLanguage() === lang ? "active" : "";
  });

  // ---------------------------------------------------------------------------
  // Spacebars -> Handlebars: wrap helper-with-args used as an {{#if}} condition
  //   {{#if isInRole 'x'}}  ->  {{#if (isInRole 'x')}}
  // Bare paths ({{#if currentUser}}, {{#if isReady}}) are left untouched.
  // ---------------------------------------------------------------------------
  var IF_HELPERS = ["isInRole", "isActivePath", "eq"];
  function preprocess(src) {
    return src.replace(
      /\{\{#if\s+([a-zA-Z_]\w*)\s+([^})]+?)\}\}/g,
      function (m, name, args) {
        return IF_HELPERS.indexOf(name) >= 0
          ? "{{#if (" + name + " " + args + ")}}"
          : m;
      },
    );
  }

  // ---------------------------------------------------------------------------
  // Render harness
  // ---------------------------------------------------------------------------
  var FRAME_PARTIALS = {
    navigation: "templates/navigation.hbs",
    topNavbar: "templates/topNavbar.hbs",
    footer: "templates/footer.hbs",
    loading: "templates/loading.hbs",
    pageHeading: "templates/pageHeading.hbs",
  };

  function fetchText(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error(url + " -> " + r.status);
      return r.text();
    });
  }

  function init() {
    var names = Object.keys(FRAME_PARTIALS);
    Promise.all(
      [fetchText("data/i18n/pt-BR.json")].concat(
        names.map(function (n) {
          return fetchText(FRAME_PARTIALS[n]);
        }),
      ),
    )
      .then(function (res) {
        I18N = JSON.parse(res[0]);
        names.forEach(function (n, i) {
          H.registerPartial(n, preprocess(res[i + 1]));
        });

        var layoutSrc = document.getElementById("tpl-mainLayout").innerHTML;
        var tpl = H.compile(preprocess(layoutSrc));
        var ctx = { currentUser: currentUser, isReady: true, events: [] };
        document.getElementById("app").innerHTML = tpl(ctx);
        onFrameRendered();
        // Now that #page-content exists in the DOM, boot the router.
        if (global.Router && global.Router.boot) global.Router.boot();
      })
      .catch(function (err) {
        console.error("[rip] init failed:", err);
        document.getElementById("app").innerHTML =
          "<div style='padding:40px;color:#a00;font-family:monospace'>rip init error: " +
          Handlebars.escapeExpression(err.message) +
          "</div>";
      });
  }

  function onFrameRendered() {
    var email = currentUser.emails[0].address;
    $("#mini-profile-img").attr(
      "src",
      Gravatar.imageUrl(email, {
        secure: true,
        size: 50,
        default:
          "https://cdn4.iconfinder.com/data/icons/medical-14/512/9-128.png",
      }),
    );
    if ($.fn.metisMenu) $("#side-menu").metisMenu();

    // Responsive: mirrors main.js Template.mainLayout.rendered resize handler
    function checkBodySmall() {
      if ($(window).width() < 769) {
        $("body").addClass("body-small");
      } else {
        $("body").removeClass("body-small");
      }
    }
    $(window).off("resize.ripSmall").on("resize.ripSmall", checkBodySmall);
    checkBodySmall();

    // Phone: fixed top-navbar (mirrors top-navbar.js rendered)
    if (Meteor.Device.isPhone()) {
      $("body").addClass("fixed-nav");
      $(".navbar-static-top")
        .removeClass("navbar-static-top")
        .addClass("navbar-fixed-top");
    }

    // #navbar-minimalize: full smooth show/hide logic (mirrors top-navbar.js events)
    $(document)
      .off("click.ripMin")
      .on("click.ripMin", "#navbar-minimalize", function (e) {
        e.preventDefault();
        $("body").toggleClass("mini-navbar");
        if (
          !$("body").hasClass("mini-navbar") ||
          $("body").hasClass("body-small")
        ) {
          $("#side-menu").hide();
          setTimeout(function () {
            $("#side-menu").fadeIn(400);
          }, 200);
        } else if ($("body").hasClass("fixed-sidebar")) {
          $("#side-menu").hide();
          setTimeout(function () {
            $("#side-menu").fadeIn(400);
          }, 100);
        } else {
          $("#side-menu").removeAttr("style");
        }
      });

    // .hide-on-phone: close sidebar after nav click on phone (mirrors navigation.js events)
    $(document)
      .off("click.ripPhone")
      .on("click.ripPhone", ".hide-on-phone", function () {
        if (Meteor.Device.isPhone()) {
          $("body").toggleClass("mini-navbar");
          $("#side-menu").hide();
          setTimeout(function () {
            $("#side-menu").fadeIn(400);
          }, 200);
        }
      });

    console.log("[rip] frame rendered for", currentUser.profile.firstName);
    global.preprocess = preprocess;
  }

  // ---------------------------------------------------------------------------
  // Per-page context builder (called by router.js before rendering a content tpl)
  // ---------------------------------------------------------------------------
  global._buildContext = function (routeName, params, query) {
    return {
      currentUser: currentUser,
      params: params,
      query: query,
    };
  };

  // ---------------------------------------------------------------------------
  // Shared namespace (Shim) — page registry + primitives exposed to the split
  // shim-util.js and shim-<domain>.js files (which run as their own IIFEs).
  // ---------------------------------------------------------------------------
  var Shim = (global.Shim = global.Shim || {});
  Shim.pages = {};
  Shim.t = t;
  Shim.currentUser = currentUser;
  Shim.pages.logout = function () {
    doLogout();
  };

  // Post-render dispatch (called by router.js). Each domain file registers its
  // init into Shim.pages; this replaces the old hard-coded if-chain.
  global._afterRender = function (routeName, params, query) {
    params = params || {};
    query = query || {};
    var fn = Shim.pages[routeName];
    if (fn) fn(params, query);
  };

  // ---------------------------------------------------------------------------
  // Login splash — fake auth (accepts hardcoded credentials or any input in demo)
  // ---------------------------------------------------------------------------
  var DEMO_EMAIL = "leo.lima.web@gmail.com";
  var DEMO_PASS = "123456";

  function doLogout() {
    // Show "Saindo…" for 2 s before transitioning back to the login splash
    setTimeout(function () {
      var app = document.getElementById("app");
      var splash = document.getElementById("login-splash");
      if (app) {
        app.style.transition = "opacity 0.3s";
        app.style.opacity = "0";
        setTimeout(function () {
          app.style.display = "none";
          app.style.opacity = "";
          app.innerHTML = "";
        }, 320);
      }
      if (splash) {
        splash.style.transition = "";
        splash.style.opacity = "";
        splash.style.display = "";
      }
      // var $pw = document.getElementById("login-password");
      // if ($pw) $pw.value = "";
      var $alert = document.getElementById("login-alert");
      if ($alert) $alert.style.display = "none";
      history.replaceState(null, "", location.pathname + location.search);
    }, 2000);
  }

  function doLogin() {
    var email = (document.getElementById("login-email") || {}).value || "";
    var pass = (document.getElementById("login-password") || {}).value || "";
    var valid = email === DEMO_EMAIL && pass === DEMO_PASS;
    if (!valid) {
      var $alert = document.getElementById("login-alert");
      if ($alert) $alert.style.display = "";
      return;
    }
    // Hide splash, show app, boot
    var splash = document.getElementById("login-splash");
    var app = document.getElementById("app");
    if (splash) {
      splash.style.transition = "opacity 0.3s";
      splash.style.opacity = "0";
      setTimeout(function () {
        splash.style.display = "none";
      }, 320);
    }
    if (app) app.style.display = "";
    init();
  }

  function bootLoginSplash() {
    var $btn = document.getElementById("login-btn");
    var $form = document.getElementById("at-pwd-form");
    if ($btn) $btn.addEventListener("click", doLogin);
    if ($form)
      $form.addEventListener("submit", function (e) {
        e.preventDefault();
        doLogin();
      });
  }

  if (document.readyState !== "loading") bootLoginSplash();
  else document.addEventListener("DOMContentLoaded", bootLoginSplash);
})(window);
