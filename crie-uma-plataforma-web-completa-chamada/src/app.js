(function () {
  "use strict";

  const STORAGE_KEY = "ejmc-vendas-state-v1";
  const SESSION_KEY = "ejmc-vendas-session-v1";

  const roles = ["Trainee", "Hunter", "Assessor", "Gerente"];
  const phases = ["Rampagem", "Transição", "Assessor"];
  const statuses = ["Ativo", "Em atenção", "Pausado", "Inativo"];

  const metricFields = [
    { key: "firstContacts", label: "Primeiros contatos realizados", short: "Contatos" },
    { key: "followUps", label: "Follow-ups feitos", short: "Follow-ups" },
    { key: "leadsAnswered", label: "Leads respondidos", short: "Respostas" },
    { key: "meetingsBooked", label: "Reuniões marcadas", short: "Marcadas" },
    { key: "meetingsHeld", label: "Reuniões realizadas", short: "Realizadas" },
    { key: "roleplaysDone", label: "Roleplays realizados", short: "Roleplays" },
    { key: "roleplayAverage", label: "Nota média roleplay", short: "Nota RP", decimal: true },
  ];

  const featureNameDefaults = {
    roleplay: "Roleplay",
    roleplays: "Roleplays",
    roleplayScore: "Nota RP",
    dashboard: "Dashboard",
    quickUpdate: "Atualização Rápida",
    hunters: "Hunters",
    meetingsBooked: "Reuniões Marcadas",
    prospecting: "Prospecções",
    conversion: "Conversão",
    revenue: "Faturamento",
    simulations: "Simuladas",
    pipeline: "Pipeline",
    ranking: "Ranking",
  };

  const featureNameFields = [
    { key: "roleplay", label: "Roleplay" },
    { key: "roleplays", label: "Roleplays" },
    { key: "roleplayScore", label: "Nota RP" },
    { key: "dashboard", label: "Dashboard" },
    { key: "quickUpdate", label: "Atualização Rápida" },
    { key: "hunters", label: "Hunters" },
    { key: "meetingsBooked", label: "Reuniões Marcadas" },
    { key: "prospecting", label: "Prospecções" },
    { key: "conversion", label: "Conversão" },
    { key: "revenue", label: "Faturamento" },
    { key: "simulations", label: "Simuladas" },
    { key: "pipeline", label: "Pipeline" },
    { key: "ranking", label: "Ranking" },
  ];

  const competencyFields = [
    { key: "organization", label: "Organização" },
    { key: "intensity", label: "Intensidade" },
    { key: "quality", label: "Qualidade" },
    { key: "conversion", label: "Conversão" },
    { key: "followUp", label: "Follow-up" },
    { key: "crm", label: "CRM" },
    { key: "autonomy", label: "Autonomia" },
    { key: "communication", label: "Comunicação" },
    { key: "diagnosis", label: "Diagnóstico" },
    { key: "proactivity", label: "Proatividade" },
    { key: "resilience", label: "Resiliência" },
    { key: "pitch", label: "Domínio do pitch" },
  ];

  const pages = [
    { id: "dashboard", label: "Dashboard Geral", icon: "layout-dashboard" },
    { id: "tactical", label: "Dashboard Tático", icon: "radar" },
    { id: "tv", label: "TV Comercial", icon: "monitor" },
    { id: "members", label: "Membros", icon: "users" },
    { id: "profile", label: "Perfil Individual", icon: "user-round" },
    { id: "quick", label: "Atualização Rápida", icon: "table" },
    { id: "evaluations", label: "Avaliações", icon: "clipboard-check" },
    { id: "roleplays", label: "Roleplays", icon: "messages-square" },
    { id: "metrics", label: "Métricas Comerciais", icon: "chart-no-axes" },
    { id: "settings", label: "Configurações", icon: "settings" },
    { id: "feedback", label: "Relatório de Feedback", icon: "file-text" },
  ];

  const actionPlanByBottleneck = {
    "Baixa intensidade": "Aumentar a meta semanal e revisar a cadência diária de prospecção.",
    "Poucos follow-ups": "Aplicar cadência FU1-FU4 e reservar blocos fixos para retomadas.",
    "Baixa conversão": "Revisar pitch, proposta de valor e RFC antes dos próximos contatos.",
    "Baixa resposta": "Rever segmentação, copy de abordagem e velocidade de resposta aos leads.",
    "Baixa organização": "Fazer revisão semanal do CRM e padronizar próximos passos por lead.",
    "Baixo roleplay": "Realizar mais roleplays com foco em abertura, diagnóstico e objeções.",
    "Baixo pitch": "Treinar narrativa comercial e reforçar domínio da proposta de valor.",
    "Baixa autonomia": "Definir rotina de acompanhamento com mentor e critérios de decisão.",
    "Baixa comunicação": "Praticar clareza, escuta ativa e condução objetiva de reuniões.",
    "Baixo diagnóstico": "Aprofundar perguntas de dor, contexto, impacto e urgência.",
    "Baixa proatividade": "Estabelecer compromissos semanais de iniciativa comercial.",
    "Baixa resiliência": "Reforçar rotina de recuperação após objeções e negativas.",
    "CRM frágil": "Revisar cadastros, tarefas e histórico de interações no CRM.",
    "Sem métricas suficientes": "Realizar a primeira atualização semanal para liberar diagnósticos.",
    "Aguardando primeira atualização": "Preencher métricas e competências na Atualização Rápida.",
  };

  const icons = {
    "layout-dashboard": '<svg viewBox="0 0 24 24"><path d="M4 5a2 2 0 0 1 2-2h4v8H4V5Zm10-2h4a2 2 0 0 1 2 2v4h-6V3ZM4 15h6v6H6a2 2 0 0 1-2-2v-4Zm10-2h6v6a2 2 0 0 1-2 2h-4v-8Z"/></svg>',
    radar: '<svg viewBox="0 0 24 24"><path d="M12 21a9 9 0 1 0-9-9h9V3"/><path d="m12 12 6.3-6.3"/><path d="M12 12v9"/><path d="M12 12H3"/></svg>',
    users: '<svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    "user-round": '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>',
    table: '<svg viewBox="0 0 24 24"><path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5Z"/><path d="M3 9h18M3 15h18M9 3v18"/></svg>',
    "clipboard-check": '<svg viewBox="0 0 24 24"><path d="M9 5h6"/><path d="M9 3h6a2 2 0 0 1 2 2v1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h1V5a2 2 0 0 1 2-2Z"/><path d="m9 14 2 2 4-5"/></svg>',
    "messages-square": '<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10Z"/></svg>',
    "chart-no-axes": '<svg viewBox="0 0 24 24"><path d="M4 19V9"/><path d="M10 19V5"/><path d="M16 19v-7"/><path d="M22 19V3"/></svg>',
    settings: '<svg viewBox="0 0 24 24"><path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.07a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.07A1.7 1.7 0 0 0 4.6 8.94a1.7 1.7 0 0 0-.34-1.88l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.88.34H9a1.7 1.7 0 0 0 1-1.56V3a2 2 0 1 1 4 0v.07a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.88V9a1.7 1.7 0 0 0 1.56 1H21a2 2 0 1 1 0 4h-.07A1.7 1.7 0 0 0 19.4 15Z"/></svg>',
    "file-text": '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h6"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
    save: '<svg viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    logOut: '<svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>',
    print: '<svg viewBox="0 0 24 24"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>',
    monitor: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></svg>',
    play: '<svg viewBox="0 0 24 24"><path d="m8 5 11 7-11 7Z"/></svg>',
    pause: '<svg viewBox="0 0 24 24"><path d="M8 5v14M16 5v14"/></svg>',
    maximize: '<svg viewBox="0 0 24 24"><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M16 21h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>',
    moon: '<svg viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0 9 7.3A9 9 0 1 1 12 3Z"/></svg>',
    sun: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>',
  };

  const app = {
    page: "dashboard",
    selectedMemberId: null,
    state: loadState(),
    toast: null,
    quickDraft: null,
    quickSearch: "",
    quickPeriod: "week",
    memberSearch: "",
    memberRoleFilter: "Todos",
    memberPhaseFilter: "Todas",
    profileTab: "overview",
    feedbackMemberId: null,
    evaluationMemberId: null,
    roleplayMemberId: null,
    tvSlide: 0,
    tvPaused: false,
    tvSettingsOpen: false,
  };

  let tvSlideTimer = null;
  let tvRefreshTimer = null;

  function emptyMetrics() {
    return metricFields.reduce((acc, field) => {
      acc[field.key] = field.key === "roleplayAverage" ? null : 0;
      return acc;
    }, {});
  }

  function emptyCompetencies() {
    return competencyFields.reduce((acc, field) => {
      acc[field.key] = null;
      return acc;
    }, {});
  }

  function initialMembers() {
    return [
      { name: "Bruno Bossolla", role: "Trainee", phase: "Rampagem", status: "Ativo" },
      { name: "Sofia Alves", role: "Trainee", phase: "Transição", status: "Ativo" },
      { name: "Isabela Brito", nickname: "Bela", role: "Trainee", phase: "Rampagem", status: "Ativo" },
      { name: "Frederico Ribeiro", role: "Trainee", phase: "Rampagem", status: "Ativo" },
      { name: "Rafael Medeiros", role: "Assessor", phase: "Assessor", status: "Ativo" },
      { name: "Thiago Chroniaris", role: "Assessor", phase: "Assessor", status: "Ativo" },
      { name: "Matheus Abbud", role: "Assessor", phase: "Assessor", status: "Ativo" },
      { name: "Danilo Oliveira", role: "Assessor", phase: "Assessor", status: "Ativo" },
      { name: "Alice Miele", role: "Assessor", phase: "Assessor", status: "Ativo" },
    ].map((member, index) => ({
      id: `m-${index + 1}`,
      nickname: member.nickname || "",
      metrics: emptyMetrics(),
      competencies: emptyCompetencies(),
      positives: [],
      improvements: [],
      roleplays: [],
      notes: {
        weeklyPositive: "",
        weeklyImprovement: "",
        general: "",
      },
      history: [],
      lastUpdated: null,
      createdAt: new Date().toISOString(),
      ...member,
    }));
  }

  function defaultTvSettings() {
    return {
      monthlyRevenueTarget: 0,
      currentRevenue: 0,
      monthlyMeetingTarget: 0,
      slideSeconds: 12,
      period: "month",
      showRanking: true,
      showActionPlan: true,
      darkMode: true,
      targetResponseRate: "",
      targetContactMeetingRate: "",
      targetResponseMeetingRate: "",
      actionPlan: {
        bottleneck: "",
        weeklyFocus: "",
        action1: "",
        action2: "",
        action3: "",
        owner: "",
        deadline: "",
        status: "Aberto",
      },
    };
  }

  function defaultFeatureNames() {
    return { ...featureNameDefaults };
  }

  function normalizeFeatureNames(featureNames) {
    return Object.keys(featureNameDefaults).reduce((acc, key) => {
      const value = featureNames && typeof featureNames[key] === "string" ? featureNames[key].trim() : "";
      acc[key] = value || featureNameDefaults[key];
      return acc;
    }, {});
  }

  function defaultState() {
    return {
      version: 1,
      members: initialMembers(),
      updatedAt: null,
      settings: {
        workspaceName: "EJMC Vendas",
        cycleName: "Ciclo comercial",
        featureNames: defaultFeatureNames(),
        adminOnlySettings: false,
        tvCommercial: defaultTvSettings(),
      },
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      return normalizeState(parsed);
    } catch (error) {
      return defaultState();
    }
  }

  function normalizeState(state) {
    const base = defaultState();
    const members = Array.isArray(state.members) && state.members.length ? state.members : base.members;
    return {
      ...base,
      ...state,
      members: members.map((member, index) => {
        const normalized = {
          ...base.members[index % base.members.length],
          ...member,
          id: member.id || `m-${index + 1}`,
          metrics: { ...emptyMetrics(), ...(member.metrics || {}) },
          competencies: { ...emptyCompetencies(), ...(member.competencies || {}) },
          notes: {
            weeklyPositive: "",
            weeklyImprovement: "",
            general: "",
            ...(member.notes || {}),
          },
          positives: Array.isArray(member.positives) ? member.positives : [],
          improvements: Array.isArray(member.improvements) ? member.improvements : [],
          roleplays: Array.isArray(member.roleplays) ? member.roleplays : Array.isArray(member.simuladas) ? member.simuladas : [],
          history: Array.isArray(member.history) ? member.history : [],
          phase: phases.includes(member.phase) ? member.phase : member.role === "Assessor" ? "Assessor" : "Transição",
        };
        normalized.metrics.roleplayAverage = roleplayAverage(normalized);
        normalized.metrics.roleplaysDone = normalized.roleplays.length || numberValue(normalized.metrics.roleplaysDone);
        return normalized;
      }),
      settings: {
        ...base.settings,
        ...(state.settings || {}),
        featureNames: normalizeFeatureNames(state.settings && state.settings.featureNames),
        adminOnlySettings: Boolean(state.settings && state.settings.adminOnlySettings),
        tvCommercial: {
          ...defaultTvSettings(),
          ...((state.settings && state.settings.tvCommercial) || {}),
          actionPlan: {
            ...defaultTvSettings().actionPlan,
            ...((state.settings && state.settings.tvCommercial && state.settings.tvCommercial.actionPlan) || {}),
          },
        },
      },
    };
  }

  function saveState() {
    app.state.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(app.state));
  }

  function icon(name) {
    return icons[name] || "";
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function activeFeatureNames() {
    return normalizeFeatureNames(app.state && app.state.settings && app.state.settings.featureNames);
  }

  function uiName(key) {
    return activeFeatureNames()[key] || featureNameDefaults[key] || key;
  }

  function lowerUiName(key) {
    return uiName(key).toLocaleLowerCase("pt-BR");
  }

  function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function featureText(value) {
    const text = String(value ?? "");
    const replacements = new Map([
      ["Atualização Rápida", uiName("quickUpdate")],
      ["atualização rápida", lowerUiName("quickUpdate")],
      ["Dashboard", uiName("dashboard")],
      ["Roleplays", uiName("roleplays")],
      ["roleplays", lowerUiName("roleplays")],
      ["Roleplay", uiName("roleplay")],
      ["roleplay", lowerUiName("roleplay")],
      ["Nota RP", uiName("roleplayScore")],
      ["Hunters", uiName("hunters")],
      ["Hunter", uiName("hunters")],
      ["Reuniões Marcadas", uiName("meetingsBooked")],
      ["Reuniões marcadas", uiName("meetingsBooked")],
      ["reuniões marcadas", lowerUiName("meetingsBooked")],
      ["Prospecções", uiName("prospecting")],
      ["prospecções", lowerUiName("prospecting")],
      ["Prospecção", uiName("prospecting")],
      ["prospecção", lowerUiName("prospecting")],
      ["Conversões", uiName("conversion")],
      ["conversões", lowerUiName("conversion")],
      ["Conversão", uiName("conversion")],
      ["conversão", lowerUiName("conversion")],
      ["Faturamento", uiName("revenue")],
      ["faturamento", lowerUiName("revenue")],
      ["Simuladas", uiName("simulations")],
      ["simuladas", lowerUiName("simulations")],
      ["Simulada", uiName("simulations")],
      ["simulada", lowerUiName("simulations")],
      ["Pipeline", uiName("pipeline")],
      ["Ranking", uiName("ranking")],
      ["ranking", lowerUiName("ranking")],
    ]);
    const pattern = new RegExp([...replacements.keys()].sort((a, b) => b.length - a.length).map(escapeRegExp).join("|"), "g");
    return text.replace(pattern, (match) => replacements.get(match));
  }

  function escapeUi(value) {
    return escapeHtml(featureText(value));
  }

  function metricFieldText(field, property) {
    if (field.key === "meetingsBooked") return uiName("meetingsBooked");
    if (field.key === "roleplaysDone") return property === "label" ? `${uiName("roleplays")} realizados` : uiName("roleplays");
    if (field.key === "roleplayAverage") return property === "label" ? `Nota média ${lowerUiName("roleplay")}` : uiName("roleplayScore");
    return featureText(field[property] || "");
  }

  function clampNumber(value, min, max) {
    const number = Number(value);
    if (Number.isNaN(number)) return null;
    return Math.min(max, Math.max(min, number));
  }

  function numberValue(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
  }

  function formatDate(value) {
    if (!value) return "Aguardando primeira atualização";
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  }

  function formatShortDate(value) {
    if (!value) return "";
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(value));
  }

  function percent(value) {
    if (value === null || value === undefined || Number.isNaN(value)) return "Sem dados";
    return `${Math.round(value * 100)}%`;
  }

  function average(values) {
    const clean = values.filter((value) => value !== null && value !== "" && value !== undefined && !Number.isNaN(Number(value)));
    if (!clean.length) return null;
    return clean.reduce((sum, value) => sum + Number(value), 0) / clean.length;
  }

  function competencyAverage(member) {
    return average(competencyFields.map((field) => member.competencies[field.key]));
  }

  function roleplayAverage(member) {
    const roleplayScores = (member.roleplays || []).map((item) => item.finalScore).filter((value) => value !== null && value !== undefined);
    if (roleplayScores.length) return average(roleplayScores);
    return null;
  }

  function hasMemberData(member) {
    const hasMetrics = metricFields.some((field) => Number(member.metrics[field.key]) > 0);
    const hasCompetencies = competencyFields.some((field) => member.competencies[field.key] !== null && member.competencies[field.key] !== "");
    const hasNotes = Boolean(member.notes.weeklyPositive || member.notes.weeklyImprovement || member.notes.general);
    return hasMetrics || hasCompetencies || member.roleplays.length > 0 || member.positives.length > 0 || member.improvements.length > 0 || hasNotes;
  }

  function totals() {
    return app.state.members.reduce(
      (acc, member) => {
        if (member.status === "Ativo") acc.active += 1;
        if (member.role === "Trainee") acc.trainees += 1;
        if (member.role === "Assessor") acc.assessors += 1;
        metricFields.forEach((field) => {
          acc.metrics[field.key] += Number(member.metrics[field.key]) || 0;
        });
        return acc;
      },
      { active: 0, trainees: 0, assessors: 0, metrics: emptyMetrics() }
    );
  }

  function teamCompetencyAverage() {
    return average(app.state.members.map(competencyAverage));
  }

  function activityRaw(member) {
    const metrics = member.metrics;
    return (
      numberValue(metrics.firstContacts) +
      numberValue(metrics.followUps) +
      numberValue(metrics.leadsAnswered) +
      numberValue(metrics.meetingsBooked) * 3 +
      numberValue(metrics.meetingsHeld) * 4 +
      numberValue(metrics.roleplaysDone) * 2
    );
  }

  function memberScore(member) {
    if (!hasMemberData(member)) return null;
    const maxActivity = Math.max(...app.state.members.map(activityRaw), 0);
    const components = [];
    const compAvg = competencyAverage(member);
    const rpAvg = roleplayAverage(member);
    if (compAvg !== null) components.push(compAvg);
    if (rpAvg !== null) components.push(rpAvg);
    if (maxActivity > 0 && activityRaw(member) > 0) components.push((activityRaw(member) / maxActivity) * 10);
    return average(components);
  }

  function ranking() {
    return app.state.members
      .map((member) => ({ member, score: memberScore(member) }))
      .filter((item) => item.score !== null)
      .sort((a, b) => b.score - a.score);
  }

  function diagnoseMember(member) {
    if (!hasMemberData(member)) {
      return {
        label: "Aguardando primeira atualização",
        severity: 0,
        action: actionPlanByBottleneck["Aguardando primeira atualização"],
        issues: [],
      };
    }

    const metrics = member.metrics;
    const contacts = numberValue(metrics.firstContacts);
    const followUps = numberValue(metrics.followUps);
    const answered = numberValue(metrics.leadsAnswered);
    const meetingsBooked = numberValue(metrics.meetingsBooked);
    const roleplaysDone = numberValue(metrics.roleplaysDone);
    const comp = member.competencies;
    const issues = [];

    function add(label, severity, reason) {
      issues.push({ label, severity, reason, action: actionPlanByBottleneck[label] });
    }

    if (contacts > 0 && followUps < Math.max(1, contacts * 0.45)) add("Poucos follow-ups", 3, "Volume de follow-ups abaixo do esperado para a base acionada.");
    if (contacts > 0 && answered / contacts < 0.2) add("Baixa resposta", 2, "Taxa de resposta abaixo de 20% nos dados informados.");
    if (contacts > 0 && meetingsBooked / contacts < 0.08) add("Baixa conversão", 3, "Poucas reuniões marcadas em relação aos primeiros contatos.");
    if (contacts === 0 && (followUps > 0 || answered > 0 || meetingsBooked > 0)) add("Baixa intensidade", 2, "Há movimentação registrada sem primeiros contatos informados.");
    if (roleplaysDone === 0 && (competencyAverage(member) !== null || contacts > 0)) add("Baixo roleplay", 2, "Nenhum roleplay registrado no ciclo atual.");

    const lowCompetencies = [
      ["organization", "Baixa organização"],
      ["intensity", "Baixa intensidade"],
      ["conversion", "Baixa conversão"],
      ["followUp", "Poucos follow-ups"],
      ["crm", "CRM frágil"],
      ["autonomy", "Baixa autonomia"],
      ["communication", "Baixa comunicação"],
      ["diagnosis", "Baixo diagnóstico"],
      ["proactivity", "Baixa proatividade"],
      ["resilience", "Baixa resiliência"],
      ["pitch", "Baixo pitch"],
    ];

    lowCompetencies.forEach(([key, label]) => {
      const value = comp[key];
      if (value !== null && value !== "" && Number(value) < 6) {
        add(label, 3, `${competencyFields.find((field) => field.key === key)?.label || label} abaixo de 6.`);
      }
    });

    const roleplayPitch = average(member.roleplays.map((roleplay) => roleplay.pitchScore));
    if (roleplayPitch !== null && roleplayPitch < 6) add("Baixo pitch", 3, "Nota de pitch em roleplays abaixo de 6.");

    if (!issues.length) {
      return {
        label: "Sem gargalo crítico",
        severity: 1,
        action: "Manter rotina de acompanhamento e acompanhar evolução semanal.",
        issues: [],
      };
    }

    const selected = issues.sort((a, b) => b.severity - a.severity)[0];
    return {
      label: selected.label,
      severity: selected.severity,
      action: selected.action,
      issues,
    };
  }

  function teamBottleneck() {
    const dataMembers = app.state.members.filter(hasMemberData);
    if (!dataMembers.length) return { label: "Sem métricas suficientes", action: actionPlanByBottleneck["Sem métricas suficientes"], count: 0 };
    const counts = dataMembers.reduce((acc, member) => {
      const label = diagnoseMember(member).label;
      if (label !== "Sem gargalo crítico") acc[label] = (acc[label] || 0) + 1;
      return acc;
    }, {});
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    if (!entries.length) return { label: "Sem gargalo crítico", action: "Manter acompanhamento tático e revisar metas do ciclo.", count: 0 };
    return { label: entries[0][0], count: entries[0][1], action: actionPlanByBottleneck[entries[0][0]] || "Revisar rotina comercial." };
  }

  function responseRate(memberOrTotals) {
    const metrics = memberOrTotals.metrics || memberOrTotals;
    const contacts = numberValue(metrics.firstContacts);
    if (!contacts) return null;
    return numberValue(metrics.leadsAnswered) / contacts;
  }

  function conversionRate(memberOrTotals) {
    const metrics = memberOrTotals.metrics || memberOrTotals;
    const contacts = numberValue(metrics.firstContacts);
    if (!contacts) return null;
    return numberValue(metrics.meetingsBooked) / contacts;
  }

  function responseToMeetingRate(memberOrTotals) {
    const metrics = memberOrTotals.metrics || memberOrTotals;
    const answered = numberValue(metrics.leadsAnswered);
    if (!answered) return null;
    return numberValue(metrics.meetingsBooked) / answered;
  }

  function getMember(id) {
    return app.state.members.find((member) => member.id === id) || app.state.members[0];
  }

  function initials(name) {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }

  function toast(message, type = "success") {
    app.toast = { message, type };
    render();
    window.setTimeout(() => {
      app.toast = null;
      render();
    }, 2600);
  }

  function setPage(page) {
    app.page = page;
    if (window.location.protocol !== "file:") {
      const nextUrl = page === "tv" ? "/tv-comercial" : `/#${page}`;
      if (`${window.location.pathname}${window.location.hash}` !== nextUrl) {
        window.history.pushState({ page }, "", nextUrl);
      }
    } else {
      window.location.hash = page;
    }
    render();
  }

  function routePageFromLocation() {
    if (window.location.pathname.replace(/\/+$/, "") === "/tv-comercial") return "tv";
    const hashPage = window.location.hash.replace("#", "");
    return pages.some((page) => page.id === hashPage) ? hashPage : "";
  }

  function optionLabel(option) {
    return option === "Hunter" ? uiName("hunters") : featureText(option);
  }

  function selectOptions(options, current) {
    return options.map((option) => `<option value="${escapeHtml(option)}" ${option === current ? "selected" : ""}>${escapeHtml(optionLabel(option))}</option>`).join("");
  }

  function render() {
    const root = document.getElementById("app");
    const session = localStorage.getItem(SESSION_KEY);
    if (!session) {
      root.innerHTML = renderLogin();
      bindLogin();
      return;
    }

    if (!app.selectedMemberId) app.selectedMemberId = app.state.members[0]?.id;
    if (!app.feedbackMemberId) app.feedbackMemberId = app.selectedMemberId;
    if (!app.evaluationMemberId) app.evaluationMemberId = app.selectedMemberId;
    if (!app.roleplayMemberId) app.roleplayMemberId = app.selectedMemberId;

    root.innerHTML = `
      <div class="app-shell ${app.page === "tv" ? "tv-shell-mode" : ""}">
        ${renderSidebar()}
        <main class="main-shell">
          ${renderTopbar()}
          <section class="content-shell">
            ${renderPage()}
          </section>
        </main>
        ${app.toast ? `<div class="toast ${app.toast.type}">${escapeHtml(app.toast.message)}</div>` : ""}
      </div>
    `;
    bindAppEvents();
    setupTvTimers();
  }

  function renderLogin() {
    return `
      <main class="login-page">
        <section class="login-visual" aria-label="EJMC Vendas">
          <div class="brand-lockup">
            <div class="brand-mark">EJ</div>
            <div>
              <span class="eyebrow">Central de Inteligência Comercial</span>
              <h1>EJMC Vendas</h1>
            </div>
          </div>
          <div class="login-dashboard-preview">
            <div class="preview-header">
              <span></span><span></span><span></span>
            </div>
            <div class="preview-grid">
              <div class="preview-card wide"></div>
              <div class="preview-card"></div>
              <div class="preview-card"></div>
              <div class="preview-line"></div>
              <div class="preview-line short"></div>
              <div class="preview-chart"><span></span><span></span><span></span><span></span><span></span></div>
            </div>
          </div>
        </section>
        <section class="login-panel">
          <div class="login-card">
            <div class="mobile-brand">
              <div class="brand-mark">EJ</div>
              <strong>EJMC Vendas</strong>
            </div>
            <span class="eyebrow">Acesso interno</span>
            <h2>Entre para acompanhar a performance comercial</h2>
            <form id="login-form" class="form-stack">
              <label>
                E-mail
                <input name="email" type="email" autocomplete="email" value="gestor@ejmc.com" />
              </label>
              <label>
                Senha
                <input name="password" type="password" autocomplete="current-password" value="hunter123" />
              </label>
              <p id="login-error" class="form-error" hidden>Credenciais inválidas. Verifique e tente novamente.</p>
              <button class="primary-button" type="submit">Entrar</button>
              <button class="secondary-button" type="button" id="demo-login">Entrar em modo demonstração</button>
              <button class="primary-button" type="button" id="dashboard-comercial">${escapeUi("Dashboard Comercial")}</button>
            </form>
          </div>
        </section>
      </main>
    `;
  }

  function bindLogin() {
    document.getElementById("login-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const email = String(data.get("email") || "").trim().toLowerCase();
      const password = String(data.get("password") || "");
      if (email === "gestor@ejmc.com" && password === "hunter123") {
        localStorage.setItem(SESSION_KEY, JSON.stringify({ mode: "gestor", at: new Date().toISOString() }));
        app.page = routePageFromLocation() || "dashboard";
        render();
        return;
      }
      document.getElementById("login-error").hidden = false;
    });

    document.getElementById("demo-login").addEventListener("click", () => {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ mode: "demo", at: new Date().toISOString() }));
      app.page = routePageFromLocation() || "dashboard";
      render();
    });

    document.getElementById("dashboard-comercial").addEventListener("click", () => {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ mode: "demo", at: new Date().toISOString() }));
      app.page = "dashboard";
      render();
    });
  }

  function renderSidebar() {
    return `
      <aside class="sidebar">
        <div class="sidebar-brand">
          <div class="brand-mark">EJ</div>
          <div>
            <strong>EJMC Vendas</strong>
            <span>Revenue Operations</span>
          </div>
        </div>
        <nav class="nav-list" aria-label="Navegação principal">
          ${pages
            .map(
              (page) => `
                <button class="nav-item ${app.page === page.id ? "active" : ""}" data-page="${page.id}" type="button">
                  ${icon(page.icon)}
                  <span>${escapeUi(page.label)}</span>
                </button>
              `
            )
            .join("")}
        </nav>
        <div class="sidebar-footer">
          <span>Banco local</span>
          <strong>${formatDate(app.state.updatedAt)}</strong>
        </div>
      </aside>
    `;
  }

  function renderTopbar() {
    const page = pages.find((item) => item.id === app.page);
    return `
      <header class="topbar">
        <div>
          <span class="eyebrow">EJMC · Gestão comercial B2B</span>
          <h2>${escapeUi(page?.label || "Dashboard")}</h2>
        </div>
        <div class="topbar-actions">
          <button class="ghost-button" type="button" data-page="quick">${icon("table")} ${escapeUi("Atualização Rápida")}</button>
          <button class="icon-button" type="button" data-action="logout" aria-label="Sair" title="Sair">${icon("logOut")}</button>
        </div>
      </header>
    `;
  }

  function renderPage() {
    switch (app.page) {
      case "dashboard":
        return renderDashboard();
      case "tactical":
        return renderTactical();
      case "tv":
        return renderTvCommercial();
      case "members":
        return renderMembers();
      case "profile":
        return renderProfile();
      case "quick":
        return renderQuickUpdate();
      case "evaluations":
        return renderEvaluations();
      case "roleplays":
        return renderRoleplays();
      case "metrics":
        return renderMetrics();
      case "settings":
        return renderSettings();
      case "feedback":
        return renderFeedbackReport();
      default:
        return renderDashboard();
    }
  }

  function tvSettings() {
    return app.state.settings.tvCommercial || defaultTvSettings();
  }

  function tvSlides() {
    const settings = tvSettings();
    return [
      { id: "overview", label: "Visão Geral da Área" },
      { id: "goals", label: "Progresso da Meta Mensal" },
      { id: "team-stage", label: "Estágio da Equipe" },
      { id: "conversions", label: "Conversões da Área" },
      { id: "prospecting", label: "Volume de Prospecção" },
      ...(settings.showActionPlan ? [{ id: "action-plan", label: "Plano de Ação Geral" }] : []),
      { id: "alerts", label: "Alertas da Área" },
    ];
  }

  function renderTvCommercial() {
    const settings = tvSettings();
    const slides = tvSlides();
    if (app.tvSlide >= slides.length) app.tvSlide = 0;
    const activeSlide = slides[app.tvSlide] || slides[0];

    return `
      <section class="tv-board ${settings.darkMode ? "dark" : "light"}">
        <header class="tv-header">
          <div class="tv-brand">
            <div class="brand-mark">EJ</div>
            <div>
              <span>TV Comercial</span>
              <strong>EJMC Vendas</strong>
            </div>
          </div>
          <div class="tv-status">
            <span>${escapeUi(activeSlide.label)}</span>
            <strong>Atualizado: ${formatDate(app.state.updatedAt)}</strong>
          </div>
          <div class="tv-controls">
            <button class="tv-control" type="button" data-page="dashboard">${escapeUi("Dashboard")}</button>
            <button class="tv-control" type="button" id="tv-pause">${icon(app.tvPaused ? "play" : "pause")} ${app.tvPaused ? "Continuar" : "Pausar"}</button>
            <button class="tv-control" type="button" id="tv-theme-toggle">${icon(settings.darkMode ? "sun" : "moon")} ${settings.darkMode ? "Claro" : "Escuro"}</button>
            <button class="tv-control" type="button" id="tv-fullscreen">${icon("maximize")} Tela cheia</button>
            <button class="tv-control primary" type="button" id="tv-settings-toggle">${icon("settings")} Configurar</button>
          </div>
        </header>

        <main class="tv-slide-stage">
          ${renderTvSlide(activeSlide.id)}
        </main>

        <footer class="tv-footer">
          <div class="tv-dots">
            ${slides
              .map(
                (slide, index) => `
                  <button class="${index === app.tvSlide ? "active" : ""}" type="button" data-tv-slide="${index}" aria-label="${escapeUi(slide.label)}">
                    <span></span>
                  </button>
                `
              )
              .join("")}
          </div>
          <span>Slide ${app.tvSlide + 1} de ${slides.length} · Troca a cada ${Number(settings.slideSeconds) || 12}s · ${tvPeriodLabel(settings.period)}</span>
        </footer>

        ${app.tvSettingsOpen ? renderTvSettingsModal() : ""}
      </section>
    `;
  }

  function renderTvSlide(slide) {
    switch (slide) {
      case "overview":
        return renderTvOverviewSlide();
      case "goals":
        return renderTvGoalsSlide();
      case "team-stage":
        return renderTvTeamStageSlide();
      case "conversions":
        return renderTvConversionsSlide();
      case "prospecting":
        return renderTvProspectingSlide();
      case "action-plan":
        return renderTvActionPlanSlide();
      case "alerts":
        return renderTvAlertsSlide();
      default:
        return renderTvOverviewSlide();
    }
  }

  function renderTvOverviewSlide() {
    const sum = totals();
    const settings = tvSettings();
    return `
      <section class="tv-slide">
        <div class="tv-slide-title">
          <span>Visão geral da área</span>
          <h1>Indicadores comerciais consolidados</h1>
        </div>
        <div class="tv-metric-grid">
          ${tvMetric("Primeiros contatos no mês", sum.metrics.firstContacts || "Aguardando atualização")}
          ${tvMetric("Follow-ups feitos", sum.metrics.followUps || "Aguardando atualização")}
          ${tvMetric("Leads respondidos", sum.metrics.leadsAnswered || "Aguardando atualização")}
          ${tvMetric("Reuniões marcadas", sum.metrics.meetingsBooked || "Aguardando atualização")}
          ${tvMetric("Reuniões realizadas", sum.metrics.meetingsHeld || "Aguardando atualização")}
          ${tvMetric("Taxa de resposta", percent(responseRate(sum.metrics)))}
          ${tvMetric("Contato -> reunião", percent(conversionRate(sum.metrics)))}
          ${tvMetric("Resposta -> reunião", percent(responseToMeetingRate(sum.metrics)))}
        </div>
        ${settings.showRanking ? renderTvRankingPanel() : ""}
      </section>
    `;
  }

  function renderTvGoalsSlide() {
    const settings = tvSettings();
    const sum = totals();
    const revenueGoal = goalProgress(numberValue(settings.currentRevenue), numberValue(settings.monthlyRevenueTarget), "currency");
    const meetingGoal = goalProgress(sum.metrics.meetingsBooked, numberValue(settings.monthlyMeetingTarget), "number");

    return `
      <section class="tv-slide">
        <div class="tv-slide-title">
          <span>Meta mensal</span>
          <h1>${escapeUi("Ritmo de faturamento e reuniões marcadas")}</h1>
        </div>
        <div class="tv-goal-grid">
          ${tvGoalCard("Faturamento", settings.currentRevenue, settings.monthlyRevenueTarget, revenueGoal, "currency")}
          ${tvGoalCard("Reuniões marcadas", sum.metrics.meetingsBooked, settings.monthlyMeetingTarget, meetingGoal, "number")}
        </div>
      </section>
    `;
  }

  function renderTvTeamStageSlide() {
    const phaseCounts = phases.map((phase) => ({ phase, count: app.state.members.filter((member) => member.phase === phase).length }));
    return `
      <section class="tv-slide">
        <div class="tv-slide-title">
          <span>Estágio da equipe</span>
          <h1>Distribuição de cargos, fases e status</h1>
        </div>
        <div class="tv-stage-layout">
          <div class="tv-phase-stack">
            ${phaseCounts
              .map((item) => {
                const width = app.state.members.length ? (item.count / app.state.members.length) * 100 : 0;
                return progressRow(item.phase, item.count, width);
              })
              .join("")}
          </div>
          <div class="tv-member-grid">
            ${app.state.members
              .map(
                (member) => `
                  <div class="tv-member-card">
                    <div class="avatar">${initials(member.name)}</div>
                    <div>
                      <strong>${escapeHtml(member.name)}</strong>
                      <span>${escapeUi(member.role)} · ${escapeHtml(member.phase)}</span>
                    </div>
                    ${badge(member.status, member.status === "Ativo" ? "success" : "neutral")}
                  </div>
                `
              )
              .join("")}
          </div>
        </div>
      </section>
    `;
  }

  function renderTvConversionsSlide() {
    const settings = tvSettings();
    const sum = totals();
    return `
      <section class="tv-slide">
        <div class="tv-slide-title">
          <span>${escapeUi("Conversões da área")}</span>
          <h1>Eficiência do funil comercial</h1>
        </div>
        <div class="tv-conversion-grid">
          ${tvConversionCard("Taxa geral de resposta", responseRate(sum.metrics), settings.targetResponseRate)}
          ${tvConversionCard("Contato -> reunião", conversionRate(sum.metrics), settings.targetContactMeetingRate)}
          ${tvConversionCard("Resposta -> reunião", responseToMeetingRate(sum.metrics), settings.targetResponseMeetingRate)}
        </div>
        <div class="tv-panel wide">
          <div class="tv-panel-header">
            <span>Evolução semanal</span>
            <strong>${app.state.members.some((member) => member.history.length) ? "Histórico disponível" : "Sem dados suficientes"}</strong>
          </div>
          ${renderTvWeeklyEvolution()}
        </div>
      </section>
    `;
  }

  function renderTvProspectingSlide() {
    const sum = totals();
    const activeMembers = app.state.members.filter((member) => member.status === "Ativo");
    const averageContacts = activeMembers.length ? sum.metrics.firstContacts / activeMembers.length : 0;
    const above = activeMembers.filter((member) => numberValue(member.metrics.firstContacts) > averageContacts && sum.metrics.firstContacts > 0);
    const below = activeMembers.filter((member) => numberValue(member.metrics.firstContacts) < averageContacts && sum.metrics.firstContacts > 0);

    return `
      <section class="tv-slide">
        <div class="tv-slide-title">
          <span>${escapeUi("Volume de prospecção")}</span>
          <h1>Ritmo de contatos e cadência de follow-up</h1>
        </div>
        <div class="tv-prospect-grid">
          ${tvMetric("Total de prospecções", sum.metrics.firstContacts || "Aguardando atualização")}
          ${tvMetric("Follow-ups realizados", sum.metrics.followUps || "Aguardando atualização")}
          ${tvMetric("Média por membro", sum.metrics.firstContacts ? averageContacts.toFixed(1) : "Sem dados suficientes")}
        </div>
        <div class="tv-split">
          ${renderTvMemberList("Acima da média", above, "success")}
          ${renderTvMemberList("Abaixo da média", below, "neutral")}
        </div>
      </section>
    `;
  }

  function renderTvActionPlanSlide() {
    const plan = tvSettings().actionPlan;
    const hasPlan = Object.values(plan).some(Boolean);
    return `
      <section class="tv-slide">
        <div class="tv-slide-title">
          <span>Plano de ação geral</span>
          <h1>Foco coletivo da área comercial</h1>
        </div>
        ${
          hasPlan
            ? `
              <div class="tv-action-grid">
                ${tvActionItem("Principal gargalo", plan.bottleneck)}
                ${tvActionItem("Foco da semana", plan.weeklyFocus)}
                ${tvActionItem("Ação prioritária 1", plan.action1)}
                ${tvActionItem("Ação prioritária 2", plan.action2)}
                ${tvActionItem("Ação prioritária 3", plan.action3)}
                ${tvActionItem("Responsável", plan.owner)}
                ${tvActionItem("Prazo", plan.deadline ? formatShortDate(plan.deadline) : "")}
                ${tvActionItem("Status", plan.status)}
              </div>
            `
            : emptyState("Plano de ação ainda não configurado", "Abra Configurar e preencha o foco coletivo da semana.")
        }
      </section>
    `;
  }

  function renderTvAlertsSlide() {
    const alerts = tvAlerts();
    return `
      <section class="tv-slide">
        <div class="tv-slide-title">
          <span>Alertas da área</span>
          <h1>Sinais de gestão para acompanhamento rápido</h1>
        </div>
        ${
          alerts.length
            ? `<div class="tv-alert-grid">${alerts.map((alert) => `<div class="tv-alert-card ${alert.type}"><strong>${escapeUi(alert.title)}</strong><p>${escapeUi(alert.text)}</p></div>`).join("")}</div>`
            : emptyState("Sem alertas críticos", "Nenhum alerta coletivo com os dados atuais.")
        }
      </section>
    `;
  }

  function renderTvSettingsModal() {
    const settings = tvSettings();
    const sum = totals();
    const plan = settings.actionPlan;
    return `
      <div class="tv-modal-backdrop">
        <form class="tv-settings-modal" id="tv-settings-form">
          <div class="panel-header">
            <div>
              <span class="eyebrow">Configurações da TV Comercial</span>
              <h3>Metas, slides e plano de ação</h3>
            </div>
            <button class="icon-button" type="button" id="tv-settings-close" aria-label="Fechar">×</button>
          </div>

          <div class="tv-settings-grid">
            <label>${escapeUi("Meta mensal de faturamento")}<input name="monthlyRevenueTarget" type="number" min="0" step="100" value="${escapeHtml(settings.monthlyRevenueTarget)}" /></label>
            <label>${escapeUi("Faturamento atual")}<input name="currentRevenue" type="number" min="0" step="100" value="${escapeHtml(settings.currentRevenue)}" /></label>
            <label>${escapeUi("Meta mensal de reuniões")}<input name="monthlyMeetingTarget" type="number" min="0" step="1" value="${escapeHtml(settings.monthlyMeetingTarget)}" /></label>
            <label>${escapeUi("Reuniões atuais")}<input name="currentMeetings" type="number" value="${escapeHtml(sum.metrics.meetingsBooked)}" readonly /></label>
            <label>Tempo de troca dos slides<input name="slideSeconds" type="number" min="5" max="120" step="1" value="${escapeHtml(settings.slideSeconds)}" /></label>
            <label>Período analisado
              <select name="period">
                <option value="week" ${settings.period === "week" ? "selected" : ""}>Semana atual</option>
                <option value="month" ${settings.period === "month" ? "selected" : ""}>Mês atual</option>
                <option value="all" ${settings.period === "all" ? "selected" : ""}>Todo o histórico</option>
              </select>
            </label>
            <label>Meta taxa de resposta (%)<input name="targetResponseRate" type="number" min="0" max="100" step="0.5" value="${escapeHtml(settings.targetResponseRate)}" placeholder="Opcional" /></label>
            <label>Meta contato -> reunião (%)<input name="targetContactMeetingRate" type="number" min="0" max="100" step="0.5" value="${escapeHtml(settings.targetContactMeetingRate)}" placeholder="Opcional" /></label>
            <label>Meta resposta -> reunião (%)<input name="targetResponseMeetingRate" type="number" min="0" max="100" step="0.5" value="${escapeHtml(settings.targetResponseMeetingRate)}" placeholder="Opcional" /></label>
          </div>

          <div class="tv-toggle-row">
            <label><input name="showRanking" type="checkbox" ${settings.showRanking ? "checked" : ""} /> ${escapeUi("Mostrar ranking individual")}</label>
            <label><input name="showActionPlan" type="checkbox" ${settings.showActionPlan ? "checked" : ""} /> Mostrar plano de ação</label>
            <label><input name="darkMode" type="checkbox" ${settings.darkMode ? "checked" : ""} /> Modo escuro</label>
          </div>

          <div class="tv-settings-grid">
            <label class="span-2">${escapeUi("Principal gargalo do mês")}<textarea name="bottleneck" placeholder="${escapeUi("Ex.: baixa conversão resposta -> reunião")}">${escapeHtml(plan.bottleneck)}</textarea></label>
            <label class="span-2">Foco da semana<textarea name="weeklyFocus" placeholder="Ex.: melhorar CTA e cadência de follow-up">${escapeHtml(plan.weeklyFocus)}</textarea></label>
            <label>Ação prioritária 1<input name="action1" value="${escapeHtml(plan.action1)}" /></label>
            <label>Ação prioritária 2<input name="action2" value="${escapeHtml(plan.action2)}" /></label>
            <label>Ação prioritária 3<input name="action3" value="${escapeHtml(plan.action3)}" /></label>
            <label>Responsável<input name="owner" value="${escapeHtml(plan.owner)}" /></label>
            <label>Prazo<input name="deadline" type="date" value="${escapeHtml(plan.deadline)}" /></label>
            <label>Status
              <select name="status">
                ${selectOptions(["Aberto", "Em andamento", "Concluído"], plan.status)}
              </select>
            </label>
          </div>

          <div class="button-row">
            <button class="primary-button" type="submit">${icon("save")} Salvar configurações</button>
            <button class="secondary-button" type="button" id="tv-settings-cancel">Cancelar</button>
          </div>
        </form>
      </div>
    `;
  }

  function tvMetric(label, value) {
    return `
      <article class="tv-metric">
        <span>${escapeUi(label)}</span>
        <strong>${escapeHtml(value)}</strong>
      </article>
    `;
  }

  function tvGoalCard(label, current, target, progress, type) {
    const configured = progress.percent !== null;
    return `
      <article class="tv-goal-card ${configured ? progress.statusKey : "empty"}">
        <div>
          <span>${escapeUi(label)}</span>
          <strong>${configured ? progress.display : "Meta ainda não configurada"}</strong>
        </div>
        <div class="tv-goal-values">
          <span>Realizado: ${type === "currency" ? formatCurrency(current) : escapeHtml(current || 0)}</span>
          <span>Meta: ${target ? (type === "currency" ? formatCurrency(target) : escapeHtml(target)) : "Não configurada"}</span>
        </div>
        <div class="tv-progress-track"><span style="width:${configured ? Math.min(100, progress.percent * 100) : 0}%"></span></div>
        <div class="tv-goal-footer">
          ${badge(progress.status, progress.statusKey === "below" ? "danger" : progress.statusKey === "above" ? "success" : "soft")}
          <span>Faltante: ${configured ? progress.missing : "Meta ainda não configurada"}</span>
        </div>
      </article>
    `;
  }

  function tvConversionCard(label, value, target) {
    const hasValue = value !== null;
    const numericTarget = target === "" || target === null || target === undefined ? null : Number(target) / 100;
    const targetText = numericTarget === null || Number.isNaN(numericTarget) ? "Meta ainda não configurada" : `Meta: ${percent(numericTarget)}`;
    const status = !hasValue ? "Sem dados suficientes" : numericTarget === null || Number.isNaN(numericTarget) ? "Sem meta comparativa" : value >= numericTarget ? "Acima da meta" : "Abaixo da meta";
    return `
      <article class="tv-conversion-card">
        <span>${escapeUi(label)}</span>
        <strong>${hasValue ? percent(value) : "Sem dados suficientes"}</strong>
        <p>${escapeUi(targetText)}</p>
        ${badge(status, status === "Abaixo da meta" ? "danger" : status === "Acima da meta" ? "success" : "neutral")}
      </article>
    `;
  }

  function tvActionItem(label, value) {
    return `
      <article class="tv-action-item">
        <span>${escapeUi(label)}</span>
        <strong>${escapeUi(value || "Aguardando definição")}</strong>
      </article>
    `;
  }

  function renderTvMemberList(title, members, type) {
    return `
      <div class="tv-panel">
        <div class="tv-panel-header">
          <span>${escapeUi(title)}</span>
          ${badge(members.length ? `${members.length} membro(s)` : "Sem dados suficientes", type)}
        </div>
        ${
          members.length
            ? `<div class="tv-mini-member-list">${members.map((member) => `<div>${memberIdentity(member)}<strong>${numberValue(member.metrics.firstContacts)}</strong></div>`).join("")}</div>`
            : emptyState("Sem dados suficientes", "Aguardando volume de prospecção para comparação.")
        }
      </div>
    `;
  }

  function renderTvRankingPanel() {
    const items = ranking().slice(0, 5);
    return `
      <div class="tv-panel wide">
        <div class="tv-panel-header">
          <span>${escapeUi("Ranking individual")}</span>
          ${badge(items.length ? "Visão resumida" : "Sem dados suficientes", items.length ? "soft" : "neutral")}
        </div>
        ${
          items.length
            ? `<div class="tv-ranking-strip">${items
                .map(
                  (item, index) => `
                    <div>
                      <span>${index + 1}</span>
                      <strong>${escapeHtml(item.member.name)}</strong>
                      <b>${item.score.toFixed(1)}</b>
                    </div>
                  `
                )
                .join("")}</div>`
            : emptyState("Sem dados suficientes", "O ranking será exibido após a primeira atualização.")
        }
      </div>
    `;
  }

  function renderTvWeeklyEvolution() {
    const history = app.state.members.flatMap((member) => member.history || []);
    if (!history.length) return emptyState("Sem dados suficientes", "A evolução semanal aparecerá após salvar atualizações recorrentes.");
    const grouped = history.reduce((acc, item) => {
      const key = formatShortDate(item.date);
      acc[key] = acc[key] || [];
      if (item.score !== null && item.score !== undefined) acc[key].push(Number(item.score));
      return acc;
    }, {});
    const values = Object.entries(grouped)
      .map(([label, scores]) => ({ label, value: average(scores) }))
      .filter((item) => item.value !== null)
      .slice(-6);
    if (!values.length) return emptyState("Sem dados suficientes", "Ainda não há índices semanais para exibir.");
    const max = Math.max(...values.map((item) => item.value), 1);
    return `
      <div class="tv-week-bars">
        ${values
          .map(
            (item) => `
              <div>
                <span style="height:${Math.max(8, (item.value / max) * 100)}%"></span>
                <strong>${item.value.toFixed(1)}</strong>
                <small>${escapeHtml(item.label)}</small>
              </div>
            `
          )
          .join("")}
      </div>
    `;
  }

  function tvAlerts() {
    const sum = totals();
    const settings = tvSettings();
    const now = Date.now();
    const staleMembers = app.state.members.filter((member) => !member.lastUpdated || now - new Date(member.lastUpdated).getTime() > 1000 * 60 * 60 * 24 * 7);
    const zeroMembers = app.state.members.filter((member) => ["firstContacts", "followUps", "leadsAnswered", "meetingsBooked", "meetingsHeld"].every((key) => numberValue(member.metrics[key]) === 0));
    const diagnostics = app.state.members.map((member) => ({ member, diagnostic: diagnoseMember(member) }));
    const lowIntensity = diagnostics.filter((item) => item.diagnostic.label === "Baixa intensidade");
    const fewFollowUps = diagnostics.filter((item) => item.diagnostic.label === "Poucos follow-ups");
    const lowConversion = diagnostics.filter((item) => item.diagnostic.label === "Baixa conversão");
    const meetingGoal = goalProgress(sum.metrics.meetingsBooked, numberValue(settings.monthlyMeetingTarget), "number");
    const revenueGoal = goalProgress(numberValue(settings.currentRevenue), numberValue(settings.monthlyRevenueTarget), "currency");
    const alerts = [];

    if (staleMembers.length) alerts.push({ type: "warning", title: "Membros sem atualização recente", text: namesSummary(staleMembers) });
    if (zeroMembers.length) alerts.push({ type: "warning", title: "Membros com métricas zeradas", text: namesSummary(zeroMembers) });
    if (lowIntensity.length) alerts.push({ type: "danger", title: "Baixa intensidade", text: namesSummary(lowIntensity.map((item) => item.member)) });
    if (fewFollowUps.length) alerts.push({ type: "danger", title: "Poucos follow-ups", text: namesSummary(fewFollowUps.map((item) => item.member)) });
    if (lowConversion.length) alerts.push({ type: "danger", title: "Baixa conversão", text: namesSummary(lowConversion.map((item) => item.member)) });
    if (meetingGoal.statusKey === "below") alerts.push({ type: "danger", title: "Meta de reuniões abaixo do ritmo", text: `Faltam ${meetingGoal.missing} para bater a meta mensal.` });
    if (revenueGoal.statusKey === "below") alerts.push({ type: "danger", title: "Meta de faturamento abaixo do ritmo", text: `Faltam ${revenueGoal.missing} para bater a meta mensal.` });

    return alerts;
  }

  function namesSummary(members) {
    if (!members.length) return "Sem membros identificados.";
    const names = members.slice(0, 5).map((member) => member.name).join(", ");
    return members.length > 5 ? `${names} e mais ${members.length - 5}.` : names;
  }

  function goalProgress(current, target, type) {
    if (!target || target <= 0) {
      return { percent: null, display: "Meta ainda não configurada", missing: "Meta ainda não configurada", status: "Meta ainda não configurada", statusKey: "empty" };
    }
    const pct = current / target;
    const elapsed = monthElapsedRatio();
    let status = "No ritmo";
    let statusKey = "pace";
    if (pct + 0.05 < elapsed) {
      status = "Abaixo do ritmo";
      statusKey = "below";
    } else if (pct > elapsed + 0.05) {
      status = "Acima do ritmo";
      statusKey = "above";
    }
    const missing = Math.max(0, target - current);
    return {
      percent: pct,
      display: `${Math.round(pct * 100)}%`,
      missing: type === "currency" ? formatCurrency(missing) : String(Math.ceil(missing)),
      status,
      statusKey,
    };
  }

  function monthElapsedRatio() {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    return now.getDate() / daysInMonth;
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(Number(value) || 0);
  }

  function tvPeriodLabel(period) {
    if (period === "week") return "Semana atual";
    if (period === "all") return "Todo o histórico";
    return "Mês atual";
  }

  function renderDashboard() {
    const sum = totals();
    const compAvg = teamCompetencyAverage();
    const teamBottle = teamBottleneck();
    const rank = ranking();
    const hasAnyData = app.state.members.some(hasMemberData);
    const phaseCounts = phases.map((phase) => ({
      phase,
      count: app.state.members.filter((member) => member.phase === phase).length,
    }));

    return `
      <div class="page-grid">
        <section class="hero-band">
          <div>
            <span class="eyebrow">Visão executiva</span>
            <h1>Performance comercial com leitura rápida de evolução, gargalos e ritmo do time.</h1>
          </div>
          <div class="hero-metrics">
            ${miniStat("Trainees", sum.trainees)}
            ${miniStat("Assessores", sum.assessors)}
            ${miniStat("Ativos", sum.active)}
          </div>
        </section>

        <section class="kpi-grid">
          ${kpiCard("Média geral", compAvg === null ? "Sem dados" : compAvg.toFixed(1), "Competências preenchidas", compAvg === null ? "empty" : "")}
          ${kpiCard("Contatos realizados", sum.metrics.firstContacts, "Primeiros contatos registrados")}
          ${kpiCard("Reuniões marcadas", sum.metrics.meetingsBooked, "Conversão comercial")}
          ${kpiCard("Taxa de resposta", percent(responseRate(sum.metrics)), "Leads respondidos / contatos", responseRate(sum.metrics) === null ? "empty" : "")}
          ${kpiCard("Taxa de conversão", percent(conversionRate(sum.metrics)), "Reuniões marcadas / contatos", conversionRate(sum.metrics) === null ? "empty" : "")}
          ${kpiCard("Gargalo do time", teamBottle.label, teamBottle.count ? `${teamBottle.count} membro(s) afetado(s)` : "Sem recorrência crítica", teamBottle.label.includes("Sem") ? "empty" : "danger")}
        </section>

        <section class="two-column">
          <article class="panel">
            <div class="panel-header">
              <div>
                <span class="eyebrow">${escapeUi("Ranking")}</span>
                <h3>Performance individual</h3>
              </div>
              <button class="ghost-button compact" type="button" data-page="members">Ver membros</button>
            </div>
            ${rank.length ? renderRanking(rank.slice(0, 7)) : emptyState("Aguardando primeira atualização", "O ranking será liberado assim que houver métricas, competências ou roleplays registrados.")}
          </article>

          <article class="panel">
            <div class="panel-header">
              <div>
                <span class="eyebrow">Fases</span>
                <h3>Distribuição por fase</h3>
              </div>
            </div>
            <div class="bar-list">
              ${phaseCounts
                .map((item) => {
                  const width = app.state.members.length ? (item.count / app.state.members.length) * 100 : 0;
                  return progressRow(item.phase, item.count, width);
                })
                .join("")}
            </div>
          </article>
        </section>

        <section class="two-column">
          <article class="panel">
            <div class="panel-header">
              <div>
                <span class="eyebrow">Evolução mensal</span>
                <h3>Histórico consolidado</h3>
              </div>
            </div>
            ${renderMonthlyEvolution()}
          </article>

          <article class="panel">
            <div class="panel-header">
              <div>
                <span class="eyebrow">Alertas</span>
                <h3>Sinais de atenção</h3>
              </div>
            </div>
            ${hasAnyData ? renderAlerts() : emptyState("Sem métricas suficientes", "Os alertas aparecerão depois da primeira atualização semanal.")}
          </article>
        </section>
      </div>
    `;
  }

  function renderTactical() {
    const dataMembers = app.state.members.filter(hasMemberData);
    const diagnostics = dataMembers.map((member) => ({ member, diagnostic: diagnoseMember(member), score: memberScore(member) }));
    const risk = diagnostics.filter((item) => item.diagnostic.severity >= 3);
    const evolving = diagnostics.filter((item) => isEvolving(item.member));
    const teamBottle = teamBottleneck();

    return `
      <div class="page-grid">
        <section class="section-title-row">
          <div>
            <span class="eyebrow">Gestão tática</span>
            <h1>Leitura objetiva para one-on-ones, reuniões semanais e priorização de acompanhamento.</h1>
          </div>
          <button class="primary-button small" type="button" data-page="quick">${icon("save")} ${escapeUi("Atualização Rápida")}</button>
        </section>

        <section class="tactical-grid">
          ${tacticalCard("Membros em risco", risk.length || "Sem dados", risk.length ? "Exigem intervenção tática" : "Aguardando dados", "danger")}
          ${tacticalCard("Em evolução", evolving.length || "Sem dados", evolving.length ? "Melhora no histórico" : "Sem histórico suficiente", "success")}
          ${tacticalCard("Gargalo do time", teamBottle.label, teamBottle.action, "dark")}
        </section>

        <section class="two-column">
          <article class="panel">
            <div class="panel-header">
              <div>
                <span class="eyebrow">Diagnóstico individual</span>
                <h3>Gargalo principal por membro</h3>
              </div>
            </div>
            ${diagnostics.length ? renderDiagnosticTable(diagnostics) : emptyState("Aguardando primeira atualização", "Preencha métricas e competências para liberar a leitura tática.")}
          </article>
          <article class="panel">
            <div class="panel-header">
              <div>
                <span class="eyebrow">Evolução semanal</span>
                <h3>Últimos movimentos</h3>
              </div>
            </div>
            ${renderWeeklyEvolution()}
          </article>
        </section>

        <section class="panel">
          <div class="panel-header">
            <div>
              <span class="eyebrow">Comparativo</span>
              <h3>Comparação entre membros</h3>
            </div>
          </div>
          ${dataMembers.length ? renderComparisonMatrix(dataMembers) : emptyState("Sem métricas suficientes", "A matriz comparativa será exibida após o primeiro preenchimento.")}
        </section>
      </div>
    `;
  }

  function renderMembers() {
    const filtered = app.state.members.filter((member) => {
      const query = app.memberSearch.toLowerCase();
      const matchesSearch = !query || member.name.toLowerCase().includes(query) || member.nickname.toLowerCase().includes(query);
      const matchesRole = app.memberRoleFilter === "Todos" || member.role === app.memberRoleFilter;
      const matchesPhase = app.memberPhaseFilter === "Todas" || member.phase === app.memberPhaseFilter;
      return matchesSearch && matchesRole && matchesPhase;
    });

    return `
      <div class="page-grid">
        <section class="section-title-row">
          <div>
            <span class="eyebrow">Equipe comercial</span>
            <h1>Membros, cargos, fases e status com edição rápida.</h1>
          </div>
        </section>

        <section class="panel">
          <div class="toolbar">
            <label class="search-box">${icon("search")}<input id="member-search" type="search" value="${escapeHtml(app.memberSearch)}" placeholder="Buscar por nome" /></label>
            <select id="member-role-filter">${selectOptions(["Todos", ...roles], app.memberRoleFilter)}</select>
            <select id="member-phase-filter">${selectOptions(["Todas", ...phases], app.memberPhaseFilter)}</select>
          </div>
          <div class="table-wrap">
            <table class="data-table member-table">
              <thead>
                <tr>
                  <th>Membro</th>
                  <th>Cargo</th>
                  <th>Fase</th>
                  <th>Status</th>
                  <th>Gargalo</th>
                  <th>Última atualização</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                ${filtered
                  .map((member) => {
                    const diagnostic = diagnoseMember(member);
                    return `
                      <tr>
                        <td>${memberIdentity(member)}</td>
                        <td><select class="inline-select" data-member-field="role" data-member-id="${member.id}">${selectOptions(roles, member.role)}</select></td>
                        <td><select class="inline-select" data-member-field="phase" data-member-id="${member.id}">${selectOptions(phases, member.phase)}</select></td>
                        <td><select class="inline-select" data-member-field="status" data-member-id="${member.id}">${selectOptions(statuses, member.status)}</select></td>
                        <td>${badge(diagnostic.label, diagnostic.severity >= 3 ? "danger" : diagnostic.severity === 0 ? "neutral" : "soft")}</td>
                        <td>${formatDate(member.lastUpdated)}</td>
                        <td><button class="ghost-button compact" type="button" data-open-profile="${member.id}">Ver perfil</button></td>
                      </tr>
                    `;
                  })
                  .join("")}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    `;
  }

  function ensureQuickDraft() {
    if (!app.quickDraft) {
      app.quickDraft = {};
      app.state.members.forEach((member) => {
        app.quickDraft[member.id] = JSON.parse(JSON.stringify(member));
      });
    }
  }

  function renderQuickUpdate() {
    ensureQuickDraft();
    const filtered = app.state.members.filter((member) => {
      const draft = app.quickDraft[member.id] || member;
      const query = app.quickSearch.toLowerCase();
      return !query || draft.name.toLowerCase().includes(query) || draft.nickname.toLowerCase().includes(query);
    });

    const columns = [
      "Nome",
      "Cargo",
      "Fase",
      "Status",
      ...metricFields.filter((field) => field.key !== "roleplayAverage").map((field) => metricFieldText(field, "short")),
      ...competencyFields.map((field) => featureText(field.label)),
      "Pontos positivos",
      "Pontos de melhoria",
      "Observações",
    ];

    return `
      <div class="page-grid quick-page">
        <section class="section-title-row">
          <div>
            <span class="eyebrow">Planilha premium</span>
            <h1>Atualize a equipe inteira em poucos minutos.</h1>
          </div>
          <button class="primary-button small" type="button" id="save-quick">${icon("save")} Salvar tudo</button>
        </section>

        <section class="panel quick-panel">
          <div class="toolbar sticky-toolbar">
            <label class="search-box">${icon("search")}<input id="quick-search" type="search" value="${escapeHtml(app.quickSearch)}" placeholder="Buscar por nome" /></label>
            <select id="quick-period">
              <option value="week" ${app.quickPeriod === "week" ? "selected" : ""}>Semana atual</option>
              <option value="month" ${app.quickPeriod === "month" ? "selected" : ""}>Mês atual</option>
              <option value="all" ${app.quickPeriod === "all" ? "selected" : ""}>Todo o histórico</option>
            </select>
            <span class="last-update">Última atualização: ${formatDate(app.state.updatedAt)}</span>
          </div>
          <div class="table-wrap quick-table-wrap">
            <table class="data-table quick-table">
              <thead>
                <tr>${columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("")}</tr>
              </thead>
              <tbody>
                ${filtered.map((member) => renderQuickRow(app.quickDraft[member.id] || member)).join("")}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    `;
  }

  function renderQuickRow(member) {
    return `
      <tr data-quick-row="${member.id}">
        <td><input class="cell-input name-input" data-quick-field="name" value="${escapeHtml(member.name)}" /></td>
        <td><select class="cell-input" data-quick-field="role">${selectOptions(roles, member.role)}</select></td>
        <td><select class="cell-input" data-quick-field="phase">${selectOptions(phases, member.phase)}</select></td>
        <td><select class="cell-input" data-quick-field="status">${selectOptions(statuses, member.status)}</select></td>
          ${metricFields
          .filter((field) => field.key !== "roleplayAverage")
          .map((field) => {
            const value = member.metrics[field.key] ?? 0;
            return `<td><input class="cell-input number" type="number" min="0" ${field.decimal ? 'step="0.1" max="10"' : 'step="1"'} data-quick-metric="${field.key}" value="${escapeHtml(value)}" /></td>`;
          })
          .join("")}
        ${competencyFields
          .map((field) => {
            const value = member.competencies[field.key] ?? "";
            return `<td><input class="cell-input number" type="number" min="0" max="10" step="0.5" data-quick-competency="${field.key}" value="${escapeHtml(value)}" placeholder="0-10" /></td>`;
          })
          .join("")}
        <td><textarea class="cell-textarea" data-quick-note="weeklyPositive" placeholder="Destaques da semana">${escapeHtml(member.notes.weeklyPositive)}</textarea></td>
        <td><textarea class="cell-textarea" data-quick-note="weeklyImprovement" placeholder="Melhorias da semana">${escapeHtml(member.notes.weeklyImprovement)}</textarea></td>
        <td><textarea class="cell-textarea" data-quick-note="general" placeholder="Observações gerais">${escapeHtml(member.notes.general)}</textarea></td>
      </tr>
    `;
  }

  function renderProfile() {
    const member = getMember(app.selectedMemberId);
    const diagnostic = diagnoseMember(member);
    const score = memberScore(member);
    const rank = ranking().findIndex((item) => item.member.id === member.id) + 1;
    const teamAvg = teamCompetencyAverage();

    return `
      <div class="page-grid">
        <section class="profile-hero">
          <div class="profile-identity">
            <div class="avatar large">${initials(member.name)}</div>
            <div>
              <span class="eyebrow">Perfil individual</span>
              <h1>${escapeHtml(member.name)} ${member.nickname ? `<span>(${escapeHtml(member.nickname)})</span>` : ""}</h1>
              <div class="profile-badges">
                ${badge(member.role, "dark")}
                ${badge(member.phase, "soft")}
                ${badge(member.status, member.status === "Ativo" ? "success" : "neutral")}
              </div>
            </div>
          </div>
          <select id="profile-member-select">${app.state.members.map((item) => `<option value="${item.id}" ${item.id === member.id ? "selected" : ""}>${escapeHtml(item.name)}</option>`).join("")}</select>
        </section>

        <section class="kpi-grid">
          ${kpiCard("Índice individual", score === null ? "Sem dados" : score.toFixed(1), "Comparativo interno", score === null ? "empty" : "")}
          ${kpiCard("Ranking", rank > 0 ? `${rank}º` : "Sem dados", "Entre membros com dados", rank > 0 ? "" : "empty")}
          ${kpiCard("Média do time", teamAvg === null ? "Sem dados" : teamAvg.toFixed(1), "Competências")}
          ${kpiCard("Gargalo principal", diagnostic.label, diagnostic.action, diagnostic.severity >= 3 ? "danger" : "")}
        </section>

        <section class="two-column">
          <article class="panel">
            <div class="panel-header"><div><span class="eyebrow">Dados básicos</span><h3>Status do membro</h3></div></div>
            <div class="profile-fields">
              ${inlineField("Cargo", "role", member.id, roles, member.role)}
              ${inlineField("Fase", "phase", member.id, phases, member.phase)}
              ${inlineField("Status", "status", member.id, statuses, member.status)}
              <div class="field-display"><span>Última atualização</span><strong>${formatDate(member.lastUpdated)}</strong></div>
            </div>
          </article>
          <article class="panel">
            <div class="panel-header"><div><span class="eyebrow">Plano de ação</span><h3>Próximo foco sugerido</h3></div></div>
            <div class="action-plan">
              <strong>${escapeUi(diagnostic.label)}</strong>
              <p>${escapeUi(diagnostic.action)}</p>
            </div>
          </article>
        </section>

        <section class="two-column">
          <article class="panel">
            <div class="panel-header"><div><span class="eyebrow">Métricas comerciais</span><h3>Resultado informado</h3></div></div>
            ${hasMemberData(member) ? renderMetricTiles(member) : emptyState("Aguardando primeira atualização", "As métricas aparecerão depois do preenchimento semanal.")}
          </article>
          <article class="panel">
            <div class="panel-header"><div><span class="eyebrow">Competências</span><h3>Notas de 0 a 10</h3></div></div>
            ${competencyAverage(member) === null ? emptyState("Nenhuma avaliação registrada", "Preencha as competências na Atualização Rápida ou em Avaliações.") : renderCompetencyBars(member)}
          </article>
        </section>

        <section class="two-column">
          <article class="panel">
            <div class="panel-header"><div><span class="eyebrow">Evolução</span><h3>Histórico do ciclo</h3></div></div>
            ${renderMemberHistory(member)}
          </article>
          <article class="panel">
            <div class="panel-header"><div><span class="eyebrow">${escapeUi("Roleplays")}</span><h3>${escapeUi("Roleplays registrados")}</h3></div><button class="ghost-button compact" data-page="roleplays" type="button">Adicionar</button></div>
            ${member.roleplays.length ? renderRoleplayList(member.roleplays.slice(0, 4)) : emptyState("Nenhum roleplay cadastrado", "Registre roleplays para acompanhar comunicação, pitch e objeções.")}
          </article>
        </section>

        <section class="two-column">
          <article class="panel">
            <div class="panel-header"><div><span class="eyebrow">Pontos positivos</span><h3>Forças e evoluções</h3></div></div>
            ${renderPositiveSection(member)}
          </article>
          <article class="panel">
            <div class="panel-header"><div><span class="eyebrow">Pontos de melhoria</span><h3>Gargalos e correções</h3></div></div>
            ${renderImprovementSection(member)}
          </article>
        </section>
      </div>
    `;
  }

  function renderEvaluations() {
    const member = getMember(app.evaluationMemberId);
    const avg = competencyAverage(member);
    return `
      <div class="page-grid">
        <section class="section-title-row">
          <div>
            <span class="eyebrow">Avaliações</span>
            <h1>Acompanhe competências comerciais com edição objetiva.</h1>
          </div>
          <select id="evaluation-member-select">${app.state.members.map((item) => `<option value="${item.id}" ${item.id === member.id ? "selected" : ""}>${escapeHtml(item.name)}</option>`).join("")}</select>
        </section>

        <section class="two-column">
          <article class="panel">
            <div class="panel-header">
              <div><span class="eyebrow">Competências</span><h3>${escapeHtml(member.name)}</h3></div>
              ${badge(avg === null ? "Nenhuma avaliação" : `Média ${avg.toFixed(1)}`, avg === null ? "neutral" : "success")}
            </div>
            <form id="evaluation-form" class="evaluation-grid">
              ${competencyFields
                .map((field) => `
                  <label>
                    ${escapeUi(field.label)}
                    <input type="number" min="0" max="10" step="0.5" name="${field.key}" value="${escapeHtml(member.competencies[field.key] ?? "")}" placeholder="0-10" />
                  </label>
                `)
                .join("")}
              <button class="primary-button form-action" type="submit">${icon("save")} Salvar avaliação</button>
            </form>
          </article>
          <article class="panel">
            <div class="panel-header"><div><span class="eyebrow">Leitura</span><h3>Radar de competências</h3></div></div>
            ${avg === null ? emptyState("Nenhuma avaliação registrada", "As barras aparecerão depois que ao menos uma competência for preenchida.") : renderCompetencyBars(member)}
          </article>
        </section>
      </div>
    `;
  }

  function renderRoleplays() {
    const member = getMember(app.roleplayMemberId);
    return `
      <div class="page-grid">
        <section class="section-title-row">
          <div>
            <span class="eyebrow">${escapeUi("Roleplays comerciais")}</span>
            <h1>${escapeUi("Registre roleplays e acompanhe evolução de postura, pitch e diagnóstico.")}</h1>
          </div>
          <select id="roleplay-member-select">${app.state.members.map((item) => `<option value="${item.id}" ${item.id === member.id ? "selected" : ""}>${escapeHtml(item.name)}</option>`).join("")}</select>
        </section>

        <section class="two-column">
          <article class="panel">
            <div class="panel-header"><div><span class="eyebrow">${escapeUi("Novo Roleplay")}</span><h3>${escapeHtml(member.name)}</h3></div></div>
            <form id="roleplay-form" class="form-grid">
              <label>${escapeUi("Tipo de Roleplay")}<input name="type" placeholder="${escapeUi("Ex.: Prospecção, diagnóstico, objeção")}" /></label>
              <label>Data<input name="date" type="date" value="${new Date().toISOString().slice(0, 10)}" /></label>
              <label>Avaliador<input name="evaluator" placeholder="Nome do avaliador" /></label>
              <label>Comunicação<input name="communicationScore" type="number" min="0" max="10" step="0.5" placeholder="0-10" /></label>
              <label>Pitch<input name="pitchScore" type="number" min="0" max="10" step="0.5" placeholder="0-10" /></label>
              <label>Diagnóstico<input name="diagnosisScore" type="number" min="0" max="10" step="0.5" placeholder="0-10" /></label>
              <label>Objeção<input name="objectionScore" type="number" min="0" max="10" step="0.5" placeholder="0-10" /></label>
              <label>Postura comercial<input name="postureScore" type="number" min="0" max="10" step="0.5" placeholder="0-10" /></label>
              <label class="span-2">Pontos fortes<textarea name="strengths" placeholder="Principais pontos fortes"></textarea></label>
              <label class="span-2">Pontos de melhoria<textarea name="improvements" placeholder="Pontos a desenvolver"></textarea></label>
              <label class="span-2">Observação<textarea name="observation" placeholder="Observações adicionais"></textarea></label>
              <button class="primary-button form-action span-2" type="submit">${icon("plus")} ${escapeUi("Adicionar Roleplay")}</button>
            </form>
          </article>
          <article class="panel">
            <div class="panel-header"><div><span class="eyebrow">Histórico</span><h3>${escapeUi("Roleplays cadastrados")}</h3></div></div>
            ${member.roleplays.length ? renderRoleplayList(member.roleplays) : emptyState("Nenhum roleplay cadastrado", "Use o formulário para registrar o primeiro roleplay.")}
          </article>
        </section>
      </div>
    `;
  }

  function renderMetrics() {
    const sum = totals();
    const hasAny = app.state.members.some(hasMemberData);
    return `
      <div class="page-grid">
        <section class="section-title-row">
          <div>
            <span class="eyebrow">Métricas comerciais</span>
            <h1>${escapeUi("Pipeline comercial consolidado e comparativo operacional.")}</h1>
          </div>
          <button class="primary-button small" type="button" data-page="quick">${icon("table")} Editar métricas</button>
        </section>

        <section class="kpi-grid">
          ${kpiCard("Primeiros contatos", sum.metrics.firstContacts, "Total informado")}
          ${kpiCard("Follow-ups", sum.metrics.followUps, "Cadência registrada")}
          ${kpiCard("Leads respondidos", sum.metrics.leadsAnswered, "Respostas obtidas")}
          ${kpiCard("Reuniões realizadas", sum.metrics.meetingsHeld, "Agenda efetiva")}
        </section>

        <section class="panel">
          <div class="panel-header"><div><span class="eyebrow">Tabela operacional</span><h3>Visão por membro</h3></div></div>
          ${hasAny ? renderMetricsTable() : emptyState("Sem métricas suficientes", "Preencha a Atualização Rápida para liberar a tabela operacional.")}
        </section>
      </div>
    `;
  }

  function renderFeatureNameSettings() {
    const names = activeFeatureNames();
    return `
      <section class="panel settings-platform-panel">
        <div class="panel-header">
          <div>
            <span class="eyebrow">Configurações da Plataforma</span>
            <h3>Nomes das Funcionalidades</h3>
          </div>
          ${badge("LocalStorage", "soft")}
        </div>
        <form id="feature-names-form" class="feature-settings-form">
          <div class="settings-grid">
            ${featureNameFields
              .map(
                (field) => `
                  <label>
                    ${escapeHtml(field.label)}
                    <input name="${field.key}" value="${escapeHtml(names[field.key])}" data-default-value="${escapeHtml(featureNameDefaults[field.key])}" />
                    <span class="settings-hint">Padrão: ${escapeHtml(featureNameDefaults[field.key])}</span>
                  </label>
                `
              )
              .join("")}
          </div>
          <div class="settings-permission-note">
            <strong>Permissões futuras</strong>
            <span>A área está visível por enquanto, mas já existe um marcador de configuração para restringir o acesso a administradores quando houver perfis de usuário.</span>
          </div>
          <div class="button-row">
            <button class="primary-button" type="submit">${icon("save")} Salvar alterações</button>
            <button class="secondary-button" type="button" id="restore-feature-names">Restaurar padrão</button>
          </div>
        </form>
      </section>
    `;
  }

  function renderSettings() {
    return `
      <div class="page-grid">
        <section class="section-title-row">
          <div>
            <span class="eyebrow">Configurações da Plataforma</span>
            <h1>Personalização, base local e preparação para futuras integrações.</h1>
          </div>
        </section>

        ${renderFeatureNameSettings()}

        <section class="two-column">
          <article class="panel">
            <div class="panel-header"><div><span class="eyebrow">Dados</span><h3>Banco local</h3></div></div>
            <div class="settings-stack">
              <div class="field-display"><span>Membros cadastrados</span><strong>${app.state.members.length}</strong></div>
              <div class="field-display"><span>Última atualização</span><strong>${formatDate(app.state.updatedAt)}</strong></div>
              <div class="button-row">
                <button class="secondary-button" type="button" id="export-data">Exportar JSON</button>
                <button class="danger-button" type="button" id="reset-data">Restaurar base inicial</button>
              </div>
              <textarea id="export-box" class="export-box" readonly placeholder="O JSON exportado aparecerá aqui."></textarea>
            </div>
          </article>

          <article class="panel">
            <div class="panel-header"><div><span class="eyebrow">Arquitetura futura</span><h3>Integrações planejadas</h3></div></div>
            <div class="integration-list">
              ${["Python", "Pipefy", "CRM", "Google Sheets", "Dashboards automáticos"].map((item) => `<div class="integration-item"><span>${item}</span>${badge("Preparado", "soft")}</div>`).join("")}
            </div>
          </article>
        </section>
      </div>
    `;
  }

  function renderFeedbackReport() {
    const member = getMember(app.feedbackMemberId);
    const diagnostic = diagnoseMember(member);
    const score = memberScore(member);
    const avg = competencyAverage(member);
    return `
      <div class="page-grid">
        <section class="section-title-row no-print">
          <div>
            <span class="eyebrow">Feedback individual</span>
            <h1>Relatório consultivo para reuniões one-on-one.</h1>
          </div>
          <div class="button-row">
            <select id="feedback-member-select">${app.state.members.map((item) => `<option value="${item.id}" ${item.id === member.id ? "selected" : ""}>${escapeHtml(item.name)}</option>`).join("")}</select>
            <button class="secondary-button" type="button" id="print-report">${icon("print")} Imprimir</button>
          </div>
        </section>

        <section class="report-page">
          <div class="report-header">
            <div>
              <span class="eyebrow">EJMC Vendas</span>
              <h1>Relatório individual de feedback</h1>
            </div>
            <div class="report-meta">
              <strong>${escapeHtml(member.name)}</strong>
              <span>${escapeUi(member.role)} · ${escapeHtml(member.phase)}</span>
              <span>${formatShortDate(new Date().toISOString())}</span>
            </div>
          </div>

          <div class="report-kpis">
            ${miniStat("Índice", score === null ? "Sem dados" : score.toFixed(1))}
            ${miniStat("Média competências", avg === null ? "Sem dados" : avg.toFixed(1))}
            ${miniStat("Gargalo", diagnostic.label)}
          </div>

          <div class="report-section">
            <h3>Diagnóstico</h3>
            <p>${escapeUi(diagnostic.label)}. ${escapeUi(diagnostic.action)}</p>
          </div>

          <div class="report-section">
            <h3>Métricas comerciais</h3>
            ${hasMemberData(member) ? renderMetricTiles(member) : emptyState("Sem métricas suficientes", "Ainda não há base para análise quantitativa.")}
          </div>

          <div class="report-section">
            <h3>Pontos positivos</h3>
            ${member.positives.length || member.notes.weeklyPositive ? renderReportPositives(member) : emptyState("Aguardando primeira atualização", "Nenhum ponto positivo registrado até o momento.")}
          </div>

          <div class="report-section">
            <h3>Pontos de melhoria</h3>
            ${member.improvements.length || member.notes.weeklyImprovement ? renderReportImprovements(member) : emptyState("Aguardando primeira atualização", "Nenhum ponto de melhoria registrado até o momento.")}
          </div>

          <div class="report-section">
            <h3>Plano de ação</h3>
            <p>${escapeUi(diagnostic.action)}</p>
          </div>
        </section>
      </div>
    `;
  }

  function miniStat(label, value) {
    return `<div class="mini-stat"><span>${escapeUi(label)}</span><strong>${escapeUi(value)}</strong></div>`;
  }

  function kpiCard(label, value, helper, variant = "") {
    return `
      <article class="kpi-card ${variant}">
        <span>${escapeUi(label)}</span>
        <strong>${escapeUi(value)}</strong>
        <p>${escapeUi(helper)}</p>
      </article>
    `;
  }

  function tacticalCard(label, value, helper, variant) {
    return `
      <article class="tactical-card ${variant}">
        <span>${escapeUi(label)}</span>
        <strong>${escapeUi(value)}</strong>
        <p>${escapeUi(helper)}</p>
      </article>
    `;
  }

  function badge(label, type = "neutral") {
    return `<span class="badge ${type}">${escapeUi(label)}</span>`;
  }

  function emptyState(title, text) {
    return `
      <div class="empty-state">
        <strong>${escapeUi(title)}</strong>
        <p>${escapeUi(text)}</p>
      </div>
    `;
  }

  function memberIdentity(member) {
    return `
      <div class="member-identity">
        <div class="avatar">${initials(member.name)}</div>
        <div>
          <strong>${escapeHtml(member.name)}</strong>
          <span>${member.nickname ? escapeHtml(member.nickname) : `${escapeUi(member.role)} · ${escapeHtml(member.phase)}`}</span>
        </div>
      </div>
    `;
  }

  function progressRow(label, value, width) {
    return `
      <div class="progress-row">
        <div><span>${escapeUi(label)}</span><strong>${escapeUi(value)}</strong></div>
        <div class="progress-track"><span style="width:${Math.max(2, width)}%"></span></div>
      </div>
    `;
  }

  function renderRanking(items) {
    return `
      <div class="ranking-list">
        ${items
          .map(
            (item, index) => `
              <button class="ranking-item" type="button" data-open-profile="${item.member.id}">
                <span class="rank-number">${index + 1}</span>
                ${memberIdentity(item.member)}
                <strong>${item.score.toFixed(1)}</strong>
              </button>
            `
          )
          .join("")}
      </div>
    `;
  }

  function renderAlerts() {
    const alerts = app.state.members
      .map((member) => ({ member, diagnostic: diagnoseMember(member) }))
      .filter((item) => item.diagnostic.severity >= 2)
      .slice(0, 6);
    if (!alerts.length) return emptyState("Sem gargalos críticos", "Nenhum alerta relevante com os dados atuais.");
    return `
      <div class="alert-list">
        ${alerts
          .map(
            (item) => `
              <button type="button" class="alert-item" data-open-profile="${item.member.id}">
                <div>
                  <strong>${escapeHtml(item.member.name)}</strong>
                  <span>${escapeUi(item.diagnostic.label)}</span>
                </div>
                ${badge(item.diagnostic.severity >= 3 ? "Prioridade alta" : "Acompanhar", item.diagnostic.severity >= 3 ? "danger" : "soft")}
              </button>
            `
          )
          .join("")}
      </div>
    `;
  }

  function renderMonthlyEvolution() {
    const snapshots = app.state.members.flatMap((member) => member.history || []);
    if (!snapshots.length) return emptyState("Aguardando primeira atualização", "O gráfico mensal aparecerá após salvar métricas semanais.");
    const byMonth = snapshots.reduce((acc, snapshot) => {
      const month = new Intl.DateTimeFormat("pt-BR", { month: "short", year: "2-digit" }).format(new Date(snapshot.date));
      acc[month] = acc[month] || [];
      acc[month].push(snapshot.score);
      return acc;
    }, {});
    const values = Object.entries(byMonth).map(([month, scores]) => ({ month, value: average(scores) || 0 }));
    const max = Math.max(...values.map((item) => item.value), 1);
    return `
      <div class="column-chart">
        ${values
          .map(
            (item) => `
              <div class="column-item">
                <span style="height:${Math.max(8, (item.value / max) * 100)}%"></span>
                <small>${escapeHtml(item.month)}</small>
              </div>
            `
          )
          .join("")}
      </div>
    `;
  }

  function renderDiagnosticTable(items) {
    return `
      <div class="diagnostic-list">
        ${items
          .map(
            (item) => `
              <button type="button" class="diagnostic-row" data-open-profile="${item.member.id}">
                ${memberIdentity(item.member)}
                <div>
                  ${badge(item.diagnostic.label, item.diagnostic.severity >= 3 ? "danger" : "soft")}
                  <p>${escapeUi(item.diagnostic.action)}</p>
                </div>
              </button>
            `
          )
          .join("")}
      </div>
    `;
  }

  function isEvolving(member) {
    if (!member.history || member.history.length < 2) return false;
    const recent = member.history.slice(-2);
    return Number(recent[1].score) > Number(recent[0].score);
  }

  function renderWeeklyEvolution() {
    const members = app.state.members.filter((member) => member.history.length >= 2);
    if (!members.length) return emptyState("Sem histórico suficiente", "Salve duas atualizações para comparar evolução semanal.");
    return `
      <div class="evolution-list">
        ${members
          .map((member) => {
            const recent = member.history.slice(-2);
            const delta = Number(recent[1].score || 0) - Number(recent[0].score || 0);
            return `
              <div class="evolution-item">
                ${memberIdentity(member)}
                <strong class="${delta >= 0 ? "positive" : "negative"}">${delta >= 0 ? "+" : ""}${delta.toFixed(1)}</strong>
              </div>
            `;
          })
          .join("")}
      </div>
    `;
  }

  function renderComparisonMatrix(members) {
    const maxActivity = Math.max(...members.map(activityRaw), 1);
    return `
      <div class="comparison-grid">
        ${members
          .map((member) => {
            const score = memberScore(member);
            const comp = competencyAverage(member);
            const activity = (activityRaw(member) / maxActivity) * 100;
            return `
              <div class="comparison-card">
                ${memberIdentity(member)}
                ${progressRow("Índice", score === null ? "Sem dados" : score.toFixed(1), score === null ? 0 : score * 10)}
                ${progressRow("Competências", comp === null ? "Sem dados" : comp.toFixed(1), comp === null ? 0 : comp * 10)}
                ${progressRow("Atividade", Math.round(activity), activity)}
              </div>
            `;
          })
          .join("")}
      </div>
    `;
  }

  function inlineField(label, field, memberId, options, current) {
    return `
      <label class="inline-field">
        <span>${escapeUi(label)}</span>
        <select class="inline-select" data-member-field="${field}" data-member-id="${memberId}">
          ${selectOptions(options, current)}
        </select>
      </label>
    `;
  }

  function renderMetricTiles(member) {
    return `
      <div class="metric-tile-grid">
        ${metricFields
          .map(
            (field) => `
              <div class="metric-tile">
                <span>${escapeHtml(metricFieldText(field, "short"))}</span>
                <strong>${field.key === "roleplayAverage" && member.metrics[field.key] === null ? "Sem nota" : escapeHtml(member.metrics[field.key] || 0)}</strong>
              </div>
            `
          )
          .join("")}
      </div>
    `;
  }

  function renderCompetencyBars(member) {
    const teamAvg = teamCompetencyAverage();
    return `
      <div class="bar-list competency-bars">
        ${competencyFields
          .map((field) => {
            const value = member.competencies[field.key];
            const width = value === null || value === "" ? 0 : Number(value) * 10;
            return progressRow(field.label, value === null || value === "" ? "Sem nota" : Number(value).toFixed(1), width);
          })
          .join("")}
        ${teamAvg !== null ? `<div class="team-average-line">Média do time: <strong>${teamAvg.toFixed(1)}</strong></div>` : ""}
      </div>
    `;
  }

  function renderMemberHistory(member) {
    if (!member.history.length) return emptyState("Sem histórico", "As atualizações salvas formarão a linha de evolução.");
    return `
      <div class="history-list">
        ${member.history
          .slice()
          .reverse()
          .slice(0, 8)
          .map(
            (item) => `
              <div class="history-item">
                <div>
                  <strong>${formatDate(item.date)}</strong>
                  <span>${escapeHtml(item.note || "Atualização semanal")}</span>
                </div>
                <strong>${item.score === null ? "Sem índice" : Number(item.score).toFixed(1)}</strong>
              </div>
            `
          )
          .join("")}
      </div>
    `;
  }

  function renderRoleplayList(roleplays) {
    return `
      <div class="roleplay-list">
        ${roleplays
          .map(
            (item) => `
              <div class="roleplay-card">
                <div>
                  <strong>${item.type ? escapeHtml(item.type) : escapeUi("Roleplay")}</strong>
                  <span>${formatShortDate(item.date)} · ${escapeHtml(item.evaluator || "Avaliador não informado")}</span>
                </div>
                ${badge(item.finalScore === null ? "Sem nota final" : `Nota ${Number(item.finalScore).toFixed(1)}`, item.finalScore === null ? "neutral" : "success")}
                ${item.strengths ? `<p><b>Pontos fortes:</b> ${escapeHtml(item.strengths)}</p>` : ""}
                ${item.improvements ? `<p><b>Pontos de melhoria:</b> ${escapeHtml(item.improvements)}</p>` : ""}
                ${item.observation ? `<p>${escapeHtml(item.observation)}</p>` : ""}
              </div>
            `
          )
          .join("")}
      </div>
    `;
  }

  function renderPositiveSection(member) {
    return `
      <form class="inline-entry-form" id="positive-form">
        <input name="title" placeholder="Título" />
        <input name="category" placeholder="Categoria" />
        <select name="relevance">
          <option>Alta</option>
          <option selected>Média</option>
          <option>Baixa</option>
        </select>
        <textarea name="description" placeholder="Descrição"></textarea>
        <button class="secondary-button" type="submit">${icon("plus")} Adicionar ponto positivo</button>
      </form>
      ${member.positives.length || member.notes.weeklyPositive ? renderReportPositives(member) : emptyState("Aguardando primeira atualização", "Nenhum destaque registrado.")}
    `;
  }

  function renderImprovementSection(member) {
    return `
      <form class="inline-entry-form" id="improvement-form">
        <input name="title" placeholder="Título" />
        <select name="criticality">
          <option>Alta</option>
          <option selected>Média</option>
          <option>Baixa</option>
        </select>
        <input name="deadline" type="date" />
        <select name="status">
          <option>Aberto</option>
          <option>Em andamento</option>
          <option>Concluído</option>
        </select>
        <textarea name="description" placeholder="Descrição"></textarea>
        <textarea name="plan" placeholder="Plano de correção"></textarea>
        <button class="secondary-button" type="submit">${icon("plus")} Adicionar ponto de melhoria</button>
      </form>
      ${member.improvements.length || member.notes.weeklyImprovement ? renderReportImprovements(member) : emptyState("Aguardando primeira atualização", "Nenhum ponto de melhoria registrado.")}
    `;
  }

  function renderReportPositives(member) {
    const items = [];
    if (member.notes.weeklyPositive) {
      items.push({ title: "Destaque da semana", description: member.notes.weeklyPositive, category: "Evolução semanal", date: member.lastUpdated, relevance: "Média" });
    }
    items.push(...member.positives);
    return `
      <div class="entry-list">
        ${items
          .map(
            (item) => `
              <div class="entry-card">
                <div>
                  <strong>${escapeHtml(item.title || "Ponto positivo")}</strong>
                  <span>${escapeHtml(item.category || "Geral")} · ${formatShortDate(item.date)}</span>
                </div>
                ${badge(item.relevance || "Média", "success")}
                <p>${escapeHtml(item.description || "")}</p>
              </div>
            `
          )
          .join("")}
      </div>
    `;
  }

  function renderReportImprovements(member) {
    const items = [];
    if (member.notes.weeklyImprovement) {
      items.push({ title: "Melhoria da semana", description: member.notes.weeklyImprovement, criticality: "Média", status: "Aberto", plan: diagnoseMember(member).action });
    }
    items.push(...member.improvements);
    return `
      <div class="entry-list">
        ${items
          .map(
            (item) => `
              <div class="entry-card">
                <div>
                  <strong>${escapeHtml(item.title || "Ponto de melhoria")}</strong>
                  <span>${escapeHtml(item.status || "Aberto")} ${item.deadline ? `· Prazo ${formatShortDate(item.deadline)}` : ""}</span>
                </div>
                ${badge(item.criticality || "Média", item.criticality === "Alta" ? "danger" : "soft")}
                <p>${escapeHtml(item.description || "")}</p>
                ${item.plan ? `<p><b>Plano:</b> ${escapeHtml(item.plan)}</p>` : ""}
              </div>
            `
          )
          .join("")}
      </div>
    `;
  }

  function renderMetricsTable() {
    return `
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Membro</th>
              ${metricFields.map((field) => `<th>${escapeHtml(metricFieldText(field, "short"))}</th>`).join("")}
              <th>Resposta</th>
              <th>${escapeUi("Conversão")}</th>
            </tr>
          </thead>
          <tbody>
            ${app.state.members
              .map(
                (member) => `
                  <tr>
                    <td>${memberIdentity(member)}</td>
                    ${metricFields.map((field) => `<td>${escapeHtml(member.metrics[field.key] || 0)}</td>`).join("")}
                    <td>${percent(responseRate(member))}</td>
                    <td>${percent(conversionRate(member))}</td>
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  function bindAppEvents() {
    document.querySelectorAll("[data-page]").forEach((button) => {
      button.addEventListener("click", () => setPage(button.dataset.page));
    });

    document.querySelectorAll("[data-open-profile]").forEach((button) => {
      button.addEventListener("click", () => {
        app.selectedMemberId = button.dataset.openProfile;
        app.feedbackMemberId = app.selectedMemberId;
        app.evaluationMemberId = app.selectedMemberId;
        app.roleplayMemberId = app.selectedMemberId;
        setPage("profile");
      });
    });

    document.querySelectorAll("[data-action='logout']").forEach((button) => {
      button.addEventListener("click", () => {
        localStorage.removeItem(SESSION_KEY);
        render();
      });
    });

    document.querySelectorAll("[data-member-field]").forEach((select) => {
      select.addEventListener("change", () => {
        const member = getMember(select.dataset.memberId);
        member[select.dataset.memberField] = select.value;
        member.lastUpdated = new Date().toISOString();
        saveState();
        toast("Alteração salva com sucesso.");
      });
    });

    bindMembersPage();
    bindQuickPage();
    bindProfilePage();
    bindEvaluationPage();
    bindRoleplayPage();
    bindSettingsPage();
    bindFeedbackPage();
    bindTvPage();
  }

  function setupTvTimers() {
    if (tvSlideTimer) {
      window.clearInterval(tvSlideTimer);
      tvSlideTimer = null;
    }
    if (tvRefreshTimer) {
      window.clearInterval(tvRefreshTimer);
      tvRefreshTimer = null;
    }
    if (app.page !== "tv") return;

    const slides = tvSlides();
    const seconds = Math.max(5, Number(tvSettings().slideSeconds) || 12);
    if (!app.tvPaused && slides.length > 1 && !app.tvSettingsOpen) {
      tvSlideTimer = window.setInterval(() => {
        app.tvSlide = (app.tvSlide + 1) % tvSlides().length;
        render();
      }, seconds * 1000);
    }

    tvRefreshTimer = window.setInterval(() => {
      if (app.tvSettingsOpen) return;
      app.state = loadState();
      if (app.tvSlide >= tvSlides().length) app.tvSlide = 0;
      render();
    }, 30000);
  }

  function bindTvPage() {
    if (app.page !== "tv") return;

    document.querySelectorAll("[data-tv-slide]").forEach((button) => {
      button.addEventListener("click", () => {
        app.tvSlide = Number(button.dataset.tvSlide) || 0;
        render();
      });
    });

    const pause = document.getElementById("tv-pause");
    if (pause) {
      pause.addEventListener("click", () => {
        app.tvPaused = !app.tvPaused;
        render();
      });
    }

    const settingsToggle = document.getElementById("tv-settings-toggle");
    if (settingsToggle) {
      settingsToggle.addEventListener("click", () => {
        app.tvSettingsOpen = true;
        app.tvPaused = true;
        render();
      });
    }

    const themeToggle = document.getElementById("tv-theme-toggle");
    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        app.state.settings.tvCommercial.darkMode = !tvSettings().darkMode;
        saveState();
        render();
      });
    }

    const fullscreen = document.getElementById("tv-fullscreen");
    if (fullscreen) {
      fullscreen.addEventListener("click", () => {
        const board = document.querySelector(".tv-board");
        if (!board) return;
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else if (board.requestFullscreen) {
          board.requestFullscreen();
        }
      });
    }

    const close = document.getElementById("tv-settings-close");
    const cancel = document.getElementById("tv-settings-cancel");
    [close, cancel].forEach((button) => {
      if (!button) return;
      button.addEventListener("click", () => {
        app.tvSettingsOpen = false;
        render();
      });
    });

    const form = document.getElementById("tv-settings-form");
    if (form) {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const data = new FormData(form);
        const current = tvSettings();
        app.state.settings.tvCommercial = {
          ...current,
          monthlyRevenueTarget: clampNumber(data.get("monthlyRevenueTarget"), 0, 999999999) || 0,
          currentRevenue: clampNumber(data.get("currentRevenue"), 0, 999999999) || 0,
          monthlyMeetingTarget: clampNumber(data.get("monthlyMeetingTarget"), 0, 999999) || 0,
          slideSeconds: clampNumber(data.get("slideSeconds"), 5, 120) || 12,
          period: data.get("period") || "month",
          showRanking: form.elements.showRanking.checked,
          showActionPlan: form.elements.showActionPlan.checked,
          darkMode: form.elements.darkMode.checked,
          targetResponseRate: data.get("targetResponseRate") || "",
          targetContactMeetingRate: data.get("targetContactMeetingRate") || "",
          targetResponseMeetingRate: data.get("targetResponseMeetingRate") || "",
          actionPlan: {
            bottleneck: data.get("bottleneck") || "",
            weeklyFocus: data.get("weeklyFocus") || "",
            action1: data.get("action1") || "",
            action2: data.get("action2") || "",
            action3: data.get("action3") || "",
            owner: data.get("owner") || "",
            deadline: data.get("deadline") || "",
            status: data.get("status") || "Aberto",
          },
        };
        if (app.tvSlide >= tvSlides().length) app.tvSlide = 0;
        app.tvSettingsOpen = false;
        saveState();
        toast("Configurações da TV Comercial salvas.");
      });
    }
  }

  function bindMembersPage() {
    const search = document.getElementById("member-search");
    if (search) {
      search.addEventListener("input", () => {
        app.memberSearch = search.value;
        render();
      });
    }
    const role = document.getElementById("member-role-filter");
    if (role) role.addEventListener("change", () => { app.memberRoleFilter = role.value; render(); });
    const phase = document.getElementById("member-phase-filter");
    if (phase) phase.addEventListener("change", () => { app.memberPhaseFilter = phase.value; render(); });
  }

  function bindQuickPage() {
    const table = document.querySelector(".quick-table");
    if (table) {
      table.addEventListener("input", handleQuickInput);
      table.addEventListener("change", handleQuickInput);
    }
    const search = document.getElementById("quick-search");
    if (search) {
      search.addEventListener("input", () => {
        app.quickSearch = search.value;
        render();
      });
    }
    const period = document.getElementById("quick-period");
    if (period) {
      period.addEventListener("change", () => {
        app.quickPeriod = period.value;
        render();
      });
    }
    const save = document.getElementById("save-quick");
    if (save) save.addEventListener("click", saveQuickDraft);
  }

  function handleQuickInput(event) {
    const row = event.target.closest("[data-quick-row]");
    if (!row) return;
    const member = app.quickDraft[row.dataset.quickRow];
    if (!member) return;
    if (event.target.dataset.quickField) member[event.target.dataset.quickField] = event.target.value;
    if (event.target.dataset.quickMetric) {
      const field = metricFields.find((item) => item.key === event.target.dataset.quickMetric);
      const max = field?.key === "roleplayAverage" ? 10 : 99999;
      member.metrics[event.target.dataset.quickMetric] = clampNumber(event.target.value, 0, max) ?? 0;
    }
    if (event.target.dataset.quickCompetency) {
      member.competencies[event.target.dataset.quickCompetency] = event.target.value === "" ? null : clampNumber(event.target.value, 0, 10);
    }
    if (event.target.dataset.quickNote) member.notes[event.target.dataset.quickNote] = event.target.value;
  }

  function saveQuickDraft() {
    const now = new Date().toISOString();
    app.state.members = app.state.members.map((member) => {
      const draft = app.quickDraft[member.id] || member;
      const previousPositive = member.notes.weeklyPositive;
      const previousImprovement = member.notes.weeklyImprovement;
      const updated = {
        ...member,
        ...draft,
        metrics: { ...emptyMetrics(), ...draft.metrics },
        competencies: { ...emptyCompetencies(), ...draft.competencies },
        notes: { ...member.notes, ...draft.notes },
        positives: [...member.positives],
        improvements: [...member.improvements],
        roleplays: [...member.roleplays],
        history: [...member.history],
        lastUpdated: now,
      };

      if (updated.notes.weeklyPositive && updated.notes.weeklyPositive !== previousPositive) {
        updated.positives.unshift({
          id: crypto.randomUUID ? crypto.randomUUID() : `p-${Date.now()}`,
          title: "Destaque semanal",
          description: updated.notes.weeklyPositive,
          category: "Evolução semanal",
          date: now,
          relevance: "Média",
        });
      }

      if (updated.notes.weeklyImprovement && updated.notes.weeklyImprovement !== previousImprovement) {
        updated.improvements.unshift({
          id: crypto.randomUUID ? crypto.randomUUID() : `i-${Date.now()}`,
          title: "Melhoria semanal",
          description: updated.notes.weeklyImprovement,
          criticality: "Média",
          plan: diagnoseMember(updated).action,
          deadline: "",
          status: "Aberto",
          date: now,
        });
      }

      if (hasMemberData(updated)) {
        updated.history.push({
          id: crypto.randomUUID ? crypto.randomUUID() : `h-${Date.now()}`,
          date: now,
          metrics: { ...updated.metrics },
          competencies: { ...updated.competencies },
          score: memberScoreForSnapshot(updated),
          note: updated.notes.general || "Atualização semanal",
        });
      }

      return updated;
    });

    saveState();
    app.quickDraft = null;
    toast("Salvo com sucesso.");
  }

  function memberScoreForSnapshot(member) {
    const compAvg = competencyAverage(member);
    const rpAvg = roleplayAverage(member);
    const activity = activityRaw(member) > 0 ? Math.min(10, activityRaw(member) / 10) : null;
    return average([compAvg, rpAvg, activity]);
  }

  function bindProfilePage() {
    const select = document.getElementById("profile-member-select");
    if (select) {
      select.addEventListener("change", () => {
        app.selectedMemberId = select.value;
        app.feedbackMemberId = select.value;
        app.evaluationMemberId = select.value;
        app.roleplayMemberId = select.value;
        render();
      });
    }
    const positiveForm = document.getElementById("positive-form");
    if (positiveForm) {
      positiveForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const data = new FormData(positiveForm);
        const member = getMember(app.selectedMemberId);
        member.positives.unshift({
          id: crypto.randomUUID ? crypto.randomUUID() : `p-${Date.now()}`,
          title: data.get("title") || "Ponto positivo",
          description: data.get("description") || "",
          category: data.get("category") || "Geral",
          date: new Date().toISOString(),
          relevance: data.get("relevance") || "Média",
        });
        member.lastUpdated = new Date().toISOString();
        saveState();
        toast("Ponto positivo adicionado.");
      });
    }
    const improvementForm = document.getElementById("improvement-form");
    if (improvementForm) {
      improvementForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const data = new FormData(improvementForm);
        const member = getMember(app.selectedMemberId);
        member.improvements.unshift({
          id: crypto.randomUUID ? crypto.randomUUID() : `i-${Date.now()}`,
          title: data.get("title") || "Ponto de melhoria",
          description: data.get("description") || "",
          criticality: data.get("criticality") || "Média",
          plan: data.get("plan") || "",
          deadline: data.get("deadline") || "",
          status: data.get("status") || "Aberto",
          date: new Date().toISOString(),
        });
        member.lastUpdated = new Date().toISOString();
        saveState();
        toast("Ponto de melhoria adicionado.");
      });
    }
  }

  function bindEvaluationPage() {
    const select = document.getElementById("evaluation-member-select");
    if (select) {
      select.addEventListener("change", () => {
        app.evaluationMemberId = select.value;
        app.selectedMemberId = select.value;
        render();
      });
    }
    const form = document.getElementById("evaluation-form");
    if (form) {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const data = new FormData(form);
        const member = getMember(app.evaluationMemberId);
        competencyFields.forEach((field) => {
          const value = data.get(field.key);
          member.competencies[field.key] = value === "" ? null : clampNumber(value, 0, 10);
        });
        member.lastUpdated = new Date().toISOString();
        saveState();
        toast("Avaliação salva com sucesso.");
      });
    }
  }

  function bindRoleplayPage() {
    const select = document.getElementById("roleplay-member-select");
    if (select) {
      select.addEventListener("change", () => {
        app.roleplayMemberId = select.value;
        app.selectedMemberId = select.value;
        render();
      });
    }
    const form = document.getElementById("roleplay-form");
    if (form) {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const data = new FormData(form);
        const scores = ["communicationScore", "pitchScore", "diagnosisScore", "objectionScore", "postureScore"].map((key) => {
          const value = data.get(key);
          return value === "" ? null : clampNumber(value, 0, 10);
        });
        const finalScore = average(scores);
        const roleplay = {
          id: crypto.randomUUID ? crypto.randomUUID() : `r-${Date.now()}`,
          type: data.get("type") || uiName("roleplay"),
          date: data.get("date") || new Date().toISOString().slice(0, 10),
          evaluator: data.get("evaluator") || "",
          communicationScore: scores[0],
          pitchScore: scores[1],
          diagnosisScore: scores[2],
          objectionScore: scores[3],
          postureScore: scores[4],
          strengths: data.get("strengths") || "",
          improvements: data.get("improvements") || "",
          observation: data.get("observation") || "",
          finalScore,
        };
        const member = getMember(app.roleplayMemberId);
        member.roleplays.unshift(roleplay);
        member.metrics.roleplaysDone = member.roleplays.length;
        if (finalScore !== null) member.metrics.roleplayAverage = roleplayAverage(member);
        member.lastUpdated = new Date().toISOString();
        saveState();
        toast(`${uiName("roleplay")} cadastrado com sucesso.`);
      });
    }
  }

  function bindSettingsPage() {
    const featureNamesForm = document.getElementById("feature-names-form");
    if (featureNamesForm) {
      featureNamesForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const data = new FormData(featureNamesForm);
        app.state.settings.featureNames = normalizeFeatureNames(Object.fromEntries(data.entries()));
        saveState();
        toast("Nomes das funcionalidades salvos.");
      });
    }

    const restoreFeatureNames = document.getElementById("restore-feature-names");
    if (restoreFeatureNames) {
      restoreFeatureNames.addEventListener("click", () => {
        app.state.settings.featureNames = defaultFeatureNames();
        saveState();
        toast("Nomes restaurados para o padrão.");
      });
    }

    const exportButton = document.getElementById("export-data");
    if (exportButton) {
      exportButton.addEventListener("click", () => {
        document.getElementById("export-box").value = JSON.stringify(app.state, null, 2);
        toast("JSON exportado.");
      });
    }
    const resetButton = document.getElementById("reset-data");
    if (resetButton) {
      resetButton.addEventListener("click", () => {
        if (!window.confirm("Restaurar a base inicial? Esta ação remove atualizações locais.")) return;
        app.state = defaultState();
        app.quickDraft = null;
        saveState();
        toast("Base inicial restaurada.");
      });
    }
  }

  function bindFeedbackPage() {
    const select = document.getElementById("feedback-member-select");
    if (select) {
      select.addEventListener("change", () => {
        app.feedbackMemberId = select.value;
        app.selectedMemberId = select.value;
        render();
      });
    }
    const print = document.getElementById("print-report");
    if (print) print.addEventListener("click", () => window.print());
  }

  window.addEventListener("hashchange", () => {
    const next = routePageFromLocation();
    if (next) {
      app.page = next;
      render();
    }
  });

  window.addEventListener("popstate", () => {
    app.page = routePageFromLocation() || "dashboard";
    render();
  });

  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY) return;
    app.state = loadState();
    render();
  });

  app.page = routePageFromLocation() || app.page;
  render();
})();
