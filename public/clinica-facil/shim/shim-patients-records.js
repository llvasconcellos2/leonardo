/*
 * rip/ shim — patients — records tab, timeline, record/exam modals
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
  // Patient records tab — timeline + FAB
  // ---------------------------------------------------------------------------
  var RECORD_ICON = {
    form: "fa-id-card",
    prescription: "fa-file-text",
    medical_certificate: "fa-file-text-o",
    exam_request: "fa-eye",
    "prescriptions-anvisa": "fa-list-alt",
  };
  var RECORD_CLS = {
    form: "form",
    prescription: "info",
    medical_certificate: "warning",
    exam_request: "danger",
    "prescriptions-anvisa": "anvisa",
  };
  var APPT_STATUS_MAP = {
    completed: {
      icon: "fa-check-circle",
      cls: "primary",
      key: "patient_appt-status-completed",
    },
    no_show: {
      icon: "fa-user-times",
      cls: "danger",
      key: "patient_appt-status-no_show",
    },
    in_progress: {
      icon: "fa-handshake-o",
      cls: "info",
      key: "patient_appt-status-in_progress",
    },
    "re-scheduled": {
      icon: "fa-hourglass-o",
      cls: "warning",
      key: "patient_appt-status-re-scheduled",
    },
  };
  function buildTimeline(entries) {
    var datesHtml = entries
      .map(function (e, i) {
        var d = moment(e.date).format("DD/MM/YYYY");
        return (
          "<li><a" +
          (i === 0 ? ' class="selected"' : "") +
          ' href="#0" data-date="' +
          d +
          '">' +
          d +
          "</a></li>"
        );
      })
      .join("");

    var contentHtml = entries
      .map(function (e, i) {
        var d = moment(e.date).format("DD/MM/YYYY");
        var id = moment(e.date).format("DDMMYYYY");
        var panels = "";

        e.appointments.forEach(function (appt) {
          var s = APPT_STATUS_MAP[appt.status] || {};
          var badge = s.key
            ? '<span class="label label-' +
              s.cls +
              '"><i class="fa ' +
              s.icon +
              '"></i> ' +
              t(s.key) +
              "</span>"
            : "";
          var time =
            moment(appt.start).format("HH:mm") +
            (appt.end ? " &ndash; " + moment(appt.end).format("HH:mm") : "");
          var doc =
            appt.user && appt.user.name
              ? "<p><b>" +
                t("patient_appointment-doctor") +
                ":</b> " +
                escH(appt.user.name) +
                "</p>"
              : "";
          panels +=
            '<div class="panel panel-default timeline-appointment"><div class="panel-heading"><h5 class="panel-title"><i class="fa fa-stethoscope"></i> ' +
            t("schedule_appointment") +
            " " +
            badge +
            "</h5></div>" +
            '<div class="panel-body"><p><i class="fa fa-clock-o"></i> ' +
            time +
            "</p>" +
            doc +
            "</div></div>";
        });

        (e.examSets || []).forEach(function (exam) {
          var labHtml = exam.laboratory
            ? '<small class="m-l-sm">' + escH(exam.laboratory) + "</small>"
            : "";
          var rowsHtml = (exam.results || [])
            .map(function (r) {
              return (
                '<tr class="' +
                (r.isAltered ? "exam-altered" : "") +
                '">' +
                '<td class="exam-cell-name">' +
                escH(r.examName) +
                "</td>" +
                '<td class="exam-cell-value">' +
                escH(r.value) +
                (r.unit
                  ? ' <span class="text-muted exam-cell-unit">' +
                    escH(r.unit) +
                    "</span>"
                  : "") +
                (r.isAltered
                  ? ' <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>'
                  : "") +
                "</td>" +
                '<td class="exam-cell-ref">' +
                escH(r.referenceUsed) +
                "</td></tr>"
              );
            })
            .join("");
          panels +=
            '<div class="panel panel-default timeline-exam">' +
            '<div class="panel-heading"><h5 class="panel-title">' +
            '<i class="fa fa-flask" aria-hidden="true"></i> ' +
            t("exam-results_title") +
            " " +
            labHtml +
            "</h5></div>" +
            '<div class="panel-body"><table class="table table-condensed exam-results-card-table">' +
            "<thead><tr><th>" +
            t("exam-results_exam-name") +
            "</th><th>" +
            t("exam-results_result") +
            "</th><th>" +
            t("exam-results_reference") +
            "</th></tr></thead><tbody>" +
            rowsHtml +
            "</tbody></table></div></div>";
        });

        e.records.forEach(function (rec, idx) {
          var icon = RECORD_ICON[rec.recordType] || "fa-file-text-o";
          var cls = RECORD_CLS[rec.recordType] || "default";
          var name = escH(
            rec.recordName || t("patient_records-item") + " #" + (idx + 1),
          );
          var cid = id + "_" + idx;
          var fields = (rec.fields || [])
            .map(function (f) {
              if (f.name && f.name.toLowerCase() === "document")
                return f.value || "";
              return (
                "<p><b>" +
                escH(f.label) +
                ":</b> " +
                escH(f.value) +
                "</p><p>&nbsp;</p>"
              );
            })
            .join("");
          panels +=
            '<div class="panel panel-default record-type-' +
            cls +
            '">' +
            '<div class="panel-heading"><h5 class="panel-title">' +
            '<a data-toggle="collapse" data-parent="#accordion' +
            id +
            '" href="#collapse_' +
            cid +
            '">' +
            '<i class="fa ' +
            icon +
            '"></i> ' +
            name +
            "</a></h5></div>" +
            '<div id="collapse_' +
            cid +
            '" class="panel-collapse collapse in">' +
            '<div class="panel-body note-editable overflow-hiden" id="' +
            cid +
            '">' +
            fields +
            "</div></div></div>";
        });

        return (
          "<li" +
          (i === 0 ? ' class="selected"' : "") +
          ' data-date="' +
          d +
          '">' +
          '<em><i class="fa fa-calendar"></i> ' +
          moment(e.date).locale("pt-br").format("LL") +
          "</em>" +
          '<div class="panel-group" id="accordion' +
          id +
          '">' +
          panels +
          "</div></li>"
        );
      })
      .join("");

    return (
      '<div class="cd-horizontal-timeline">' +
      '<div class="timeline"><div class="events-wrapper"><div class="events"><ol>' +
      datesHtml +
      "</ol>" +
      '<span class="filling-line" aria-hidden="true"></span>' +
      '<span class="timeline-marker" aria-hidden="true"></span>' +
      "</div></div>" +
      '<ul class="cd-timeline-navigation"><li><a href="#0" class="prev inactive">Prev</a></li><li><a href="#0" class="next">Next</a></li></ul>' +
      "</div>" +
      '<div class="events-content"><ol>' +
      contentHtml +
      "</ol></div></div>"
    );
  }

  function initRecordsTab(patientId) {
    if (!patientId) return;
    var records = PatientRecords.find(
      { patientId: patientId },
      { sort: { date: -1 } },
    ).fetch();
    var appts = Appointments.find(
      { "patient._id": patientId },
      { sort: { start: -1 } },
    ).fetch();
    var exams = PatientExams.find(
      { patientId: patientId },
      { sort: { datePerformed: -1 } },
    ).fetch();

    var entries = [];
    function findByDay(date) {
      return entries.filter(function (e) {
        return moment(e.date).isSame(date, "day");
      })[0];
    }
    records.forEach(function (item) {
      var entry = findByDay(item.date);
      if (!entry)
        entries.push({
          date: item.date,
          records: [
            {
              fields: item.record,
              recordType: item.recordType,
              recordName: item.recordName,
            },
          ],
          appointments: [],
          examSets: [],
        });
      else
        entry.records.push({
          fields: item.record,
          recordType: item.recordType,
          recordName: item.recordName,
        });
    });
    appts.forEach(function (appt) {
      var entry = findByDay(appt.start);
      if (!entry)
        entries.push({
          date: appt.start,
          records: [],
          appointments: [appt],
          examSets: [],
        });
      else entry.appointments.push(appt);
    });
    exams.forEach(function (exam) {
      var entry = findByDay(exam.datePerformed);
      if (!entry)
        entries.push({
          date: exam.datePerformed,
          records: [],
          appointments: [],
          examSets: [exam],
        });
      else entry.examSets.push(exam);
    });
    entries.sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });

    if (entries.length === 0) return; // leave empty state

    var el = document.getElementById("records-tab-content");
    if (!el) return;
    el.innerHTML = buildTimeline(entries);
    setTimeout(runTimeline, 80);

    // Re-run on tab click (so layout fits after the tab becomes visible)
    $('a[href="#records-tab"]')
      .off("shown.bs.tab.ripRec")
      .on("shown.bs.tab.ripRec", function () {
        setTimeout(runTimeline, 80);
      });

    // qtip tooltips for FAB buttons
    setTimeout(function () {
      if ($.fn.qtip) {
        $("[data-tooltip]")
          .filter(function () {
            return $(this).attr("data-tooltip") !== "";
          })
          .qtip({
            content: { attr: "data-tooltip" },
            position: { my: "center right", at: "center left" },
            style: { classes: "qtip-tipsy qtip-shadow" },
          });
      }
    }, 150);
  }

  // Port of patientTimeLine.js runTimeline()
  function runTimeline() {
    var timelines = $(".cd-horizontal-timeline");
    if (!timelines.length) return;
    var MIN_DIST = 90;

    timelines.each(function () {
      var tl = $(this),
        tc = {};
      tc.wrap = tl.find(".events-wrapper");
      tc.events = tc.wrap.children(".events");
      tc.filling = tc.events.children(".filling-line");
      tc.links = tc.events.find("a");
      tc.content = tl.children(".events-content");
      tc.nav = tl.find(".cd-timeline-navigation");

      // position each date link evenly, 100px apart
      tc.links.each(function (i) {
        $(this).css("left", (i + 1) * 100 + "px");
      });

      var total = tc.links.length * 100 + 100;
      var wrap = tl.find(".timeline").width();
      if (total < wrap) total = wrap;
      tc.events.css("width", total + "px");

      tl.addClass("loaded");

      function updateFilling(sel) {
        var s = window.getComputedStyle(sel.get(0), null);
        var left = parseFloat(s.left) + parseFloat(s.width) / 2;
        var scale = left / total;
        tc.filling.get(0).style.transform = "scaleX(" + scale + ")";
        tc.filling.siblings(".timeline-marker").css("left", left + "px");
      }

      function fitContent() {
        var sel = tc.content.find(".selected");
        if (!sel.length) return;
        var h = Math.max(sel.height(), sel.get(0).scrollHeight) + 24;
        tc.content.css("height", h + "px");
      }

      function showContent(link) {
        var d = link.data("date");
        var cur = tc.content.find(".selected");
        var nxt = tc.content.find('[data-date="' + d + '"]');
        if (!nxt.length) return;
        var entering =
          nxt.index() > cur.index()
            ? "selected enter-right"
            : "selected enter-left";
        var leaving = nxt.index() > cur.index() ? "leave-left" : "leave-right";
        nxt.attr("class", entering);
        cur
          .attr("class", leaving)
          .one(
            "webkitAnimationEnd oanimationend msAnimationEnd animationend",
            function () {
              cur.removeClass("leave-right leave-left");
              nxt.removeClass("enter-left enter-right");
            },
          );
        fitContent();
        // Center the picked date within the strip's OWN horizontal scroller
        // (.events-wrapper) only. Never Element.scrollIntoView: it also scrolls
        // ancestor scrollers (#wrapper is ~15px horizontally scrollable), which
        // slides the in-flow #page-wrapper left over the absolutely-positioned
        // sidebar, making the menu look 15px narrower on every date pick.
        var scroller = tc.wrap.get(0);
        if (scroller) {
          var a = link.get(0);
          var ar = a.getBoundingClientRect();
          var sr = scroller.getBoundingClientRect();
          var target =
            scroller.scrollLeft +
            (ar.left - sr.left) -
            sr.width / 2 +
            ar.width / 2;
          target = Math.max(
            0,
            Math.min(target, scroller.scrollWidth - scroller.clientWidth),
          );
          tc.wrap.stop().animate({ scrollLeft: target }, 300);
        }
      }

      function updateOlder(link) {
        link
          .parent("li")
          .prevAll("li")
          .children("a")
          .addClass("older-event")
          .end()
          .end()
          .nextAll("li")
          .children("a")
          .removeClass("older-event");
      }

      function updateArrows() {
        var node = tc.wrap.get(0);
        tc.nav.find(".prev").toggleClass("inactive", node.scrollLeft <= 1);
        tc.nav
          .find(".next")
          .toggleClass(
            "inactive",
            node.scrollLeft + node.clientWidth >= node.scrollWidth - 1,
          );
      }

      // fit initial selected content
      fitContent();
      $(window)
        .off("resize.tlfit")
        .on("resize.tlfit", function () {
          fitContent();
        });

      // fill line on first selected
      var firstSel = tc.links.filter(".selected");
      if (firstSel.length) {
        updateFilling(firstSel);
        updateOlder(firstSel);
      }

      // arrow scrolling
      tc.wrap.off("scroll.tlnav").on("scroll.tlnav", function () {
        updateArrows();
      });
      tc.nav.off("click").on("click", ".next", function (e) {
        e.preventDefault();
        var node = tc.wrap.get(0);
        tc.wrap.stop().animate(
          {
            scrollLeft:
              node.scrollLeft + Math.max(node.clientWidth - MIN_DIST, 100),
          },
          300,
        );
      });
      tc.nav.on("click", ".prev", function (e) {
        e.preventDefault();
        var node = tc.wrap.get(0);
        tc.wrap.stop().animate(
          {
            scrollLeft:
              node.scrollLeft - Math.max(node.clientWidth - MIN_DIST, 100),
          },
          300,
        );
      });
      updateArrows();

      // date link click → show content
      tc.links.off("click").on("click", function (e) {
        e.preventDefault();
        tc.links.removeClass("selected");
        $(this).addClass("selected");
        updateOlder($(this));
        updateFilling($(this));
        showContent($(this));
      });
    });
  }

  // Rebuild the timeline (and evolution charts) after a record/exam is saved.
  // The Store already fired its change event; rip has no reactive re-render,
  // so both tabs are simply re-initialized from the current Store contents.
  function refreshRecords(patientId) {
    initRecordsTab(patientId);
    S.initEvolutionTab(patientId);
  }

  // Converts a date of birth + reference date into the patient's age in WHOLE
  // MONTHS (port of src/app/lib/exam-age.js — reference-range rules are
  // stored in months so they can be matched with simple integer math).
  function ageInMonths(dateOfBirth, referenceDate) {
    if (!dateOfBirth) return null;
    var dob = new Date(dateOfBirth);
    var ref = referenceDate ? new Date(referenceDate) : new Date();
    var months =
      (ref.getFullYear() - dob.getFullYear()) * 12 +
      (ref.getMonth() - dob.getMonth());
    if (ref.getDate() < dob.getDate()) months -= 1;
    return months < 0 ? 0 : months;
  }

  // Port of patientRecord.js buildHashTagMap/hashTagReplace/hashTagValue —
  // substitutes #SHORTCUT tokens in document templates with patient/doctor/
  // clinic data at insertion time (hint pick) and again on save (catches any
  // hand-typed shortcut left untouched).
  function buildHashTagMap(patient, settings) {
    var user = Users.findOne(Meteor.userId()) || Meteor.user();
    var profile = (user && user.profile) || {};
    return [
      { key: "#NOME_DO_PACIENTE", replace: patient.name || "" },
      { key: "#CPF_PACIENTE", replace: patient.CPF || "" },
      { key: "#RG_PACIENTE", replace: patient.RG || "" },
      {
        key: "#ENDERECO_PACIENTE",
        replace: function () {
          var bairro = patient.bairro || "";
          var city = patient.city || "";
          var s1 = patient.streetAddress_1 || "";
          var s2 = patient.streetAddress_2 || "";
          var zip = patient.zip || "";
          // <br> (not a single joined line) - matches patientRecord.js so the
          // ANVISA letterhead layouts (tuned assuming a 2-line address) don't
          // wrap into a 3rd line and overlap the field below.
          return (
            s1 + (s2 ? " - " + s2 : "") + "<br>" + bairro + " - " + city + " - " + zip
          );
        },
      },
      {
        key: "#DATA_NASCIMENTO_PACIENTE",
        replace: patient.dateOfBirth
          ? moment(patient.dateOfBirth).format("DD/MM/YYYY")
          : "",
      },
      {
        key: "#SEXO_PACIENTE",
        replace:
          patient.gender === "M"
            ? "Masculino"
            : patient.gender === "F"
              ? "Feminino"
              : "",
      },
      {
        key: "#TELEFONE_PACIENTE",
        replace: patient.mobile || patient.phone || "",
      },
      {
        key: "#DATA_DA_CONSULTA",
        replace: moment().locale("pt-br").format("LLLL"),
      },
      { key: "#DIA", replace: moment().format("D") },
      { key: "#MES", replace: moment().locale("pt-br").format("MMMM") },
      { key: "#ANO", replace: moment().format("YYYY") },
      { key: "#HORARIO_DA_CONSULTA", replace: moment().format("HH:mm") },
      {
        key: "#NOME_PROFISSIONAL",
        replace: (profile.firstName || "") + " " + (profile.lastName || ""),
      },
      { key: "#CRM_PROFISSIONAL", replace: profile.CRM || "" },
      { key: "#ASSINATURA_PROFISSIONAL", replace: profile.signature || "" },
      {
        key: "#ENDERECO_CLINICA",
        replace: (settings && settings.address) || "",
      },
    ];
  }

  function hashTagReplace(patient, settings, text) {
    var modifiedText = text || "";
    buildHashTagMap(patient, settings).forEach(function (item) {
      var value =
        typeof item.replace === "function" ? item.replace() : item.replace;
      modifiedText = modifiedText.split(item.key).join(value);
    });
    return modifiedText;
  }

  function hashTagValue(patient, settings, word) {
    var match = buildHashTagMap(patient, settings).filter(function (item) {
      return item.key === "#" + word;
    })[0];
    if (!match) return word;
    return typeof match.replace === "function"
      ? match.replace()
      : match.replace;
  }

  // ---------------------------------------------------------------------------
  // #addToRecords modal — the 4 FAB buttons (form/prescription/certificate/
  // exam request) share this modal; port of patient_record/patientRecord.js.
  // ---------------------------------------------------------------------------
  function initRecordsModals(patientId) {
    var $addModal = $("#addToRecords");
    if (!$addModal.length) return;
    var patient = Patients.findOne(patientId) || {};
    var settings = Settings.findOne() || {};

    function resetModal() {
      $addModal.find(".form-group").not("#date").hide();
      $addModal.find("select").val("");
      if ($.fn.chosen)
        $addModal.find(".chosen-select").trigger("chosen:updated");
      $("#form-render").html("");
      if ($.fn.summernote && $("#document").data("summernote"))
        $("#document").summernote("code", "");
      $("#patient-record-form").find(".has-error").removeClass("has-error");
      // always start a fresh record dated today, so a date typed for a
      // previous record in this session doesn't leak into the next one
      $("#record-date").val(moment().format("DD/MM/YYYY"));
    }

    function openModal(type) {
      resetModal();
      switch (type) {
        case "form":
          $("#form-models-form-group").show();
          break;
        case "prescription":
          $("#prescriptions-form-group").show();
          break;
        case "certificate":
          $("#certificates-form-group").show();
          break;
        case "exam":
          $("#exams-form-group").show();
          break;
        case "prescriptions-anvisa":
          $("#anvisa-prescriptions-form-group").show();
          break;
      }
      $addModal.modal();
    }

    function fillSelect($sel, docs) {
      $sel.find("option").not("[value='']").remove();
      docs.forEach(function (d) {
        $sel.append(
          '<option value="' + d._id + '">' + escH(d.name) + "</option>",
        );
      });
    }
    fillSelect($("#record-form-models"), FormModels.find().fetch());
    fillSelect(
      $("#record-prescriptions"),
      DocumentModels.find({ type: "prescription" }).fetch(),
    );
    fillSelect(
      $("#record-certificates"),
      DocumentModels.find({ type: "medical_certificate" }).fetch(),
    );
    fillSelect(
      $("#record-exams"),
      DocumentModels.find({ type: "exam_request" }).fetch(),
    );
    fillSelect(
      $("#record-anvisa-prescriptions"),
      DocumentModels.find({ type: "prescriptions-anvisa" }).fetch(),
    );

    if ($.fn.chosen) $addModal.find(".chosen-select").chosen({ width: "100%" });

    $addModal.find(".form-group").not("#date").hide();
    $addModal
      .off("hidden.bs.modal.ripRec")
      .on("hidden.bs.modal.ripRec", resetModal);

    $("#record-date").mask("00/00/0000");

    var drugsArray = Drugs.find()
      .fetch()
      .map(function (d) {
        return d.name;
      });
    var diseasesArray = ICD10.find()
      .fetch()
      .filter(function (d) {
        return d.code && d.display;
      })
      .map(function (d) {
        return d.code + " - " + d.display;
      });
    var hashtagWords = [
      "NOME_DO_PACIENTE",
      "CPF_PACIENTE",
      "RG_PACIENTE",
      "ENDERECO_PACIENTE",
      "DATA_NASCIMENTO_PACIENTE",
      "SEXO_PACIENTE",
      "TELEFONE_PACIENTE",
      "DATA_DA_CONSULTA",
      "HORARIO_DA_CONSULTA",
      "NOME_PROFISSIONAL",
      "CRM_PROFISSIONAL",
      "ASSINATURA_PROFISSIONAL",
      "ENDERECO_CLINICA",
    ];

    if ($.fn.summernote) {
      $("#document").summernote({
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
            words: drugsArray,
            match: /\B\$(\w*)$/,
            search: function (keyword, callback) {
              callback(
                $.map(this.words, function (item) {
                  return item.toUpperCase().indexOf(keyword.toUpperCase()) >= 0
                    ? item
                    : null;
                }),
              );
            },
            index: 1,
            replace: function (item) {
              return item.toUpperCase() + " ";
            },
          },
          {
            words: diseasesArray,
            match: /\B@(\w{3,})$/,
            search: function (keyword, callback) {
              callback(
                $.map(this.words, function (item) {
                  return item.toUpperCase().indexOf(keyword.toUpperCase()) >= 0
                    ? item
                    : null;
                }),
              );
            },
            index: 2,
            replace: function (item) {
              return item.toUpperCase() + " ";
            },
          },
          {
            words: hashtagWords,
            match: /\B#(\w*)$/,
            search: function (keyword, callback) {
              callback(
                $.grep(this.words, function (item) {
                  return item.toUpperCase().indexOf(keyword.toUpperCase()) >= 0
                    ? item
                    : null;
                }),
              );
            },
            template: function (item) {
              return item;
            },
            content: function (item) {
              return "#" + item;
            },
            replace: function (item) {
              return hashTagValue(patient, settings, item.toUpperCase()) + " ";
            },
          },
        ],
      });
    }

    $addModal
      .find(".chosen-select")
      .off("change.ripRec")
      .on("change.ripRec", function () {
        var $sel = $(this);
        var type = $sel.data("type");
        var id = $sel.val();
        if (type === "form") {
          if (id) {
            var model = FormModels.findOne(id);
            if (model && $.fn.formRender) {
              $("#form-render").formRender({
                dataType: "json",
                formData: JSON.stringify(model.model),
              });
            }
          } else {
            $("#form-render").html("");
          }
        } else {
          if (id) {
            var dm = DocumentModels.findOne(id);
            if (dm && $.fn.summernote) {
              $("#document").summernote(
                "code",
                hashTagReplace(patient, settings, dm.model),
              );
            }
            $("#document-wrapper").show();
          } else if ($.fn.summernote) {
            $("#document").summernote("code", "");
          }
        }
      });

    $("#patient-add-form-btn")
      .off("click.ripRec")
      .on("click.ripRec", function () {
        openModal("form");
      });
    $("#patient-add-prescription-btn")
      .off("click.ripRec")
      .on("click.ripRec", function () {
        openModal("prescription");
      });
    $("#patient-add-certificate-btn")
      .off("click.ripRec")
      .on("click.ripRec", function () {
        openModal("certificate");
      });
    $("#patient-add-exam-btn")
      .off("click.ripRec")
      .on("click.ripRec", function () {
        openModal("exam");
      });
    $("#patient-add-exam-results-btn")
      .off("click.ripRec")
      .on("click.ripRec", function () {
        $("#examResultsModal").modal();
      });
    $("#patient-add-anvisa-prescription-btn")
      .off("click.ripRec")
      .on("click.ripRec", function () {
        openModal("prescriptions-anvisa");
      });

    $addModal
      .find(".save")
      .off("click.ripRec")
      .on("click.ripRec", function () {
        $("#patient-record-form").submit();
      });

    function clearErrors() {
      $("#patient-record-form").find(".has-error").removeClass("has-error");
    }
    function markError(el) {
      $(el).closest(".form-group").addClass("has-error");
    }
    function validateForm() {
      clearErrors();
      $("#patient-record-form")
        .find(".form-group")
        .each(function () {
          var input = $(this).find("[required]")[0];
          if (input && !$(input).val()) markError(input);
        });
      if ($("#patient-record-form").find(".has-error:visible").length > 0) {
        throw new Error(t("patient_records-validation-error"));
      }
    }

    $("#patient-record-form")
      .off("submit.ripRec")
      .on("submit.ripRec", function (event) {
        event.preventDefault();
        try {
          validateForm();
          var formData = $(this).serializeArray();
          formData.forEach(function (el) {
            var labelEl = $("#patient-record-form")
              .find('[name="' + el.name + '"]')
              .closest(".form-group")
              .find("label:first");
            el.label = $.trim(labelEl.text());
          });

          var date = formData.shift().value;

          formData.forEach(function (el) {
            if (el.name === "document")
              el.value = hashTagReplace(patient, settings, el.value);
          });

          var answeredFields = formData.filter(function (el) {
            return el.value !== "";
          });

          var $sel = $addModal
            .find(".chosen-select")
            .filter(function () {
              return $(this).val();
            })
            .first();
          if (!$sel.length) {
            toastr.error(
              t("patient_records-validation-error"),
              t("common_error"),
            );
            return;
          }

          var recordData = {
            date: moment(date, "DD/MM/YYYY").toDate(),
            patientId: patientId,
            recordType: $sel.data("type"),
            recordName: $sel.find("option:selected").text(),
            record: answeredFields,
          };

          PatientRecords.insert(recordData);
          $addModal.modal("hide");
          toastr.success(t("common_save-success"), t("common_success"));
          refreshRecords(patientId);
        } catch (err) {
          toastr.error(err.message, t("common_error"));
        }
      });

    initExamResultsModal(patientId, patient);
  }

  // ---------------------------------------------------------------------------
  // #examResultsModal — dedicated spreadsheet-like grid for exam RESULTS.
  // Port of exam_results/examResultsModal.js.
  // ---------------------------------------------------------------------------
  function initExamResultsModal(patientId, patient) {
    var $modal = $("#examResultsModal");
    if (!$modal.length) return;
    var $rows = $modal.find("#exam-results-rows");
    var $templateRow = $("#exam-result-template-row");

    function patientContext() {
      var dateStr = $modal.find("#exam-results-date").val();
      var ref = dateStr ? moment(dateStr, "DD/MM/YYYY").toDate() : new Date();
      return {
        gender: patient && patient.gender,
        ageMonths: ageInMonths(patient && patient.dateOfBirth, ref),
      };
    }

    function addRow() {
      var $row = $templateRow.clone().removeAttr("id").removeAttr("style");
      $rows.append($row);
      $row.find(".exam-name-input").focus();
      return $row;
    }

    function resetModal() {
      $rows.empty();
      $modal.find("#exam-results-laboratory").val("");
      $modal
        .find("#exam-results-date")
        .mask("00/00/0000")
        .val(moment().format("DD/MM/YYYY"));
      addRow();
    }

    function validateRow($row) {
      var $val = $row.find(".exam-value-input");
      var raw = $val.val();
      $val.css("border-color", "");
      $row.data("altered", false);
      if (raw === "" || raw === null) return;
      var num = parseFloat(String(raw).replace(",", "."));
      if (isNaN(num)) return;
      var min = $row.data("min");
      var max = $row.data("max");
      var hasMin = min !== undefined && min !== null && min !== "";
      var hasMax = max !== undefined && max !== null && max !== "";
      if (!hasMin && !hasMax) return;
      var altered = false;
      if (hasMin && hasMax) altered = num < min || num > max;
      else if (hasMax) altered = num > max;
      else if (hasMin) altered = num < min;
      $val.css("border-color", altered ? "#dc3545" : "#198754");
      $row.data("altered", altered);
    }

    function selectExam($row, item, rule) {
      $row.find(".exam-name-input").val(item.name);
      $row.find(".exam-autocomplete-list").hide().empty();
      var $ref = $row.find(".exam-reference-input");
      $row.find(".exam-unit-input").val(item.unit || "");
      $row.removeData("min");
      $row.removeData("max");
      $row.data("matched", false);
      if (rule) {
        $ref.val(rule.displayText || "");
        $ref.prop("readonly", true).addClass("exam-reference-locked");
        if (rule.min !== undefined && rule.min !== null)
          $row.data("min", rule.min);
        if (rule.max !== undefined && rule.max !== null)
          $row.data("max", rule.max);
        $row.data("matched", true);
      } else {
        $ref
          .val("")
          .prop("readonly", false)
          .removeClass("exam-reference-locked");
      }
      $row.find(".exam-value-input").focus();
      validateRow($row);
    }

    function moveHighlight($list, dir) {
      var $items = $list.children("li");
      if (!$items.length) return;
      var idx = $items.index($items.filter(".active"));
      idx = idx + dir;
      if (idx < 0) idx = $items.length - 1;
      if (idx >= $items.length) idx = 0;
      $items.removeClass("active");
      $items.eq(idx).addClass("active");
    }

    function collectRows() {
      var rows = [];
      $rows.children("tr").each(function () {
        var $row = $(this);
        var name = $.trim($row.find(".exam-name-input").val());
        if (!name) return;
        rows.push({
          examName: name,
          value: $.trim($row.find(".exam-value-input").val()),
          referenceUsed: $.trim($row.find(".exam-reference-input").val()),
          unit: $.trim($row.find(".exam-unit-input").val()),
          isAltered: !!$row.data("altered"),
          matched: !!$row.data("matched"),
        });
      });
      return rows;
    }

    function save() {
      var rows = collectRows();
      if (rows.length === 0) {
        toastr.warning(t("exam-results_empty-warning"), t("common_error"));
        return;
      }
      var dateStr = $modal.find("#exam-results-date").val();
      var doc = {
        laboratory: $.trim($modal.find("#exam-results-laboratory").val()),
        datePerformed: dateStr
          ? moment(dateStr, "DD/MM/YYYY").toDate()
          : new Date(),
        results: rows,
      };
      Meteor.call("savePatientExam", patientId, doc, function (err) {
        if (err) {
          toastr.error(err.reason || err.message, t("common_error"));
          return;
        }
        toastr.success(t("common_save-success"), t("common_success"));
        $modal.modal("hide");
        refreshRecords(patientId);
      });
    }

    $modal.off("show.bs.modal.ripExam").on("show.bs.modal.ripExam", resetModal);

    function runSearch($row) {
      var $input = $row.find(".exam-name-input");
      var $list = $row.find(".exam-autocomplete-list");
      var term = $.trim($input.val());
      if (term.length > 64) {
        $list.hide().empty();
        return;
      }
      var ctx = patientContext();
      Meteor.call(
        "searchExamCatalog",
        term,
        ctx.gender,
        ctx.ageMonths,
        function (err, res) {
          $list.empty();
          if (err || !res || res.length === 0) {
            $list.hide();
            return;
          }
          res.forEach(function (item, i) {
            var rule =
              (item.applicableRules && item.applicableRules[0]) || null;
            var $li = $('<li><a href="#"></a></li>');
            if (i === 0) $li.addClass("active");
            $li
              .find("a")
              .html(
                escH(item.name) +
                  (item.unit
                    ? ' <small class="text-muted">(' +
                      escH(item.unit) +
                      ")</small>"
                    : "") +
                  (rule && rule.displayText
                    ? ' <span class="pull-right text-muted"><small>' +
                      escH(rule.displayText) +
                      "</small></span>"
                    : ""),
              );
            $li.data("item", item);
            $li.data("rule", rule);
            $list.append($li);
          });
          $list.show();
        },
      );
    }

    var NAV_KEYS = [9, 13, 27, 38, 40];
    $modal
      .off("keyup.ripExam")
      .on("keyup.ripExam", ".exam-name-input", function (e) {
        if (NAV_KEYS.indexOf(e.which) !== -1) return;
        var $row = $(this).closest("tr");
        var $list = $row.find(".exam-autocomplete-list");
        var term = $.trim($(this).val());
        if (term.length < 1) {
          $list.hide().empty();
          return;
        }
        runSearch($row);
      });

    $modal
      .off("keydown.ripExam")
      .on("keydown.ripExam", ".exam-name-input", function (e) {
        var $row = $(this).closest("tr");
        var $list = $row.find(".exam-autocomplete-list");
        var open = $list.is(":visible") && $list.children("li").length > 0;
        if (e.which === 40) {
          e.preventDefault();
          if (open) moveHighlight($list, 1);
          else runSearch($row);
        } else if (e.which === 38) {
          if (!open) return;
          e.preventDefault();
          moveHighlight($list, -1);
        } else if (e.which === 13 || e.which === 9) {
          if (!open) return;
          e.preventDefault();
          var $active = $list.children("li.active").first();
          if (!$active.length) $active = $list.children("li").first();
          selectExam($row, $active.data("item"), $active.data("rule"));
        } else if (e.which === 27) {
          $list.hide();
        }
      });

    $modal
      .off("mousedown.ripExam")
      .on("mousedown.ripExam", ".exam-autocomplete-list li", function (e) {
        e.preventDefault();
        var $li = $(this);
        selectExam($li.closest("tr"), $li.data("item"), $li.data("rule"));
      });

    $modal
      .off("mouseenter.ripExam")
      .on("mouseenter.ripExam", ".exam-autocomplete-list li", function () {
        $(this).addClass("active").siblings().removeClass("active");
      });

    $modal
      .off("blur.ripExam")
      .on("blur.ripExam", ".exam-name-input", function () {
        var $list = $(this).closest("tr").find(".exam-autocomplete-list");
        setTimeout(function () {
          $list.hide();
        }, 150);
      });

    $modal
      .off("input.ripExam")
      .on("input.ripExam", ".exam-value-input", function () {
        validateRow($(this).closest("tr"));
      });

    $modal
      .off("keydown.ripExamUnit")
      .on("keydown.ripExamUnit", ".exam-unit-input", function (e) {
        var isTab = e.which === 9 && !e.shiftKey;
        var isEnter = e.which === 13;
        if (!isTab && !isEnter) return;
        var $row = $(this).closest("tr");
        var isLast = $row.is(":last-child");
        var nameFilled = $.trim($row.find(".exam-name-input").val()) !== "";
        var valueFilled = $.trim($row.find(".exam-value-input").val()) !== "";
        if (isLast && nameFilled && valueFilled) {
          e.preventDefault();
          addRow();
        }
      });

    $modal
      .off("click.ripExamRemove")
      .on("click.ripExamRemove", ".exam-row-remove", function () {
        var $row = $(this).closest("tr");
        if ($rows.children("tr").length > 1) {
          $row.remove();
        } else {
          $row
            .find("input")
            .val("")
            .css("border-color", "")
            .prop("readonly", false)
            .removeClass("exam-reference-locked");
          $row
            .removeData("min")
            .removeData("max")
            .removeData("matched")
            .removeData("altered");
        }
      });

    $modal
      .off("click.ripExamSave")
      .on("click.ripExamSave", ".exam-results-save", function () {
        save();
      });
  }

  S.initRecordsTab = initRecordsTab;
  S.initRecordsModals = initRecordsModals;
  S.refreshRecords = refreshRecords;
})(window);
