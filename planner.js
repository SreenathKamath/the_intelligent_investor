const budgetRules = {
  balanced: {
    name: "50:30:20 Balanced",
    needs: 0.5,
    wants: 0.3,
    savings: 0.2,
    description: "A classic budgeting rule that tries to keep life balanced between essentials, lifestyle, and future savings.",
    bestFor: "Best for users with reasonably stable income who want a simple all-round structure.",
  },
  essentials: {
    name: "60:20:20 Essentials First",
    needs: 0.6,
    wants: 0.2,
    savings: 0.2,
    description: "A more practical rule when household commitments or fixed living costs are already taking a bigger share of income.",
    bestFor: "Best for users with family responsibilities, high rent, or less flexible monthly budgets.",
  },
  builder: {
    name: "50:20:30 Wealth Builder",
    needs: 0.5,
    wants: 0.2,
    savings: 0.3,
    description: "A stronger wealth-building rule that pushes more income toward saving and investing.",
    bestFor: "Best for disciplined users who want faster goal progress and can control lifestyle spending.",
  },
  survival: {
    name: "70:20:10 Stability Mode",
    needs: 0.7,
    wants: 0.2,
    savings: 0.1,
    description: "A protection-first rule for tighter financial phases where stability matters more than ideal optimization.",
    bestFor: "Best for lower-income periods, early career stages, job transitions, or temporary pressure months.",
  },
};

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, value));
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function annualRateForProfile(profile) {
  if (profile === "aggressive") return 0.12;
  if (profile === "conservative") return 0.08;
  return 0.1;
}

function monthsToEmergency(fundGap, monthlyReserveAllocation) {
  if (fundGap <= 0) return 0;
  if (monthlyReserveAllocation <= 0) return Infinity;
  return Math.ceil(fundGap / monthlyReserveAllocation);
}

function estimateSip(goalAmount, currentSavings, annualReturn, years) {
  const monthlyRate = annualReturn / 12;
  const months = years * 12;
  const futureValueCurrent = currentSavings * Math.pow(1 + monthlyRate, months);
  const gap = Math.max(goalAmount - futureValueCurrent, 0);
  if (gap === 0) return 0;
  const factor = (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
  return gap / factor;
}

function ageAllocation(age, goalYears, riskPreference, debtRatio) {
  let equity = 55;
  let debt = 30;
  let gold = 10;
  let cash = 5;
  if (age < 30 && goalYears >= 7) {
    equity += 10;
    debt -= 5;
    cash -= 5;
  }
  if (goalYears <= 3) {
    equity -= 20;
    debt += 10;
    cash += 10;
  } else if (goalYears <= 5) {
    equity -= 10;
    debt += 5;
    cash += 5;
  }
  if (riskPreference === "aggressive") {
    equity += 10;
    debt -= 5;
    cash -= 5;
  }
  if (riskPreference === "conservative") {
    equity -= 15;
    debt += 10;
    cash += 5;
  }
  if (debtRatio > 0.2) {
    equity -= 10;
    debt += 5;
    cash += 5;
  }
  equity = clamp(equity, 20, 75);
  debt = clamp(debt, 15, 55);
  gold = clamp(gold, 5, 15);
  cash = clamp(100 - equity - debt - gold, 5, 20);
  const total = equity + debt + gold + cash;
  return {
    profile: riskPreference === "aggressive" ? "Growth-first allocator" : riskPreference === "conservative" ? "Capital-preservation allocator" : "Balanced allocator",
    equity: Math.round((equity / total) * 100),
    debt: Math.round((debt / total) * 100),
    gold: Math.round((gold / total) * 100),
    cash: 100 - Math.round((equity / total) * 100) - Math.round((debt / total) * 100) - Math.round((gold / total) * 100),
  };
}

function renderBudgetPlan(input) {
  const budgetSplit = document.getElementById("budget-split");
  const ratioGrid = document.getElementById("ratio-grid");
  const ratioExplanations = document.getElementById("ratio-explanations");
  const allocationChart = document.getElementById("allocation-chart");
  const allocationSummary = document.getElementById("allocation-summary");
  const investmentLanes = document.getElementById("investment-lanes");
  const riskPanel = document.getElementById("risk-panel");
  const budgetExplanation = document.getElementById("budget-explanation");
  const cashflowChart = document.getElementById("cashflow-chart");
  const cashflowCaption = document.getElementById("cashflow-caption");
  const projectionPanel = document.getElementById("projection-panel");

  const { budgetRule, age, income, fixedExpenses, flexibleExpenses, emi, savings, goalAmount, goalYears, riskPreference } = input;
  const selectedRule = budgetRules[budgetRule] || budgetRules.balanced;
  const essentialExpenses = fixedExpenses + emi;
  const totalExpenses = essentialExpenses + flexibleExpenses;
  const surplus = income - totalExpenses;
  const savingsRate = (surplus / Math.max(income, 1)) * 100;
  const debtRatio = emi / Math.max(income, 1);
  const essentialRatio = essentialExpenses / Math.max(income, 1);
  const expenseRatio = totalExpenses / Math.max(income, 1);
  const emergencyTarget = essentialExpenses * 6;
  const emergencyCoverage = savings / Math.max(essentialExpenses, 1);
  const liquidityRatio = savings / Math.max(totalExpenses, 1);
  const allocation = ageAllocation(age, goalYears, riskPreference, debtRatio);
  const annualReturn = annualRateForProfile(riskPreference);
  const recommendedMonthlyInvest = Math.max(surplus * 0.75, 0);
  const requiredSip = estimateSip(goalAmount, savings * 0.4, annualReturn, goalYears);
  const futureCorpus = savings * Math.pow(1 + annualReturn, goalYears) + recommendedMonthlyInvest * 12 * (((Math.pow(1 + annualReturn, goalYears) - 1) / annualReturn) || goalYears);
  const goalFundingRatio = goalAmount > 0 ? (futureCorpus / goalAmount) * 100 : 100;
  const monthlyReserveAllocation = Math.max(Math.min(surplus * 0.35, essentialExpenses * 0.5), 0);
  const emergencyGap = Math.max(emergencyTarget - savings, 0);
  const emergencyMonthsNeeded = monthsToEmergency(emergencyGap, monthlyReserveAllocation);
  const needTarget = income * selectedRule.needs;
  const wantTarget = income * selectedRule.wants;
  const savingTarget = income * selectedRule.savings;
  const actualSavings = Math.max(surplus, 0);
  const needGap = essentialExpenses - needTarget;
  const wantGap = flexibleExpenses - wantTarget;
  const savingsGap = actualSavings - savingTarget;

  budgetSplit.innerHTML = [
    { label: "Needs", value: formatCurrency(needTarget), hint: `Actual ${formatCurrency(essentialExpenses)}` },
    { label: "Wants", value: formatCurrency(wantTarget), hint: `Actual ${formatCurrency(flexibleExpenses)}` },
    { label: "Savings", value: formatCurrency(savingTarget), hint: `Potential ${formatCurrency(actualSavings)}` },
    { label: "Rule Fit", value: needGap <= 0 && wantGap <= 0 && savingsGap >= 0 ? "Aligned" : "Needs tuning", hint: `${needGap > 0 ? "Needs high. " : ""}${wantGap > 0 ? "Wants high. " : ""}${savingsGap < 0 ? "Savings below target." : "Savings on track."}` },
  ].map((item) => `<article class="split-card"><span>${item.label}</span><strong>${item.value}</strong><div class="lane-meta">${item.hint}</div></article>`).join("");

  budgetExplanation.innerHTML = `<strong>${selectedRule.name}</strong><br />${selectedRule.description}<br />${selectedRule.bestFor}<br />Your real monthly pattern is now being compared only against this selected budget style, so the advice below is matched to the rule you chose.`;

  const ratios = [
    { label: "Savings Rate", value: `${Math.max(savingsRate, 0).toFixed(1)}%`, hint: savingsRate >= 25 ? "Strong" : savingsRate >= 15 ? "Stable" : "Needs improvement", formula: "Monthly surplus / Monthly income", explanation: savingsRate >= 25 ? "You are saving a strong portion of income, which gives you room for investing and emergencies." : savingsRate >= 15 ? "You are doing reasonably well, but increasing savings gradually would improve long-term flexibility." : "A low savings rate usually means future goals may feel difficult unless spending is tightened or income rises." },
    { label: "Debt To Income", value: `${(debtRatio * 100).toFixed(1)}%`, hint: debtRatio <= 0.15 ? "Comfortable" : debtRatio <= 0.25 ? "Watch closely" : "High pressure", formula: "Monthly EMI / Monthly income", explanation: debtRatio <= 0.15 ? "Your current debt load looks manageable and leaves enough room for investing." : debtRatio <= 0.25 ? "Debt is still manageable, but it needs monitoring because it can slow wealth building." : "Debt is taking too much of your income and should be reduced before aggressive investing." },
    { label: "Essential Cost Ratio", value: `${(essentialRatio * 100).toFixed(1)}%`, hint: essentialRatio <= 0.5 ? "Healthy" : "Tight cash flow", formula: "(Fixed essentials + EMI) / Monthly income", explanation: essentialRatio <= 0.5 ? "Your non-negotiable monthly costs are under control, which is a healthy sign." : "Too much of your income is locked into must-pay expenses, which reduces flexibility." },
    { label: "Expense Ratio", value: `${(expenseRatio * 100).toFixed(1)}%`, hint: expenseRatio <= 0.7 ? "Investable" : "Expense heavy", formula: "Total monthly expenses / Monthly income", explanation: expenseRatio <= 0.7 ? "Your spending pattern leaves a workable gap for saving and investing." : "Your total spending is high compared with income, so investing will feel harder unless spending comes down." },
    { label: "Emergency Coverage", value: `${emergencyCoverage.toFixed(1)} months`, hint: emergencyCoverage >= 6 ? "Ready" : "Build reserve", formula: "Existing savings / Monthly essential expenses", explanation: emergencyCoverage >= 6 ? "You already have a strong emergency cushion for common life disruptions." : "Your safety buffer is still building. Focus here before increasing higher-risk investments." },
    { label: "Goal Funding Ratio", value: `${goalFundingRatio.toFixed(0)}%`, hint: goalFundingRatio >= 100 ? "On track" : "Gap to close", formula: "Projected future corpus / Goal corpus", explanation: goalFundingRatio >= 100 ? "At the current pace, your goal looks achievable if you stay consistent." : "There is still a gap between the current path and your target, so you may need a higher SIP, more time, or a smaller goal." },
  ];

  ratioGrid.innerHTML = ratios.map((item) => `<article class="ratio-card"><span>${item.label}</span><strong>${item.value}</strong><div class="lane-meta">${item.hint}</div></article>`).join("");
  ratioExplanations.innerHTML = `<article class="insight-item"><strong>Budget Rule Fit</strong><span>Calculated by comparing your actual needs, wants, and savings against the targets of ${selectedRule.name}.</span><span>${needGap <= 0 && wantGap <= 0 && savingsGap >= 0 ? "You are following this budgeting style fairly well right now." : "Your current spending is not fully aligned with this style yet, which is completely normal. Use the needs, wants, and savings gaps to see what to improve first."}</span></article>` + ratios.map((item) => `<article class="insight-item"><strong>${item.label}</strong><span>Calculated as: ${item.formula}</span><span>${item.explanation}</span></article>`).join("");

  allocationChart.innerHTML = [
    { label: "Equity", value: allocation.equity },
    { label: "Debt", value: allocation.debt },
    { label: "Gold", value: allocation.gold },
    { label: "Cash", value: allocation.cash },
  ].map((bar) => `<div class="allocation-bar"><div class="allocation-bar-fill" style="height: ${bar.value * 1.6}px"></div><strong>${bar.value}%</strong><span>${bar.label}</span></div>`).join("");

  allocationSummary.innerHTML = `<div class="insight-item"><strong>${allocation.profile}</strong><span>This mix adjusts for age, goal horizon, risk preference, and EMI pressure instead of relying on a one-size-fits-all split.</span></div><div class="insight-item"><strong>Suggested implementation</strong><span>Use broad Indian index funds or ETFs for equity, high-quality debt options like PPF or short-duration debt products for stability, Gold ETF or gold mutual fund for hedge exposure, and cash or liquid instruments for short-term safety.</span></div>`;

  cashflowChart.innerHTML = [
    { label: "Essentials", value: essentialExpenses, percent: (essentialExpenses / Math.max(income, 1)) * 100, className: "essentials" },
    { label: "Flexible spending", value: flexibleExpenses, percent: (flexibleExpenses / Math.max(income, 1)) * 100, className: "flexible" },
    { label: "Free surplus", value: actualSavings, percent: (actualSavings / Math.max(income, 1)) * 100, className: "savings" },
  ].map((row) => `<div class="cashflow-row"><div class="cashflow-meta"><span>${row.label}</span><span>${formatCurrency(row.value)} | ${row.percent.toFixed(1)}%</span></div><div class="cashflow-bar-track"><div class="cashflow-bar-fill ${row.className}" style="width: ${Math.min(row.percent, 100)}%"></div></div></div>`).join("");

  cashflowCaption.innerHTML = surplus >= 0 ? `This chart shows where your income goes each month. Under ${selectedRule.name}, your targets are ${formatCurrency(needTarget)} for needs, ${formatCurrency(wantTarget)} for wants, and ${formatCurrency(savingTarget)} for savings.` : "Your expenses are currently above income, so the first goal should be reducing pressure before building an investment plan.";

  investmentLanes.innerHTML = [
    { title: "Emergency Reserve", weight: emergencyGap > 0 ? "Priority 1" : "Maintained", copy: emergencyGap > 0 ? `Direct ${formatCurrency(monthlyReserveAllocation)} per month into a liquid reserve bucket until you reach ${formatCurrency(emergencyTarget)}.` : "You already cover a six-month reserve. Keep this money in low-volatility, high-access instruments.", meta: "Best fits: sweep account, liquid fund, short FD ladder" },
    { title: "Core Equity Investing", weight: "Priority 2", copy: `Allocate roughly ${allocation.equity}% of your long-term portfolio to diversified equity. Since you selected ${selectedRule.name}, the savings bucket of this rule should be the main source for long-term investing.`, meta: "Best fits: Nifty 50 index fund, Sensex index fund, diversified flexi-cap fund" },
    { title: "Stability Bucket", weight: "Priority 3", copy: `Allocate ${allocation.debt}% to stability and compounding discipline. This helps reduce regret during volatility and keeps goal withdrawals safer.`, meta: "Best fits: PPF, EPF, short-duration debt funds, target-maturity debt funds" },
    { title: "Hedge And Optionality", weight: "Satellite", copy: `Keep ${allocation.gold}% in gold-type hedges and about ${allocation.cash}% in deployable cash so you are never forced to sell risk assets in weak markets.`, meta: "Best fits: Gold ETF, gold mutual fund, liquid cash bucket" },
  ].map((lane) => `<article class="investment-lane"><div class="lane-weight">${lane.weight}</div><h4>${lane.title}</h4><p>${lane.copy}</p><div class="lane-meta">${lane.meta}</div></article>`).join("");

  riskPanel.innerHTML = `<div class="insight-item"><strong>Emergency fund target: ${formatCurrency(emergencyTarget)}</strong><span>${emergencyGap > 0 ? `You are short by ${formatCurrency(emergencyGap)} and may need about ${Number.isFinite(emergencyMonthsNeeded) ? `${emergencyMonthsNeeded} months` : "an extended period"} to close the gap at the current reserve allocation pace.` : "Your reserve strength is already solid for most normal disruptions."}</span></div><div class="insight-item"><strong>Liquidity ratio: ${liquidityRatio.toFixed(1)} months</strong><span>This measures how long your current savings can support your present lifestyle without new income.</span></div><div class="insight-item"><strong>Debt pressure assessment</strong><span>${debtRatio > 0.25 ? "Debt obligations are too heavy. Prioritize deleveraging before increasing risk assets." : debtRatio > 0.15 ? "Debt is manageable but should stay under close control while you invest." : "Debt levels are reasonable enough to support structured long-term investing."}</span></div>`;

  projectionPanel.innerHTML = `<div class="projection-card"><strong>Recommended monthly investing</strong><span>${formatCurrency(recommendedMonthlyInvest)}</span></div><div class="projection-card"><strong>Goal SIP needed</strong><span>${formatCurrency(requiredSip)}</span></div><div class="projection-card"><strong>Projected corpus by goal year</strong><span>${formatCurrency(futureCorpus)}</span></div><div class="projection-card"><strong>Portfolio guidance</strong><span>${recommendedMonthlyInvest >= requiredSip ? "Your current surplus can realistically support the goal if kept consistent and invested with discipline." : "Your goal looks ambitious relative to current surplus. Increase investing, extend timeline, or reduce the target amount."}</span></div>`;
}

const plannerForm = document.getElementById("planner-form");
const scenarioButton = document.getElementById("scenario-button");

plannerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(plannerForm);
  renderBudgetPlan({
    budgetRule: String(formData.get("budgetRule")),
    age: Number(formData.get("age")),
    income: Number(formData.get("income")),
    fixedExpenses: Number(formData.get("fixedExpenses")),
    flexibleExpenses: Number(formData.get("flexibleExpenses")),
    emi: Number(formData.get("emi")),
    savings: Number(formData.get("savings")),
    goalAmount: Number(formData.get("goalAmount")),
    goalYears: Number(formData.get("goalYears")),
    riskPreference: String(formData.get("riskPreference")),
  });
});

scenarioButton.addEventListener("click", () => {
  renderBudgetPlan({
    budgetRule: "builder",
    age: 33,
    income: 140000,
    fixedExpenses: 38000,
    flexibleExpenses: 18000,
    emi: 8000,
    savings: 450000,
    goalAmount: 2500000,
    goalYears: 10,
    riskPreference: "aggressive",
  });
});

renderBudgetPlan({
  budgetRule: "balanced",
  age: 29,
  income: 95000,
  fixedExpenses: 28000,
  flexibleExpenses: 14000,
  emi: 6000,
  savings: 220000,
  goalAmount: 1500000,
  goalYears: 8,
  riskPreference: "moderate",
});
