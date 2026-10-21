// ============================================================
// ReturnsCalculator — the page's one live thing.
//
// Pick an amount up to ₹5,00,000 and see what a four-month cycle is
// targeted to return, month by month. The figures are a target range and
// are labelled as one, with the risk stated next to them, not under them.
// The numbers roll like an old mechanical counter; the bars rise with
// the amount in absolute rupees, so a bigger sum visibly is bigger.
// ============================================================

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type CSSProperties } from 'react';
import Reel from '../ui/Reel';
import Arrow from '../ui/Arrow';
import { CONTACT, RETURNS } from '../../content';
import { clampAmount, inLakh, project, rupees } from '../../utils/returns';
import { revealLines } from '../../utils/motion';
import './ReturnsCalculator.css';


export default function ReturnsCalculator() {
  const [amount, setAmount] = useState<number>(RETURNS.initial);
  const [draft, setDraft] = useState<string>(RETURNS.initial.toLocaleString('en-IN'));
  const [spoken, setSpoken] = useState('');
  const titleRef = useRef<HTMLHeadingElement>(null);

  const plan = useMemo(() => project(amount), [amount]);
  const fill = ((amount - RETURNS.min) / (RETURNS.max - RETURNS.min)) * 100;

  // The bars show the staircase of what has been received by each month. Their
  // overall height grows with the amount, so a bigger sum is visibly bigger.
  const chartScale = 0.38 + 0.62 * (fill / 100);
  const cumMax = plan.months[plan.months.length - 1].cumHigh;

  useEffect(() => {
    if (!titleRef.current) return;
    return revealLines(titleRef.current);
  }, []);

  // Screen readers get the result once the amount stops changing, not on every
  // step of a drag.
  useEffect(() => {
    const t = window.setTimeout(
      () =>
        setSpoken(
          `On ${rupees(amount)}: ${rupees(plan.months[0].low)} to ${rupees(plan.months[0].high)} a month, ` +
            `${rupees(plan.totalLow)} to ${rupees(plan.totalHigh)} over four months, if the target is met.`
        ),
      450
    );
    return () => window.clearTimeout(t);
  }, [amount, plan]);

  const set = (value: number) => {
    const next = clampAmount(value);
    setAmount(next);
    setDraft(next.toLocaleString('en-IN'));
  };

  const onSlide = (e: ChangeEvent<HTMLInputElement>) => set(Number(e.target.value));

  const onType = (e: ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '');
    setDraft(digits ? Number(digits).toLocaleString('en-IN') : '');
    const n = Number(digits);
    if (n >= RETURNS.min && n <= RETURNS.max) setAmount(clampAmount(n));
  };

  const commit = () => set(Number(draft.replace(/\D/g, '')) || amount);

  const asLakh = amount >= 100_000 ? ` (${inLakh(amount)})` : '';
  const message = `Hello, I would like to talk about ${rupees(amount)}${asLakh} for a four-month cycle with Barakah Commodities.`;
  const whatsapp = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;

  const first = plan.months[0];

  return (
    <section
      className="returns section field field--turmeric"
      id="returns"
      data-nav="turmeric"
      aria-labelledby="returns-title"
    >
      <div className="shell returns__grid">
        <header className="returns__head">
          <h2 className="head" id="returns-title" ref={titleRef}>
            {RETURNS.title}
          </h2>
          <p className="lead">{RETURNS.lede}</p>
        </header>

        <div className="returns__left">
        <form className="returns__controls" onSubmit={(e) => e.preventDefault()}>
          <label className="returns__label" htmlFor="amount-range">
            {RETURNS.labels.amount}
          </label>

          <div className="returns__amount display" aria-hidden="true">
            <Reel value={amount} />
          </div>

          <input
            id="amount-range"
            className="returns__range"
            type="range"
            min={RETURNS.min}
            max={RETURNS.max}
            step={RETURNS.step}
            value={amount}
            onChange={onSlide}
            aria-valuetext={rupees(amount)}
            style={{ '--fill': `${fill}%` } as CSSProperties}
          />

          <div className="returns__scale tnum" aria-hidden="true">
            <span>{rupees(RETURNS.min)}</span>
            <span>{rupees(RETURNS.max)}</span>
          </div>

          <div className="returns__presets" role="group" aria-label="Common amounts">
            {RETURNS.presets.map((p) => (
              <button
                key={p}
                type="button"
                className="returns__preset"
                aria-pressed={amount === p}
                onClick={() => set(p)}
              >
                {inLakh(p)}
              </button>
            ))}
          </div>

          <div className="returns__typed">
            <label htmlFor="amount-typed">Or type it</label>
            <span className="returns__input">
              <span aria-hidden="true">₹</span>
              <input
                id="amount-typed"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={draft}
                onChange={onType}
                onBlur={commit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commit();
                }}
              />
            </span>
          </div>

          <p className="returns__cycle">{RETURNS.labels.cycle}</p>
        </form>

        <aside className="returns__note" id="returns-note">
          <p className="returns__note-title">{RETURNS.disclaimerLabel}</p>
          <p>{RETURNS.disclaimerBody}</p>
        </aside>
        </div>

        <div className="returns__right">

        <div className="returns__result field field--ink">
          <p className="returns__result-label">{RETURNS.labels.monthly}</p>
          <p className="returns__monthly display" aria-hidden="true">
            <Reel value={first.low} />
            <span className="returns__to">to</span>
            <Reel value={first.high} />
          </p>

          <div className="returns__chart" aria-hidden="true">
            {plan.months.map((m) => (
              <div className="returns__col" key={m.month}>
                <div className="returns__bar">
                  <span
                    className="returns__bar-high"
                    style={{ '--h': (m.cumHigh / cumMax) * chartScale } as CSSProperties}
                  />
                  <span
                    className="returns__bar-low"
                    style={{ '--h': (m.cumLow / cumMax) * chartScale } as CSSProperties}
                  />
                </div>
                <p className="returns__month">Month {m.month}</p>
                <p className="returns__cum tnum">
                  {rupees(m.cumLow)}
                  <br />
                  to {rupees(m.cumHigh)}
                </p>
              </div>
            ))}
          </div>

          <dl className="returns__totals">
            <div>
              <dt>{RETURNS.labels.total}</dt>
              <dd className="tnum">
                {rupees(plan.totalLow)} to {rupees(plan.totalHigh)}
                <span className="returns__pct">
                  {plan.pctLow}% to {plan.pctHigh}% of the amount
                </span>
              </dd>
            </div>
            <div>
              <dt>{RETURNS.labels.closing}</dt>
              <dd className="tnum">
                {rupees(plan.closeLow)} to {rupees(plan.closeHigh)}
                <span className="returns__pct">{RETURNS.labels.closingNote}</span>
              </dd>
            </div>
          </dl>

          {/* The same figures as a table, for anyone not reading the chart. */}
          <table className="sr-only">
            <caption>Targeted returns by month on {rupees(amount)}</caption>
            <thead>
              <tr>
                <th scope="col">Month</th>
                <th scope="col">Paid that month</th>
                <th scope="col">Received so far</th>
              </tr>
            </thead>
            <tbody>
              {plan.months.map((m) => (
                <tr key={m.month}>
                  <th scope="row">{m.month}</th>
                  <td>
                    {rupees(m.low)} to {rupees(m.high)}
                  </td>
                  <td>
                    {rupees(m.cumLow)} to {rupees(m.cumHigh)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="returns__cta">
          <a className="btn" href={whatsapp} target="_blank" rel="noopener noreferrer">
            {RETURNS.ctaLabel} {rupees(amount)}
            <Arrow />
          </a>
          <a className="link returns__call tnum" href={CONTACT.phoneHref}>
            or call {CONTACT.phone}
          </a>
        </div>
        </div>


      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {spoken}
      </p>
    </section>
  );
}
