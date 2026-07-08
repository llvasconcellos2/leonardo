/*
 * rip/ shim — schedule — FullCalendar Scheduler
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
  // Schedule page — FullCalendar Scheduler init (matches original schedule.js)
  // ---------------------------------------------------------------------------
  function initSchedule() {
    if (!$.fn.fullCalendar) return;
    var $cal = $("#calendar");
    if (!$cal.length) return;

    if (Meteor.Device.isPhone() || Meteor.Device.isTablet()) {
      $("#mobile-hint").show();
    }

    // Quick "new patient" form (modal slide 2) has a dateOfBirth field.
    initDatepickers($("#quickPatientForm"));

    // Populate patient select in modal
    function populatePatientSelect() {
      var $sel = $(".patients-chosen-select");
      $sel.find("option[value!='']").remove();
      Patients.find({}, { sort: { name: 1 } })
        .fetch()
        .forEach(function (p) {
          $sel.append(
            '<option value="' +
              p._id +
              '">' +
              Handlebars.escapeExpression(p.name || "") +
              "</option>",
          );
        });
      if ($.fn.chosen) {
        if ($sel.data("chosen")) {
          $sel.trigger("chosen:updated");
        } else {
          $sel.chosen({ width: "100%" });
          $sel.on("chosen:showing_dropdown", function () {
            $(".carousel-inner").css("overflow", "visible");
          });
          $sel.on("chosen:hiding_dropdown", function () {
            $(".carousel-inner").css("overflow", "");
          });
        }
      }
    }

    // Settings (mirrors schedule.js onRendered logic)
    var settings = Settings.findOne({}) || {};
    var workHoursStart = settings.workHoursStart || "06:00";
    var workHoursEnd = settings.workHoursEnd || "23:00";
    var slotDurationMins = settings.slotDuration || 20;

    // All doctors with specialties, workHours, color
    var doctors = Meteor.users
      .find({ "profile.group": "medical_doctor" })
      .fetch();

    // Event source function (used by fullCalendar so new inserts appear immediately)
    function eventSourceFn(start, end, timezone, callback) {
      var evs = Schedule.find({})
        .fetch()
        .map(function (ev) {
          return {
            id: ev._id,
            _id: ev._id,
            title: ev.title || t("schedule_status-to-confirm"),
            start: ev.start,
            end: ev.end,
            resourceId: ev.resourceId,
            patient: ev.patient,
            status: ev.status || "to-confirm",
            allDay: false,
          };
        });
      if (callback) callback(evs);
    }

    // Show the event modal (mirrors original showEventModal)
    function showEventModal(eventId) {
      populatePatientSelect();
      var ev = Schedule.findOne({ _id: eventId });
      if (!ev) return;
      $(".scheduleTitle").html(moment(ev.start).format("LLLL"));
      $("#schedule-form [name='eventId']").val(eventId);
      $(".patients-chosen-select")
        .val(ev.patient || "")
        .trigger("chosen:updated");

      var status =
        ev.status === "to-confirm" ? "scheduled" : ev.status || "scheduled";
      $("#schedule-form input[name='status']").val([status]);
      $("#schedule-form input[value='" + status + "']")
        .closest("label")
        .button("toggle");

      setAppointmentFormButtons();
      $("#scheduleEventForm").modal("show");
    }

    function setAppointmentFormButtons() {
      $("#scheduleEventForm .delete-btn").show();
      $(document)
        .off("click.schSave")
        .on("click.schSave", "#scheduleEventForm .save", function () {
          var eventId = $("#schedule-form [name='eventId']").val();
          var patientId = $(".patients-chosen-select").val();
          var status = $("#schedule-form input[name='status']:checked").val();
          var pat = patientId ? Patients.findOne({ _id: patientId }) : null;
          if (pat) {
            $("#patient-form-group").removeClass("has-error");
            Schedule.update(eventId, {
              $set: { patient: pat._id, title: pat.name, status: status },
            });
            $("#scheduleEventForm").modal("hide");
            $cal.fullCalendar("refetchEvents");
            if (global.toastr)
              toastr.success(t("common_save-success"), t("common_success"));
          } else {
            $("#patient-form-group").addClass("has-error");
          }
        });
      $(document)
        .off("click.schDel")
        .on("click.schDel", "#scheduleEventForm .delete-btn", function () {
          var eventId = $("#schedule-form [name='eventId']").val();
          Schedule.remove(eventId);
          $cal.fullCalendar("removeEvents", eventId);
          $("#scheduleEventForm").modal("hide");
          if (global.toastr)
            toastr.warning(
              t("schedule_appointment-canceled"),
              t("common_success"),
            );
        });
    }

    function setPatientFormButtons() {
      setTimeout(function () {
        $("#quickPatientForm input:first:visible").focus();
      }, 500);
      $("#scheduleEventForm .delete-btn").hide();
      $(document)
        .off("click.schSave")
        .on("click.schSave", "#scheduleEventForm .save", function () {
          $("#quickPatientForm").submit();
        });
    }

    // Calendar export (doctors only). rip/ has no server, so unlike src/app
    // this is client-side-only .ics generation - no subscribable live feed
    // is possible without a backend to host one.
    $(document)
      .off("click.schDownloadIcs")
      .on("click.schDownloadIcs", "#scheduleEventForm .download-ics-btn", function () {
        var eventId = $("#schedule-form [name='eventId']").val();
        var ev = Schedule.findOne({ _id: eventId });
        if (!ev) return;
        var doctor = Meteor.users.findOne({ _id: ev.resourceId });
        var patient = ev.patient ? Patients.findOne({ _id: ev.patient }) : null;
        S.downloadIcs([S.buildVEvent(ev, doctor, patient)], null, "consulta.ics");
      });

    // Modal carousel slides
    $("#scheduleEventForm")
      .off("hidden.bs.modal.sch")
      .on("hidden.bs.modal.sch", function () {
        $("#content-switcher").carousel(0);
        $("#patient-form-group").removeClass("has-error");
      });
    $("#content-switcher")
      .off("slide.bs.carousel.sch")
      .on("slide.bs.carousel.sch", function (e) {
        if (e.direction === "left") setPatientFormButtons();
        else setAppointmentFormButtons();
      });

    // Convert a FullCalendar moment to a local-time Date built from its own
    // wall-clock fields. FullCalendar runs ambiguously-zoned here (no
    // moment-timezone is loaded), so it re-reads a stored Date in the browser's
    // local zone. Using moment.toDate() stored the wall-clock as UTC, so new
    // events rendered shifted by the browser's offset (e.g. -3h in
    // America/Sao_Paulo). Rebuilding from the fields keeps the event where it
    // was dropped in every timezone — and mirrors the original Meteor app, where
    // SimpleSchema stored new Date(start.format()) (a local-time parse).
    function momentToLocalDate(m) {
      return new Date(
        m.year(),
        m.month(),
        m.date(),
        m.hours(),
        m.minutes(),
        m.seconds(),
        0,
      );
    }

    // Date picker custom button
    var datePicker = null;

    // Calendar export (doctors only - the logged-in doctor's own appointments
    // within the visible range, never other doctors' even though this view
    // shows every doctor's column).
    var isDoctor = Roles.userIsInRole(currentUser._id, "medical_doctor");
    var customButtons = {
      datePicker: {
        text: moment().format("DD/MM/YYYY"),
        click: function () {
          if (datePicker) {
            datePicker.datepicker("show");
          } else {
            datePicker = $(".fc-datePicker-button")
              .datepicker({
                autoclose: true,
                language: TAPi18n.getLanguage(),
                todayHighlight: true,
              })
              .datepicker("show")
              .on("changeDate", function (e) {
                $(".fc-datePicker-button").html(
                  moment(e.date).format("DD/MM/YYYY"),
                );
                $cal.fullCalendar("gotoDate", e.date);
              });
          }
        },
      },
    };
    var headerLeft = "today prev,datePicker,next";
    if (isDoctor) {
      customButtons.exportIcs = {
        text: t("schedule_export-range"),
        click: function () {
          var view = $cal.fullCalendar("getView");
          var doctor = Meteor.users.findOne({ _id: currentUser._id });
          var events = Schedule.find({
            resourceId: currentUser._id,
            start: { $gte: view.start.toDate(), $lte: view.end.toDate() },
          }).fetch();
          var vevents = events.map(function (ev) {
            var patient = ev.patient
              ? Patients.findOne({ _id: ev.patient })
              : null;
            return S.buildVEvent(ev, doctor, patient);
          });
          var calName = doctor
            ? (doctor.profile.firstName + " " + doctor.profile.lastName).trim()
            : "Agenda";
          S.downloadIcs(vevents, calName, "agenda.ics");
        },
      };
      headerLeft += " exportIcs";
    }

    $cal.fullCalendar("destroy");
    $cal.fullCalendar({
      schedulerLicenseKey: "GPL-My-Project-Is-Open-Source",
      defaultView: "timelineDay",
      timezone: "America/Sao_Paulo",
      locale: TAPi18n.getLanguage().toLowerCase(),
      height: "auto",
      navLinks: true,
      editable: true,
      slotDuration: { minutes: slotDurationMins },
      minTime: workHoursStart + ":00",
      maxTime: workHoursEnd + ":00",
      resourceLabelText: t("users_doctors"),
      resourceAreaWidth: 220,
      resourceOrder: "title",
      header: {
        left: headerLeft,
        center: "title",
        right: "timelineDay,agendaDay,listWeek,agendaWeek,month",
      },
      customButtons: customButtons,
      buttonText: {
        today: t("schedule_today"),
      },
      views: {
        timelineDay: {
          buttonText: t("schedule_timelineDay"),
          slotLabelFormat: ["HH:mm"],
          slotLabelInterval: { minutes: slotDurationMins },
          titleFormat: "dddd – MMMM D, YYYY",
        },
        listWeek: { buttonText: t("schedule_listWeek") },
        agendaDay: {
          buttonText: t("schedule_agendaDay"),
          titleFormat: "dddd – MMMM D, YYYY",
        },
        agendaWeek: { buttonText: t("schedule_agendaWeek") },
        month: { buttonText: t("schedule_month") },
      },
      viewRender: function (view) {
        $(".fc-datePicker-button").html(
          view.intervalStart.format("DD/MM/YYYY"),
        );
      },
      dayClick: function (date, jsEvent, view) {
        if (view.name === "month") {
          $cal.fullCalendar("changeView", "timelineDay");
          $cal.fullCalendar("gotoDate", date);
        }
      },
      selectable: true,
      selectHelper: true,
      selectOverlap: false,
      selectAllow: function (info) {
        var doctor = doctors.find(function (d) {
          return d._id === info.resourceId;
        });
        if (!doctor) return true;
        if (!doctor.workHours) {
          if (global.toastr)
            toastr.error(
              t("schedule_no-doctor-workhours-error"),
              t("common_notAllowed"),
            );
          return false;
        }
        var weekday = info.start.day();
        var dayHours = doctor.workHours[weekday];
        if (!dayHours) return false;
        var calStart = moment(info.start.format("HH:mm"), "HH:mm");
        var allowed = dayHours.some(function (interval) {
          var docStart = moment(interval.start, "HH:mm");
          var docEnd = moment(interval.end, "HH:mm");
          return (
            calStart.isBetween(docStart, docEnd) ||
            calStart.diff(docStart) === 0
          );
        });
        return allowed;
      },
      select: function (start, end, jsEvent, view, resource) {
        if (!resource) {
          $cal.fullCalendar("unselect");
          return;
        }
        var newId = Schedule.insert({
          resourceId: resource.id,
          // local-time Dates so the event renders on the slot it was dropped on
          // (see momentToLocalDate — .toDate() shifted it by the browser offset)
          start: momentToLocalDate(start),
          end: momentToLocalDate(end),
          title: "to-confirm",
          status: "to-confirm",
        });
        $cal.fullCalendar("unselect");
        if (newId) showEventModal(newId);
      },
      eventClick: function (calEvent) {
        showEventModal(calEvent._id);
      },
      eventRender: function (event, element, view) {
        var icon = "";
        var tooltip = event.title;
        switch (event.status) {
          case "to-confirm":
            tooltip = t("schedule_status-to-confirm");
            element.find(".fc-content").css("background", "#E44F4F");
            icon = '<i class="fa fa-hourglass-o"></i>';
            break;
          case "waiting":
            icon = '<i class="fa fa-calendar-check-o"></i>';
            break;
          case "scheduled":
            icon = '<i class="fa fa-clock-o"></i>';
            break;
          case "attending":
            icon = '<i class="fa fa-handshake-o"></i>';
            break;
          case "no-show":
            icon = '<i class="fa fa-user-times"></i>';
            break;
          case "finished":
            icon = '<i class="fa fa-check-circle"></i>';
            break;
        }
        if (view.name === "timelineDay" || view.name === "timelineThreeDays") {
          element.find(".fc-title").html(icon);
        } else if (event.title === "to-confirm") {
          element.find(".fc-title").html(t("schedule_status-to-confirm"));
        }
        if ($.fn.qtip) {
          element.qtip({
            position: {
              target: "mouse",
              adjust: {
                x: 10,
                y: 4,
                mouse: true,
                screen: true,
                scroll: false,
                resize: false,
              },
            },
            show: { solo: true },
            style: { classes: "qtip-bootstrap agenda-tooltip" },
            content: tooltip,
          });
        }
      },
      resources: function (callback) {
        var calResources = [];
        doctors.forEach(function (doctor) {
          var workHours = [];
          if (doctor.workHours) {
            doctor.workHours.forEach(function (day, dayIndex) {
              if (day) {
                day.forEach(function (interval) {
                  workHours.push({
                    start: interval.start,
                    end: interval.end,
                    dow: [dayIndex],
                  });
                });
              } else {
                workHours.push({
                  start: "00:00",
                  end: "00:00",
                  dow: [dayIndex],
                });
              }
            });
          }
          var color = doctor.color || randomMC.getColor();
          calResources.push({
            id: doctor._id,
            title:
              (doctor.profile.firstName || "") +
              " " +
              (doctor.profile.lastName || ""),
            picture: doctor.profile.picture,
            email:
              doctor.emails && doctor.emails[0] && doctor.emails[0].address,
            color: color,
            eventColor: color,
            specialties: doctor.specialties,
            businessHours: workHours,
          });
        });
        callback(calResources);
      },
      resourceRender: function (resource, labelTds) {
        labelTds.find(".fc-cell-text").css("display", "block");
        var pictureUrl =
          "https://cdn4.iconfinder.com/data/icons/medical-14/512/9-128.png";
        if (resource.picture) {
          var img = Images.findOne({ _id: resource.picture });
          if (img) pictureUrl = img.link();
        } else if (resource.email) {
          pictureUrl = Gravatar.imageUrl(resource.email, {
            secure: true,
            size: 28,
            default: pictureUrl,
          });
        }
        var imgHtml =
          '<img class="profile-pic cal-resource-pic" style="border-color:' +
          resource.color +
          '" src="' +
          Handlebars.escapeExpression(pictureUrl) +
          '">';
        labelTds.find(".fc-cell-content").prepend(imgHtml);

        var html = Handlebars.escapeExpression(resource.title) + "<br><small>";
        if (resource.specialties && resource.specialties.length) {
          html += Handlebars.escapeExpression(resource.specialties.join(", "));
        } else {
          html += t("schedule_no-specialties");
        }
        html += "</small>";
        labelTds.find(".fc-cell-text").html(html);
      },
      events: eventSourceFn,
    });
  }


  S.pages.schedule = function () {
    initSchedule();
  };
})(window);
