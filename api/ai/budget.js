const { sendJson } = require("../_lib/data");
const { DEFAULT_MODEL, hasOpenRouterKey, readJsonRequest, generateAiSummary } = require("../_lib/ai");

module.exports = async function handler(req, res) {
  if (req.method && req.method !== "POST") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  try {
    const body = await readJsonRequest(req);
    const { snapshot } = body;
    if (!snapshot) {
      sendJson(res, 400, { error: "Missing budget snapshot" });
      return;
    }

    if (!hasOpenRouterKey()) {
      sendJson(res, 200, {
        summary: "AI summary is ready to use once you add OPENROUTER_API_KEY to your environment.",
        model: DEFAULT_MODEL,
        warning: "Missing OPENROUTER_API_KEY"
      });
      return;
    }

    const systemPrompt = "You are an expert Indian personal finance planner. Give practical, cautious, beginner-friendly guidance. Do not promise returns. Use clear section headings and keep the advice useful for a wide range of users.";
    const userPrompt = `Create a concise budgeting summary for this user.\n\nUser snapshot:\n- Budget rule: ${snapshot.ruleName}\n- Age: ${snapshot.age}\n- Monthly income: INR ${snapshot.income}\n- Essential expenses: INR ${snapshot.essentialExpenses}\n- Flexible expenses: INR ${snapshot.flexibleExpenses}\n- EMI: INR ${snapshot.emi}\n- Existing savings: INR ${snapshot.savings}\n- Goal amount: INR ${snapshot.goalAmount}\n- Goal horizon: ${snapshot.goalYears} years\n- Risk preference: ${snapshot.riskPreference}\n\nComputed insights:\n- Savings rate: ${snapshot.savingsRate}%\n- Debt to income: ${snapshot.debtRatio}%\n- Essential cost ratio: ${snapshot.essentialRatio}%\n- Expense ratio: ${snapshot.expenseRatio}%\n- Emergency coverage: ${snapshot.emergencyCoverage} months\n- Goal funding ratio: ${snapshot.goalFundingRatio}%\n- Recommended monthly investing: INR ${snapshot.recommendedMonthlyInvest}\n- Goal SIP needed: INR ${snapshot.requiredSip}\n- Allocation: Equity ${snapshot.allocation.equity}%, Debt ${snapshot.allocation.debt}%, Gold ${snapshot.allocation.gold}%, Cash ${snapshot.allocation.cash}%\n- Emergency status: ${snapshot.emergencyStatus}\n- Goal status: ${snapshot.goalStatus}\n\nWrite with these exact headings:\nDiagnosis:\nTop Priorities:\nInvestment Approach:\nCaution:\n\nKeep it under 220 words.`;

    const result = await generateAiSummary({ systemPrompt, userPrompt, temperature: 0.25, maxTokens: 420 });
    sendJson(res, 200, result);
  } catch (error) {
    sendJson(res, 500, { error: error.message || "AI budget summary failed" });
  }
};
