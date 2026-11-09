export const THEME_KEY = "stellar:theme";

/**
 * Inline (pre-paint) script: applies the saved theme, or the system preference if none was chosen,
 * as <html data-theme="light|dark">.
 */
export const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem("${THEME_KEY}");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";var d=document.documentElement;d.dataset.theme=t;d.style.colorScheme=t}catch(e){}`;
