/*
 * rip/ shim — document models — list + form
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

  function initDocumentModelList() {
    $("#btn-new-docmodel")
      .off("click.ripNew")
      .on("click.ripNew", function () {
        FlowRouter.go("documentModelCreate");
      });
    var typeMeta = {
      prescription: { cls: "info", label: t("common_prescription") },
      medical_certificate: { cls: "warning", label: t("common_medical-certificate") },
      exam_request: { cls: "danger", label: t("common_exam-request") },
      "prescriptions-anvisa": { cls: "anvisa", label: t("common_prescriptions-anvisa") },
    };
    initDT(
      "document-models-table",
      DocumentModels.find({}, { sort: { name: 1 } }).fetch(),
      [
        {
          title: t("document-models_name"),
          data: "name",
          render: function (d) {
            return d ? escH(d) : "";
          },
        },
        {
          title: t("document-models_description"),
          data: "description",
          render: function (d) {
            return d ? escH(d) : "";
          },
        },
        {
          title: t("document-models_type"),
          data: "type",
          render: function (d) {
            var meta = typeMeta[d];
            if (!meta) return "";
            return '<span class="label label-' + meta.cls + '">' + meta.label + "</span>";
          },
        },
        {
          data: "_id",
          orderable: false,
          render: function (id) {
            return (
              '<a class="btn btn-info btn-xs" href="#/document-models/' +
              id +
              '">' +
              '<i class="fa fa-pencil"></i></a>'
            );
          },
        },
      ],
      function (row) {
        FlowRouter.go("documentModelEdit", { _id: row._id });
      },
    );
  }

  // ---------------------------------------------------------------------------
  // Document model form (Summernote for model HTML)
  // ---------------------------------------------------------------------------
  function initDocumentModelForm(id) {
    var dm = id ? DocumentModels.findOne({ _id: id }) : null;
    var $model = $("#dm-model");

    if (dm) {
      $("#dm-name").val(dm.name || "");
      if (dm.type) $("#dm-type").val(dm.type);
      $("#dm-description").val(dm.description || "");
    }

    if ($.fn.chosen)
      $("#dm-type").chosen({ width: "100%", disable_search_threshold: 3 });

    if ($.fn.summernote) {
      var dmDrugsArray = Drugs.find().fetch().map(function (d) { return d.name; });
      var dmDiseasesArray = ICD10.find().fetch()
        .filter(function (d) { return d.code && d.display; })
        .map(function (d) { return d.code + " - " + d.display; });
      var dmHashtagWords = [
        "NOME_DO_PACIENTE", "CPF_PACIENTE", "RG_PACIENTE", "ENDERECO_PACIENTE",
        "DATA_NASCIMENTO_PACIENTE", "SEXO_PACIENTE", "TELEFONE_PACIENTE",
        "DATA_DA_CONSULTA", "DIA", "MES", "ANO", "HORARIO_DA_CONSULTA",
        "NOME_PROFISSIONAL", "CRM_PROFISSIONAL", "ASSINATURA_PROFISSIONAL",
        "ENDERECO_CLINICA",
      ];

      $model.summernote({
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
        hint: [
          {
            words: dmDrugsArray,
            match: /\B\$(\w*)$/,
            search: function (keyword, callback) {
              callback($.map(this.words, function (item) {
                return item.toUpperCase().indexOf(keyword.toUpperCase()) >= 0 ? item : null;
              }));
            },
            index: 1,
            replace: function (item) { return item.toUpperCase() + " "; },
          },
          {
            words: dmDiseasesArray,
            match: /\B@(\w{3,})$/,
            search: function (keyword, callback) {
              callback($.map(this.words, function (item) {
                return item.toUpperCase().indexOf(keyword.toUpperCase()) >= 0 ? item : null;
              }));
            },
            index: 2,
            replace: function (item) { return item.toUpperCase() + " "; },
          },
          {
            words: dmHashtagWords,
            match: /\B#(\w*)$/,
            search: function (keyword, callback) {
              callback($.grep(this.words, function (item) {
                return item.toUpperCase().indexOf(keyword.toUpperCase()) >= 0 ? item : null;
              }));
            },
            template: function (item) { return item; },
            content: function (item) { return "#" + item; },
            replace: function (item) { return item.toUpperCase() + " "; },
          },
        ],
      });
      if (dm && dm.model) $model.summernote("code", dm.model);
    }

    $("#btn-new-document-model")
      .off("click.rip")
      .on("click.rip", function () {
        FlowRouter.go("documentModelCreate");
      });
    $("#dm-cancel-btn")
      .off("click.rip")
      .on("click.rip", function () {
        if ($.fn.summernote) $model.summernote("destroy");
        FlowRouter.go("documentModelList");
      });

    if (dm) {
      $("#dm-delete-btn")
        .show()
        .off("click.rip")
        .on("click.rip", function () {
          swal(
            {
              title: t("common_areYouSure"),
              text: dm.name,
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#ed5565",
              confirmButtonText: t("common_confirm"),
            },
            function () {
              if ($.fn.summernote) $model.summernote("destroy");
              DocumentModels.remove(dm._id);
              toastr.success(t("common_deleteSuccess"), t("common_success"));
              FlowRouter.go("documentModelList");
            },
          );
        });
    }

    $("#dm-save-btn")
      .off("click.rip")
      .on("click.rip", function () {
        var name = $("#dm-name").val().trim();
        var type = $("#dm-type").val();
        var description = $("#dm-description").val().trim();
        var modelHtml = $.fn.summernote
          ? $model.summernote("code")
          : $model.val();
        if (!name || !type || !description || !modelHtml) {
          toastr.error(t("common_field-required"), t("common_error"));
          return;
        }
        var doc = {
          name: name,
          type: type,
          description: description,
          model: modelHtml,
        };
        if (dm) {
          DocumentModels.update(dm._id, { $set: doc });
        } else {
          DocumentModels.insert(doc);
        }
        if ($.fn.summernote) $model.summernote("destroy");
        toastr.success(t("common_save-success"), t("common_success"));
        FlowRouter.go("documentModelList");
      });
  }


  S.pages.documentModelList = function () {
    initDocumentModelList();
  };
  S.pages.documentModelCreate = function () {
    initDocumentModelForm(null);
  };
  S.pages.documentModelEdit = function (p) {
    initDocumentModelForm(p && p.id);
  };
})(window);
