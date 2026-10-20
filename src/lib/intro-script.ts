/** Class the inline <head> script puts on <html> to hide intro targets. */
export const INTRO_PENDING = "intro-pending";

/**
 * Inline script for <head>. It runs before first paint and hides only the
 * elements the intro animates, only on the home page (the only page that
 * mounts the intro) and only for people without reduced motion.
 * Without JS it never runs, so the server HTML stays fully visible. The
 * 2.5s timeout is a failsafe: if the app has not hydrated by then, show
 * everything and skip the intro.
 */
export const INTRO_SCRIPT = `try{if(location.pathname==="/"&&window.matchMedia("(prefers-reduced-motion: no-preference)").matches){var d=document.documentElement;d.classList.add("${INTRO_PENDING}");setTimeout(function(){d.classList.remove("${INTRO_PENDING}")},2500)}}catch(e){}`;
