export function initMobileNav() {
  const root = document.querySelector('[data-mobile-nav]');
  if (!root) return;

  const toggle = root.querySelector<HTMLButtonElement>('[data-mobile-nav-toggle]');
  const closeBtn = root.querySelector<HTMLButtonElement>('[data-mobile-nav-close]');
  const overlay = root.querySelector<HTMLElement>('[data-mobile-nav-overlay]');
  const drawer = root.querySelector<HTMLElement>('[data-mobile-nav-drawer]');

  if (!toggle || !closeBtn || !overlay || !drawer) return;

  let previouslyFocused: HTMLElement | null = null;

  function setAccordionExpanded(button: HTMLButtonElement, expanded: boolean) {
    const panel = button.closest('[data-nav-accordion]')?.querySelector('[data-accordion-panel]');
    const icon = button.querySelector('[data-accordion-icon]');
    button.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    panel?.classList.toggle('hidden', !expanded);
    icon?.classList.toggle('rotate-180', expanded);
  }

  root.querySelectorAll<HTMLButtonElement>('[data-accordion-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      setAccordionExpanded(button, !expanded);
    });
  });

  function getFocusableElements(): HTMLElement[] {
    return Array.from(
      drawer.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );
  }

  function trapFocus(e: KeyboardEvent) {
    if (e.key !== 'Tab' || drawer.classList.contains('translate-x-full')) return;

    const focusable = getFocusableElements();
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function open() {
    previouslyFocused = document.activeElement as HTMLElement | null;
    toggle.setAttribute('aria-expanded', 'true');
    overlay.classList.remove('opacity-0', 'invisible', 'pointer-events-none');
    overlay.classList.add('opacity-100', 'visible');
    drawer.classList.remove('translate-x-full');
    drawer.classList.add('translate-x-0');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
    document.addEventListener('keydown', onKeydown);
    drawer.addEventListener('keydown', trapFocus);
  }

  function close() {
    toggle.setAttribute('aria-expanded', 'false');
    overlay.classList.add('opacity-0', 'invisible', 'pointer-events-none');
    overlay.classList.remove('opacity-100', 'visible');
    drawer.classList.add('translate-x-full');
    drawer.classList.remove('translate-x-0');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKeydown);
    drawer.removeEventListener('keydown', trapFocus);
    previouslyFocused?.focus();
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') close();
  }

  toggle.addEventListener('click', () => {
    if (toggle.getAttribute('aria-expanded') === 'true') {
      close();
    } else {
      open();
    }
  });

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);

  drawer.querySelectorAll('a[href]').forEach((link) => {
    link.addEventListener('click', close);
  });
}

initMobileNav();
