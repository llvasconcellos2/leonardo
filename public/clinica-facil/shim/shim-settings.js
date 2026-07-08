/*
 * rip/ shim — settings form
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
  // Settings form
  // ---------------------------------------------------------------------------
  function initSettingsForm() {
    var s = Settings.findOne({}) || {};
    var $form = $("#settingsForm");
    if (!$form.length) return;
    if (s.workHoursStart)
      $form.find("[name=workHoursStart]").val(s.workHoursStart);
    if (s.workHoursEnd) $form.find("[name=workHoursEnd]").val(s.workHoursEnd);
    if (s.slotDuration) $form.find("[name=slotDuration]").val(s.slotDuration);
    if (s.appointmentValue)
      $form.find("[name=appointmentValue]").val(s.appointmentValue);
    if (s.address) $form.find("[name=address]").val(s.address);

    // Clockpicker on the two work-hours fields (mirrors src/app settings_form.js)
    function transformToClockPicker($input) {
      if (!$input.length || $input.parent().hasClass("clockpicker")) return;
      var $group = $(
        '<div class="input-group clockpicker" data-autoclose="true"></div>',
      );
      $input.before($group);
      $input.detach().appendTo($group);
      $group.append(
        '<span class="input-group-addon"><span class="glyphicon glyphicon-time"></span></span>',
      );
    }
    transformToClockPicker($form.find("[name=workHoursStart]"));
    transformToClockPicker($form.find("[name=workHoursEnd]"));
    if ($.fn.clockpicker) $form.find(".clockpicker").clockpicker();

    // slotDuration: compact input-group (mirrors src/app)
    var $slot = $form.find("[name=slotDuration]");
    if ($slot.length && !$slot.parent().hasClass("input-group")) {
      var $slotGroup = $('<div class="input-group size-sm"></div>');
      $slot.before($slotGroup);
      $slot.detach().appendTo($slotGroup);
    }

    // appointmentValue: "R$" addon (mirrors src/app)
    var $appt = $form.find("[name=appointmentValue]");
    if ($appt.length && !$appt.parent().hasClass("input-group")) {
      var $apptGroup = $('<div class="input-group size-sm"></div>');
      $appt.before($apptGroup);
      $apptGroup.append('<span class="input-group-addon">R$</span>');
      $appt.detach().appendTo($apptGroup);
    }

    // address: summernote rich-text editor (mirrors src/app)
    if ($.fn.summernote && !$("#s-address").data("summernote")) {
      $("#s-address").summernote({
        height: 150,
        lang: TAPi18n.getLanguage(),
        print: { stylesheetUrl: "vendor/summernote-print.css" },
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
      });
      if (s.address) $("#s-address").summernote("code", s.address);
    }

    $form.off("submit.ripSettings").on("submit.ripSettings", function (e) {
      e.preventDefault();
      var data = {};
      $form.serializeArray().forEach(function (f) {
        if (f.name === "address") return;
        if (f.value !== "") data[f.name] = f.value;
      });
      if ($.fn.summernote && $("#s-address").data("summernote")) {
        var addressHtml = $("#s-address").summernote("code");
        if (addressHtml && addressHtml !== "<p><br></p>")
          data.address = addressHtml;
      } else {
        var addressVal = $("#s-address").val();
        if (addressVal) data.address = addressVal;
      }
      if (data.slotDuration) data.slotDuration = Number(data.slotDuration);
      if (data.appointmentValue)
        data.appointmentValue = Number(data.appointmentValue);
      if (s._id) Settings.update(s._id, { $set: data });
      else s._id = Settings.insert(data);
      if (global.toastr)
        toastr.success(t("common_save-success"), t("common_success"));
    });

    // Persistence panel
    var P = global.Persistence;
    var $ps = $("#persist-status");
    var $pa = $("#persist-actions");
    if ($ps.length && P) {
      if (P.active) {
        $ps.html(
          '<div class="alert alert-success" style="margin-bottom:0">' +
            '<i class="fa fa-database"></i> ' +
            "<strong>Modo persistente ativo.</strong> " +
            "Suas alterações são salvas no IndexedDB do navegador e sobrevivem ao reload." +
            "</div>",
        );
        $pa.html(
          '<button type="button" class="btn btn-warning btn-sm m-r-sm" id="persist-reset-btn">' +
            '<i class="fa fa-refresh"></i> Restaurar dados originais (fixtures)' +
            "</button>" +
            '<button type="button" class="btn btn-default btn-sm m-r-sm" id="persist-disable-btn">' +
            '<i class="fa fa-power-off"></i> Desativar modo persistente' +
            "</button>" +
            backupRestoreButtonsHtml(),
        );
        $("#persist-reset-btn").on("click", function () {
          swal(
            {
              title: "Restaurar dados originais?",
              text: "Isso apagará todas as alterações salvas e recarregará os dados iniciais.",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#ed5565",
              confirmButtonText: "Sim, restaurar",
              cancelButtonText: "Cancelar",
            },
            function (confirmed) {
              if (confirmed) P.reset();
            },
          );
        });
        $("#persist-disable-btn").on("click", function () {
          P.disable();
        });
      } else {
        $ps.html(
          '<div class="alert alert-info" style="margin-bottom:0">' +
            '<i class="fa fa-info-circle"></i> ' +
            "<strong>Modo demo (em memória).</strong> " +
            "Alterações são perdidas ao recarregar a página." +
            "</div>",
        );
        $pa.html(
          '<button type="button" class="btn btn-primary btn-sm m-r-sm" id="persist-enable-btn">' +
            '<i class="fa fa-database"></i> Ativar modo persistente (IndexedDB)' +
            "</button>" +
            backupRestoreButtonsHtml(),
        );
        $("#persist-enable-btn").on("click", function () {
          P.enable();
        });
      }
      wireBackupRestoreButtons(P, $pa);
    }
  }

  // ---------------------------------------------------------------------------
  // Manual backup (export) / restore (import) — available in both demo and
  // persistent modes. Restore is always a full replace (never a merge): see
  // docs/BackupRestore.md for why (it's the thing that keeps the free rip/
  // version from doubling as a poor-man's multi-user sync via pendrive).
  // ---------------------------------------------------------------------------
  function backupRestoreButtonsHtml() {
    return (
      '<button type="button" class="btn btn-success btn-sm m-r-sm" id="persist-export-btn">' +
        '<i class="fa fa-download"></i> Exportar backup' +
        "</button>" +
        '<button type="button" class="btn btn-default btn-sm" id="persist-import-btn">' +
        '<i class="fa fa-upload"></i> Importar backup' +
        "</button>" +
        '<input type="file" accept=".json,application/json" id="persist-import-file" style="display:none">'
    );
  }

  function wireBackupRestoreButtons(P, $pa) {
    $pa.find("#persist-export-btn").on("click", function () {
      var json = P.serialize();
      var blob = new Blob([json], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var filename = "clinica-facil-backup-" + moment().format("YYYY-MM-DD-HHmm") + ".json";
      var $a = $("<a>").attr({ href: url, download: filename }).appendTo("body");
      $a[0].click();
      $a.remove();
      URL.revokeObjectURL(url);
    });

    var $file = $pa.find("#persist-import-file");
    $pa.find("#persist-import-btn").on("click", function () {
      $file.val("").trigger("click");
    });

    $file.on("change", function (e) {
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        var text = reader.result;
        var parsed;
        try {
          parsed = JSON.parse(text);
          if (!parsed || parsed.format !== "clinica-facil-rip-backup" || !parsed.collections) {
            throw new Error("invalid backup format");
          }
        } catch (err) {
          toastr.error(
            "Arquivo inválido. Selecione um backup exportado por esta aplicação.",
            "Erro",
          );
          return;
        }
        var nPatients = (parsed.collections.patients || []).length;
        var nAppointments = (parsed.collections.appointments || []).length;
        swal(
          {
            title: "Restaurar backup?",
            text:
              "Isso substituirá TODOS os dados locais deste navegador (" +
              nPatients + " pacientes, " + nAppointments + " agendamentos) " +
              "pelos dados do arquivo selecionado. Esta ação não pode ser desfeita.",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ed5565",
            confirmButtonText: "Sim, restaurar",
            cancelButtonText: "Cancelar",
          },
          function (confirmed) {
            if (!confirmed) return;
            try {
              var result = P.restore(parsed);
              if (result && typeof result.then === "function") {
                result.catch(function (err) {
                  console.warn("[rip] restore failed:", err);
                  toastr.error("Falha ao restaurar backup.", "Erro");
                });
              }
            } catch (err) {
              toastr.error("Falha ao restaurar backup.", "Erro");
            }
          },
        );
      };
      reader.readAsText(file);
    });
  }


  S.pages.settingsForm = function () {
    initSettingsForm();
  };
})(window);
