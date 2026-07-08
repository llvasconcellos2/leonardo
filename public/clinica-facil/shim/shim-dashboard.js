/*
 * rip/ shim — dashboard page
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

  var DASH_PAL = {
    blue: "#1c84c6",
    green: "#1ab394",
    teal: "#23c6c8",
    yellow: "#f8ac59",
    red: "#ed5565",
    pink: "#ec90c5",
    money: "#18a689",
  };

  function renderDashboard() {
    // KPIs
    Meteor.call("dashboardStats", function (err, stats) {
      if (err || !stats) return;
      $("#kpi-patients").text(stats.totals.patients);
      $("#kpi-appointments").text(stats.totals.appointmentsMonth);
      $("#kpi-records").text(stats.totals.recordsMonth);
      $("#kpi-prescriptions").text(stats.totals.prescriptions);
      $("#kpi-billing").text(dashFormatBRL(stats.billing.monthly));
      $("#kpi-billing-sub").text(
        stats.billing.appointments + " " + t("reports_appointments-unit"),
      );

      // today's schedule timeline
      var now = new Date();
      var dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      var dayEnd = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59,
        999,
      );
      var userId = currentUser._id;
      var events = Schedule.find(
        { resourceId: userId, start: { $gte: dayStart, $lt: dayEnd } },
        { sort: { start: 1 } },
      ).fetch();
      var $tl = $("#schedule-timeline");
      if (events.length) {
        var html = "";
        events.forEach(function (ev) {
          var timeStr = moment(ev.start).format("HH:mm");
          var diff = moment().diff(ev.start, "hours", true);
          var diffStr =
            diff > 0
              ? Math.round(diff) + " " + t("schedule_hours-ago")
              : Math.round(Math.abs(diff)) + " " + t("schedule_hours-from-now");
          var title =
            ev.title === "to-confirm"
              ? t("schedule_status-to-confirm")
              : ev.title || "";
          var patLink = ev.patient
            ? '<a href="#/patients/' +
              ev.patient +
              '"><b>' +
              Handlebars.escapeExpression(title) +
              "</b></a>"
            : "<b>" + Handlebars.escapeExpression(title) + "</b>";
          var btn =
            ev.status === "waiting"
              ? '<a href="#/patients/' +
                ev.patient +
                "?start_appointment=true&eventId=" +
                ev._id +
                '" class="btn btn-sm btn-primary iniciar-consulta-btn">' +
                '<i class="fa fa-play"></i>&nbsp;&nbsp;' +
                t("patients_start-appointment") +
                "</a>"
              : '<a href="#/patients/' +
                ev.patient +
                '" class="btn btn-sm btn-secondary iniciar-consulta-btn">' +
                '<i class="fa fa-folder-open-o"></i>&nbsp;&nbsp;' +
                t("patients_records") +
                "</a>";
          html +=
            '<div class="timeline-item"><div class="row">' +
            '<div class="col-xs-3 date"><i class="fa fa-clock-o"></i> ' +
            timeStr +
            '<br><small class="text-navy">' +
            Handlebars.escapeExpression(diffStr) +
            "</small></div>" +
            '<div class="col-xs-7 content no-top-border">' +
            '<p><div class="timeline-label">' +
            t("patients_patient") +
            ":</div>" +
            patLink +
            "</p>" +
            '<p class="m-b-xs"><div class="timeline-label">' +
            t("schedule_status") +
            ":</div>" +
            scheduleStatusBadge(ev.status) +
            "</p>" +
            btn +
            "</div></div></div>";
        });
        $tl.html(html);
      }

      // Charts
      if (typeof Chart === "undefined") return;
      var mk = function (id, cfg) {
        var el = document.getElementById(id);
        if (!el) return;
        new Chart(el.getContext("2d"), cfg);
      };

      mk("dash-appts", {
        type: "bar",
        data: {
          labels: stats.apptsByMonth.map(function (x) {
            return x.label;
          }),
          datasets: [
            {
              label: t("dashboard_appointments"),
              backgroundColor: DASH_PAL.blue,
              data: stats.apptsByMonth.map(function (x) {
                return x.value;
              }),
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: { display: false },
          scales: { yAxes: [{ ticks: { beginAtZero: true } }] },
        },
      });

      var rt = stats.recordsByType;
      mk("dash-records", {
        type: "doughnut",
        data: {
          labels: [
            t("dashboard_forms"),
            t("dashboard_prescriptions"),
            t("dashboard_exam-requests"),
            t("dashboard_certificates"),
          ],
          datasets: [
            {
              data: [
                rt.form,
                rt.prescription,
                rt.exam_request,
                rt.medical_certificate,
              ],
              backgroundColor: [
                DASH_PAL.blue,
                DASH_PAL.teal,
                DASH_PAL.red,
                DASH_PAL.yellow,
              ],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: { position: "bottom" },
          cutoutPercentage: 60,
        },
      });

      mk("dash-age", {
        type: "bar",
        data: {
          labels: stats.ageGroups.map(function (x) {
            return x.label;
          }),
          datasets: [
            {
              label: t("dashboard_patients"),
              backgroundColor: DASH_PAL.green,
              data: stats.ageGroups.map(function (x) {
                return x.value;
              }),
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: { display: false },
          scales: { yAxes: [{ ticks: { beginAtZero: true } }] },
        },
      });

      mk("dash-gender", {
        type: "doughnut",
        data: {
          labels: [t("dashboard_male"), t("dashboard_female")],
          datasets: [
            {
              data: [stats.gender.M, stats.gender.F],
              backgroundColor: [DASH_PAL.blue, DASH_PAL.pink],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: { position: "bottom" },
          cutoutPercentage: 60,
        },
      });
    });
  }


  S.pages.dashboard = function () {
    renderDashboard();
  };
})(window);
