/*
 * rip/ shim — exam catalog — list + form
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

  function initExamCatalogList() {
    $("#btn-new-exam")
      .off("click.ripNew")
      .on("click.ripNew", function () {
        FlowRouter.go("examCatalogCreate");
      });
    initDT(
      "exam-catalog-table",
      ExamCatalog.find({}, { sort: { name: 1 } }).fetch(),
      [
        { title: t("exam-catalog_name"), data: "name" },
        { title: t("exam-catalog_unit"), data: "unit", defaultContent: "" },
        {
          title: t("exam-catalog_usage-count"),
          data: "usageCount",
          defaultContent: "0",
        },
        {
          data: "_id",
          orderable: false,
          render: function (id) {
            return (
              '<a class="btn btn-info btn-xs" href="#/exam-catalog/' +
              id +
              '">' +
              '<i class="fa fa-pencil"></i></a>'
            );
          },
        },
      ],
      function (row) {
        FlowRouter.go("examCatalogEdit", { _id: row._id });
      },
    );
  }

  // ---------------------------------------------------------------------------
  // Exam catalog form
  // ---------------------------------------------------------------------------
  function initExamCatalogForm(id) {
    var ec = id ? ExamCatalog.findOne({ _id: id }) : null;
    var ruleCount = 0;

    function buildRuleRow(data) {
      var idx = ruleCount++;
      var tplEl = document.getElementById("rule-row-tpl");
      if (!tplEl) return $();
      var html = tplEl.innerHTML.replace(/__IDX__/g, idx);
      var $row = $(html);
      if (data) {
        $row.find("[name=gender]").val(data.gender || "todos");
        if (data.ageMin != null) $row.find("[name=ageMin]").val(data.ageMin);
        if (data.ageMax != null) $row.find("[name=ageMax]").val(data.ageMax);
        if (data.min != null) $row.find("[name=min]").val(data.min);
        if (data.max != null) $row.find("[name=max]").val(data.max);
        if (data.displayText)
          $row.find("[name=displayText]").val(data.displayText);
      }
      $row
        .find(".remove-rule-btn")
        .off("click")
        .on("click", function () {
          $row.remove();
        });
      return $row;
    }

    $("#btn-new-exam-catalog")
      .off("click.rip")
      .on("click.rip", function () {
        FlowRouter.go("examCatalogCreate");
      });
    $("#add-rule-btn")
      .off("click.rip")
      .on("click.rip", function () {
        $("#reference-rules-list").append(buildRuleRow(null));
      });

    if (ec) {
      $("#ec-name").val(ec.name);
      if (ec.unit) $("#ec-unit").val(ec.unit);
      (ec.referenceRules || []).forEach(function (rule) {
        $("#reference-rules-list").append(buildRuleRow(rule));
      });
      $("#ec-delete-btn")
        .show()
        .off("click.rip")
        .on("click.rip", function () {
          swal(
            {
              title: t("common_areYouSure"),
              text: ec.name,
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#ed5565",
              confirmButtonText: t("common_confirm"),
            },
            function () {
              ExamCatalog.remove(ec._id);
              toastr.success(t("common_deleteSuccess"), t("common_success"));
              FlowRouter.go("examCatalogList");
            },
          );
        });
    }

    $("#examCatalogForm")
      .off("submit.rip")
      .on("submit.rip", function (e) {
        e.preventDefault();
        var name = $("#ec-name").val().trim();
        if (!name) return;
        var rules = [];
        $("#reference-rules-list .rule-row").each(function () {
          var $r = $(this);
          var rule = { gender: $r.find("[name=gender]").val() || "todos" };
          var ageMin = parseFloat($r.find("[name=ageMin]").val());
          var ageMax = parseFloat($r.find("[name=ageMax]").val());
          var min = parseFloat($r.find("[name=min]").val());
          var max = parseFloat($r.find("[name=max]").val());
          var dt = $r.find("[name=displayText]").val();
          if (!isNaN(ageMin)) rule.ageMin = ageMin;
          if (!isNaN(ageMax)) rule.ageMax = ageMax;
          if (!isNaN(min)) rule.min = min;
          if (!isNaN(max)) rule.max = max;
          if (dt) rule.displayText = dt;
          rules.push(rule);
        });
        var doc = { name: name };
        if ($("#ec-unit").val()) doc.unit = $("#ec-unit").val();
        if (rules.length) doc.referenceRules = rules;
        if (ec) {
          ExamCatalog.update(ec._id, { $set: doc });
        } else {
          doc.usageCount = 0;
          doc.createdAt = new Date();
          ExamCatalog.insert(doc);
        }
        toastr.success(t("common_save-success"), t("common_success"));
        FlowRouter.go("examCatalogList");
      });
  }


  S.pages.examCatalogList = function () {
    initExamCatalogList();
  };
  S.pages.examCatalogCreate = function () {
    initExamCatalogForm(null);
  };
  S.pages.examCatalogEdit = function (p) {
    initExamCatalogForm(p && p.id);
  };
})(window);
