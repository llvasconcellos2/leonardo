/*
 * rip/ shim — doctors — list + form (edit-only; created via Users)
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

  function initDoctorList() {
    var doctors = Meteor.users
      .find({ "profile.group": "medical_doctor" })
      .fetch();
    var defaultAvatar = "images/default-user-image.png";
    initDT(
      "doctors-table",
      doctors,
      [
        {
          title: "",
          data: "profile.picture",
          orderable: false,
          render: function (cellData, type, row) {
            var url = defaultAvatar;
            if (cellData) {
              var img = Images.findOne({ _id: cellData });
              if (img) url = img.link();
            } else {
              var email = row.emails && row.emails[0] && row.emails[0].address;
              if (email)
                // Gravatar's `default` must be an absolute URL or a keyword; a
                // relative path resolves against Gravatar's CDN and 400s. Ask
                // for a 404 instead and fall back to the local avatar via onerror.
                url = Gravatar.imageUrl(email, {
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
        {
          title: T9n.get("name"),
          data: "profile.firstName",
          render: function (d, t, row) {
            return (
              (row.profile.firstName || "") + " " + (row.profile.lastName || "")
            );
          },
        },
        {
          title: '<i class="fa fa-envelope"></i> Email',
          data: "emails",
          render: function (d, t, row) {
            return row.emails && row.emails[0] ? row.emails[0].address : "";
          },
        },
        {
          title: T9n.get("enabled"),
          data: "isUserEnabled",
          orderable: false,
          render: function (d, t, row) {
            var on = row.isUserEnabled;
            return (
              '<span class="label label-' +
              (on ? "primary" : "danger") +
              '">' +
              T9n.get(on ? "enabled" : "disabled") +
              "</span>"
            );
          },
        },
        {
          data: "_id",
          orderable: false,
          render: function (id) {
            return (
              '<a class="btn btn-info" href="' +
              FlowRouter.path("doctorEdit", { _id: id }) +
              '">' +
              '<i class="fa fa-pencil"></i></a>'
            );
          },
        },
      ],
      function (row) {
        FlowRouter.go("doctorEdit", { _id: row._id });
      },
    );
  }

  // ---------------------------------------------------------------------------
  // Doctor form (workHours grid + Summernote signature + Chosen selects)
  // ---------------------------------------------------------------------------
  var DOCTOR_COLOR_PALETTE = [
    "#3f81c6",
    "#504bd0",
    "#b1932c",
    "#dd4f97",
    "#17cccc",
    "#55a7ff",
    "#8a86ff",
    "#ebc444",
    "#ff86c3",
    "#31dd81",
    "#ff9055",
    "#F44336",
    "#E91E63",
    "#9C27B0",
    "#673AB7",
    "#3F51B5",
    "#2196F3",
    "#03A9F4",
    "#00BCD4",
    "#009688",
    "#4CAF50",
    "#8BC34A",
    "#CDDC39",
    "#FFEB3B",
    "#FFC107",
    "#FF9800",
    "#FF5722",
    "#795548",
    "#9E9E9E",
    "#607D8B",
  ];

  function buildHoursSlot(start, end, isFirst) {
    var cpInput = function (val) {
      return (
        '<div class="input-group clockpicker" data-autoclose="true" style="width:100px">' +
        '<input type="text" class="form-control" value="' +
        (val || "") +
        '">' +
        '<span class="input-group-addon"><span class="glyphicon glyphicon-time"></span></span></div>'
      );
    };
    var btn = isFirst
      ? '<button class="btn btn-sm btn-primary add-hours-slot" type="button"><i class="fa fa-plus"></i></button>'
      : '<button class="btn btn-sm btn-default remove-hours-slot" type="button"><i class="fa fa-times"></i></button>';
    return (
      '<div class="hours" style="display:flex;align-items:center;gap:8px;margin-top:6px">' +
      '<div class="hours-start">' +
      cpInput(start) +
      "</div>" +
      '<div class="clockpicker-separator">—</div>' +
      '<div class="hours-end">' +
      cpInput(end) +
      "</div>" +
      btn +
      "</div>"
    );
  }

  function buildWorkHoursDay(day, hours) {
    var dayName = moment().startOf("week").add(day, "days").format("dddd");
    var hasHours = hours && hours.length > 0;
    return (
      '<div id="day-of-week-' +
      day +
      '" class="form-group">' +
      '<label style="width:110px;display:inline-block">' +
      dayName +
      "</label>" +
      '<label class="m-r-sm"><input type="checkbox" class="wh-toggle"' +
      (hasHours ? " checked" : "") +
      "> " +
      '<span class="m-l-xs">' +
      (hasHours ? t("common_enabled") : t("common_disabled")) +
      "</span></label>" +
      '<div class="hours-container"' +
      (hasHours ? "" : ' style="display:none"') +
      ">" +
      (hasHours
        ? hours
            .map(function (sl, i) {
              return buildHoursSlot(sl.start, sl.end, i === 0);
            })
            .join("")
        : buildHoursSlot("", "", true)) +
      "</div></div>"
    );
  }

  function initDoctorForm(id) {
    var doctor = id ? Meteor.users.findOne({ _id: id }) : null;
    if (!doctor) {
      FlowRouter.go("doctorList");
      return;
    }
    var profile = doctor.profile || {};

    $("#doctor-form-title").text(
      (profile.firstName || "") + " " + (profile.lastName || ""),
    );
    $("[name=CRM]").val(profile.CRM || "");

    // Summernote for signature
    var $sig = $("textarea[name=signature]");
    if ($.fn.summernote) {
      $sig.summernote({
        height: 150,
        lang: "pt-BR",
        toolbar: [
          ["style", ["bold", "italic", "underline", "clear"]],
          ["para", ["ul", "ol"]],
          ["misc", ["codeview"]],
        ],
      });
      if (profile.signature) $sig.summernote("code", profile.signature);
    } else {
      $sig.val(profile.signature || "");
    }

    // Populate specialties chosen
    var $specSel = $("#doctor-specialties");
    Specialties.find({}, { sort: { name: 1 } })
      .fetch()
      .forEach(function (s) {
        var selected = (doctor.specialties || []).indexOf(s.name) >= 0;
        $specSel.append(
          '<option value="' +
            s.name +
            '"' +
            (selected ? " selected" : "") +
            ">" +
            s.name +
            "</option>",
        );
      });

    // Populate color chosen
    var $colorSel = $("#doctor-color");
    DOCTOR_COLOR_PALETTE.forEach(function (c) {
      $colorSel.append(
        '<option value="' +
          c +
          '"' +
          (doctor.color === c ? " selected" : "") +
          ">" +
          c +
          "</option>",
      );
    });

    if ($.fn.chosen) {
      $specSel.chosen({ width: "100%" });
      $colorSel.chosen({ width: "100%" });
    }

    // Work hours grid
    var wh = doctor.workHours || [];
    var gridHtml = "";
    for (var d = 0; d < 7; d++) {
      gridHtml += buildWorkHoursDay(d, wh[d]);
    }
    $("#work-hours-grid").html(gridHtml);

    if ($.fn.clockpicker) {
      $("#work-hours-grid .clockpicker").clockpicker({ autoclose: true });
    }

    // Toggle checkbox → show/hide hours-container + update label
    $("#work-hours-grid").on("change", ".wh-toggle", function () {
      var $day = $(this).closest(".form-group");
      var on = $(this).prop("checked");
      $day.find(".hours-container").toggle(on);
      $(this)
        .next("span")
        .text(on ? t("common_enabled") : t("common_disabled"));
    });

    // Add extra time slot
    $("#work-hours-grid").on("click", ".add-hours-slot", function () {
      var $container = $(this).closest(".hours-container");
      var $slot = $(buildHoursSlot("", "", false));
      $slot.find(".remove-hours-slot").on("click", function () {
        $slot.remove();
      });
      if ($.fn.clockpicker)
        $slot.find(".clockpicker").clockpicker({ autoclose: true });
      $container.append($slot);
    });

    // Remove time slot
    $("#work-hours-grid").on("click", ".remove-hours-slot", function () {
      $(this).closest(".hours").remove();
    });

    // Cancel
    $("#doctor-form .cancel")
      .off("click.rip")
      .on("click.rip", function () {
        FlowRouter.go("doctorList");
      });

    // Submit
    $("#doctor-form")
      .off("submit.rip")
      .on("submit.rip", function (e) {
        e.preventDefault();
        var hours = [];
        for (var dd = 0; dd < 7; dd++) {
          var $day = $("#day-of-week-" + dd);
          if ($day.find(".wh-toggle").prop("checked")) {
            var slots = [];
            $day.find(".hours").each(function () {
              slots.push({
                start: $(this).find(".hours-start input").val(),
                end: $(this).find(".hours-end input").val(),
              });
            });
            hours[dd] = slots;
          } else {
            hours[dd] = null;
          }
        }
        var updateDoc = {
          $set: {
            "profile.CRM": $("[name=CRM]").val(),
            "profile.signature": $.fn.summernote
              ? $sig.summernote("code")
              : $sig.val(),
            specialties: $specSel.val() || [],
            color: $colorSel.val(),
            workHours: hours,
          },
        };
        Meteor.users.update(doctor._id, updateDoc);
        toastr.success(t("common_save-success"), t("common_success"));
        FlowRouter.go("doctorList");
      });
  }


  S.pages.doctorList = function () {
    initDoctorList();
  };
  S.pages.doctorEdit = function (p) {
    initDoctorForm(p && p.id);
  };
})(window);
