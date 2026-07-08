/*
 * rip/ shim — reports — appointments / patients / production
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
  // Report pages
  // ---------------------------------------------------------------------------
  var REPORT_PAL = {
    blue: "#1c84c6",
    green: "#1ab394",
    teal: "#23c6c8",
    yellow: "#f8ac59",
    red: "#ed5565",
    pink: "#ec90c5",
  };

  function ageFromDob(dob) {
    if (!dob) return null;
    return Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 86400000));
  }

  function mkChart(id, cfg) {
    var el = document.getElementById(id);
    if (!el) return;
    if (el._chartInstance) {
      el._chartInstance.destroy();
    }
    el._chartInstance = new Chart(el.getContext("2d"), cfg);
  }

  function initReportAppointments() {
    getDtLang(function (lang) {
      var data = Appointments.find({}, { sort: { start: -1 } }).fetch();
      initDT("report-appts-table", data, [
        {
          title: T9n.get("groupMD"),
          data: "user.name",
          render: function (cellData) {
            return cellData ? Handlebars.escapeExpression(cellData) : "";
          },
        },
        {
          title: T9n.get("patient"),
          data: "patient.name",
          render: function (cellData, renderType, currentRow) {
            var id = currentRow.patient && currentRow.patient._id;
            var name = cellData ? Handlebars.escapeExpression(cellData) : "";
            if (!id) return name;
            return (
              '<a href="' + FlowRouter.path("patientEdit", { _id: id }) + '">' + name + "</a>"
            );
          },
        },
        {
          title: T9n.get("start"),
          data: "start",
          render: function (cellData) {
            return cellData ? moment(cellData).format("DD/MM/YYYY HH:mm") : "";
          },
        },
        {
          title: T9n.get("end"),
          data: "end",
          render: function (cellData) {
            return cellData ? moment(cellData).format("DD/MM/YYYY HH:mm") : "";
          },
        },
        {
          title: T9n.get("time"),
          data: "end",
          render: function (cellData, renderType, currentRow) {
            if (!cellData) return "";
            return moment.duration(moment(cellData).diff(currentRow.start)).humanize();
          },
        },
        {
          title: T9n.get("status"),
          data: "status",
          render: function (cellData) {
            return apptStatusBadge(cellData);
          },
        },
        {
          title: T9n.get("records"),
          data: "patient._id",
          orderable: false,
          render: function (cellData, renderType, currentRow) {
            if (!cellData) return "";
            var date = moment(currentRow.start).format("DD/MM/YYYY");
            var href =
              FlowRouter.path("patientEdit", { _id: cellData }) +
              "?tab=records&date=" +
              encodeURIComponent(date);
            return (
              '<a class="btn btn-xs btn-info" href="' +
              href +
              '" title="' +
              date +
              '"><i class="fa fa-stethoscope" aria-hidden="true"></i> ' +
              date +
              "</a>"
            );
          },
        },
      ]);
    });
  }

  function initReportPatients() {
    Meteor.call("dashboardStats", function (err, stats) {
      if (err || !stats) return;
      mkChart("rep-age", {
        type: "bar",
        data: {
          labels: stats.ageGroups.map(function (x) {
            return x.label;
          }),
          datasets: [
            {
              label: t("reports_patients"),
              backgroundColor: REPORT_PAL.green,
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
      mkChart("rep-gender", {
        type: "doughnut",
        data: {
          labels: [t("dashboard_male"), t("dashboard_female")],
          datasets: [
            {
              data: [stats.gender.M, stats.gender.F],
              backgroundColor: [REPORT_PAL.blue, REPORT_PAL.pink],
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
    getDtLang(function (lang) {
      var defaultAvatar = "images/default-user-image.png";
      initDT(
        "report-patients-table",
        Patients.find({}, { sort: { name: 1 } }).fetch(),
        [
          {
            title: T9n.get("name"),
            data: "name",
            render: function (cellData, renderType, currentRow) {
              var name = cellData ? Handlebars.escapeExpression(cellData) : "";
              return (
                '<a href="' +
                FlowRouter.path("patientEdit", { _id: currentRow._id }) +
                '">' +
                name +
                "</a>"
              );
            },
          },
          {
            title: T9n.get("gender"),
            data: "gender",
            render: function (g) {
              if (g === "M") return '<span class="label label-info">' + t("M") + "</span>";
              if (g === "F")
                return '<span class="label" style="background:' + REPORT_PAL.pink + '">' + t("F") + "</span>";
              return "";
            },
          },
          {
            title: T9n.get("dateOfBirth"),
            data: "dateOfBirth",
            render: function (d) {
              var age = ageFromDob(d);
              return d ? moment(d).format("DD/MM/YYYY") + (age != null ? " (" + age + ")" : "") : "";
            },
          },
          { title: T9n.get("city"), data: "city", defaultContent: "" },
          { title: T9n.get("phone"), data: "phone", defaultContent: "" },
        ],
      );
    });
  }

  function initReportProduction() {
    Meteor.call("productionStats", function (err, stats) {
      if (err || !stats) return;
      $("#prod-billing-value").text(dashFormatBRL(stats.billing.monthly));
      $("#prod-billing-sub").text(
        stats.billing.appointments +
          " " +
          t("reports_appointments-unit") +
          " × " +
          dashFormatBRL(stats.billing.value),
      );
      $("#prod-total-form").text(stats.totals.form);
      $("#prod-total-prescription").text(stats.totals.prescription);
      $("#prod-total-exam").text(stats.totals.exam_request);
      $("#prod-total-cert").text(stats.totals.medical_certificate);

      var labels = stats.byMonth.map(function (m) {
        return m.label;
      });
      mkChart("prod-month", {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: t("dashboard_forms"),
              backgroundColor: REPORT_PAL.blue,
              data: stats.byMonth.map(function (m) {
                return m.form;
              }),
            },
            {
              label: t("dashboard_prescriptions"),
              backgroundColor: REPORT_PAL.teal,
              data: stats.byMonth.map(function (m) {
                return m.prescription;
              }),
            },
            {
              label: t("dashboard_exam-requests"),
              backgroundColor: REPORT_PAL.red,
              data: stats.byMonth.map(function (m) {
                return m.exam_request;
              }),
            },
            {
              label: t("dashboard_certificates"),
              backgroundColor: REPORT_PAL.yellow,
              data: stats.byMonth.map(function (m) {
                return m.medical_certificate;
              }),
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [{ stacked: true }],
            yAxes: [{ stacked: true, ticks: { beginAtZero: true } }],
          },
          legend: { position: "bottom" },
        },
      });
    });
  }


  S.pages.reportAppointments = function () {
    initReportAppointments();
  };
  S.pages.reportPatients = function () {
    initReportPatients();
  };
  S.pages.reportProduction = function () {
    initReportProduction();
  };
})(window);
