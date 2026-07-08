/*
 * rip/ shim — shared helpers (formatting, badges, DataTables, dates, colors)
 * Split out of the former monolithic shim.js. Depends on shim-core.js
 * (global.Shim namespace) and shim-util.js (shared helpers), which load first.
 */
(function (global) {
  "use strict";
  var S = global.Shim;
  var t = S.t;

  function dashFormatBRL(n) {
    var s = (Number(n) || 0).toFixed(2).split(".");
    return "R$ " + s[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "," + s[1];
  }

  function scheduleStatusBadge(status) {
    var map = {
      "to-confirm": {
        icon: "fa-hourglass-o",
        cls: "danger",
        key: "schedule_status-to-confirm",
      },
      waiting: {
        icon: "fa-calendar-check-o",
        cls: "warning",
        key: "schedule_status-waiting",
      },
      scheduled: {
        icon: "fa-clock-o",
        cls: "info",
        key: "schedule_status-scheduled",
      },
      attending: {
        icon: "fa-handshake-o",
        cls: "primary",
        key: "schedule_status-attending",
      },
      "no-show": {
        icon: "fa-user-times",
        cls: "default",
        key: "schedule_status-no-show",
      },
      finished: {
        icon: "fa-check-circle",
        cls: "success",
        key: "schedule_status-finished",
      },
    };
    var s = map[status];
    if (!s) return "";
    return (
      '<span class="label label-' +
      s.cls +
      ' hollow"><i class="fa ' +
      s.icon +
      '"></i> ' +
      t(s.key) +
      "</span>"
    );
  }

  // Appointment (Appointments collection) status badge — distinct from
  // scheduleStatusBadge, which covers the Schedule collection's own statuses.
  function apptStatusBadge(status) {
    var map = {
      "re-scheduled": { cls: "warning", key: "patient_appt-status-re-scheduled" },
      in_progress: { cls: "info", key: "patient_appt-status-in_progress" },
      completed: { cls: "primary", key: "patient_appt-status-completed" },
      no_show: { cls: "danger", key: "patient_appt-status-no_show" },
    };
    var s = map[status];
    if (!s) return "";
    return '<span class="label label-' + s.cls + '">' + t(s.key) + "</span>";
  }
  function escH(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  var DT_LANG_URL = "data/datatables-pt-BR.json";
  var _dtLang = null;
  function getDtLang(cb) {
    if (_dtLang) {
      cb(_dtLang);
      return;
    }
    fetch(DT_LANG_URL)
      .then(function (r) {
        return r.json();
      })
      .then(function (lang) {
        _dtLang = lang;
        cb(lang);
      })
      .catch(function () {
        cb({});
      });
  }
  // ---------------------------------------------------------------------------
  // Generic DataTable factory (shared by drug/icd10/specialty/doctor lists)
  // ---------------------------------------------------------------------------
  function initDT(tableId, data, columns, onRowClick) {
    getDtLang(function (lang) {
      var $table = $("#" + tableId);
      if (!$table.length) return;
      if ($.fn.DataTable.isDataTable($table[0])) {
        $table.DataTable().destroy();
        $table.empty();
      }
      var dt = $table.DataTable({
        data: data,
        columns: columns,
        language: lang,
        searchHighlight: true,
        autoWidth: false,
        pageLength: 20,
        lengthMenu: [10, 20, 50, 100],
        dom: '<"html5buttons"B>lTfgitp',
        buttons: [
          { extend: "copy", text: '<i class="fa fa-files-o"></i>' },
          { extend: "csv", text: '<i class="fa fa-file-excel-o"></i>' },
          {
            extend: "print",
            text: '<i class="fa fa-print"></i>',
            customize: function (win) {
              $(win.document.body)
                .addClass("white-bg")
                .css("font-size", "10px");
              $(win.document.body)
                .find("table")
                .addClass("compact")
                .css("font-size", "inherit");
            },
          },
        ],
        infoCallback: function (s, start, end, max, total) {
          var str = (lang.sInfo || "")
            .replace("_START_", start)
            .replace("_END_", end)
            .replace("_TOTAL_", total);
          $("#table-footer").html(str);
        },
      });
      if (onRowClick) {
        $table.off("click.dtRow").on("click.dtRow", "tbody tr", function () {
          var row = dt.row(this).data();
          if (row) onRowClick(row);
        });
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Date pickers — mirror the Meteor patient_form wiring (bootstrap-datepicker,
  // dd/mm/yyyy, pt-BR). The Meteor app binds the picker to the <input> (not the
  // .input-group), so the calendar addon isn't treated as a component trigger —
  // it forwards addon clicks to the input's datepicker('show'). We reproduce
  // both here. Matches: inputs inside .input-group.date and any .js-datepicker.
  // ---------------------------------------------------------------------------
  function initDatepickers($scope) {
    $scope = $scope && $scope.length ? $scope : $(document);
    $scope
      .find(".input-group.date > input, input.js-datepicker")
      .each(function () {
        var $input = $(this);
        if ($input.data("datepicker")) return; // already initialized
        $input.datepicker({
          format: "dd/mm/yyyy",
          language: "pt-BR",
          autoclose: true,
          todayHighlight: true,
        });
        // Mirror the Meteor patient_form: mask the date as dd/mm/yyyy so the
        // slashes are auto-inserted, and request the numeric keyboard on mobile
        // (submit reads the input text, so the mask + datepicker coexist fine).
        $input.mask("00/00/0000").attr("inputmode", "numeric");
      });
    $scope
      .find(".input-group.date")
      .off("click.ripDp")
      .on("click.ripDp", ".input-group-addon", function () {
        $(this).siblings("input").datepicker("show");
      });
  }

  // ---------------------------------------------------------------------------
  // randomMC — text-seeded color (no murmur dep; consistent per unique string)
  // ---------------------------------------------------------------------------
  global.randomMC = (function () {
    var PALETTE = [
      "#1c84c6",
      "#1ab394",
      "#23c6c8",
      "#f8ac59",
      "#9b59b6",
      "#e67e22",
      "#27ae60",
      "#e74c3c",
      "#3498db",
      "#f39c12",
    ];
    function simpleHash(s) {
      var h = 0;
      for (var i = 0; i < s.length; i++) {
        h = (h << 5) - h + s.charCodeAt(i);
        h |= 0;
      }
      return Math.abs(h);
    }
    return {
      getColor: function (opts) {
        if (opts && opts.text)
          return PALETTE[simpleHash(String(opts.text)) % PALETTE.length];
        return PALETTE[Math.floor(Math.random() * PALETTE.length)];
      },
    };
  })();

  // AutoForm stub (used only to set hooks; no autoform in static build)
  global.AutoForm = { addHooks: function () {}, resetForm: function () {} };

  // expose to the per-domain shim-*.js files
  S.dashFormatBRL = dashFormatBRL;
  S.scheduleStatusBadge = scheduleStatusBadge;
  S.apptStatusBadge = apptStatusBadge;
  S.escH = escH;
  S.getDtLang = getDtLang;
  S.initDT = initDT;
  S.initDatepickers = initDatepickers;
})(window);
