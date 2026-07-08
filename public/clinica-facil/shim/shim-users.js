/*
 * rip/ shim — users — list + inline edit form
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
  // Users list + inline edit form
  // ---------------------------------------------------------------------------
  function initUserList() {
    var defaultPic =
      "https://cdn4.iconfinder.com/data/icons/medical-14/512/9-128.png";
    function picUrl(user) {
      if (user.profile && user.profile.picture) {
        var img = Images.findOne({ _id: user.profile.picture });
        if (img && img.link) return img.link();
      }
      var email = user.emails && user.emails[0] && user.emails[0].address;
      if (email && global.Gravatar) {
        return Gravatar.imageUrl(email, {
          secure: true,
          size: 28,
          default: defaultPic,
        });
      }
      return defaultPic;
    }

    var data = Meteor.users.find().fetch();
    initDT(
      "users-table",
      data,
      [
        {
          title: "",
          data: "_id",
          orderable: false,
          render: function (id, type, row) {
            return '<img class="profile-pic" src="' + picUrl(row) + '">';
          },
        },
        {
          title: t("users_firstName"),
          data: "profile.firstName",
          render: function (d, type, row) {
            var p = row.profile || {};
            return (p.firstName || "") + " " + (p.lastName || "");
          },
        },
        {
          title: "Email",
          data: "emails",
          render: function (d, type, row) {
            var addr = row.emails && row.emails[0] ? row.emails[0].address : "";
            return '<i class="fa fa-envelope"></i>&nbsp;' + addr;
          },
        },
        {
          title: t("common_enabled"),
          data: "isUserEnabled",
          orderable: false,
          render: function (d) {
            var cls = d ? "primary" : "danger";
            return (
              '<span class="label label-' +
              cls +
              '">' +
              t(d ? "common_enabled" : "common_disabled") +
              "</span>"
            );
          },
        },
        {
          title: t("superAdmin"),
          data: "isSuperAdmin",
          orderable: false,
          render: function (d) {
            var cls = d ? "primary" : "danger";
            return (
              '<span class="label label-' +
              cls +
              '">' +
              t(d ? "common_enabled" : "common_disabled") +
              "</span>"
            );
          },
        },
        {
          data: "_id",
          orderable: false,
          render: function (id) {
            return (
              '<button class="btn btn-info btn-xs user-edit-btn" data-userid="' +
              id +
              '">' +
              '<i class="glyphicon glyphicon-edit"></i></button>'
            );
          },
        },
      ],
      function (rowData) {
        loadUserForm(rowData._id);
      },
    );

    $(document)
      .off("click.ripUsers")
      .on("click.ripUsers", ".user-edit-btn", function () {
        loadUserForm($(this).data("userid"));
      });
    $("#new-user-btn")
      .off("click.ripUsers")
      .on("click.ripUsers", function () {
        loadUserForm(null);
      });
    $("#user-form-cancel").off("click.ripUsers").on("click.ripUsers", hideUserForm);
    $("#user-form")
      .off("submit.ripUsers")
      .on("submit.ripUsers", function (e) {
        e.preventDefault();
        var form = this;
        var f = function (name) {
          return form.querySelector('[name="' + name + '"]');
        };
        var userId = form.getAttribute("data-userid") || null;
        var firstName = f("firstName").value.trim();
        var lastName = f("lastName").value.trim();
        var email = f("email").value.trim();
        var group = f("group").value;
        var enabled = f("enabled").checked;
        var superAdmin = f("super-admin").checked;

        if (userId) {
          Meteor.users.update(userId, {
            $set: {
              "profile.firstName": firstName,
              "profile.lastName": lastName,
              "profile.group": group,
              "emails.0.address": email,
              isUserEnabled: enabled,
              isSuperAdmin: superAdmin,
            },
          });
        } else {
          Meteor.users.insert({
            emails: [{ address: email, verified: false }],
            profile: {
              firstName: firstName,
              lastName: lastName,
              group: group,
              language: "pt-BR",
            },
            isUserEnabled: enabled,
            isSuperAdmin: superAdmin,
          });
        }

        toastr.success(t("common_saved"));
        hideUserForm();
        initUserList();
      });
  }

  function showUserForm() {
    var $tb = $("#tablebox"),
      $fb = $("#users-formbox");
    $tb.removeClass("col-sm-12").addClass("col-sm-8");
    $fb.removeClass("col-sm-0").addClass("col-sm-4");
  }

  function hideUserForm() {
    var $tb = $("#tablebox"),
      $fb = $("#users-formbox");
    $tb.removeClass("col-sm-8").addClass("col-sm-12");
    $fb.removeClass("col-sm-4").addClass("col-sm-0");
    var form = $("#user-form")[0];
    if (form) {
      form.reset();
      form.removeAttribute("data-userid");
    }
  }

  function loadUserForm(userId) {
    showUserForm();
    var form = document.getElementById("user-form");
    if (!form) return;
    var f = function (name) {
      return form.querySelector('[name="' + name + '"]');
    };
    if (userId) {
      var user = Meteor.users.findOne({ _id: userId });
      if (!user) return;
      form.setAttribute("data-userid", userId);
      var p = user.profile || {};
      f("firstName").value = p.firstName || "";
      f("lastName").value = p.lastName || "";
      f("email").value =
        user.emails && user.emails[0] ? user.emails[0].address : "";
      f("password").value = "";
      f("password").placeholder = t("users_changepassword");
      f("group").value = p.group || "medical_doctor";
      f("enabled").checked = !!user.isUserEnabled;
      f("super-admin").checked = !!user.isSuperAdmin;
    } else {
      form.reset();
      form.removeAttribute("data-userid");
      f("password").placeholder = t("users_passwordPlaceholder");
    }
  }


  S.pages.users = function () {
    initUserList();
  };
})(window);
