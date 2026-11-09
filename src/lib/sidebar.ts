export const SIDEBAR_KEY = "stellar:sidebar";

/** Inline (pre-paint) script that restores the collapsed sidebar state from localStorage. */
export const SIDEBAR_INIT_SCRIPT = `try{if(localStorage.getItem("${SIDEBAR_KEY}")==="collapsed")document.documentElement.dataset.sidebar="collapsed"}catch(e){}`;
