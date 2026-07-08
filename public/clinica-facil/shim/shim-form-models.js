/*
 * rip/ shim — form models — list + formBuilder form
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

  function initFormModelsList() {
    $("#btn-new-formmodel")
      .off("click.ripNew")
      .on("click.ripNew", function () {
        FlowRouter.go("formModelsCreate");
      });
    initDT(
      "form-models-table",
      FormModels.find({}, { sort: { name: 1 } }).fetch(),
      [
        { title: t("form-models_name"), data: "name" },
        {
          title: t("form-models_description"),
          data: "description",
          defaultContent: "",
        },
        {
          data: "_id",
          orderable: false,
          render: function (id) {
            return (
              '<a class="btn btn-info btn-xs" href="#/form-models/' +
              id +
              '">' +
              '<i class="fa fa-pencil"></i></a>'
            );
          },
        },
      ],
      function (row) {
        FlowRouter.go("formModelsEdit", { _id: row._id });
      },
    );
  }

  // ---------------------------------------------------------------------------
  // Form models form (formBuilder drag-drop builder)
  // ---------------------------------------------------------------------------
  function initFormModelsForm(id) {
    var fm = id ? FormModels.findOne({ _id: id }) : null;

    if (fm) {
      $("#fm-name").val(fm.name || "");
      $("#fm-description").val(fm.description || "");
    }

    var fbOptions = {
      dataType: "json",
      roles: false,
      sortableControls: true,
      stickyControls: false,
      disableFields: ["autocomplete", "button", "file", "date"],
      controlOrder: ["text", "textarea", "number", "select"],
    };
    if (fm && fm.model) {
      fbOptions.formData = JSON.stringify(fm.model);
    }

    if (!$.fn.formBuilder) return;
    var formBuilder = $("#record-builder")
      .formBuilder(fbOptions)
      .data("formBuilder");

    // Prevent native HTML5 drag interfering with jQuery UI sortable
    $("#record-builder").on("dragstart", function (e) {
      e.preventDefault();
    });

    // Preview tab
    $(".record-builder-tabs a[data-toggle='tab']").on(
      "shown.bs.tab",
      function () {
        if (formBuilder) {
          try {
            $("#record-render").formRender({
              dataType: "json",
              formData: formBuilder.formData,
            });
          } catch (err) {}
        }
      },
    );

    // Inject extra buttons into formBuilder toolbar
    setTimeout(function () {
      var $save = $("#record-builder .form-builder-save");
      if (!$save.length) return;
      $save.prepend('<i class="fa fa-floppy-o"></i>&nbsp;');
      $save.before(
        '<button class="btn btn-default fm-cancel-btn" type="button" style="margin-right:6px">' +
          '<i class="fa fa-ban"></i> ' +
          t("common_cancel") +
          "</button>",
      );
      if (fm) {
        $save.before(
          '<button class="btn btn-danger fm-delete-btn" type="button" style="margin-right:6px">' +
            '<i class="fa fa-trash"></i></button>',
        );
      }
      $(".fm-cancel-btn")
        .off("click.rip")
        .on("click.rip", function () {
          FlowRouter.go("formModelsList");
        });
      $(".fm-delete-btn")
        .off("click.rip")
        .on("click.rip", function () {
          swal(
            {
              title: t("common_areYouSure"),
              text: fm ? fm.name : "",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#ed5565",
              confirmButtonText: t("common_confirm"),
            },
            function () {
              FormModels.remove(fm._id);
              toastr.success(t("common_deleteSuccess"), t("common_success"));
              FlowRouter.go("formModelsList");
            },
          );
        });
      $save.off("click.rip").on("click.rip", function (e) {
        e.preventDefault();
        var name = $("#fm-name").val().trim();
        if (!name) {
          toastr.error(t("common_field-required"), t("common_error"));
          return;
        }
        var data = {
          name: name,
          description: $("#fm-description").val(),
          model: formBuilder.actions.getData(),
        };
        if (fm) {
          FormModels.update(fm._id, { $set: data });
        } else {
          FormModels.insert(data);
        }
        toastr.success(t("common_save-success"), t("common_success"));
        FlowRouter.go("formModelsList");
      });
    }, 500);
  }


  S.pages.formModelsList = function () {
    initFormModelsList();
  };
  S.pages.formModelsCreate = function () {
    initFormModelsForm(null);
  };
  S.pages.formModelsEdit = function (p) {
    initFormModelsForm(p && p.id);
  };
})(window);
