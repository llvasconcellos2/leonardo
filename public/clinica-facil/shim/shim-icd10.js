/*
 * rip/ shim — ICD-10 — list + inline form
 * Split out of the former monolithic shim.js. Depends on shim-core.js
 * (global.Shim namespace) and shim-util.js (shared helpers), which load first.
 */
(function (global) {
  "use strict";
  var S = global.Shim;
  var t = S.t,
    escH = S.escH,
    initDT = S.initDT,
    getDtLang = S.getDtLang,
    initDatepickers = S.initDatepickers,
    dashFormatBRL = S.dashFormatBRL,
    scheduleStatusBadge = S.scheduleStatusBadge,
    apptStatusBadge = S.apptStatusBadge,
    currentUser = S.currentUser;

  // Derive the app root from this shim script's own URL (same trick as data-source.js
  // and router.js) so cid-info.json resolves under any deployment sub-path.
  var BASE = (function () {
    var s = document.currentScript;
    if (!s) {
      var all = document.querySelectorAll("script[src]");
      s = all[all.length - 1];
    }
    return s ? s.src.replace(/\/shim\/[^/]+$/, "") : ".";
  })();

  var cidInfoLoaded = false;

  function loadCidInfo() {
    if (cidInfoLoaded) return;
    cidInfoLoaded = true;
    fetch(BASE + "/data/cid-info.json")
      .then(function (r) { return r.json(); })
      .then(function (info) {
        $("#icd10-info-title").text(info.title || "");
        $("#icd10-info-description").text(info.description || "");
        $("#icd10-info-publisher").text(info.publisher || "");
        $("#icd10-info-version").text(info.version || "");
        $("#icd10-info-date").text(info.date ? moment(info.date).format("DD/MM/YYYY") : "");
        $("#icd10-info-source").attr("href", info.url || "#").text(info.url || "");
        $("#icd10-info-panel").show();
      })
      .catch(function (e) { console.warn("[shim-icd10] failed to load cid-info.json", e); });
  }

  function initIcd10List() {
    loadCidInfo();

    initDT(
      "icd10-table",
      ICD10.find().fetch(),
      [
        {
          title: T9n.get("code"),
          data: "code",
          render: function (cellData) { return escH(cellData); },
        },
        {
          title: T9n.get("description"),
          data: "display",
          render: function (cellData) { return escH(cellData); },
        },
        {
          data: "_id",
          orderable: false,
          render: function (id) {
            return (
              '<button class="btn btn-info btn-xs icd10-edit-btn" data-icd10id="' +
              id +
              '">' +
              '<i class="glyphicon glyphicon-edit"></i></button>'
            );
          },
        },
      ],
      function (row) {
        loadIcd10Form(row._id);
      },
    );

    $(document)
      .off("click.ripIcd10")
      .on("click.ripIcd10", ".icd10-edit-btn", function () {
        loadIcd10Form($(this).data("icd10id"));
      });
    $("#new-icd10-btn")
      .off("click.ripIcd10")
      .on("click.ripIcd10", function () {
        loadIcd10Form(null);
      });
    $("#icd10-form-cancel").off("click.ripIcd10").on("click.ripIcd10", hideIcd10Form);
    $("#icd10-delete-btn")
      .off("click.ripIcd10")
      .on("click.ripIcd10", function () {
        var id = $("#icd10-form").attr("data-icd10id");
        if (!id) return;
        var record = ICD10.findOne({ _id: id });
        swal(
          {
            title: t("common_areYouSure"),
            text: record ? record.code + " - " + record.display : "",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ed5565",
            confirmButtonText: t("common_confirm"),
          },
          function () {
            ICD10.remove(id);
            toastr.success(t("common_deleteSuccess"), t("common_success"));
            hideIcd10Form();
            initIcd10List();
          },
        );
      });
    $("#icd10-form")
      .off("submit.ripIcd10")
      .on("submit.ripIcd10", function (e) {
        e.preventDefault();
        var form = this;
        var icd10Id = form.getAttribute("data-icd10id") || null;
        var codeValue = form.querySelector('[name="code"]').value.trim();
        var displayValue = form.querySelector('[name="display"]').value.trim();
        if (!codeValue || !displayValue) return;

        if (icd10Id) {
          ICD10.update(icd10Id, { $set: { code: codeValue, display: displayValue } });
        } else {
          ICD10.insert({ code: codeValue, display: displayValue });
        }

        toastr.success(t("common_save-success"), t("common_success"));
        hideIcd10Form();
        initIcd10List();
      });
  }

  function showIcd10Form() {
    var $tb = $("#tablebox"),
      $fb = $("#icd10-formbox");
    $tb.removeClass("col-sm-12").addClass("col-sm-8");
    $fb.removeClass("col-sm-0").addClass("col-sm-4");
  }

  function hideIcd10Form() {
    var $tb = $("#tablebox"),
      $fb = $("#icd10-formbox");
    $tb.removeClass("col-sm-8").addClass("col-sm-12");
    $fb.removeClass("col-sm-4").addClass("col-sm-0");
    var form = $("#icd10-form")[0];
    if (form) {
      form.reset();
      form.removeAttribute("data-icd10id");
    }
    $("#icd10-delete-btn").hide();
  }

  function loadIcd10Form(icd10Id) {
    showIcd10Form();
    var form = document.getElementById("icd10-form");
    if (!form) return;
    if (icd10Id) {
      var record = ICD10.findOne({ _id: icd10Id });
      if (!record) return;
      form.setAttribute("data-icd10id", icd10Id);
      form.querySelector('[name="code"]').value = record.code || "";
      form.querySelector('[name="display"]').value = record.display || "";
      $("#icd10-delete-btn").show();
    } else {
      form.reset();
      form.removeAttribute("data-icd10id");
      $("#icd10-delete-btn").hide();
    }
  }


  S.pages.icd10List = function () {
    initIcd10List();
  };
})(window);
