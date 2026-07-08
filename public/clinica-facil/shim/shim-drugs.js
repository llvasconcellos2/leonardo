/*
 * rip/ shim — drugs — list + form
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

  function initDrugList() {
    $("#btn-new-drug")
      .off("click.ripNew")
      .on("click.ripNew", function () {
        FlowRouter.go("drugCreate");
      });
    initDT(
      "drugs-table",
      Drugs.find().fetch(),
      [
        { title: T9n.get("name"), data: "name" },
        { title: "Busca", data: "search", defaultContent: "" },
        {
          data: "_id",
          orderable: false,
          render: function (id) {
            return (
              '<a class="btn btn-info" href="#/drugs/' +
              id +
              '">' +
              '<i class="fa fa-pencil"></i></a>'
            );
          },
        },
      ],
      function (row) {
        FlowRouter.go("drugEdit", { _id: row._id });
      },
    );
  }

  // ---------------------------------------------------------------------------
  // Drug form (Summernote for html field)
  // ---------------------------------------------------------------------------
  function initDrugForm(id) {
    var drug = id ? Drugs.findOne({ _id: id }) : null;
    var $html = $("textarea[name=html]");

    if (drug) {
      $("#drug-name").val(drug.name || "");
      $("[name=commercial_name]").val(drug.commercial_name || "");
      $("[name=generic_name]").val(drug.generic_name || "");
      $("[name=popular_pharmacy_name]").val(drug.popular_pharmacy_name || "");
      $("[name=search]").val(drug.search || "");
      $(
        "[name=special_prescription][value=" +
          (drug.special_prescription ? "true" : "false") +
          "]",
      ).prop("checked", true);
    }

    if ($.fn.summernote) {
      $html.summernote({
        height: 300,
        lang: "pt-BR",
        print: {
          stylesheetUrl: "vendor/summernote-print.css",
        },
        fontSizes: [
          "4",
          "6",
          "8",
          "9",
          "10",
          "11",
          "12",
          "14",
          "16",
          "18",
          "20",
          "24",
          "36",
        ],
        lineHeights: ["0.4", "0.6", "0.8", "1.0", "1.2", "1.4", "1.5", "1.6", "1.8", "2.0", "3.0"],
        toolbar: [
          ["history", ["undo", "redo"]],
          ["style", ["style", "bold", "italic", "underline", "clear"]],
          ["font", ["strikethrough", "superscript", "subscript"]],
          ["fontsize", ["fontsize"]],
          ["para", ["ul", "ol", "paragraph"]],
          ["height", ["height"]],
          ["insert", ["hr", "table"]],
          ["misc", ["fullscreen", "codeview", "print"]],
        ],
      });
      if (drug && drug.html) $html.summernote("code", drug.html);
    }

    $("#btn-new-drug")
      .off("click.rip")
      .on("click.rip", function () {
        FlowRouter.go("drugCreate");
      });

    if (drug) {
      $("#drug-delete-btn")
        .show()
        .off("click.rip")
        .on("click.rip", function () {
          swal(
            {
              title: t("common_areYouSure"),
              text: drug.name,
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#ed5565",
              confirmButtonText: t("common_confirm"),
            },
            function () {
              if ($.fn.summernote) $html.summernote("destroy");
              Drugs.remove(drug._id);
              toastr.success(t("common_deleteSuccess"), t("common_success"));
              FlowRouter.go("drugList");
            },
          );
        });
    }

    $("#drugForm")
      .off("submit.rip")
      .on("submit.rip", function (e) {
        e.preventDefault();
        var name = $("#drug-name").val().trim();
        if (!name) return;
        var doc = {
          name: name,
          commercial_name: $("[name=commercial_name]").val(),
          generic_name: $("[name=generic_name]").val(),
          popular_pharmacy_name: $("[name=popular_pharmacy_name]").val(),
          search: $("[name=search]").val(),
          special_prescription:
            $("[name=special_prescription]:checked").val() === "true",
          html: $.fn.summernote ? $html.summernote("code") : $html.val(),
        };
        if (drug) {
          Drugs.update(drug._id, { $set: doc });
        } else {
          Drugs.insert(doc);
        }
        if ($.fn.summernote) $html.summernote("destroy");
        toastr.success(t("common_save-success"), t("common_success"));
        FlowRouter.go("drugList");
      });
  }


  S.pages.drugList = function () {
    initDrugList();
  };
  S.pages.drugCreate = function () {
    initDrugForm(null);
  };
  S.pages.drugEdit = function (p) {
    initDrugForm(p && p.id);
  };
})(window);
