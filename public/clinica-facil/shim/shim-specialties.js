/*
 * rip/ shim — specialties — list + form
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

  function initSpecialtyList() {
    $("#btn-new-specialty")
      .off("click.ripNew")
      .on("click.ripNew", function () {
        FlowRouter.go("specialtyCreate");
      });
    initDT(
      "specialties-table",
      Specialties.find().fetch(),
      [
        { title: T9n.get("name"), data: "name" },
        {
          data: "_id",
          orderable: false,
          render: function (id) {
            return (
              '<a class="btn btn-info" href="' +
              FlowRouter.path("specialtyEdit", { _id: id }) +
              '">' +
              '<i class="fa fa-pencil"></i></a>'
            );
          },
        },
      ],
      function (row) {
        FlowRouter.go("specialtyEdit", { _id: row._id });
      },
    );
  }

  // ---------------------------------------------------------------------------
  // Specialty form — create (id=null) and edit (id=string)
  // ---------------------------------------------------------------------------
  function initSpecialtyForm(id) {
    var specialty = id ? Specialties.findOne({ _id: id }) : null;
    $("#btn-new-specialty")
      .off("click.rip")
      .on("click.rip", function () {
        FlowRouter.go("specialtyCreate");
      });
    if (specialty) {
      $("#specialty-name").val(specialty.name);
      $("#specialty-delete-btn")
        .show()
        .off("click.rip")
        .on("click.rip", function () {
          swal(
            {
              title: t("common_areYouSure"),
              text: specialty.name,
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#ed5565",
              confirmButtonText: t("common_confirm"),
            },
            function () {
              Specialties.remove(specialty._id);
              toastr.success(t("common_deleteSuccess"), t("common_success"));
              FlowRouter.go("specialtyList");
            },
          );
        });
    }
    $("#specialtyForm")
      .off("submit.rip")
      .on("submit.rip", function (e) {
        e.preventDefault();
        var name = $("#specialty-name").val().trim();
        if (!name) {
          $("#fg-name").addClass("has-error");
          return;
        }
        $("#fg-name").removeClass("has-error");
        if (specialty) {
          Specialties.update(specialty._id, { $set: { name: name } });
        } else {
          Specialties.insert({ name: name });
        }
        toastr.success(t("common_save-success"), t("common_success"));
        FlowRouter.go("specialtyList");
      });
  }


  S.pages.specialtyList = function () {
    initSpecialtyList();
  };
  S.pages.specialtyCreate = function () {
    initSpecialtyForm(null);
  };
  S.pages.specialtyEdit = function (p) {
    initSpecialtyForm(p && p.id);
  };
})(window);
