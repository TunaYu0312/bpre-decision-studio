import {
  AlertTriangle,
  BarChart3,
  Building2,
  Check,
  ChevronRight,
  CircleCheck,
  Clock3,
  Download,
  Factory,
  FileCheck2,
  FlaskConical,
  Gauge,
  MessageSquarePlus,
  Printer,
  ShieldAlert,
  Store,
  Target,
  UsersRound,
} from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useParams } from "react-router";

import { seedPricingDecisionRoom } from "@/data/pricing-room-seed";
import {
  calculateScenarioAfterOperationsReview,
  type CommonFact,
  type EvidenceLayer,
  type EvidenceQueueItem,
  type PricingRoomScenario,
  type QueueItemType,
} from "@/domain/pricing-room";

import {
  compactCurrencyFormatter,
  percentFormatter,
  signedPercent,
} from "./pricing-format";

type RoomStage = "current" | "facts" | "options" | "evidence" | "decision";

const stages: Array<{ id: RoomStage; label: string; question: string }> = [
  { id: "current", label: "当前决策", question: "今天究竟要决定什么？" },
  { id: "facts", label: "共同事实", question: "哪些事实足以支持讨论？" },
  { id: "options", label: "方案与 Trade-off", question: "各方案真正牺牲和获得什么？" },
  { id: "evidence", label: "问题与证据", question: "哪些问题可能改变选择？" },
  { id: "decision", label: "决策、执行与复盘", question: "决定如何变成可验证的行动？" },
];

const factLayers: Array<"All" | EvidenceLayer> = [
  "All",
  "Market",
  "Customer",
  "Store",
  "Product",
  "Competition",
];

export function PricingDecisionRoomPage() {
  const { id, stage } = useParams();
  const activeStage = (stage ?? "current") as RoomStage;
  const [frameComplete, setFrameComplete] = useState(false);
  const [factLayer, setFactLayer] = useState<(typeof factLayers)[number]>("All");
  const [selectedScenarioId, setSelectedScenarioId] = useState("option-d");
  const [queue, setQueue] = useState<EvidenceQueueItem[]>(seedPricingDecisionRoom.queue);
  const [operationsApplied, setOperationsApplied] = useState(false);
  const [newStatement, setNewStatement] = useState("");
  const [newType, setNewType] = useState<QueueItemType>("Question");
  const [decisionOutcome, setDecisionOutcome] = useState("小范围试点");
  const [frozen, setFrozen] = useState(false);

  if (!id || !stages.some((item) => item.id === activeStage)) {
    return <Navigate replace to="/pricing" />;
  }

  const room = seedPricingDecisionRoom;
  const selectedScenario =
    room.scenarios.find((scenario) => scenario.id === selectedScenarioId) ??
    room.scenarios[4];
  const activeIndex = stages.findIndex((item) => item.id === activeStage);
  const activeStageMeta = stages[activeIndex];

  const runOperationsAnalysis = () => {
    setQueue((current) =>
      current.map((item) =>
        item.id === "queue-ops"
          ? {
              ...item,
              status: "Result awaiting review",
              result:
                "按饮料工位负荷、加班触发点和最小备货批次重新计算：方案B和D需增加¥18k人工及¥12k报废成本。",
            }
          : item,
      ),
    );
  };

  const confirmOperationsResult = () => {
    setOperationsApplied(true);
    setQueue((current) =>
      current.map((item) =>
        item.id === "queue-ops" ? { ...item, status: "Fact updated" } : item,
      ),
    );
  };

  const addPerspective = () => {
    const statement = newStatement.trim();
    if (!statement) return;
    setQueue((current) => [
      ...current,
      {
        id: `queue-${current.length + 1}`,
        type: newType,
        statement,
        owner: "待分派",
        due: "待确认",
        status: "Pending confirmation",
        relatedScenarios: [selectedScenarioId],
      },
    ]);
    setNewStatement("");
  };

  const exportMarkdown = () => {
    const markdown = buildDecisionMarkdown(
      selectedScenario,
      decisionOutcome,
      operationsApplied,
    );
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${room.code}-decision-record.md`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="pricing-room-shell">
      <header className="pricing-room-topbar">
        <div className="pricing-room-brand">
          <div><Target aria-hidden="true" size={19} /></div>
          <span>Menu Pricing Decision Room</span>
        </div>
        <div className="pricing-room-command">
          <span>{room.code}</span>
          <strong>{room.title}</strong>
          <small>{room.status} · 决策截止 {room.deadline}</small>
        </div>
        <div className="pricing-room-decision-maker">
          <span>最终决策者</span>
          <strong>{room.decisionMaker}</strong>
        </div>
      </header>

      <aside className="pricing-room-stagebar">
        <p>会议主线</p>
        <nav aria-label="定价决策会议流程">
          {stages.map((item, index) => (
            <Link
              aria-current={item.id === activeStage ? "step" : undefined}
              className={item.id === activeStage ? "room-stage-link room-stage-link--active" : "room-stage-link"}
              key={item.id}
              to={`/pricing/${id}/room/${item.id}`}
            >
              <span>{index + 1}</span>
              <div>
                <strong>{item.label}</strong>
                <small>{item.question}</small>
              </div>
              <ChevronRight aria-hidden="true" size={14} />
            </Link>
          ))}
        </nav>
        <div className="room-analysis-links">
          <p>分析下钻</p>
          <Link to={`/pricing/${id}/baseline`}>Menu Analysis</Link>
          <Link to={`/pricing/${id}/research`}>Price Response Curves</Link>
        </div>
      </aside>

      <main className="pricing-room-main">
        <div className="room-stage-heading">
          <div>
            <span>阶段 {activeIndex + 1} / 5</span>
            <h1>{activeStageMeta.question}</h1>
          </div>
          <div className="room-stage-timer">
            <Clock3 aria-hidden="true" size={16} />
            <span>建议 {activeStage === "options" ? "15" : activeStage === "evidence" ? "10–20" : "10"} 分钟</span>
          </div>
        </div>

        {activeStage === "current" && (
          <CurrentDecisionPage
            frameComplete={frameComplete}
            onComplete={() => setFrameComplete(true)}
          />
        )}
        {activeStage === "facts" && (
          <CommonFactsPage factLayer={factLayer} onLayerChange={setFactLayer} />
        )}
        {activeStage === "options" && (
          <OptionsPage
            operationsApplied={operationsApplied}
            onSelect={setSelectedScenarioId}
            selectedScenarioId={selectedScenarioId}
          />
        )}
        {activeStage === "evidence" && (
          <EvidenceQueuePage
            newStatement={newStatement}
            newType={newType}
            onAdd={addPerspective}
            onConfirm={confirmOperationsResult}
            onRun={runOperationsAnalysis}
            onStatementChange={setNewStatement}
            onTypeChange={setNewType}
            operationsApplied={operationsApplied}
            queue={queue}
          />
        )}
        {activeStage === "decision" && (
          <DecisionExecutionPage
            decisionOutcome={decisionOutcome}
            frozen={frozen}
            onExport={exportMarkdown}
            onFreeze={() => setFrozen(true)}
            onOutcomeChange={setDecisionOutcome}
            operationsApplied={operationsApplied}
            scenario={selectedScenario}
          />
        )}
      </main>

      <CollaborationRail queue={queue} />

      <footer className="pricing-room-decisionbar">
        <div>
          <span>当前建议</span>
          <strong>办公区与交通枢纽 · 30店受控试点</strong>
        </div>
        <div className="room-decision-actions" role="group" aria-label="最终决策选项">
          {["批准", "有条件批准", "小范围试点", "延期补证据", "否决"].map((outcome) => (
            <button
              aria-pressed={decisionOutcome === outcome}
              className={decisionOutcome === outcome ? "room-outcome-button room-outcome-button--active" : "room-outcome-button"}
              key={outcome}
              onClick={() => setDecisionOutcome(outcome)}
              type="button"
            >
              {outcome}
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
}

function CurrentDecisionPage({
  frameComplete,
  onComplete,
}: {
  frameComplete: boolean;
  onComplete: () => void;
}) {
  const room = seedPricingDecisionRoom;
  return (
    <div className="room-page-stack">
      {!frameComplete && (
        <section className="room-missing-alert" role="alert">
          <AlertTriangle aria-hidden="true" size={19} />
          <div>
            <strong>范围完整性检查：还缺1项人工确认</strong>
            <p>顾客价值 Guardrail 必须由品牌负责人确认，才能冻结会前简报。</p>
          </div>
          <button onClick={onComplete} type="button">确认 VFM ≥ 97</button>
        </section>
      )}

      <section className="room-decision-statement">
        <span>{frameComplete ? "标准决策命题 · 已完成" : "标准决策命题 · 草稿"}</span>
        <h2>{room.decisionStatement}</h2>
        <div>
          <strong>首要目标</strong>
          <p>{room.primaryObjective}</p>
        </div>
      </section>

      <section className="room-panel">
        <PanelHeading eyebrow="六类必填范围" title="本次决定包含什么？" meta={`${room.scope.length}/6 已填写`} />
        <div className="room-scope-grid">
          {room.scope.map((item) => (
            <article key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </article>
          ))}
        </div>
        <div className="room-out-of-scope">
          <span>明确不在范围内</span>
          <p>{room.outOfScope}</p>
        </div>
      </section>

      <section className="room-panel">
        <PanelHeading eyebrow="硬性约束" title="即使利润为正，哪些边界也不能突破？" meta="4 Guardrails" />
        <div className="room-guardrail-grid">
          {room.guardrails.map((guardrail) => (
            <article key={guardrail.label}>
              <span>{guardrail.type}</span>
              <strong>{guardrail.label}</strong>
              <p>{guardrail.threshold}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function CommonFactsPage({
  factLayer,
  onLayerChange,
}: {
  factLayer: (typeof factLayers)[number];
  onLayerChange: (value: (typeof factLayers)[number]) => void;
}) {
  const room = seedPricingDecisionRoom;
  const facts = room.facts.filter(
    (fact) => factLayer === "All" || fact.layer === factLayer,
  );
  return (
    <div className="room-page-stack">
      <section className="room-fact-summary">
        <div>
          <span>共同事实摘要</span>
          <strong>8条事实 · 1条争议 · 1项低质量假设</strong>
        </div>
        <p>只展示可能改变方案选择的事实；所有数值保留来源、期间、状态和质量。</p>
      </section>

      <div className="room-filter-tabs" role="tablist" aria-label="事实层级">
        {factLayers.map((layer) => (
          <button
            aria-selected={factLayer === layer}
            key={layer}
            onClick={() => onLayerChange(layer)}
            role="tab"
            type="button"
          >
            {layer}
          </button>
        ))}
      </div>

      <section className="room-facts-grid">
        {facts.map((fact) => <FactCard fact={fact} key={fact.id} />)}
      </section>

      <section className="room-panel">
        <PanelHeading eyebrow="商圈—顾客—门店" title="为什么全国平均不能直接决定价格？" meta="3 decision layers" />
        <div className="three-layer-grid">
          <article>
            <Building2 aria-hidden="true" size={19} />
            <span>商圈</span>
            <strong>办公区与交通枢纽存在价格空间</strong>
            <p>社区店当前已与可比竞品相当，不进入首轮涨价。</p>
          </article>
          <article>
            <UsersRound aria-hidden="true" size={19} />
            <span>顾客</span>
            <strong>午餐刚需与临时客更可承受</strong>
            <p>高频社区会员的VFM和复购是首轮硬性保护对象。</p>
          </article>
          <article>
            <Store aria-hidden="true" size={19} />
            <span>门店</span>
            <strong>同商圈仍需按产能筛选试点店</strong>
            <p>饮料工位负荷、P90出餐和备货批次决定门店是否适合试点。</p>
          </article>
        </div>
      </section>

      <div className="room-detail-drawers">
        <details>
          <summary><Factory size={17} />产品复杂度与门店产能档案</summary>
          <OperationsProfile />
        </details>
        <details>
          <summary><BarChart3 size={17} />竞品价格与竞争立场</summary>
          <div className="competitor-summary">
            <strong>标准化到手价：自有A套餐 ¥28 → 候选 ¥30</strong>
            <p>交通枢纽可比套餐 ¥32–¥34；办公区 ¥30–¥33；社区 ¥28–¥31。比较已统一套餐组成、渠道和会员优惠。</p>
            <span>竞争立场：核心价值商品有限溢价；不做机械跟随。</span>
          </div>
        </details>
      </div>
    </div>
  );
}

function OptionsPage({
  operationsApplied,
  onSelect,
  selectedScenarioId,
}: {
  operationsApplied: boolean;
  onSelect: (id: string) => void;
  selectedScenarioId: string;
}) {
  const room = seedPricingDecisionRoom;
  const selected = room.scenarios.find((item) => item.id === selectedScenarioId)!;
  const netContribution = calculateScenarioAfterOperationsReview(
    selected,
    operationsApplied,
  );
  return (
    <div className="room-page-stack">
      <section className="room-option-selector" aria-label="定价方案">
        {room.scenarios.map((scenario) => {
          const net = calculateScenarioAfterOperationsReview(
            scenario,
            operationsApplied,
          );
          return (
            <button
              aria-pressed={selectedScenarioId === scenario.id}
              key={scenario.id}
              onClick={() => onSelect(scenario.id)}
              type="button"
            >
              <span>{scenario.id === "option-0" ? "必须比较的基线" : scenario.id === "option-d" ? "建议" : "候选"}</span>
              <strong>{scenario.name}</strong>
              <small>{compactCurrencyFormatter.format(net)} 净贡献</small>
            </button>
          );
        })}
      </section>

      {operationsApplied && (
        <section className="room-update-banner">
          <CircleCheck size={18} />
          <p>运营分析已人工确认：所有调价方案已加入阶梯人工和批次报废成本，净贡献结果已更新。</p>
        </section>
      )}

      <section className="room-option-hero">
        <div>
          <span>当前查看方案</span>
          <h2>{selected.name}</h2>
          <p>{selected.action} · {selected.scope} · {selected.rollout}</p>
        </div>
        <div className="net-contribution-kpi">
          <span>门店净增量贡献</span>
          <strong>{compactCurrencyFormatter.format(netContribution)}</strong>
          <small>统一6周决策期间 · 模拟数据</small>
        </div>
      </section>

      <section className="room-tradeoff-grid">
        <TradeoffMetric label="价格" value={selected.price} detail={selected.scope} />
        <TradeoffMetric label="ADTC变化" value={signedPercent(selected.trafficChange)} detail="对比可比基线" />
        <TradeoffMetric label="UPH变化" value={signedPercent(selected.uphChange)} detail="A套餐需求" />
        <TradeoffMetric label="AC变化" value={signedPercent(selected.averageCheckChange)} detail="整体订单客单" />
        <TradeoffMetric label="GM%" value={percentFormatter.format(selected.grossMargin)} detail="不能替代净贡献" />
        <TradeoffMetric label="顾客价值风险" value={selected.valueRisk} detail={`证据置信度 ${selected.confidence}`} />
        <TradeoffMetric label="门店产能风险" value={selected.capacityRisk} detail="含高峰负荷" />
        <TradeoffMetric label="可逆性" value={selected.reversibility} detail={selected.rollout} />
      </section>

      <section className="room-panel">
        <PanelHeading eyebrow="真实经营贡献" title="表面毛利之后，还扣除了什么？" meta="Gross profit is not enough" />
        <ContributionBridge scenario={selected} operationsApplied={operationsApplied} />
        <div className="room-tradeoff-statement">
          <strong>核心 Trade-off</strong>
          <p>{selected.tradeoff}</p>
          <span>关键成立假设：{selected.keyAssumption}</span>
        </div>
      </section>

      <section className="room-panel">
        <PanelHeading eyebrow="商圈价格决策矩阵" title="同一价格动作为什么不能覆盖所有商圈？" meta="3 market clusters" />
        <div className="table-shell mt-4">
          <table className="operating-table district-decision-table">
            <thead><tr><th>商圈</th><th>核心顾客</th><th>敏感度</th><th>价值风险</th><th>竞品位置</th><th>门店产能</th><th>净贡献</th><th>建议动作</th><th>推广路线</th></tr></thead>
            <tbody>
              {room.districtMatrix.map((row) => (
                <tr key={row.district}>
                  <td><strong>{row.district}</strong></td><td>{row.customer}</td><td>{row.sensitivity}</td>
                  <td><RiskBadge risk={row.valueRisk} /></td><td>{row.competitorPosition}</td><td>{row.capacity}</td>
                  <td>{compactCurrencyFormatter.format(row.netContribution)}</td><td>{row.action}</td><td>{row.rollout}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function EvidenceQueuePage({
  newStatement,
  newType,
  onAdd,
  onConfirm,
  onRun,
  onStatementChange,
  onTypeChange,
  operationsApplied,
  queue,
}: {
  newStatement: string;
  newType: QueueItemType;
  onAdd: () => void;
  onConfirm: () => void;
  onRun: () => void;
  onStatementChange: (value: string) => void;
  onTypeChange: (value: QueueItemType) => void;
  operationsApplied: boolean;
  queue: EvidenceQueueItem[];
}) {
  return (
    <div className="room-page-stack">
      <section className="room-panel">
        <PanelHeading eyebrow="管理观点入口" title="把发言转化为可处理的决策对象" meta="Human confirmation required" />
        <div className="perspective-form">
          <label>
            观点类型
            <select value={newType} onChange={(event) => onTypeChange(event.target.value as QueueItemType)}>
              {["Fact claim", "Assumption", "Constraint", "Preference", "Question", "Risk", "New option", "Objection"].map((type) => <option key={type}>{type}</option>)}
            </select>
          </label>
          <label>
            会议发言或问题
            <input value={newStatement} onChange={(event) => onStatementChange(event.target.value)} placeholder="例如：社区高频会员可能把30元视为价值跳点" />
          </label>
          <button onClick={onAdd} type="button"><MessageSquarePlus size={17} />加入证据队列</button>
        </div>
      </section>

      <section className="room-panel">
        <PanelHeading eyebrow="问题—证据队列" title="哪些问题可能改变方案选择？" meta={`${queue.length} items`} />
        <div className="evidence-queue-list">
          {queue.map((item) => (
            <article key={item.id}>
              <div className="queue-type"><span>{item.type}</span><StatusBadge status={item.status} /></div>
              <h3>{item.statement}</h3>
              <p>Owner: {item.owner} · Due: {item.due} · 关联 {item.relatedScenarios.join(", ")}</p>
              {item.suggestedAnalysis && <div className="queue-analysis"><FlaskConical size={15} />建议分析：{item.suggestedAnalysis}</div>}
              {item.result && <div className="queue-result"><strong>分析结果</strong><p>{item.result}</p></div>}
              {item.id === "queue-ops" && item.status === "Pending confirmation" && (
                <button className="room-inline-action" onClick={onRun} type="button">运行预设运营情景分析</button>
              )}
              {item.id === "queue-ops" && item.status === "Result awaiting review" && (
                <button className="room-inline-action" onClick={onConfirm} type="button">人工确认并回写方案</button>
              )}
              {item.id === "queue-ops" && operationsApplied && <span className="queue-confirmed"><Check size={14} />已更新共同事实及方案B、D</span>}
            </article>
          ))}
        </div>
      </section>

      <section className="preset-analysis-grid">
        {["历史调价前后", "价格敏感度区间", "产品替代与连带", "盈亏平衡销量", "主动工时与产能", "备货与报废", "净增量贡献", "竞品价值对比"].map((analysis) => (
          <article key={analysis}><Gauge size={17} /><strong>{analysis}</strong><span>Validated preset</span></article>
        ))}
      </section>
    </div>
  );
}

function DecisionExecutionPage({
  decisionOutcome,
  frozen,
  onExport,
  onFreeze,
  onOutcomeChange,
  operationsApplied,
  scenario,
}: {
  decisionOutcome: string;
  frozen: boolean;
  onExport: () => void;
  onFreeze: () => void;
  onOutcomeChange: (value: string) => void;
  operationsApplied: boolean;
  scenario: PricingRoomScenario;
}) {
  const room = seedPricingDecisionRoom;
  const net = calculateScenarioAfterOperationsReview(scenario, operationsApplied);
  return (
    <div className="room-page-stack">
      <section className="room-final-decision">
        <div>
          <span>建议的人工作出结论</span>
          <h2>{decisionOutcome}</h2>
          <strong>{scenario.name}</strong>
          <p>在15家商务办公和15家交通枢纽门店执行6周试点，社区门店维持28元作为业务对照；达到扩大条件后再进入分阶段推广决策。</p>
        </div>
        <div className="room-final-kpi">
          <span>确认后净增量贡献</span>
          <strong>{compactCurrencyFormatter.format(net)}</strong>
          <small>30家试点店 · 6周 · 模拟情景</small>
        </div>
      </section>

      <section className="room-panel">
        <PanelHeading eyebrow="正式记录" title="选择理由、反对意见与失效条件" meta={frozen ? "Version 1.0 frozen" : "Draft version"} />
        <div className="decision-record-grid">
          <article><span>选择理由</span><p>目标商圈存在价格空间；社区价值得到保护；试点可以验证真实ADTC、UPH、工时和报废。</p></article>
          <article><span>未选方案</span><p>不选择全市场统一调价，因为社区VFM风险突破边界；不选择结构重构，因为高峰复杂度风险较高。</p></article>
          <article><span>保留的反对意见</span><p>运营负责人认为饮料工位在极端午峰仍可能超过稳定负荷，应逐店审查试点名单。</p></article>
          <article><span>决策失效条件</span><p>主要竞品价格下调、食材成本回落超过8%、试点店结构显著变化或社区被错误纳入执行。</p></article>
        </div>
      </section>

      <section className="room-panel">
        <PanelHeading eyebrow="执行与复盘" title="决定如何成为可监测、可扩大、可回滚的行动？" meta="4 commitments" />
        <div className="execution-plan-grid">
          <ExecutionCard icon={Store} label="试点范围" title="30家试点 + 15家对照" text="办公区15家、交通枢纽15家；按ADTC、会员占比和产能匹配对照店。" />
          <ExecutionCard icon={UsersRound} label="Owner" title={room.executionOwner} text="Finance负责净贡献；Consumer Insight负责VFM；Store Ops负责执行一致性。" />
          <ExecutionCard icon={CircleCheck} label="扩大条件" title="连续2周通过全部门槛" text="净贡献为正、复购≥−2%、VFM≥97、P90≤6.5分钟、报废≤4.5%。" />
          <ExecutionCard icon={ShieldAlert} label="暂停与回滚" title="任一硬性边界连续2周突破" text="恢复28元并保留试点版本；72小时内完成原因归类和门店沟通。" />
        </div>
        <div className="review-timeline">
          <div><span>Day 0</span><strong>冻结价格、门店与假设版本</strong></div>
          <div><span>Week 1</span><strong>执行与数据质量检查</strong></div>
          <div><span>Week 3</span><strong>中期Guardrail检查</strong></div>
          <div><span>Week 6</span><strong>正式复盘与扩大决定</strong></div>
        </div>
      </section>

      <section className="decision-output-bar">
        <div>
          <span>{frozen ? "正式版本已冻结" : "确认后生成不可覆盖版本"}</span>
          <strong>{frozen ? `${room.code} · Version 1.0` : "决策纪要、行动清单与复盘计划"}</strong>
        </div>
        <button onClick={onExport} type="button"><Download size={16} />导出 Markdown 纪要</button>
        <button onClick={() => window.print()} type="button"><Printer size={16} />打印 / 保存 PDF</button>
        <button className="decision-freeze-button" disabled={frozen} onClick={onFreeze} type="button"><FileCheck2 size={16} />{frozen ? "已冻结" : "决策者确认并冻结"}</button>
      </section>

      <div className="sr-only">
        <label>决策结果<select value={decisionOutcome} onChange={(event) => onOutcomeChange(event.target.value)}><option>{decisionOutcome}</option></select></label>
      </div>
    </div>
  );
}

function CollaborationRail({ queue }: { queue: EvidenceQueueItem[] }) {
  return (
    <aside className="pricing-room-collaboration">
      <div className="collaboration-header">
        <div><UsersRound size={17} /><strong>会议协作</strong></div>
        <span>5人在线</span>
      </div>
      <section>
        <p>参与者</p>
        {["COO · 决策", "Commercial · 主持", "Finance · 分析", "Brand · 价值", "Operations · 执行"].map((person) => <div className="participant-row" key={person}><i />{person}</div>)}
      </section>
      <section>
        <p>问题队列</p>
        {queue.slice(0, 4).map((item) => (
          <article className="rail-queue-item" key={item.id}>
            <span>{item.type}</span>
            <strong>{item.statement}</strong>
            <small>{item.status}</small>
          </article>
        ))}
      </section>
      <section className="pending-confirmations">
        <p>待人工确认</p>
        <strong>{queue.filter((item) => item.status === "Result awaiting review" || item.status === "Pending confirmation").length}</strong>
        <span>项更新不能由AI自动写入正式材料</span>
      </section>
    </aside>
  );
}

function FactCard({ fact }: { fact: CommonFact }) {
  return (
    <article className={fact.disputed ? "room-fact-card room-fact-card--disputed" : "room-fact-card"}>
      <div><span>{fact.layer}</span><EvidenceBadge state={fact.state} /></div>
      <h2>{fact.title}</h2>
      <strong>{fact.value}</strong>
      <p>{fact.interpretation}</p>
      <details>
        <summary>查看来源与关联</summary>
        <small>{fact.source} · {fact.period} · Quality {fact.quality}</small>
        <small>关联方案：{fact.supports.join(", ")}</small>
      </details>
    </article>
  );
}

function OperationsProfile() {
  const profile = seedPricingDecisionRoom.operations;
  const fields = [
    ["主动操作工时", `${profile.activeMinutes}分钟`],
    ["总制作周期", `${profile.totalCycleMinutes}分钟`],
    ["瓶颈工位", profile.bottleneck],
    ["最小备货批次", `${profile.minimumBatch}份`],
    ["保质期", `${profile.shelfLifeMinutes}分钟`],
    ["当前→情景报废率", `${percentFormatter.format(profile.currentWasteRate)} → ${percentFormatter.format(profile.scenarioWasteRate)}`],
    ["最大稳定UPH", `${profile.maxStableUph}`],
    ["当前高峰负荷", percentFormatter.format(profile.peakLoad)],
  ];
  return <div className="operations-profile-grid">{fields.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>;
}

function ContributionBridge({ scenario, operationsApplied }: { scenario: PricingRoomScenario; operationsApplied: boolean }) {
  const breakdown = scenario.breakdown;
  const labor = breakdown.laborCost + (operationsApplied && scenario.id !== "option-0" ? 18_000 : 0);
  const waste = breakdown.wasteCost + (operationsApplied && scenario.id !== "option-0" ? 12_000 : 0);
  const rows = [
    ["增量销售收入", breakdown.incrementalRevenue, "positive"],
    ["增量食材成本", -breakdown.ingredientCost, "negative"],
    ["增量人工成本", -labor, "negative"],
    ["备货与报废成本", -waste, "negative"],
    ["包装及渠道成本", -breakdown.packagingAndChannelCost, "negative"],
    ["返工、退款与质量损失", -breakdown.qualityLoss, "negative"],
    ["被挤占商品贡献损失", -breakdown.displacedContribution, "negative"],
    ["其他运营成本", -breakdown.otherOperatingCost, "negative"],
  ] as const;
  return (
    <div className="contribution-bridge">
      {rows.map(([label, value, tone]) => (
        <div className={`contribution-row contribution-row--${tone}`} key={label}>
          <span>{label}</span><strong>{compactCurrencyFormatter.format(value)}</strong>
        </div>
      ))}
      <div className="contribution-total"><span>门店净增量贡献</span><strong>{compactCurrencyFormatter.format(calculateScenarioAfterOperationsReview(scenario, operationsApplied))}</strong></div>
    </div>
  );
}

function TradeoffMetric({ detail, label, value }: { detail: string; label: string; value: string }) {
  return <article><span>{label}</span><strong>{value}</strong><p>{detail}</p></article>;
}

function PanelHeading({ eyebrow, meta, title }: { eyebrow: string; meta: string; title: string }) {
  return <div className="room-panel-heading"><div><span>{eyebrow}</span><h2>{title}</h2></div><small>{meta}</small></div>;
}

function EvidenceBadge({ state }: { state: CommonFact["state"] }) {
  return <b className={`evidence-state evidence-state--${state.toLowerCase().replace(" ", "-")}`}>{state}</b>;
}

function StatusBadge({ status }: { status: EvidenceQueueItem["status"] }) {
  return <b className="queue-status">{status}</b>;
}

function RiskBadge({ risk }: { risk: "Low" | "Medium" | "High" | "Very high" }) {
  return <span className={`room-risk room-risk--${risk.toLowerCase().replace(" ", "-")}`}>{risk}</span>;
}

function ExecutionCard({ icon: Icon, label, text, title }: { icon: typeof Store; label: string; text: string; title: string }) {
  return <article><Icon aria-hidden="true" size={18} /><span>{label}</span><strong>{title}</strong><p>{text}</p></article>;
}

function buildDecisionMarkdown(
  scenario: PricingRoomScenario,
  outcome: string,
  operationsApplied: boolean,
) {
  const room = seedPricingDecisionRoom;
  const net = calculateScenarioAfterOperationsReview(scenario, operationsApplied);
  return `# ${room.title}\n\n- 决策编号：${room.code}\n- 决策结果：${outcome}\n- 最终方案：${scenario.name}\n- 决策者：${room.decisionMaker}\n- 版本：1.0\n\n## 决策命题\n\n${room.decisionStatement}\n\n## 选择理由\n\n目标商圈存在价格空间，社区价值感得到保护，并通过受控试点验证需求、产能和报废假设。\n\n## 门店净增量贡献\n\n${compactCurrencyFormatter.format(net)}（30家试点店，6周，模拟情景）\n\n## 执行计划\n\n- 15家商务办公区门店与15家交通枢纽门店试点。\n- 15家匹配门店作为对照。\n- Week 1执行检查，Week 3中期检查，Week 6正式复盘。\n\n## 扩大与回滚条件\n\n- 扩大：连续2周净贡献为正、复购≥−2%、VFM≥97、P90≤6.5分钟、报废≤4.5%。\n- 回滚：任一硬性边界连续2周突破。\n`;
}
