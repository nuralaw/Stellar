import "server-only";
import { getQuestionsByIds } from "./bank";
import { REPORT_REASONS } from "./report-reasons";
import type { Report } from "./reports";
import type { SupportRequest } from "./support";
import { getSkill } from "./taxonomy";

// Emails the admin a copy of every support request and question report (Resend, https://resend.com).
//  - RESEND_API_KEY: API key from resend.com → API Keys.
//  - SUPPORT_EMAIL_TO: where the emails go (comma-separated).
//  - SUPPORT_EMAIL_FROM (optional): a sender on a domain verified in Resend. Without one, Resend's test sender
//    onboarding@resend.dev is used, which can only send to the email the Resend account was created with.
// Without RESEND_API_KEY / SUPPORT_EMAIL_TO nothing is sent; everything is still saved and shows in /admin.
// Never throws: an email failure is only logged.

const KEY = process.env.RESEND_API_KEY;
const TO = (process.env.SUPPORT_EMAIL_TO ?? "").split(",").map((s) => s.trim()).filter(Boolean);
const FROM = process.env.SUPPORT_EMAIL_FROM || "Stellar Support <onboarding@resend.dev>";

const ACCENT = "#F97316";
const MIME: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" };

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
/** Escaped, with line breaks kept. */
const escMultiline = (s: string) => esc(s).replace(/\r?\n/g, "<br>");

/** "@name", "t.me/name", "https://instagram.com/name/" → "name" (only handle-safe characters). */
const handle = (v: string) =>
  v
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^(www\.)?(t\.me|telegram\.me|instagram\.com)\//i, "")
    .replace(/^@/, "")
    .replace(/[/?#].*$/, "");
const safeHandle = (v: string) => (/^[\w.]{1,64}$/.test(handle(v)) ? handle(v) : null);

const when = (at: number) => new Date(at).toUTCString();

interface Contact {
  label: string;
  value: string;
  href?: string;
}

function contactsOf(c: { telegram?: string; instagram?: string; other?: string }): Contact[] {
  const out: Contact[] = [];
  const add = (label: string, raw: string | undefined, base: string) => {
    if (!raw) return;
    const h = safeHandle(raw);
    out.push(h ? { label, value: `@${h}`, href: `${base}${h}` } : { label, value: raw });
  };
  add("Telegram", c.telegram, "https://t.me/");
  add("Instagram", c.instagram, "https://instagram.com/");
  if (c.other) out.push({ label: "Other", value: c.other });
  return out;
}

const contactsText = (cs: Contact[]) => (cs.length ? cs.map((c) => `${c.label}: ${c.value}${c.href ? ` (${c.href})` : ""}`) : ["None left."]);
const contactsHtml = (cs: Contact[]) =>
  cs.length
    ? cs
        .map(
          (c) =>
            `<div style="margin:0 0 4px">${esc(c.label)}: ${
              c.href ? `<a href="${esc(c.href)}" style="color:${ACCENT};font-weight:600;text-decoration:none">${esc(c.value)}</a>` : esc(c.value)
            }</div>`,
        )
        .join("")
    : `<span style="color:#78716c">None left.</span>`;

/** A labelled block of the email body. `html` must already be escaped. */
const section = (label: string, html: string) =>
  `<tr><td style="padding:0 28px 18px"><div style="font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#a8a29e;margin:0 0 6px">${esc(label)}</div><div style="font-size:15px;line-height:1.55;color:#1c1917">${html}</div></td></tr>`;

const button = (href: string, label: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="display:inline-table;margin:0 8px 8px 0"><tr><td bgcolor="${ACCENT}" style="border-radius:10px"><a href="${esc(href)}" target="_blank" style="display:inline-block;padding:11px 20px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:10px">${esc(label)}</a></td></tr></table>`;

function layout(o: { kind: string; title: string; preheader: string; sections: string[]; buttons: string[]; footer: string }) {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(o.title)}</title></head>
<body style="margin:0;padding:0;background:#f5f5f4">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(o.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f5f4"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
<tr><td bgcolor="${ACCENT}" style="height:6px;line-height:6px;font-size:0">&nbsp;</td></tr>
<tr><td style="padding:24px 28px 6px"><div style="font-size:13px;font-weight:700;color:${ACCENT};letter-spacing:.04em;text-transform:uppercase">Stellar · ${esc(o.kind)}</div><h1 style="margin:6px 0 18px;font-size:20px;line-height:1.35;color:#1c1917">${esc(o.title)}</h1></td></tr>
${o.sections.join("\n")}
<tr><td style="padding:4px 28px 20px">${o.buttons.join("")}</td></tr>
<tr><td style="padding:14px 28px 22px;border-top:1px solid #e7e5e4;font-size:12px;line-height:1.5;color:#a8a29e">${o.footer}</td></tr>
</table></td></tr></table></body></html>`;
}

interface Attachment {
  filename: string;
  content: string;
  content_type?: string;
  content_id?: string;
}

/** POSTs to Resend. Returns the HTTP status (0 = network error, null = email not configured). Never throws. */
async function send(tag: string, mail: { subject: string; html: string; text: string; attachments?: Attachment[] }): Promise<number | null> {
  if (!KEY || !TO.length) return null;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: TO, ...mail, subject: mail.subject.replace(/[\r\n]+/g, " ").slice(0, 200) }),
      cache: "no-store",
    });
    if (!res.ok) console.error(`[${tag}] email not sent: Resend ${res.status} ${(await res.text()).slice(0, 300)}`);
    return res.status;
  } catch (e) {
    console.error(`[${tag}] email not sent:`, e);
    return 0;
  }
}

export async function emailSupportRequest(req: SupportRequest, image: { bytes: Uint8Array; ext: string } | null, origin: string) {
  const contacts = contactsOf(req);
  const firstLine = req.message.split("\n")[0].slice(0, 70);
  const admin = `${origin}/admin`;
  const cid = "screenshot";

  const text = [
    req.message,
    "",
    "— Contacts —",
    ...contactsText(contacts),
    "",
    image ? "Screenshot attached." : "No screenshot.",
    `Request ${req.id} · ${when(req.at)}`,
    `Support list: ${admin}`,
  ].join("\n");

  const html = layout({
    kind: "Support request",
    title: firstLine,
    preheader: req.message.slice(0, 120),
    sections: [
      section("Message", escMultiline(req.message)),
      section("Contacts", contactsHtml(contacts)),
      section(
        "Screenshot",
        image
          ? `<img src="cid:${cid}" alt="Screenshot" width="544" style="display:block;width:100%;max-width:544px;height:auto;border:1px solid #e7e5e4;border-radius:10px">`
          : `<span style="color:#78716c">No screenshot.</span>`,
      ),
    ],
    buttons: [button(admin, "Open Support list")],
    footer: `Request ${esc(req.id)} · ${esc(when(req.at))}`,
  });

  return send("support", {
    subject: `Stellar support: ${firstLine}`,
    html,
    text,
    attachments: image
      ? [{ filename: `screenshot.${image.ext}`, content: Buffer.from(image.bytes).toString("base64"), content_type: MIME[image.ext], content_id: cid }]
      : undefined,
  });
}

/** Plain text of the question prompt: tags stripped, common entities decoded, whitespace collapsed. */
const plain = (s: string) =>
  s
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

export async function emailReport(r: Report, origin: string) {
  const q = getQuestionsByIds([r.qid])[0];
  const reason = REPORT_REASONS[r.reason] ?? r.reason;
  const sectionName = q?.section === "math" ? "Math" : "R&W";
  const n = q ? Number(q.id.split("-")[1]) : null;
  const name = q ? `${sectionName} #${n}` : r.qid;
  const skill = q ? (getSkill(q.skill)?.name ?? q.skill) : "";
  // R&W prompts are generic ("Which choice…"), so lead with the start of the passage.
  const passage = q?.passage ? plain(q.passage) : "";
  const snippet = q ? `${passage ? `${passage.slice(0, 220)}${passage.length > 220 ? "…" : ""} ` : ""}${plain(q.prompt)}`.slice(0, 300) : "";
  const answer = q ? (q.type === "mcq" ? q.answer : q.answer.join(" or ")) : "";
  const link = q ? `${origin}/practice?section=${q.section}&q=${n}` : null;
  const admin = `${origin}/admin`;
  const contacts = contactsOf(r);

  const text = [
    `${reason} — ${name}${skill ? ` · ${skill}` : ""}`,
    "",
    r.note ? r.note : "(no note)",
    "",
    "— Question —",
    q ? `${snippet}${snippet.length >= 300 ? "…" : ""}` : "Question not found in the bank.",
    q ? `Answer key: ${answer}` : "",
    link ? `Open: ${link}` : "",
    "",
    "— Contacts —",
    ...contactsText(contacts),
    "",
    `Reported ${when(r.at)}`,
    `Support list: ${admin}`,
  ]
    .filter((l, i, a) => l !== "" || a[i - 1] !== "")
    .join("\n");

  const html = layout({
    kind: "Question report",
    title: `${reason} · ${name}`,
    preheader: r.note || reason,
    sections: [
      section("Reason", `<span style="color:${ACCENT};font-weight:700">${esc(reason)}</span>`),
      section("Note", r.note ? escMultiline(r.note) : `<span style="color:#78716c">No note.</span>`),
      section(
        q ? `Question · ${name}${skill ? ` · ${skill}` : ""}` : "Question",
        q
          ? `<div style="background:#fafaf9;border:1px solid #e7e5e4;border-radius:10px;padding:12px 14px;font-size:14px">${esc(snippet)}${snippet.length >= 300 ? "…" : ""}<div style="margin-top:8px;font-weight:700">Answer key: ${esc(answer)}</div></div>`
          : `${esc(r.qid)} <span style="color:#78716c">(not found in the bank)</span>`,
      ),
      section("Contacts", contactsHtml(contacts)),
    ],
    buttons: [...(link ? [button(link, "Open the question")] : []), button(admin, "Open Support list")],
    footer: `${esc(r.qid)} · reported ${esc(when(r.at))}`,
  });

  return send("report", { subject: `Stellar report: ${reason} · ${name}`, html, text });
}
