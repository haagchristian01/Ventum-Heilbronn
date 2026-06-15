(function () {
  const RECOMMENDATIONS = {
    "assessment-roadmap": {
      type: "Service",
      title: "Assessment & Roadmap",
      why: "passt, wenn der Einstieg unklar ist und zuerst eine belastbare Entscheidungsvorlage gebraucht wird.",
      result: "Priorisierte Roadmap mit Nutzen, Aufwand, Risiken und sinnvollem Pilot-Scope."
    },
    "cloud-transformation": {
      type: "Leistung",
      title: "Cloud-Transformation",
      why: "passt, wenn Infrastruktur, Workloads, Kosten, Identitäten oder Betrieb neu geordnet werden müssen.",
      result: "Zielarchitektur und Migrationspfad für hybride oder cloudbasierte IT-Landschaften."
    },
    "data-analytics": {
      type: "Leistung",
      title: "Data & Analytics",
      why: "passt, wenn Kennzahlen, Datenquellen oder Reporting nicht verlässlich genug für Entscheidungen sind.",
      result: "Datenmodell, Kennzahlenlogik und Dashboard- oder KI-Vorbereitung."
    },
    "process-automation": {
      type: "Leistung",
      title: "Prozessautomatisierung",
      why: "passt, wenn manuelle Arbeit, Medienbrüche oder wiederkehrende Prüfungen Zeit und Qualität kosten.",
      result: "Bewerteter Pilot mit messbaren Erfolgskriterien und Übergabe in den Betrieb."
    },
    "information-security": {
      type: "Leistung",
      title: "Informationssicherheit & Governance",
      why: "passt, wenn Risiken, Zugriffe, Nachweise, Kundenanforderungen oder NIS2-Fragen Druck erzeugen.",
      result: "Priorisierte Sicherheitsmaßnahmen mit Verantwortlichkeiten und Nachweisstruktur."
    },
    "training-enablement": {
      type: "Service",
      title: "Enablement & Schulung",
      why: "passt, wenn Akzeptanz, Rollen, Wissen und Veränderung über den Projekterfolg entscheiden.",
      result: "Enablement-Plan mit Key Usern, Schulungsformaten, Dokumentation und Feedback-Schleifen."
    },
    "operations-support": {
      type: "Service",
      title: "Betrieb & Support",
      why: "passt, wenn eine bestehende Lösung stabilisiert, weiterentwickelt oder nach dem Go-live betreut werden soll.",
      result: "Support- und Optimierungsrhythmus mit klaren Verantwortlichkeiten."
    },
    "roi-vorlage": {
      type: "Checkliste",
      title: "Projekt-ROI-Checkliste",
      why: "hilft, wenn Nutzen, Aufwand und Risiken vor der Entscheidung vergleichbar werden müssen.",
      result: "Entscheidungsraster für Business Case, Aufwand, Risiko und Erfolgskriterien."
    },
    "datenquellen-kompass": {
      type: "Checkliste",
      title: "Datenquellen-Kompass",
      why: "hilft, wenn viele Datenquellen existieren, aber unklar ist, welche verlässlich und führend sind.",
      result: "Übersicht über Datenquellen, Verantwortliche, Qualität und Kennzahlen."
    },
    "akzeptanz-check": {
      type: "Checkliste",
      title: "Mitarbeiter-Akzeptanz-Check",
      why: "hilft, wenn Einführung, Schulung und Rollen früh vorbereitet werden müssen.",
      result: "Akzeptanzbild mit betroffenen Rollen, Schulungsbedarf und Kommunikationspunkten."
    },
    "it-risiko-erstcheck": {
      type: "Checkliste",
      title: "IT-Risiko-Erstcheck",
      why: "hilft, wenn Risiken, kritische Systeme oder externe Abhängigkeiten zunächst grob eingeordnet werden müssen.",
      result: "Erste Risikolandkarte mit Handlungsfeldern und offenen Fragen."
    }
  };

  function val(id) {
    return document.getElementById(id)?.value || "";
  }

  function text(id) {
    const el = document.getElementById(id);
    return el?.options?.[el.selectedIndex]?.text || "";
  }

  function add(scores, id, value) {
    scores[id] = (scores[id] || 0) + value;
  }

  function buildScores() {
    const scores = {};
    add(scores, "assessment-roadmap", 2);

    const pain = val("finder-pain");
    const goal = val("finder-goal");
    const systems = val("finder-systems");
    const maturity = val("finder-maturity");
    const pressure = val("finder-pressure");
    const budget = val("finder-budget");
    const adoption = val("finder-adoption");
    const dataQuality = val("finder-data-quality");
    const security = val("finder-security");

    if (maturity === "unclear" || pain === "unclear") add(scores, "assessment-roadmap", 4);
    if (budget === "businesscase" || pressure === "board") add(scores, "roi-vorlage", 4);

    if (systems === "legacy" || systems === "hybrid" || pain === "cloud" || goal === "architecture") add(scores, "cloud-transformation", 5);
    if (systems === "shadowit") add(scores, "assessment-roadmap", 2);

    if (pain === "data" || goal === "analytics" || dataQuality === "weak") {
      add(scores, "data-analytics", 5);
      add(scores, "datenquellen-kompass", 4);
    }
    if (dataQuality === "mixed") add(scores, "datenquellen-kompass", 3);

    if (pain === "manual" || goal === "automation" || systems === "manual") add(scores, "process-automation", 5);

    if (pain === "security" || goal === "security" || security === "high" || security === "nis2") {
      add(scores, "information-security", 5);
      add(scores, "it-risiko-erstcheck", 4);
    }

    if (goal === "enablement" || adoption === "critical" || adoption === "unclear") {
      add(scores, "training-enablement", 5);
      add(scores, "akzeptanz-check", 4);
    }

    if (maturity === "scaled" || pressure === "aftercare") add(scores, "operations-support", 4);

    return scores;
  }

  function recommendations() {
    const scores = buildScores();
    return Object.entries(scores)
      .filter(([, score]) => score >= 3)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id]) => ({ id, ...RECOMMENDATIONS[id] }));
  }

  function finderContext() {
    return [
      `Rolle: ${text("finder-role")}`,
      `Branche: ${text("finder-industry")}`,
      `Größe: ${text("finder-size")}`,
      `Region: ${text("finder-region")}`,
      `Reifegrad: ${text("finder-maturity")}`,
      `Systemlage: ${text("finder-systems")}`,
      `Schmerzpunkt: ${text("finder-pain")}`,
      `Ziel: ${text("finder-goal")}`,
      `Zeitdruck: ${text("finder-pressure")}`,
      `Entscheidungsrahmen: ${text("finder-budget")}`,
      `Akzeptanz: ${text("finder-adoption")}`,
      `Datenqualität: ${text("finder-data-quality")}`,
      `Sicherheitsanforderung: ${text("finder-security")}`
    ].join("; ");
  }

  function renderRecommendations() {
    const result = recommendations();
    const wrap = document.getElementById("finder-recommendations");
    const summary = document.getElementById("finder-summary");
    if (!wrap || !summary) return;

    summary.textContent = result.length > 1
      ? `Wir empfehlen ${result.length} kombinierbare nächste Schritte. Wählen Sie aus, was ins Kontaktformular übernommen werden soll.`
      : "Wir empfehlen einen klaren nächsten Schritt. Sie können ihn direkt ins Kontaktformular übernehmen.";

    wrap.innerHTML = result.map((item, index) => `
      <article class="recommendation">
        <label>
          <input type="checkbox" value="${item.id}" ${index < 3 ? "checked" : ""}>
          <span>
            <span class="tag">${item.type}</span>
            <h3>${item.title}</h3>
            <p><strong>Warum passend:</strong> ${item.why}</p>
            <p><strong>Ergebnis:</strong> ${item.result}</p>
          </span>
        </label>
      </article>
    `).join("");
  }

  function selectedRecommendationIds() {
    return Array.from(document.querySelectorAll("#finder-recommendations input:checked")).map((input) => input.value);
  }

  function goToContact(ids) {
    if (!ids.length) {
      window.VentumContact?.showToast("Bitte wählen Sie mindestens eine Empfehlung aus.");
      return;
    }
    const context = window.VentumContact.bundleContext(ids, finderContext());
    window.VentumContact.navigateToContact(context, "kontakt.html");
  }

  document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("[data-finder]");
    if (!form) return;
    form.querySelectorAll("select").forEach((select) => {
      select.addEventListener("change", renderRecommendations);
    });
    renderRecommendations();

    document.getElementById("finder-all")?.addEventListener("click", (event) => {
      event.preventDefault();
      const all = Array.from(document.querySelectorAll("#finder-recommendations input")).map((input) => input.value);
      goToContact(all);
    });

    document.getElementById("finder-selected")?.addEventListener("click", (event) => {
      event.preventDefault();
      goToContact(selectedRecommendationIds());
    });

    document.getElementById("finder-reset")?.addEventListener("click", (event) => {
      event.preventDefault();
      window.location.href = "index.html";
    });
  });
})();
