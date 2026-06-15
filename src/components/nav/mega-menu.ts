export function initMegaMenus() {
  document.querySelectorAll('[data-mega-menu]').forEach((menu) => {
    const trigger = menu.querySelector('[data-mega-trigger]');
    if (!trigger) return;

    function setExpanded(expanded: boolean) {
      trigger.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    }

    menu.addEventListener('mouseenter', () => setExpanded(true));
    menu.addEventListener('mouseleave', () => setExpanded(false));
    menu.addEventListener('focusin', () => setExpanded(true));
    menu.addEventListener('focusout', (e) => {
      if (!menu.contains(e.relatedTarget as Node)) setExpanded(false);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.matches(':hover, :focus-within')) {
        setExpanded(false);
        (trigger as HTMLElement).focus();
      }
    });
  });
}

initMegaMenus();
