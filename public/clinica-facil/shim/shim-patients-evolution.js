/*
 * rip/ shim — patients — evolution tab (vitals series + Chart.js)
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
  // Patient evolution tab — vitals series + Chart.js charts
  // ---------------------------------------------------------------------------
  var EVO_PAL = {
    blue: "#1c84c6",
    green: "#1ab394",
    teal: "#23c6c8",
    yellow: "#f8ac59",
    red: "#ed5565",
    muted: "#9aa4ac",
  };
  var _evoCharts = {};

  function fieldVal(rec, name) {
    for (var i = 0; i < rec.record.length; i++) {
      if (rec.record[i].name === name) {
        var v = parseFloat(String(rec.record[i].value).replace(",", "."));
        return isNaN(v) ? null : v;
      }
    }
    return null;
  }

  function lastNonNull(arr) {
    for (var i = arr.length - 1; i >= 0; i--) if (arr[i] != null) return arr[i];
    return null;
  }
  function firstNonNull(arr) {
    for (var i = 0; i < arr.length; i++) if (arr[i] != null) return arr[i];
    return null;
  }
  function seriesDelta(arr) {
    var f = firstNonNull(arr),
      l = lastNonNull(arr);
    return f != null && l != null ? Math.round((l - f) * 10) / 10 : null;
  }

  function imcClassify(v) {
    if (v == null) return { label: "—", cls: "default" };
    if (v < 18.5) return { label: t("evolution_imc-underweight"), cls: "info" };
    if (v < 25) return { label: t("evolution_imc-normal"), cls: "primary" };
    if (v < 30) return { label: t("evolution_imc-overweight"), cls: "warning" };
    if (v < 35) return { label: t("evolution_imc-obese-1"), cls: "warning" };
    if (v < 40) return { label: t("evolution_imc-obese-2"), cls: "danger" };
    return { label: t("evolution_imc-obese-3"), cls: "danger" };
  }

  function paClassify(sys, dia) {
    if (sys == null || dia == null) return { label: "—", cls: "default" };
    if (sys < 120 && dia < 80)
      return { label: t("evolution_pa-optimal"), cls: "primary" };
    if (sys < 140 && dia < 90)
      return { label: t("evolution_pa-elevated"), cls: "warning" };
    return { label: t("evolution_pa-high"), cls: "danger" };
  }

  function buildVitalsSeries(patientId) {
    var recs = PatientRecords.find(
      { patientId: patientId, recordName: "Triagem e Sinais Vitais" },
      { sort: { date: 1 } },
    ).fetch();
    var s = {
      labels: [],
      imc: [],
      peso: [],
      altura: null,
      sys: [],
      dia: [],
      fc: [],
      spo2: [],
      n: recs.length,
      first: null,
      last: null,
    };
    recs.forEach(function (r) {
      var peso = fieldVal(r, "peso"),
        alt = fieldVal(r, "altura");
      var imc =
        peso && alt
          ? Math.round((peso / Math.pow(alt / 100, 2)) * 10) / 10
          : null;
      if (alt) s.altura = alt;
      s.labels.push(moment(r.date).format("DD/MM/YY"));
      s.imc.push(imc);
      s.peso.push(peso);
      s.sys.push(fieldVal(r, "pressao-sistolica"));
      s.dia.push(fieldVal(r, "pressao-diastolica"));
      s.fc.push(fieldVal(r, "frequencia-cardiaca"));
      s.spo2.push(fieldVal(r, "saturacao-oxigenio"));
    });
    if (recs.length) {
      s.first = recs[0].date;
      s.last = recs[recs.length - 1].date;
    }
    return s;
  }

  function buildExamList(patientId) {
    var docs = PatientExams.find({ patientId: patientId }).fetch();
    var by = {};
    docs.forEach(function (d) {
      (d.results || []).forEach(function (r) {
        if (
          !r.examName ||
          parseFloat(String(r.value).replace(",", ".")) == null
        )
          return;
        var e =
          by[r.examName] ||
          (by[r.examName] = { name: r.examName, unit: r.unit || "", count: 0 });
        e.count++;
        if (r.unit) e.unit = r.unit;
      });
    });
    return Object.keys(by)
      .map(function (k) {
        return by[k];
      })
      .filter(function (e) {
        return e.count >= 2;
      })
      .sort(function (a, b) {
        return b.count - a.count || a.name.localeCompare(b.name);
      });
  }

  function buildExamSeries(patientId, name) {
    var docs = PatientExams.find(
      { patientId: patientId },
      { sort: { datePerformed: 1 } },
    ).fetch();
    var out = { labels: [], values: [], altered: [], refs: [], unit: "" };
    docs.forEach(function (d) {
      (d.results || []).forEach(function (r) {
        if (r.examName !== name) return;
        var v = parseFloat(String(r.value || "").replace(",", "."));
        if (isNaN(v)) return;
        out.labels.push(moment(d.datePerformed).format("DD/MM/YY"));
        out.values.push(v);
        out.altered.push(!!r.isAltered);
        out.refs.push(r.referenceUsed || "");
        if (r.unit) out.unit = r.unit;
      });
    });
    return out;
  }

  function drawEvoCharts(s, examList, patientId) {
    Object.keys(_evoCharts).forEach(function (k) {
      try {
        _evoCharts[k].destroy();
      } catch (e) {}
    });
    _evoCharts = {};

    function lineCfg(datasets) {
      return {
        type: "line",
        data: { labels: s.labels, datasets: datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: { display: datasets.length > 1, position: "bottom" },
          tooltips: { mode: "index", intersect: false },
          elements: {
            line: { tension: 0.3 },
            point: { radius: 2, hitRadius: 8 },
          },
          scales: { yAxes: [{ ticks: { beginAtZero: false } }] },
        },
      };
    }
    function ds(label, color, fill) {
      return {
        label: label,
        borderColor: color,
        backgroundColor: fill || "transparent",
        pointBackgroundColor: color,
        borderWidth: 2,
        fill: !!fill,
        data: [],
        spanGaps: true,
      };
    }
    function mk(id, cfg) {
      var el = document.getElementById(id);
      if (!el) return;
      _evoCharts[id] = new Chart(el.getContext("2d"), cfg);
    }

    var imcCfg = lineCfg([
      ds(t("evolution_imc"), EVO_PAL.blue, "rgba(28,132,198,0.08)"),
    ]);
    imcCfg.data.datasets[0].data = s.imc;
    mk("evo-imc", imcCfg);

    var pesoCfg = lineCfg([
      ds(t("evolution_weight"), EVO_PAL.green, "rgba(26,179,148,0.08)"),
    ]);
    pesoCfg.data.datasets[0].data = s.peso;
    mk("evo-peso", pesoCfg);

    var sysDs = ds(t("evolution_pa-systolic"), EVO_PAL.red);
    var diaDs = ds(t("evolution_pa-diastolic"), EVO_PAL.yellow);
    sysDs.data = s.sys;
    diaDs.data = s.dia;
    mk("evo-pa", lineCfg([sysDs, diaDs]));

    var fcDs = ds(t("evolution_heart-rate"), EVO_PAL.teal);
    var spo2Ds = ds("SpO₂ (%)", EVO_PAL.muted);
    fcDs.data = s.fc;
    spo2Ds.data = s.spo2;
    mk("evo-fc", lineCfg([fcDs, spo2Ds]));

    // exam chart — first exam in list by default
    var el = document.getElementById("evo-exam");
    if (el && examList.length) {
      var exName = examList[0].name;
      var es = buildExamSeries(patientId, exName);
      var pts = es.altered.map(function (a) {
        return a ? EVO_PAL.red : EVO_PAL.green;
      });
      _evoCharts["evo-exam"] = new Chart(el.getContext("2d"), {
        type: "line",
        data: {
          labels: es.labels,
          datasets: [
            {
              label: exName + (es.unit ? " (" + es.unit + ")" : ""),
              data: es.values,
              borderColor: EVO_PAL.blue,
              backgroundColor: "rgba(28,132,198,0.06)",
              pointBackgroundColor: pts,
              pointBorderColor: pts,
              pointRadius: 4,
              borderWidth: 2,
              fill: true,
              spanGaps: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: { display: false },
          elements: { line: { tension: 0.3 }, point: { hitRadius: 8 } },
          scales: { yAxes: [{ ticks: { beginAtZero: false } }] },
        },
      });
      $("#evo-exam-select").on("change.ripEvo", function () {
        var name = $(this).val();
        if (_evoCharts["evo-exam"]) _evoCharts["evo-exam"].destroy();
        var es2 = buildExamSeries(patientId, name);
        var pts2 = es2.altered.map(function (a) {
          return a ? EVO_PAL.red : EVO_PAL.green;
        });
        _evoCharts["evo-exam"] = new Chart(
          document.getElementById("evo-exam").getContext("2d"),
          {
            type: "line",
            data: {
              labels: es2.labels,
              datasets: [
                {
                  label: name,
                  data: es2.values,
                  borderColor: EVO_PAL.blue,
                  backgroundColor: "rgba(28,132,198,0.06)",
                  pointBackgroundColor: pts2,
                  pointBorderColor: pts2,
                  pointRadius: 4,
                  borderWidth: 2,
                  fill: true,
                  spanGaps: true,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              legend: { display: false },
              elements: { line: { tension: 0.3 } },
              scales: { yAxes: [{ ticks: { beginAtZero: false } }] },
            },
          },
        );
      });
    }
  }

  function initEvolutionTab(patientId) {
    if (!patientId) return;
    var s = buildVitalsSeries(patientId);
    var examList = buildExamList(patientId);
    if (s.n === 0 && examList.length === 0) return; // leave empty state

    var imc = lastNonNull(s.imc),
      peso = lastNonNull(s.peso),
      sys = lastNonNull(s.sys),
      dia = lastNonNull(s.dia),
      fc = lastNonNull(s.fc);
    var imcC = imcClassify(imc),
      paC = paClassify(sys, dia);
    var dImc = seriesDelta(s.imc),
      dPeso = seriesDelta(s.peso);
    var fmtD = function (d) {
      return d && d !== 0 ? (d > 0 ? "+" : "") + d : null;
    };
    var dCls = function (d, gd) {
      return !d || d === 0
        ? "text-muted"
        : d < 0 === gd
          ? "text-navy"
          : "text-danger";
    };
    var span = s.first
      ? moment(s.first).format("MMM/YY") +
        " – " +
        moment(s.last).format("MMM/YY")
      : "";

    var imcD = fmtD(dImc),
      pesoD = fmtD(dPeso);
    var exPicker = examList.length
      ? '<div class="pull-right evo-exam-picker"><label class="evo-exam-label">' +
        t("evolution_exam-select") +
        "</label>" +
        '<select id="evo-exam-select" class="form-control input-sm evo-exam-select">' +
        examList
          .map(function (e) {
            return (
              '<option value="' +
              escH(e.name) +
              '">' +
              escH(e.name) +
              (e.unit ? " (" + escH(e.unit) + ")" : "") +
              "</option>"
            );
          })
          .join("") +
        "</select></div>"
      : "";
    var exBlock = examList.length
      ? '<div class="row"><div class="col-lg-12"><div class="ibox">' +
        '<div class="ibox-title"><h5><i class="fa fa-flask"></i> ' +
        t("evolution_exam-results") +
        "</h5>" +
        exPicker +
        "</div>" +
        '<div class="ibox-content"><div class="evo-chart-wrap"><canvas id="evo-exam"></canvas></div></div>' +
        "</div></div></div>"
      : "";

    var html =
      '<div class="panel-body evolution-pane">' +
      '<div class="row">' +
      '<div class="col-md-3 col-sm-6"><div class="ibox"><div class="ibox-content evo-summary">' +
      '<span class="evo-summary-label">' +
      t("evolution_imc") +
      "</span>" +
      '<h2 class="evo-summary-value">' +
      (imc != null ? imc : "—") +
      " <small>kg/m²</small></h2>" +
      '<span class="label label-' +
      imcC.cls +
      '">' +
      imcC.label +
      "</span>" +
      (imcD
        ? '<div class="evo-delta ' +
          dCls(dImc, true) +
          '"><i class="fa ' +
          (dImc < 0 ? "fa-arrow-down" : "fa-arrow-up") +
          '"></i> ' +
          imcD +
          " kg/m² " +
          t("evolution_since-first") +
          "</div>"
        : "") +
      "</div></div></div>" +
      '<div class="col-md-3 col-sm-6"><div class="ibox"><div class="ibox-content evo-summary">' +
      '<span class="evo-summary-label">' +
      t("evolution_weight") +
      "</span>" +
      '<h2 class="evo-summary-value">' +
      (peso != null ? peso : "—") +
      " <small>kg</small></h2>" +
      '<span class="text-muted">' +
      t("evolution_height") +
      ": " +
      (s.altura != null ? s.altura : "—") +
      " cm</span>" +
      (pesoD
        ? '<div class="evo-delta ' +
          dCls(dPeso, true) +
          '"><i class="fa ' +
          (dPeso < 0 ? "fa-arrow-down" : "fa-arrow-up") +
          '"></i> ' +
          pesoD +
          " kg " +
          t("evolution_since-first") +
          "</div>"
        : "") +
      "</div></div></div>" +
      '<div class="col-md-3 col-sm-6"><div class="ibox"><div class="ibox-content evo-summary">' +
      '<span class="evo-summary-label">' +
      t("evolution_blood-pressure") +
      "</span>" +
      '<h2 class="evo-summary-value">' +
      (sys != null ? sys : "—") +
      "/" +
      (dia != null ? dia : "—") +
      " <small>mmHg</small></h2>" +
      '<span class="label label-' +
      paC.cls +
      '">' +
      paC.label +
      "</span>" +
      "</div></div></div>" +
      '<div class="col-md-3 col-sm-6"><div class="ibox"><div class="ibox-content evo-summary">' +
      '<span class="evo-summary-label">' +
      t("evolution_heart-rate") +
      "</span>" +
      '<h2 class="evo-summary-value">' +
      (fc != null ? fc : "—") +
      " <small>bpm</small></h2>" +
      '<span class="text-muted">' +
      s.n +
      " " +
      t("evolution_measurements") +
      " · " +
      span +
      "</span>" +
      "</div></div></div>" +
      "</div>" +
      '<div class="row">' +
      '<div class="col-lg-6"><div class="ibox"><div class="ibox-title"><h5><i class="fa fa-line-chart"></i> ' +
      t("evolution_imc") +
      '</h5><span class="label label-info pull-right">' +
      t("evolution_imc-subtitle") +
      '</span></div><div class="ibox-content"><div class="evo-chart-wrap"><canvas id="evo-imc"></canvas></div></div></div></div>' +
      '<div class="col-lg-6"><div class="ibox"><div class="ibox-title"><h5><i class="fa fa-balance-scale"></i> ' +
      t("evolution_weight") +
      '</h5></div><div class="ibox-content"><div class="evo-chart-wrap"><canvas id="evo-peso"></canvas></div></div></div></div>' +
      "</div>" +
      '<div class="row">' +
      '<div class="col-lg-6"><div class="ibox"><div class="ibox-title"><h5><i class="fa fa-heartbeat"></i> ' +
      t("evolution_blood-pressure") +
      '</h5></div><div class="ibox-content"><div class="evo-chart-wrap"><canvas id="evo-pa"></canvas></div></div></div></div>' +
      '<div class="col-lg-6"><div class="ibox"><div class="ibox-title"><h5><i class="fa fa-heart"></i> ' +
      t("evolution_heart-rate") +
      ' &amp; SpO₂</h5></div><div class="ibox-content"><div class="evo-chart-wrap"><canvas id="evo-fc"></canvas></div></div></div></div>' +
      "</div>" +
      exBlock +
      "</div>";

    var el = document.getElementById("evolution-tab-content");
    if (el) el.innerHTML = html;

    // Draw charts once the tab becomes visible (canvas sizing requires display)
    function doDrawEvo() {
      drawEvoCharts(s, examList, patientId);
    }
    $('a[href="#evolution-tab"]')
      .off("shown.bs.tab.ripEvo")
      .on("shown.bs.tab.ripEvo", function () {
        setTimeout(doDrawEvo, 50);
      });
    // If tab is already active (shouldn't happen on load but guard it)
    if ($("#evolution-tab").is(":visible")) setTimeout(doDrawEvo, 50);
  }

  S.initEvolutionTab = initEvolutionTab;
})(window);
