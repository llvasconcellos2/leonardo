/*
 * rip/ shim — CSV import (Papa Parse)
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
  // CSV import (Papa Parse)
  // ---------------------------------------------------------------------------
  var REQUIRED_FIELDS = ["name", "gender", "mobile"];
  var DATE_FIELDS = ["dateOfBirth", "returnDate", "createdAt"];

  function initImport() {
    var $file = $("#import-csv-file");
    var $parse = $("#import-parse-btn");
    var parsedRows = [];

    $file.off("change.rip").on("change.rip", function () {
      $parse.prop("disabled", !this.files || !this.files[0]);
    });

    $parse.off("click.rip").on("click.rip", function () {
      var file = $file[0].files && $file[0].files[0];
      if (!file) return;
      if (typeof Papa === "undefined") {
        toastr.error("Papa Parse não carregado", t("common_error"));
        return;
      }
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          parsedRows = results.data;
          showPreview(parsedRows, results.meta.fields || []);
        },
        error: function (err) {
          toastr.error(err.message, t("common_error"));
        },
      });
    });

    function showPreview(rows, fields) {
      var errors = [];
      rows.forEach(function (row, i) {
        REQUIRED_FIELDS.forEach(function (f) {
          if (!row[f])
            errors.push(
              "Linha " + (i + 2) + ": campo obrigatório ausente — " + f,
            );
        });
      });

      var $errPanel = $("#import-errors-panel");
      if (errors.length) {
        var $list = $("#import-errors-list").empty();
        errors.forEach(function (e) {
          $list.append("<li>" + e + "</li>");
        });
        $errPanel.show();
        $("#import-confirm-btn").prop("disabled", true);
      } else {
        $errPanel.hide();
        $("#import-confirm-btn").prop("disabled", false);
      }

      // Preview table (first 20 rows)
      var cols = (fields.length ? fields : Object.keys(rows[0] || {})).slice(
        0,
        12,
      );
      var thead =
        "<tr>" +
        cols
          .map(function (c) {
            return "<th>" + c + "</th>";
          })
          .join("") +
        "</tr>";
      var tbody = rows
        .slice(0, 20)
        .map(function (row) {
          return (
            "<tr>" +
            cols
              .map(function (c) {
                return (
                  "<td style='white-space:nowrap;font-size:11px'>" +
                  (row[c] || "") +
                  "</td>"
                );
              })
              .join("") +
            "</tr>"
          );
        })
        .join("");

      $("#import-preview-wrap").html(
        '<table class="table table-bordered table-hover table-condensed"><thead>' +
          thead +
          "</thead><tbody>" +
          tbody +
          "</tbody></table>",
      );
      $("#import-info-msg").text(
        rows.length +
          " paciente(s) encontrado(s). " +
          (rows.length > 20 ? "Mostrando os primeiros 20." : ""),
      );

      $("#import-step-upload").hide();
      $("#import-step-preview").show();
    }

    $("#import-back-btn")
      .off("click.rip")
      .on("click.rip", function () {
        $("#import-step-preview").hide();
        $("#import-step-upload").show();
        parsedRows = [];
      });

    $("#import-confirm-btn")
      .off("click.rip")
      .on("click.rip", function () {
        var imported = 0;
        parsedRows.forEach(function (row) {
          var doc = {};
          Object.keys(row).forEach(function (k) {
            if (!row[k]) return;
            if (DATE_FIELDS.indexOf(k) >= 0) {
              var d = moment(row[k]);
              if (d.isValid()) doc[k] = d.toDate();
            } else if (k === "special_prescription") {
              doc[k] = row[k] === "true" || row[k] === "1";
            } else {
              doc[k] = row[k];
            }
          });
          if (doc.name && doc.gender) {
            doc.createdAt = doc.createdAt || new Date();
            Patients.insert(doc);
            imported++;
          }
        });
        $("#import-step-preview").hide();
        $("#import-done-msg").text(
          imported + " paciente(s) importado(s) com sucesso!",
        );
        $("#import-step-done").show();
      });
  }

  S.pages.import = function () {
    initImport();
  };
})(window);
