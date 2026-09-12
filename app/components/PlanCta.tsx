import Link from 'next/link';

export default function PlanCta() {
  return (
    <section className="cta" aria-labelledby="cta-title">
      <div className="cta-copy">
        <p className="eyebrow">Your turn</p>
        <h2 id="cta-title">Ready to map your own morning?</h2>
        <p className="cta-text">Three quick questions: when you need to arrive, how long you travel, and what you do before you leave.</p>
      </div>
      <Link className="primary" href="/plan">Plan my morning <span className="arrow" aria-hidden="true">↗</span></Link>
    </section>
  );
}
