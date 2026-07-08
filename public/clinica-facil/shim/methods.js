/*
 * methods.js — local client-side implementations of the Meteor server methods.
 * Registered into Meteor._methods by data-source.js; called via Meteor.call().
 */
(function (global) {
  "use strict";

  var MONTHS_PT = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  var MONTHS_EN = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  var MONTHS_ES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

  function monthLabel(d) {
    var lang = TAPi18n.getLanguage();
    var arr = lang === "en" ? MONTHS_EN : lang === "es" ? MONTHS_ES : MONTHS_PT;
    return arr[d.getMonth()] + "/" + String(d.getFullYear()).slice(2);
  }

  function ageFrom(dob, now) {
    return Math.floor((now - new Date(dob)) / (365.25 * 86400000));
  }

  Meteor._methods.dashboardStats = function () {
    var now = new Date();
    var monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    var stats = {};

    stats.totals = {
      patients:           Patients.count(),
      appointmentsMonth:  Appointments.find({ status: "completed", start: { $gte: monthStart } }).count(),
      recordsMonth:       PatientRecords.find({ date: { $gte: monthStart } }).count(),
      prescriptions:      PatientRecords.find({ recordType: "prescription" }).count(),
    };

    var apptValue = ((Settings.findOne() || {}).appointmentValue) || 0;
    stats.billing = {
      value:        apptValue,
      appointments: stats.totals.appointmentsMonth,
      monthly:      apptValue * stats.totals.appointmentsMonth,
    };

    // appointments per month — last 12 months
    var months = [];
    for (var i = 11; i >= 0; i--) {
      var d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ y: d.getFullYear(), m: d.getMonth(), label: monthLabel(d), value: 0 });
    }
    var since = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    Appointments.find({ status: "completed", start: { $gte: since } }).forEach(function (a) {
      var ad = new Date(a.start);
      for (var j = 0; j < months.length; j++) {
        if (months[j].y === ad.getFullYear() && months[j].m === ad.getMonth()) { months[j].value++; break; }
      }
    });
    stats.apptsByMonth = months.map(function (x) { return { y: x.y, m: x.m, label: x.label, value: x.value }; });

    stats.recordsByType = {
      form:                PatientRecords.find({ recordType: "form" }).count(),
      prescription:        PatientRecords.find({ recordType: "prescription" }).count(),
      exam_request:        PatientRecords.find({ recordType: "exam_request" }).count(),
      medical_certificate: PatientRecords.find({ recordType: "medical_certificate" }).count(),
    };

    var groups = [
      { label: "0-17",  min: 0,  max: 17,  value: 0 },
      { label: "18-29", min: 18, max: 29,  value: 0 },
      { label: "30-44", min: 30, max: 44,  value: 0 },
      { label: "45-59", min: 45, max: 59,  value: 0 },
      { label: "60+",   min: 60, max: 200, value: 0 },
    ];
    var gender = { M: 0, F: 0 };
    Patients.find({}).forEach(function (p) {
      if (p.gender === "M") gender.M++; else if (p.gender === "F") gender.F++;
      if (p.dateOfBirth) {
        var age = ageFrom(p.dateOfBirth, now);
        for (var g = 0; g < groups.length; g++) {
          if (age >= groups[g].min && age <= groups[g].max) { groups[g].value++; break; }
        }
      }
    });
    stats.ageGroups = groups;
    stats.gender = gender;
    return stats;
  };

  Meteor._methods.productionStats = function () {
    var now = new Date();
    var TYPES = ["form", "prescription", "exam_request", "medical_certificate"];
    var months = [];
    for (var i = 11; i >= 0; i--) {
      var d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      var row = { y: d.getFullYear(), m: d.getMonth(), label: monthLabel(d) };
      TYPES.forEach(function (t) { row[t] = 0; });
      months.push(row);
    }
    var since = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    var totals = { form: 0, prescription: 0, exam_request: 0, medical_certificate: 0, all: 0 };
    PatientRecords.find({ date: { $gte: since } }).forEach(function (r) {
      if (totals[r.recordType] == null) return;
      totals[r.recordType]++; totals.all++;
      for (var j = 0; j < months.length; j++) {
        if (months[j].y === new Date(r.date).getFullYear() && months[j].m === new Date(r.date).getMonth()) {
          months[j][r.recordType]++; break;
        }
      }
    });
    var apptValue = ((Settings.findOne() || {}).appointmentValue) || 0;
    var mStart = new Date(now.getFullYear(), now.getMonth(), 1);
    var apptsMonth = Appointments.find({ status: "completed", start: { $gte: mStart } }).count();
    return {
      byMonth: months,
      totals: totals,
      billing: { value: apptValue, appointments: apptsMonth, monthly: apptValue * apptsMonth },
    };
  };

  // Turn a free-text reference ("13 - 17", "até 200", "> 30") into a catalog
  // reference rule. Two numbers -> min/max; one number -> keyword scan decides
  // whether it is a ceiling (max) or a floor (min).
  function parseReferenceText(text) {
    var rule = { gender: "todos", displayText: text || "" };
    if (!text) return rule;
    var matches = text.match(/\d+(?:[.,]\d+)?/g) || [];
    var nums = matches.map(function (n) { return parseFloat(n.replace(",", ".")); });
    if (nums.length >= 2) {
      rule.min = Math.min(nums[0], nums[1]);
      rule.max = Math.max(nums[0], nums[1]);
    } else if (nums.length === 1) {
      var lower = text.toLowerCase();
      if (/[<≤]|menor|at[eé]|inferior|abaixo/.test(lower)) {
        rule.max = nums[0];
      } else if (/[>≥]|maior|superior|acima|m[ií]nimo/.test(lower)) {
        rule.min = nums[0];
      } else {
        rule.max = nums[0];
      }
    }
    return rule;
  }

  function regexEscape(term) {
    return String(term).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  // Local port of the server aggregation: case-insensitive substring match on
  // ExamCatalog name, filter each doc's referenceRules down to the ones that
  // apply to this patient's gender/age, sort by usageCount, top 5.
  Meteor._methods.searchExamCatalog = function (term, gender, ageMonths) {
    term = term || "";
    if (term.length > 64) return [];
    var re = new RegExp(regexEscape(term), "i");
    var age = typeof ageMonths === "number" ? ageMonths : -1;
    var matches = ExamCatalog.find({}).fetch().filter(function (e) {
      return re.test(e.name || "");
    });
    matches = matches.map(function (e) {
      var rules = (e.referenceRules || []).filter(function (rule) {
        var genderOk = rule.gender === "todos" || rule.gender === gender;
        var minOk = rule.ageMin == null || rule.ageMin <= age;
        var maxOk = rule.ageMax == null || rule.ageMax >= age;
        return genderOk && minOk && maxOk;
      });
      return { name: e.name, unit: e.unit, usageCount: e.usageCount || 0, applicableRules: rules };
    });
    matches.sort(function (a, b) { return (b.usageCount || 0) - (a.usageCount || 0); });
    return matches.slice(0, 5);
  };

  // Local port of the server method: persist the exam set with the reference
  // text used INLINE (later catalog edits never rewrite this patient's
  // history), then let the catalog learn (usage bump, fresh unit, and a
  // parsed reference rule for brand-new or still-ruleless exams).
  Meteor._methods.savePatientExam = function (patientId, doc) {
    var results = (doc && doc.results) || [];
    PatientExams.insert({
      patientId: patientId,
      laboratory: (doc && doc.laboratory) || "",
      datePerformed: doc && doc.datePerformed ? new Date(doc.datePerformed) : new Date(),
      results: results.map(function (r) {
        return {
          examName: r.examName,
          value: r.value == null ? "" : String(r.value),
          referenceUsed: r.referenceUsed || "",
          unit: r.unit || "",
          isAltered: !!r.isAltered,
        };
      }),
    });

    results.forEach(function (r) {
      if (!r.examName) return;
      var existing = ExamCatalog.findOne({ name: r.examName });
      if (existing) {
        var set = { usageCount: (existing.usageCount || 0) + 1 };
        if (r.unit) set.unit = r.unit;
        ExamCatalog.update(existing._id, { $set: set });
        var hasRules = existing.referenceRules && existing.referenceRules.length > 0;
        if (!r.matched && r.referenceUsed && !hasRules) {
          ExamCatalog.update(existing._id, { $push: { referenceRules: parseReferenceText(r.referenceUsed) } });
        }
      } else {
        var newDoc = { name: r.examName, unit: r.unit || "", usageCount: 1, referenceRules: [] };
        if (r.referenceUsed) newDoc.referenceRules = [parseReferenceText(r.referenceUsed)];
        ExamCatalog.insert(newDoc);
      }
    });
  };

})(window);
