/*
 * rip/ shim — patients — list + create/edit form + start/stop appointment
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

  // ---------------------------------------------------------------------------
  // Patient list — DataTables init (per-template classification: jQuery-plugin region)
  // ---------------------------------------------------------------------------
  function initPatientList() {
    getDtLang(function (lang) {
      var defaultAvatar = "images/default-user-image.png";
      var columns = [
        {
          title: "",
          data: "picture",
          orderable: false,
          render: function (cellData, type, row) {
            var url = defaultAvatar;
            if (cellData) {
              var img = Images.findOne({ _id: cellData });
              if (img) url = img.link();
            } else if (row.email) {
              // Gravatar's `default` must be an absolute URL or a keyword; a
              // relative path resolves against Gravatar's CDN and 400s. Ask for
              // a 404 instead and fall back to the local avatar via onerror.
              url = Gravatar.imageUrl(row.email, {
                secure: true,
                size: 28,
                default: "404",
              });
            }
            return (
              '<img class="profile-pic" src="' +
              url +
              '" onerror="this.onerror=null;this.src=\'' +
              defaultAvatar +
              '\'">'
            );
          },
        },
        { title: T9n.get("name"), data: "name" },
        {
          title: '<i class="fa fa-envelope"></i> Email',
          data: "email",
          render: function (d) {
            return d || "";
          },
        },
        {
          title: T9n.get("dateOfBirth"),
          data: "dateOfBirth",
          render: function (d) {
            return d ? moment(d).format("DD/MM/YYYY") : "";
          },
        },
        {
          data: "_id",
          orderable: false,
          render: function (id) {
            return (
              '<a class="btn btn-info" href="' +
              FlowRouter.path("patientEdit", { _id: id }) +
              '">' +
              '<i class="fa fa-pencil" aria-hidden="true"></i></a>'
            );
          },
        },
      ];

      var $table = $("#patients-table");
      if (!$table.length) return;

      // Destroy previous instance if re-entering the route
      if ($.fn.DataTable.isDataTable($table[0])) {
        $table.DataTable().destroy();
        $table.empty();
      }

      var dt = $table.DataTable({
        data: Patients.find().fetch(),
        columns: columns,
        language: lang,
        searchHighlight: true,
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
        infoCallback: function (settings, start, end, max, total) {
          var str = (lang.sInfo || "")
            .replace("_START_", start)
            .replace("_END_", end)
            .replace("_TOTAL_", total);
          $("#table-footer").html(str);
        },
      });

      // Row click → navigate to patient edit
      $table.on("click", "tbody tr", function () {
        var row = dt.row(this).data();
        if (row) FlowRouter.go("patientEdit", { _id: row._id });
      });
    });
  }

  // ---------------------------------------------------------------------------
  // Patient form — start/finish appointment (mirrors src/app patient_form.js)
  // ---------------------------------------------------------------------------
  var apptScheduleEventId = null;
  var apptAppointmentId = null;

  function toggleStartBtnState() {
    var $btn = $("#btn-start-appointment");
    $btn.toggleClass("btn-success btn-danger");
    $btn.find("i").toggleClass("fa-play fa-stop");
    var $strong = $btn.find("strong");
    var text = $strong.text().trim();
    if (text === t("patients_start-appointment")) {
      $strong.html(
        $strong
          .html()
          .replace(
            t("patients_start-appointment"),
            t("patients_finish-appointment"),
          ),
      );
    } else {
      $strong.html(
        $strong
          .html()
          .replace(
            t("patients_finish-appointment"),
            t("patients_start-appointment"),
          ),
      );
    }
  }

  function startAppointment(patient) {
    apptScheduleEventId = FlowRouter.getQueryParam("eventId");
    apptAppointmentId = Appointments.insert({
      patient: { _id: patient._id, name: patient.name },
      start: new Date(),
      status: "in_progress",
      user: {
        _id: Meteor.userId(),
        name:
          currentUser.profile.firstName + " " + currentUser.profile.lastName,
      },
    });
    if (apptScheduleEventId) {
      Schedule.update(apptScheduleEventId, {
        $set: { status: "attending" },
      });
    }
    FlowRouter.setQueryParams({ start_appointment: null, eventId: null });
    Router.setUnsaved(true);
    $(window)
      .off("beforeunload.ripAppt")
      .on("beforeunload.ripAppt", function () {
        return t("patient_appointment-leave-confirmation");
      });
    // The appointment is a timeline entry like any other patient record — show
    // it immediately instead of waiting for the next full page render.
    S.initRecordsTab(patient._id);
  }

  function stopAppointment(patient) {
    if (apptAppointmentId) {
      Appointments.update(apptAppointmentId, {
        $set: { end: new Date(), status: "completed" },
      });
    }
    if (apptScheduleEventId) {
      Schedule.update(apptScheduleEventId, { $set: { status: "finished" } });
    }
    Router.setUnsaved(false);
    $(window).off("beforeunload.ripAppt");
    apptAppointmentId = null;
    apptScheduleEventId = null;
    if (patient) S.initRecordsTab(patient._id);
  }

  // ---------------------------------------------------------------------------
  // Patient form — create (id=null) and edit (id=string) modes
  // ---------------------------------------------------------------------------
  function initPatientForm(patientId) {
    var patient = patientId ? Patients.findOne({ _id: patientId }) : null;
    var $form = $("#insertPatientForm");
    if (!$form.length) return;

    // Date fields (dateOfBirth, returnDate) — wire the bootstrap-datepicker.
    initDatepickers($form);

    // Input masks — mirror the Meteor patient schema's masked-input fields
    // (lib/collections/patients/_patientSchema.js) via the same jquery.mask plugin.
    $form.find("[name='CPF'], [name='titularCPF']").mask("000.000.000-00", {
      reverse: true,
    });
    $form.find("[name='zip']").mask("00000-000");
    $form.find("[name='phone']").mask("(00) 0000-0000");
    $form.find("[name='mobile']").mask("(00) 00000-0000");

    // These fields only ever take digits (the mask inserts the separators), so
    // ask mobile browsers for the numeric on-screen keyboard.
    $form
      .find(
        "[name='CPF'], [name='titularCPF'], [name='zip'], [name='phone'], [name='mobile']",
      )
      .attr("inputmode", "numeric");

    // CEP -> address autofill (mirrors src/app's patient_form.js). Note: ViaCEP's
    // `/json/unicode/` variant currently 400s (and, since it's an error response,
    // sends no CORS headers, which Chrome then reports as a CORS failure) — use
    // the plain `/json/` endpoint instead.
    $form
      .find("[name='zip']")
      .off("blur.ripCep")
      .on("blur.ripCep", function (event) {
        var cep = (event.target.value || "").replace(/\D/g, "");
        if (cep.length !== 8) return;
        $.ajax({
          url: "https://viacep.com.br/ws/" + cep + "/json/",
        }).done(function (data) {
          if (data.erro) return;
          $form.find("[name='streetAddress_1']").val(data.logradouro);
          $form.find("[name='streetAddress_2']").val(data.complemento);
          $form.find("[name='bairro']").val(data.bairro);
          $form.find("[name='city']").val(data.localidade);
          $form.find("[name='state']").val(data.uf);
        });
      });

    // Show/hide edit-only UI elements
    if (patient) {
      $(".tab-records-nav, .tab-evolution-nav").show();
      $("#btn-start-appointment").show();
      $("#btn-start-appointment")
        .off("click.ripAppt")
        .on("click.ripAppt", function () {
          var text = $(this).find("strong").text().trim();
          if (text === t("patients_start-appointment")) {
            startAppointment(patient);
          } else {
            stopAppointment(patient);
          }
          toggleStartBtnState();
        });
      if (FlowRouter.getQueryParam("start_appointment")) {
        startAppointment(patient);
        toggleStartBtnState();
      }
      // Pre-fill patient photo
      if (patient.picture) {
        var img = Images.findOne({ _id: patient.picture });
        if (img) $("#patient-pic-img").attr("src", img.link());
        $("#patient-picture-id").val(patient.picture);
      } else if (patient.email) {
        // Gravatar's `default` must be an absolute URL or a keyword; a relative
        // path resolves against Gravatar's CDN and 400s. Ask for a 404 and fall
        // back to the local avatar via onerror (set before src so it's in place).
        $("#patient-pic-img")
          .attr(
            "onerror",
            "this.onerror=null;this.src='images/default-user-image.png'",
          )
          .attr(
            "src",
            Gravatar.imageUrl(patient.email, {
              secure: true,
              size: 210,
              default: "404",
            }),
          );
      }

      // Fill text/email inputs
      var textFields = [
        "name",
        "records",
        "placeOfBirth",
        "CPF",
        "RG",
        "titularCPF",
        "fathersName",
        "mothersName",
        "occupation",
        "recommendedBy",
        "email",
        "phone",
        "mobile",
        "zip",
        "streetAddress_1",
        "streetAddress_2",
        "bairro",
        "city",
        "state",
        "obs",
      ];
      textFields.forEach(function (f) {
        var val = patient[f];
        if (val != null) $form.find("[name='" + f + "']").val(val);
      });

      // Date fields
      if (patient.dateOfBirth)
        $form
          .find("[name='dateOfBirth']")
          .val(moment(patient.dateOfBirth).format("DD/MM/YYYY"));
      if (patient.returnDate)
        $form
          .find("[name='returnDate']")
          .val(moment(patient.returnDate).format("DD/MM/YYYY"));

      // Selects
      ["gender", "maritalStatus", "skinColor", "literacy"].forEach(
        function (f) {
          if (patient[f] != null)
            $form.find("[name='" + f + "']").val(patient[f]);
        },
      );

      $("#patient-delete-btn")
        .off("click.rip")
        .on("click.rip", function () {
          swal(
            {
              title: t("common_areYouSure"),
              text: patient.name,
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#ed5565",
              confirmButtonText: t("common_confirm"),
            },
            function () {
              PatientRecords.remove({ patientId: patient._id });
              PatientExams.remove({ patientId: patient._id });
              // Images is shared with users.profile.picture (doctors), so only
              // delete the file if no other patient/user still points at it.
              if (patient.picture) {
                var stillReferenced =
                  Patients.find({
                    picture: patient.picture,
                    _id: { $ne: patient._id },
                  }).count() > 0 ||
                  Users.find({ "profile.picture": patient.picture }).count() >
                    0;
                if (!stillReferenced) Images.remove(patient.picture);
              }
              Patients.remove(patient._id);
              toastr.success(t("common_deleteSuccess"), t("common_success"));
              FlowRouter.go("patientList");
            },
          );
        });
    }

    // File-upload preview (client-side only — no ostrio:files in static build)
    $("#patient-pic-file")
      .off("change.ripPic")
      .on("change.ripPic", function () {
        var file = this.files && this.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function (e) {
          $("#patient-pic-img").attr("src", e.target.result);
        };
        reader.readAsDataURL(file);
      });

    // "New patient" button
    $(".new-record")
      .off("click.ripNew")
      .on("click.ripNew", function () {
        FlowRouter.go("patientCreate");
      });

    // Form submit
    $form.off("submit.ripPat").on("submit.ripPat", function (e) {
      e.preventDefault();
      var data = {};
      $form.serializeArray().forEach(function (f) {
        if (f.value) data[f.name] = f.value;
      });

      // Validate required fields
      var valid = true;
      $form.find("[required]").each(function () {
        if (!$(this).val()) {
          $(this).closest(".form-group").addClass("has-error");
          valid = false;
        } else $(this).closest(".form-group").removeClass("has-error");
      });
      if (!valid) {
        if (global.toastr)
          toastr.error(t("common_field-required"), t("common_error"));
        return;
      }

      // Validate email format (optional field — only when filled). Mirrors the
      // Meteor schema's SimpleSchema.RegEx.Email rule on `email`.
      var $email = $form.find("[name='email']");
      var emailVal = ($email.val() || "").trim();
      var EMAIL_RE =
        /^[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
      if (emailVal && !EMAIL_RE.test(emailVal)) {
        $email.closest(".form-group").addClass("has-error");
        if (global.toastr)
          toastr.error(t("common_invalid-email"), t("common_error"));
        return;
      }
      $email.closest(".form-group").removeClass("has-error");
      if (emailVal) data.email = emailVal;

      // Validate phone/mobile against the Brazilian formats their masks enforce:
      // phone (telefone) is a 10-digit landline, mobile (celular) an 11-digit
      // cell. The required-field loop above only guards emptiness, so a partially
      // typed number would otherwise slip through. Phone is optional (checked
      // only when filled); mobile is required and must be complete.
      var digits = function (v) {
        return (v || "").replace(/\D/g, "");
      };
      var $phone = $form.find("[name='phone']");
      var phoneDigits = digits($phone.val());
      if (phoneDigits && phoneDigits.length !== 10) {
        $phone.closest(".form-group").addClass("has-error");
        if (global.toastr)
          toastr.error(t("common_invalid-phone"), t("common_error"));
        return;
      }
      $phone.closest(".form-group").removeClass("has-error");

      var $mobile = $form.find("[name='mobile']");
      var mobileDigits = digits($mobile.val());
      if (mobileDigits.length !== 11) {
        $mobile.closest(".form-group").addClass("has-error");
        if (global.toastr)
          toastr.error(t("common_invalid-mobile"), t("common_error"));
        return;
      }
      $mobile.closest(".form-group").removeClass("has-error");

      // Parse dates back to Date objects for Store
      if (data.dateOfBirth) {
        var d = moment(data.dateOfBirth, "DD/MM/YYYY");
        if (d.isValid()) data.dateOfBirth = d.toDate();
        else delete data.dateOfBirth;
      }
      if (data.returnDate) {
        var r = moment(data.returnDate, "DD/MM/YYYY");
        if (r.isValid()) data.returnDate = r.toDate();
        else delete data.returnDate;
      }

      if (patient) {
        Patients.update(patient._id, { $set: data });
      } else {
        var newId = Patients.insert(data);
        FlowRouter.go("patientEdit", { _id: newId });
      }
      if (global.toastr)
        toastr.success(t("common_save-success"), t("common_success"));
    });

    // Populate records + evolution tabs for existing patients
    if (patientId) {
      S.initRecordsTab(patientId);
      S.initEvolutionTab(patientId);
      S.initRecordsModals(patientId);
    }

    // Deep-link from the appointments report: open the records tab and, when
    // provided, select the timeline point matching the appointment's date.
    if (FlowRouter.getQueryParam("tab") === "records") {
      setTimeout(function () {
        $('a[href="#records-tab"]').tab("show");
        var date = FlowRouter.getQueryParam("date");
        if (date && /^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
          setTimeout(function () {
            var event = $(".cd-horizontal-timeline .events a").filter(
              function () {
                return $(this).attr("data-date") === date;
              },
            );
            if (event.length) event.trigger("click");
          }, 700);
        }
      }, 1200);
    }
  }


  S.pages.patientList = function () {
    initPatientList();
  };
  S.pages.patientCreate = function () {
    initPatientForm(null);
  };
  S.pages.patientEdit = function (p) {
    initPatientForm(p && p.id);
  };
})(window);
