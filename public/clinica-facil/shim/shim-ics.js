/*
 * rip/ shim — RFC 5545 (iCalendar) generation, client-side only.
 * Mirrors src/app/server/ics.js field-for-field (same UID/DTSTART/DTEND/
 * SUMMARY/STATUS/ORGANIZER mapping) so exported .ics files look the same
 * whether they come from the real app or this static mirror. Kept as a
 * separate hand-written copy per the rip/ "mirror, don't extend" convention
 * (no shared module between the two runtimes).
 */
(function (global) {
  "use strict";
  var S = global.Shim;

  var ICS_LINE_LIMIT = 75;

  var ICS_STATUS_MAP = {
    "to-confirm": "TENTATIVE",
    waiting: "TENTATIVE",
    scheduled: "CONFIRMED",
    attending: "CONFIRMED",
    finished: "CONFIRMED",
    "no-show": "CANCELLED",
  };

  function formatIcsDate(date) {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  }

  function escapeIcsText(str) {
    return String(str)
      .replace(/\\/g, "\\\\")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,")
      .replace(/\r\n|\n|\r/g, "\\n");
  }

  function foldIcsLine(line) {
    if (line.length <= ICS_LINE_LIMIT) {
      return line;
    }
    var result = line.slice(0, ICS_LINE_LIMIT);
    var rest = line.slice(ICS_LINE_LIMIT);
    while (rest.length > 0) {
      result += "\r\n " + rest.slice(0, ICS_LINE_LIMIT - 1);
      rest = rest.slice(ICS_LINE_LIMIT - 1);
    }
    return result;
  }

  function buildVEvent(event, doctor, patient) {
    var summary = (patient && patient.name) || event.title || "Consulta";
    var status = ICS_STATUS_MAP[event.status] || "CONFIRMED";

    var lines = [
      "BEGIN:VEVENT",
      foldIcsLine("UID:" + event._id + "@easyclinic"),
      foldIcsLine("DTSTAMP:" + formatIcsDate(new Date())),
      foldIcsLine("DTSTART:" + formatIcsDate(new Date(event.start))),
      foldIcsLine("DTEND:" + formatIcsDate(new Date(event.end))),
      foldIcsLine("SUMMARY:" + escapeIcsText(summary)),
      foldIcsLine("STATUS:" + status),
    ];

    if (doctor && doctor.profile) {
      var doctorName = (
        doctor.profile.firstName +
        " " +
        doctor.profile.lastName
      ).trim();
      var doctorEmail =
        doctor.emails && doctor.emails[0] && doctor.emails[0].address;
      if (doctorEmail) {
        lines.push(
          foldIcsLine(
            "ORGANIZER;CN=" +
              escapeIcsText(doctorName) +
              ":mailto:" +
              doctorEmail,
          ),
        );
      }
    }

    lines.push("END:VEVENT");
    return lines.join("\r\n");
  }

  function buildVCalendar(vevents, calName) {
    var lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Clinica Facil//Schedule//PT-BR",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
    ];

    if (calName) {
      lines.push(foldIcsLine("X-WR-CALNAME:" + escapeIcsText(calName)));
    }
    lines.push("X-PUBLISHED-TTL:PT12H");

    lines = lines.concat(vevents);
    lines.push("END:VCALENDAR");
    return lines.join("\r\n") + "\r\n";
  }

  // Builds a VCALENDAR string and triggers a browser download of it.
  function downloadIcs(vevents, calName, fileName) {
    var ics = buildVCalendar(vevents, calName);
    var blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = fileName || "agenda.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  S.buildVEvent = buildVEvent;
  S.buildVCalendar = buildVCalendar;
  S.downloadIcs = downloadIcs;
})(window);
