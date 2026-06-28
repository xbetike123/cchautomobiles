"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { byId, INTERIORS, PAINTS, VERSIONS, WHEELS } from "@/lib/xiaomi/data";
import { IMG } from "@/lib/xiaomi/images";
import { YU7_CSS } from "@/lib/xiaomi/styles";

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

type OrderStatus = "idle" | "submitting" | "confirmed";

type Line = {
  nm: string;
  sub: string;
  dot: string;
  usd: number;
  base?: boolean;
  fee?: boolean;
  rmb?: number;
};

export function XiaomiConfigurator() {
  const [ver, setVer] = useState("ev835");
  const [paint, setPaint] = useState("green");
  const [interior, setInterior] = useState("grey");
  const [wheel, setWheel] = useState("w19");
  const [spk, setSpk] = useState(false);
  const [fridge, setFridge] = useState(false);
  const [rateStr, setRateStr] = useState("7.15");
  const [feeStr, setFeeStr] = useState("0");
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [orderStatus, setOrderStatus] = useState<OrderStatus>("idle");

  const rate = parseFloat(rateStr) || 7.15;
  const fee = Math.max(0, parseFloat(feeStr) || 0);
  const rmb2usd = useCallback((r: number) => r / rate, [rate]);

  const v = byId(VERSIONS, ver);
  const p = byId(PAINTS, paint);
  const i = byId(INTERIORS, interior);
  const w = byId(WHEELS, wheel);

  // 25-speaker Hi-Fi is only an add-on on the base EV; standard on MAX, N/A on PRO.
  const speakerSelected = spk && ver === "ev835";

  const lineItems = useMemo<Line[]>(() => {
    const it: Line[] = [
      { nm: v.tier, sub: v.drive, dot: "#3a3a40", usd: v.usd, base: true },
      { nm: p.nm, sub: "paint", dot: p.hex ?? "#4a4a52", usd: rmb2usd(p.rmb), rmb: p.rmb },
      { nm: i.nm, sub: "interior", dot: i.hex ?? "#4a4a52", usd: rmb2usd(i.rmb), rmb: i.rmb },
      { nm: w.nm, sub: "wheels", dot: "#4a4a52", usd: rmb2usd(w.rmb), rmb: w.rmb },
    ];
    if (speakerSelected) it.push({ nm: "25-Speaker Hi-Fi", sub: "option", dot: "#4a4a52", usd: rmb2usd(6000), rmb: 6000 });
    if (fridge) it.push({ nm: "In-car Refrigerator", sub: "option", dot: "#4a4a52", usd: rmb2usd(2000), rmb: 2000 });
    if (fee > 0) it.push({ nm: "Service & logistics", sub: "added fee", dot: "#c8102e", usd: fee, fee: true });
    return it;
  }, [v, p, i, w, speakerSelected, fridge, fee, rmb2usd]);

  const total = useMemo(() => lineItems.reduce((s, x) => s + x.usd, 0), [lineItems]);

  // Animated total counter (ease-out cubic, ~420ms).
  const [shown, setShown] = useState(total);
  const shownRef = useRef(total);
  useEffect(() => {
    const from = shownRef.current;
    const delta = total - from;
    if (delta === 0) return;
    const t0 = performance.now();
    const dur = 420;
    let raf = 0;
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      const val = from + delta * e;
      shownRef.current = val;
      setShown(val);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [total]);

  // Hero crossfade: fade out, swap the image after 180ms, fade back in.
  const [heroSrc, setHeroSrc] = useState(IMG[p.img]);
  const [heroVisible, setHeroVisible] = useState(true);
  const selectPaint = useCallback(
    (id: string) => {
      setPaint(id);
      const next = IMG[byId(PAINTS, id).img];
      if (next === heroSrc) return;
      setHeroVisible(false);
      setTimeout(() => {
        setHeroSrc(next);
        setHeroVisible(true);
      }, 180);
    },
    [heroSrc],
  );

  const configCode = useMemo(() => {
    const key = (ver + paint + interior + wheel + (speakerSelected ? "S" : "") + (fridge ? "F" : "")).toUpperCase();
    let h = 0;
    for (const c of key) h = (h * 31 + c.charCodeAt(0)) % 1000000;
    return "CCH-YU7-" + String(h).padStart(6, "0");
  }, [ver, paint, interior, wheel, speakerSelected, fridge]);

  const summaryText = useCallback(() => {
    let t = `XIAOMI YU7 — CCH AUTOMOBILE QUOTE\n${configCode}\n\n`;
    t += `Model: ${v.name}\nDrive: ${v.drive} · ${v.range}km · 0-100 ${v.acc}s\n`;
    t += `Exterior: ${p.nm}${p.rmb ? ` (+$${fmt(rmb2usd(p.rmb))})` : " (incl.)"}\n`;
    t += `Interior: ${i.nm}${i.rmb ? ` (+$${fmt(rmb2usd(i.rmb))})` : " (incl.)"}\n`;
    t += `Wheels: ${w.nm}${w.rmb ? ` (+$${fmt(rmb2usd(w.rmb))})` : " (incl.)"}\n`;
    if (speakerSelected) t += `25-Speaker Hi-Fi: +$${fmt(rmb2usd(6000))}\n`;
    if (ver === "max760") t += `25-Speaker Hi-Fi + Dolby: included\n`;
    if (fridge) t += `In-car Refrigerator: +$${fmt(rmb2usd(2000))}\n`;
    if (fee > 0) t += `Service & logistics: +$${fmt(fee)}\n`;
    t += `\nTOTAL (FOB Nansha): $${fmt(total)}\n`;
    t += `\n(Rate ¥${rate.toFixed(2)}=$1. FOB excludes sea freight, duties & clearing unless a service fee is shown.)`;
    return t;
  }, [configCode, v, p, i, w, speakerSelected, fridge, fee, total, rate, rmb2usd, ver]);

  const copySummary = useCallback(() => {
    navigator.clipboard.writeText(summaryText()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    });
  }, [summaryText]);

  // Submit the order. No backend yet — simulate the round-trip, then show the
  // confirmed state. Swap the setTimeout for a real fetch/server action later;
  // `summaryText()` is the payload to send.
  const submitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const confirmOrder = useCallback(() => {
    setOrderStatus("submitting");
    submitTimer.current = setTimeout(() => setOrderStatus("confirmed"), 1900);
  }, []);

  const closeOrder = useCallback(() => {
    if (submitTimer.current) clearTimeout(submitTimer.current);
    setOrderStatus("idle");
    setModalOpen(false);
  }, []);

  // Lock body scroll while the order sheet or confirmation is open.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const lock = modalOpen || orderStatus !== "idle";
    document.body.style.overflow = lock ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen, orderStatus]);

  useEffect(() => () => {
    if (submitTimer.current) clearTimeout(submitTimer.current);
  }, []);

  const paintTag = (sw: { rmb: number }) =>
    sw.rmb === 0 ? (
      <span className="pr free">Included</span>
    ) : (
      <span className="pr">+${fmt(rmb2usd(sw.rmb))}</span>
    );

  let speakerOpt: React.ReactNode;
  if (ver === "max760") {
    speakerOpt = (
      <div className="opt disabled">
        <div className="box">✓</div>
        <div className="txt">
          <b>25-Speaker Hi-Fi + Dolby Atmos</b>
          <p>Standard on YU7 MAX</p>
        </div>
        <div className="pr inc">Included</div>
      </div>
    );
  } else if (ver === "pro770") {
    speakerOpt = (
      <div className="opt disabled">
        <div className="box" />
        <div className="txt">
          <b>25-Speaker Hi-Fi System</b>
          <p>Not offered on YU7 PRO</p>
        </div>
        <div className="pr na">N/A</div>
      </div>
    );
  } else {
    speakerOpt = (
      <div className={`opt${spk ? " sel" : ""}`} onClick={() => setSpk((s) => !s)}>
        <div className="box">✓</div>
        <div className="txt">
          <b>25-Speaker Hi-Fi System</b>
          <p>Upgrade from 10 speakers</p>
        </div>
        <div className="pr">
          +${fmt(rmb2usd(6000))} <small style={{ color: "var(--dim)" }}>¥6,000</small>
        </div>
      </div>
    );
  }

  const feeNote = fee > 0 ? "Incl. service & logistics fee" : "Free-on-board, excl. shipping";

  return (
    <div className="yu7">
      <style dangerouslySetInnerHTML={{ __html: YU7_CSS }} />

      <header>
        <div className="bar">
          <div className="brand">
            <div>
              <b>Xiaomi YU7</b>
              <span>Build &amp; Price</span>
            </div>
          </div>
          <div className="bar-spacer" />
          <div className="cfg">
            <div className="field">
              <label>USD / RMB rate</label>
              <div className="inp">
                <span>¥</span>
                <input
                  type="number"
                  step="0.01"
                  value={rateStr}
                  onChange={(e) => setRateStr(e.target.value)}
                />
                <span>= $1</span>
              </div>
            </div>
            <div className="field">
              <label>Service / logistics ($)</label>
              <div className="inp">
                <span>$</span>
                <input
                  type="number"
                  step="50"
                  value={feeStr}
                  onChange={(e) => setFeeStr(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="wrap">
        <div className="grid">
          {/* LEFT: hero + live summary */}
          <div className="left">
            <div className="stage">
              <div className="badge">
                <div className="chip">
                  <b>
                    {v.tier} {v.range}KM
                  </b>
                </div>
                <div className="chip">{p.nm}</div>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={heroSrc} alt={`Xiaomi YU7 in ${p.nm}`} style={{ opacity: heroVisible ? 1 : 0 }} />
              <div className="nameplate">
                <h2>{v.name}</h2>
                <p>
                  {v.drive} · {v.range} km · 0–100 in {v.acc}s
                </p>
              </div>
            </div>

            <div className="summary">
              <div className="total-row">
                <div className="lab">
                  Total · FOB Nansha
                  <small>{feeNote}</small>
                </div>
                <div className="price">
                  <span className="cur">$</span>
                  <span>{fmt(shown)}</span>
                </div>
              </div>
              <div className="lines">
                {lineItems.map((x, idx) => (
                  <div className="line" key={idx}>
                    <div className="l">
                      <span className="dot" style={{ background: x.dot }} />
                      <span className="nm">
                        {x.nm}
                        <small>{x.sub}</small>
                      </span>
                    </div>
                    {x.base ? (
                      <span className="v">${fmt(x.usd)}</span>
                    ) : x.fee ? (
                      <span className="v">+${fmt(x.usd)}</span>
                    ) : x.rmb === 0 ? (
                      <span className="v free">INCLUDED</span>
                    ) : (
                      <span className="v">+${fmt(x.usd)}</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="cta">
                <button className="btn ghost" onClick={copySummary}>
                  {copied ? "Copied ✓" : "Copy spec"}
                </button>
                <button className="btn prim" onClick={() => setModalOpen(true)}>
                  Order summary →
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: build steps */}
          <div className="steps">
            <div className="step">
              <div className="head">
                <span className="num">01</span>
                <h3>Choose your model</h3>
                <span className="sub">Battery &amp; Drivetrain</span>
              </div>
              <div className="versions">
                {VERSIONS.map((item) => (
                  <div
                    key={item.id}
                    className={`vcard${ver === item.id ? " sel" : ""}`}
                    onClick={() => {
                      setVer(item.id);
                      if (item.id !== "ev835") setSpk(false);
                    }}
                  >
                    <div className="tick">✓</div>
                    <div className="tier">{item.tier}</div>
                    <div className="drive">{item.drive}</div>
                    <div className="specs">
                      <div className="spec">
                        <b>{item.range}</b>
                        <small>km range</small>
                      </div>
                      <div className="spec">
                        <b>{item.hp}</b>
                        <small>ps</small>
                      </div>
                      <div className="spec">
                        <b>{item.acc}s</b>
                        <small>0–100</small>
                      </div>
                    </div>
                    <div className="fob">
                      ${fmt(item.usd)}
                      <small>FOB NANSHA</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="step">
              <div className="head">
                <span className="num">02</span>
                <h3>Exterior colour</h3>
                <span className="sub">9 finishes</span>
              </div>
              <div className="swgrid sw-paint">
                {PAINTS.map((sw) => (
                  <div key={sw.id} className={`sw${paint === sw.id ? " sel" : ""}`} onClick={() => selectPaint(sw.id)}>
                    <div className="thumb" style={{ backgroundImage: `url(${IMG[sw.img]})` }} />
                    <div className="meta">
                      <div className="nm">
                        {sw.nm}
                        <small>{sw.sub}</small>
                      </div>
                      {paintTag(sw)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="step">
              <div className="head">
                <span className="num">03</span>
                <h3>Interior</h3>
                <span className="sub">Nappa leather</span>
              </div>
              <div className="swgrid sw-int">
                {INTERIORS.map((sw) => (
                  <div key={sw.id} className={`sw${interior === sw.id ? " sel" : ""}`} onClick={() => setInterior(sw.id)}>
                    <div className="thumb" style={{ backgroundImage: `url(${IMG[sw.img]})` }} />
                    <div className="meta">
                      <div className="nm">
                        {sw.nm}
                        <small>{sw.sub}</small>
                      </div>
                      {paintTag(sw)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="step">
              <div className="head">
                <span className="num">04</span>
                <h3>Wheels</h3>
                <span className="sub">19&quot; – 21&quot;</span>
              </div>
              <div className="swgrid sw-wheel">
                {WHEELS.map((sw) => (
                  <div key={sw.id} className={`sw sw-w${wheel === sw.id ? " sel" : ""}`} onClick={() => setWheel(sw.id)}>
                    <div className="thumb" style={{ backgroundImage: `url(${IMG[sw.img]})` }} />
                    <div className="meta">
                      <div className="nm">
                        {sw.nm}
                        <small>{sw.sub}</small>
                      </div>
                      {paintTag(sw)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="step">
              <div className="head">
                <span className="num">05</span>
                <h3>Options</h3>
                <span className="sub">Add-ons</span>
              </div>
              <div className="opts">
                {speakerOpt}
                <div className={`opt${fridge ? " sel" : ""}`} onClick={() => setFridge((f) => !f)}>
                  <div className="box">✓</div>
                  <div className="txt">
                    <b>In-car Refrigerator</b>
                    <p>Centre-console cooler</p>
                  </div>
                  <div className="pr">
                    +${fmt(rmb2usd(2000))} <small style={{ color: "var(--dim)" }}>¥2,000</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* mobile sticky bar */}
      <div className="mbar">
        <div className="mp">
          <small>Total · FOB Nansha</small>
          <b>
            <span>$</span>
            <span>{fmt(shown)}</span>
          </b>
        </div>
        <button onClick={() => setModalOpen(true)}>Summary</button>
      </div>

      {/* order summary modal */}
      <div
        className={`modal${modalOpen ? " open" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setModalOpen(false);
        }}
      >
        <div className="sheet">
          <div className="sh-top">
            <div className="mk">
              XIAOMI <span>YU7</span>
            </div>
            <div className="code">{configCode}</div>
          </div>
          <div className="sh-body">
            <h4>{v.name.replace("XIAOMI ", "")}</h4>
            <div className="drv">
              {v.drive} · {v.range} km · 0–100 in {v.acc}s
            </div>
            <div className="sh-shots">
              <figure className="sh-shot sh-ext">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={IMG[p.img]} alt={`Xiaomi YU7 in ${p.nm}`} />
                <figcaption>Exterior · {p.nm}</figcaption>
              </figure>
              <div className="sh-thumbs">
                <figure className="sh-shot">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={IMG[i.img]} alt={i.nm} />
                  <figcaption>Interior · {i.nm}</figcaption>
                </figure>
                <figure className="sh-shot sh-wheel">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={IMG[w.img]} alt={w.nm} />
                  <figcaption>Wheels · {w.nm}</figcaption>
                </figure>
              </div>
            </div>
            <div>
              {lineItems.map((x, idx) => (
                <div className="srow" key={idx}>
                  <div className="sk">
                    {x.base ? <b>{x.nm}</b> : x.nm} <span style={{ color: "#aaa" }}>· {x.sub}</span>
                  </div>
                  {x.base ? (
                    <div className="sv">${fmt(x.usd)}</div>
                  ) : x.rmb === 0 ? (
                    <div className="sv free">Included</div>
                  ) : (
                    <div className="sv">+${fmt(x.usd)}</div>
                  )}
                </div>
              ))}
            </div>
            <div className="sgrand">
              <div className="gl">Total · FOB Nansha</div>
              <div className="gv">
                <span>$</span>
                <span>{fmt(total)}</span>
              </div>
            </div>
            <div className="fine">
              Rate ¥{rate.toFixed(2)} = $1. FOB Nansha — excludes sea freight, import duty and clearing unless a service
              &amp; logistics fee is listed above. Quote valid subject to factory confirmation.
            </div>
          </div>
          <div className="sh-act">
            <button className="b-close" onClick={() => setModalOpen(false)}>
              Close
            </button>
            <button className="b-print" onClick={() => window.print()}>
              Print / PDF
            </button>
            <button className="b-confirm" onClick={confirmOrder}>
              Confirm Order
            </button>
          </div>
        </div>
      </div>

      {/* order submission / confirmation overlay */}
      {orderStatus !== "idle" && (
        <div className="confirm">
          <div className="confirm-card">
            {orderStatus === "submitting" ? (
              <>
                <div className="spinner" />
                <h3>Submitting your order…</h3>
                <p>Sending your YU7 build to CCH Automobile.</p>
                <div className="confirm-code">{configCode}</div>
              </>
            ) : (
              <>
                <div className="check">✓</div>
                <h3>Order confirmed</h3>
                <p>
                  Thanks — your order is in. Our team will reach out shortly to confirm the build and arrange payment.
                </p>
                <div className="confirm-code">{configCode}</div>
                <div className="confirm-total">
                  Total · FOB Nansha <b>${fmt(total)}</b>
                </div>
                <button className="confirm-done" onClick={closeOrder}>
                  Done
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
