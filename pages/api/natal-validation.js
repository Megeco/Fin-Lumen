import resolveCompany from "../../lib/companyResolver.js";
import natalRegistry from "../../lib/natalRegistry.js";
import { evaluateNatalValidation } from "../../lib/natalValidationEngine.js";

export default async function handler(req, res) {
  try {
    const ticker = String(req.query.ticker || req.query.symbol || "").trim();
    const chartId = String(req.query.chartId || "").trim() || null;
    const fullUniverse = String(req.query.all || req.query.fullUniverse || "").toLowerCase() === "true" || String(req.query.all || "") === "1";

    if (fullUniverse) {
      const symbols = Object.keys(natalRegistry || {}).sort();
      const rows = [];
      for (const symbol of symbols) {
        const company = await resolveCompany(symbol, null, {});
        if (!company?.found) continue;
        const natalValidation = evaluateNatalValidation(company, {
          selectedChartId: company.selectedChartId || company.preferredChartId
        });
        rows.push({
          symbol,
          companyName: company.companyName || symbol,
          displayedChartId: natalValidation.displayedChartId,
          bestChart: natalValidation.bestChart,
          selectionStatus: natalValidation.selectionStatus,
          confidence: natalValidation.confidence,
          alternateCount: natalValidation.alternateCount,
          candidates: natalValidation.candidates
        });
      }
      return res.status(200).json({
        success: true,
        route: "/api/natal-validation",
        version: "v35.1-full-universe-natal-validation",
        universeSize: rows.length,
        rows,
        note: "All available candidate charts are scored automatically. This is chart-selection readiness scoring; deep event-level replay can be layered per stock/chart."
      });
    }

    if (!ticker) return res.status(400).json({ success: false, error: "ticker is required" });

    const company = await resolveCompany(ticker, null, { chartId });
    if (!company?.found) {
      return res.status(404).json({ success: false, error: company?.error || "Company not found", ticker });
    }

    const natalValidation = evaluateNatalValidation(company, {
      selectedChartId: chartId || company.selectedChartId || company.preferredChartId
    });

    return res.status(200).json({
      success: true,
      route: "/api/natal-validation",
      version: "v35.1-natal-validation-chart-selector-ui-hardening",
      ticker,
      symbol: company.symbol,
      companyName: company.companyName,
      selectedChartId: company.selectedChartId || company.preferredChartId,
      natalValidation
    });
  } catch (error) {
    return res.status(500).json({ success: false, route: "/api/natal-validation", error: error.message, stack: error.stack });
  }
}
