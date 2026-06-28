// Scoped styles for the Xiaomi YU7 configurator (everything under .yu7).
// Auto-derived from the standalone configurator stylesheet.

export const YU7_CSS = String.raw`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Saira+Condensed:wght@500;600;700;800&family=Saira:wght@400;500;600&display=swap');
.yu7{
  --bg:#0d0d0f; --panel:#161619; --panel2:#1d1d21; --line:#2a2a30;
  --txt:#f4f4f3; --mut:#9a9aa1; --dim:#6c6c74;
  --red:#c8102e; --red2:#e23b52; --gold:#fdd445; --ok:#4fd08a;
  --r:14px;
}
.yu7 *{box-sizing:border-box;margin:0;padding:0}
.yu7{scroll-behavior:smooth}
.yu7{background:var(--bg);color:var(--txt);font-family:'Inter',system-ui,sans-serif;-webkit-font-smoothing:antialiased;line-height:1.45}
.yu7 .wrap{max-width:1320px;margin:0 auto;padding:0 20px}
.yu7
header{position:sticky;top:0;z-index:40;background:rgba(13,13,15,.86);backdrop-filter:blur(12px);border-bottom:1px solid var(--line)}
.yu7 .bar{display:flex;align-items:center;gap:16px;padding:13px 20px;max-width:1320px;margin:0 auto;flex-wrap:wrap}
.yu7 .brand{display:flex;align-items:center;gap:11px}
.yu7 .mark{width:34px;height:34px;border-radius:8px;background:var(--red);display:grid;place-items:center;font-family:'Saira Condensed';font-weight:800;font-size:19px;color:#fff;letter-spacing:.5px}
.yu7 .brand b{font-family:'Saira Condensed';font-weight:700;font-size:17px;letter-spacing:.4px;line-height:1}
.yu7 .brand span{display:block;font-size:10.5px;letter-spacing:.22em;text-transform:uppercase;color:var(--mut);margin-top:3px}
.yu7 .bar-spacer{flex:1}
.yu7 .cfg{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.yu7 .field{display:flex;flex-direction:column;gap:3px}
.yu7 .field label{font-size:9.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--dim)}
.yu7 .field .inp{display:flex;align-items:center;gap:5px;background:var(--panel2);border:1px solid var(--line);border-radius:9px;padding:6px 9px}
.yu7 .field .inp span{font-size:12px;color:var(--mut)}
.yu7 .field input{width:64px;background:none;border:none;color:var(--txt);font-family:'Saira';font-size:14px;outline:none}
.yu7
.grid{display:grid;grid-template-columns:1.05fr .95fr;gap:26px;padding:26px 0 140px}
.yu7 .left{position:sticky;top:74px;align-self:start}
.yu7 .stage{position:relative;border-radius:18px;overflow:hidden;background:
   radial-gradient(120% 80% at 50% 18%,#26262b 0%,#161619 46%,#0f0f12 100%);
   border:1px solid var(--line);aspect-ratio:16/10}
.yu7 .stage::after{content:"";position:absolute;left:8%;right:8%;bottom:7%;height:34px;border-radius:50%;
   background:radial-gradient(closest-side,rgba(0,0,0,.55),transparent);filter:blur(2px)}
.yu7 .stage img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;padding:6% 5% 9%;
   transition:opacity .35s ease;opacity:1}
.yu7 .stage .badge{position:absolute;left:16px;top:14px;display:flex;gap:8px;flex-wrap:wrap;z-index:2}
.yu7 .chip{font-size:11px;letter-spacing:.05em;padding:5px 10px;border-radius:999px;background:rgba(0,0,0,.5);
   border:1px solid rgba(255,255,255,.14);backdrop-filter:blur(4px)}
.yu7 .chip b{color:#fff;font-weight:600}
.yu7 .stage .nameplate{position:absolute;left:16px;bottom:14px;z-index:2}
.yu7 .stage .nameplate h2{font-family:'Saira Condensed';font-weight:800;font-size:30px;letter-spacing:.5px;line-height:.95;text-shadow:0 2px 12px rgba(0,0,0,.6)}
.yu7 .stage .nameplate p{font-size:12px;color:#d6d6da;margin-top:3px;text-shadow:0 1px 6px rgba(0,0,0,.7)}
.yu7
.summary{margin-top:16px;background:var(--panel);border:1px solid var(--line);border-radius:16px;overflow:hidden}
.yu7 .total-row{padding:18px 20px;display:flex;align-items:flex-end;justify-content:space-between;gap:12px;border-bottom:1px solid var(--line);background:linear-gradient(180deg,#1b1b1f,#161619)}
.yu7 .total-row .lab{font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:var(--mut)}
.yu7 .total-row .lab small{display:block;margin-top:5px;color:var(--dim);letter-spacing:.04em;font-size:10.5px;text-transform:none}
.yu7 .price{font-family:'Saira Condensed';font-weight:800;font-size:46px;line-height:.9;letter-spacing:.5px;color:#fff;font-variant-numeric:tabular-nums;white-space:nowrap}
.yu7 .price .cur{color:var(--red2);font-size:24px;vertical-align:top;margin-right:2px}
.yu7 .lines{padding:8px 20px 6px}
.yu7 .line{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:8px 0;border-bottom:1px dashed #232328;font-size:13px}
.yu7 .line:last-child{border-bottom:none}
.yu7 .line .l{display:flex;align-items:center;gap:9px;color:var(--mut);min-width:0}
.yu7 .line .dot{width:13px;height:13px;border-radius:4px;flex:none;border:1px solid rgba(255,255,255,.2)}
.yu7 .line .nm{color:var(--txt);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.yu7 .line .nm small{color:var(--dim);font-size:11px;margin-left:6px}
.yu7 .line .v{font-family:'Saira';font-variant-numeric:tabular-nums;color:#fff;white-space:nowrap}
.yu7 .line .v.free{color:var(--ok);font-size:12px;letter-spacing:.06em}
.yu7 .cta{padding:14px 20px 18px;display:flex;gap:10px;flex-wrap:wrap}
.yu7 .btn{flex:1;min-width:130px;border:none;border-radius:11px;padding:13px 14px;font-family:'Inter';font-weight:600;font-size:13.5px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:.15s}
.yu7 .btn.prim{background:var(--red);color:#fff}
.yu7 .btn.prim:hover{background:#e0142f}
.yu7 .btn.ghost{background:var(--panel2);color:var(--txt);border:1px solid var(--line)}
.yu7 .btn.ghost:hover{border-color:#3a3a42}
.yu7
.steps{display:flex;flex-direction:column;gap:30px}
.yu7 .step .head{display:flex;align-items:baseline;gap:12px;margin-bottom:14px}
.yu7 .step .num{font-family:'Saira Condensed';font-weight:700;font-size:13px;color:var(--red2);letter-spacing:.1em}
.yu7 .step h3{font-family:'Saira Condensed';font-weight:700;font-size:22px;letter-spacing:.4px}
.yu7 .step .sub{font-size:12px;color:var(--dim);margin-left:auto}
.yu7
.versions{display:grid;grid-template-columns:repeat(3,1fr);gap:11px}
.yu7 .vcard{background:var(--panel);border:1.5px solid var(--line);border-radius:14px;padding:15px 14px;cursor:pointer;transition:.16s;position:relative}
.yu7 .vcard:hover{border-color:#3c3c44}
.yu7 .vcard.sel{border-color:var(--red);background:linear-gradient(180deg,#1f1518,#161619)}
.yu7 .vcard .tier{font-family:'Saira Condensed';font-weight:700;font-size:17px;letter-spacing:.3px}
.yu7 .vcard .drive{font-size:11px;color:var(--mut);margin:4px 0 12px}
.yu7 .vcard .specs{display:flex;gap:12px;margin-bottom:13px}
.yu7 .vcard .spec b{font-family:'Saira';font-size:16px;display:block}
.yu7 .vcard .spec small{font-size:9.5px;color:var(--dim);letter-spacing:.06em;text-transform:uppercase}
.yu7 .vcard .fob{font-family:'Saira Condensed';font-weight:700;font-size:20px;color:#fff;font-variant-numeric:tabular-nums}
.yu7 .vcard .fob small{font-size:10px;color:var(--dim);font-weight:400;letter-spacing:.1em;display:block;margin-top:2px;font-family:'Inter'}
.yu7 .vcard .tick{position:absolute;top:12px;right:12px;width:20px;height:20px;border-radius:50%;border:1.5px solid var(--line);display:grid;place-items:center;font-size:12px;color:transparent}
.yu7 .vcard.sel .tick{background:var(--red);border-color:var(--red);color:#fff}
.yu7
.swgrid{display:grid;gap:11px}
.yu7 .sw-paint{grid-template-columns:repeat(3,1fr)}
.yu7 .sw-int{grid-template-columns:repeat(2,1fr)}
.yu7 .sw-wheel{grid-template-columns:repeat(3,1fr)}
.yu7 .sw{background:var(--panel);border:1.5px solid var(--line);border-radius:12px;overflow:hidden;cursor:pointer;transition:.16s}
.yu7 .sw:hover{border-color:#3c3c44}
.yu7 .sw.sel{border-color:var(--red)}
.yu7 .sw .thumb{aspect-ratio:16/9;background:#0e0e11 center/cover no-repeat;border-bottom:1px solid var(--line)}
.yu7 .sw.sw-w .thumb{aspect-ratio:1/1;background-size:contain;background-color:#141417}
.yu7 .sw .meta{padding:9px 11px;display:flex;align-items:center;justify-content:space-between;gap:8px}
.yu7 .sw .meta .nm{font-size:12.5px;font-weight:500;line-height:1.2}
.yu7 .sw .meta .nm small{display:block;color:var(--dim);font-size:10px;font-weight:400;margin-top:2px}
.yu7 .sw .meta .pr{font-family:'Saira';font-size:12px;color:var(--mut);font-variant-numeric:tabular-nums;white-space:nowrap;text-align:right}
.yu7 .sw .meta .pr.free{color:var(--ok)}
.yu7 .sw.sel .meta .pr{color:var(--txt)}
.yu7
.opts{display:flex;flex-direction:column;gap:10px}
.yu7 .opt{display:flex;align-items:center;gap:14px;background:var(--panel);border:1.5px solid var(--line);border-radius:12px;padding:13px 15px;cursor:pointer;transition:.16s}
.yu7 .opt:hover{border-color:#3c3c44}
.yu7 .opt.sel{border-color:var(--red)}
.yu7 .opt.disabled{opacity:.45;cursor:not-allowed}
.yu7 .opt .box{width:21px;height:21px;border-radius:6px;border:1.5px solid var(--line);flex:none;display:grid;place-items:center;font-size:13px;color:transparent;transition:.16s}
.yu7 .opt.sel .box{background:var(--red);border-color:var(--red);color:#fff}
.yu7 .opt .txt{flex:1}
.yu7 .opt .txt b{font-size:13.5px;font-weight:600}
.yu7 .opt .txt p{font-size:11.5px;color:var(--mut);margin-top:2px}
.yu7 .opt .pr{font-family:'Saira';font-size:13px;color:var(--txt);font-variant-numeric:tabular-nums}
.yu7 .opt .pr.inc{color:var(--ok);font-size:11px;letter-spacing:.06em}
.yu7 .opt .pr.na{color:var(--dim);font-size:11px}
.yu7
.mbar{display:none}
.yu7
.modal{position:fixed;inset:0;z-index:60;background:rgba(6,6,8,.72);backdrop-filter:blur(4px);display:none;align-items:flex-start;justify-content:center;padding:30px 16px;overflow:auto}
.yu7 .modal.open{display:flex}
.yu7 .sheet{width:100%;max-width:560px;background:#fff;color:#111;border-radius:16px;overflow:hidden;font-family:'Inter'}
.yu7 .sheet .sh-top{background:#111;color:#fff;padding:20px 22px;display:flex;justify-content:space-between;align-items:center}
.yu7 .sheet .sh-top .mk{font-family:'Saira Condensed';font-weight:800;font-size:20px}
.yu7 .sheet .sh-top .mk span{color:var(--red2)}
.yu7 .sheet .sh-top .code{font-family:'Saira';font-size:12px;color:#bbb}
.yu7 .sheet .sh-body{padding:20px 22px}
.yu7 .sheet h4{font-family:'Saira Condensed';font-weight:700;font-size:18px;margin-bottom:3px}
.yu7 .sheet .drv{color:#666;font-size:12px;margin-bottom:14px}
.yu7 .srow{display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px solid #ececec;font-size:13.5px}
.yu7 .srow .sk{color:#555}.yu7 .srow .sk b{color:#111;font-weight:600;margin-left:0}
.yu7 .srow .sv{font-family:'Saira';font-variant-numeric:tabular-nums;font-weight:500}
.yu7 .srow .sv.free{color:#1a9e5e}
.yu7 .sgrand{display:flex;justify-content:space-between;align-items:baseline;margin-top:16px;padding-top:14px;border-top:2px solid #111}
.yu7 .sgrand .gl{font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#888}
.yu7 .sgrand .gv{font-family:'Saira Condensed';font-weight:800;font-size:32px;font-variant-numeric:tabular-nums}
.yu7 .sgrand .gv span{color:var(--red);font-size:18px;vertical-align:top}
.yu7 .sheet .fine{font-size:10.5px;color:#999;margin-top:12px;line-height:1.5}
.yu7 .sheet .sh-act{display:flex;gap:10px;padding:0 22px 22px}
.yu7 .sheet .sh-act button{flex:1;border:none;border-radius:10px;padding:12px;font-weight:600;font-size:13px;cursor:pointer}
.yu7 .b-wa{background:#25d366;color:#0a2e1a}
.yu7 .b-print{background:#111;color:#fff}
.yu7 .b-close{background:#eee;color:#333}

@media(max-width:980px){
  .yu7 .grid{grid-template-columns:1fr;gap:20px;padding:18px 0 96px}
  .yu7 .left{position:static}
  .yu7 .summary{display:none}
  .yu7 .versions{grid-template-columns:1fr}
  .yu7 .mbar{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:45;background:rgba(18,18,21,.96);
     backdrop-filter:blur(12px);border-top:1px solid var(--line);padding:11px 16px;align-items:center;gap:14px}
  .yu7 .mbar .mp{flex:1}
  .yu7 .mbar .mp small{font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--mut);display:block}
  .yu7 .mbar .mp b{font-family:'Saira Condensed';font-weight:800;font-size:26px;font-variant-numeric:tabular-nums}
  .yu7 .mbar .mp b span{color:var(--red2);font-size:15px;vertical-align:top}
  .yu7 .mbar button{border:none;background:var(--red);color:#fff;border-radius:10px;padding:12px 18px;font-weight:600;font-size:13.5px;cursor:pointer}
}
@media(max-width:560px){
  .yu7 .sw-paint,.yu7 .sw-wheel{grid-template-columns:repeat(2,1fr)}
  .yu7 .cfg{width:100%}
}
@media print{
  .yu7 *{visibility:hidden}
  .yu7 .modal,.yu7 .modal *{visibility:visible}
  .yu7 .modal{position:absolute;inset:0;background:#fff;padding:0;display:block}
  .yu7 .sheet{box-shadow:none;max-width:100%}
  .yu7 .sh-act{display:none!important}
}
@media (prefers-reduced-motion:reduce){.yu7 *{transition:none!important}}

.yu7 .sh-shots{margin:2px 0 16px}
.yu7 .sh-shot{margin:0;border:1px solid #ececec;border-radius:10px;overflow:hidden;background:#f1f1f3}
.yu7 .sh-ext img{display:block;width:100%;aspect-ratio:16/10;object-fit:cover}
.yu7 .sh-thumbs{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}
.yu7 .sh-thumbs .sh-shot img{display:block;width:100%;height:82px;object-fit:cover}
.yu7 .sh-thumbs .sh-wheel img{object-fit:contain;background:#fff}
.yu7 .sh-shot figcaption{padding:5px 8px;font-size:9.5px;letter-spacing:.05em;text-transform:uppercase;color:#666;background:#fafafa;border-top:1px solid #ececec;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.yu7 .sh-shots img{-webkit-print-color-adjust:exact;print-color-adjust:exact}
@media print{.yu7 .sh-shots,.yu7 .sh-shots *{visibility:visible}}

.yu7 .b-confirm{background:var(--red);color:#fff}
.yu7 .confirm{position:fixed;inset:0;z-index:70;background:rgba(6,6,8,.82);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:24px}
.yu7 .confirm-card{width:100%;max-width:380px;background:#fff;color:#111;border-radius:16px;padding:36px 28px 30px;text-align:center;font-family:'Inter';box-shadow:0 24px 70px rgba(0,0,0,.45)}
.yu7 .confirm-card h3{font-family:'Saira Condensed';font-weight:700;font-size:22px;letter-spacing:.3px;margin-bottom:6px}
.yu7 .confirm-card p{font-size:13px;line-height:1.5;color:#666;max-width:300px;margin:0 auto}
.yu7 .spinner{width:46px;height:46px;border-radius:50%;border:4px solid #eee;border-top-color:var(--red);margin:0 auto 18px;animation:yu7spin .8s linear infinite}
@keyframes yu7spin{to{transform:rotate(360deg)}}
.yu7 .check{width:56px;height:56px;border-radius:50%;background:#1a9e5e;color:#fff;display:flex;align-items:center;justify-content:center;font-size:30px;margin:0 auto 16px;animation:yu7pop .35s ease}
@keyframes yu7pop{0%{transform:scale(.5);opacity:0}100%{transform:scale(1);opacity:1}}
.yu7 .confirm-code{display:inline-block;margin-top:16px;font-family:'Saira';font-size:12px;letter-spacing:.06em;color:#444;background:#f4f4f5;border:1px solid #ececec;border-radius:8px;padding:6px 12px}
.yu7 .confirm-total{margin-top:14px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#888}
.yu7 .confirm-total b{display:block;margin-top:4px;font-family:'Saira Condensed';font-weight:800;font-size:26px;letter-spacing:.5px;color:#111;text-transform:none}
.yu7 .confirm-done{margin-top:22px;width:100%;border:none;border-radius:11px;padding:13px;background:#111;color:#fff;font-family:'Inter';font-weight:600;font-size:13.5px;cursor:pointer}
.yu7 .confirm-done:hover{background:#000}
@media print{.yu7 .confirm{display:none!important}}
`;
