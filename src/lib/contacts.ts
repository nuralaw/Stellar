// The student's Telegram / Instagram username, remembered in this browser so the report and support forms
// start filled in. Removed by "Reset all progress" (store.ts).

export interface Contacts {
  telegram: string;
  instagram: string;
}

export const CONTACTS_KEY = "stellar:contacts";

export const CONTACT_ICONS = {
  telegram: "M21 4 3 11l6 2.2L11 20l3.3-4.2 4.7 3.5L21 4ZM9 13.2l9-6.2",
  instagram: "M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3ZM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm5-1.5h.01",
};

export function loadContacts(): Contacts {
  try {
    const v = JSON.parse(localStorage.getItem(CONTACTS_KEY) ?? "{}");
    return { telegram: typeof v.telegram === "string" ? v.telegram : "", instagram: typeof v.instagram === "string" ? v.instagram : "" };
  } catch {
    return { telegram: "", instagram: "" };
  }
}

export function saveContacts(c: Contacts) {
  try {
    localStorage.setItem(CONTACTS_KEY, JSON.stringify({ telegram: c.telegram.trim(), instagram: c.instagram.trim() }));
  } catch {}
}
