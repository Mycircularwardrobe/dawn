class DetailsDisclosure extends HTMLElement {
  constructor() {
    super();
    this.mainDetailsToggle = this.querySelector('details');
    this.content = this.mainDetailsToggle.querySelector('summary').nextElementSibling;

    this.mainDetailsToggle.addEventListener('focusout', this.onFocusOut.bind(this));
    this.mainDetailsToggle.addEventListener('toggle', this.onToggle.bind(this));
  }

  onFocusOut() {
    setTimeout(() => {
      if (!this.contains(document.activeElement)) this.close();
    });
  }

  onToggle() {
    if (!this.animations) this.animations = this.content.getAnimations();

    if (this.mainDetailsToggle.hasAttribute('open')) {
      this.animations.forEach((animation) => animation.play());
    } else {
      this.animations.forEach((animation) => animation.cancel());
    }
  }

  close() {
    this.mainDetailsToggle.removeAttribute('open');
    this.mainDetailsToggle.querySelector('summary').setAttribute('aria-expanded', false);
  }
}

customElements.define('details-disclosure', DetailsDisclosure);

class HeaderMenu extends DetailsDisclosure {
  constructor() {
    super();
    this.header = document.querySelector('.header-wrapper');

    // Open on hover and close shortly after the pointer leaves (mouse users only; keyboard and touch keep click behaviour)
    this.hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    this.addEventListener('mouseenter', this.onHoverIn.bind(this));
    this.addEventListener('mouseleave', this.onHoverOut.bind(this));
    this.mainDetailsToggle.querySelector('summary').addEventListener('click', (event) => {
      if (this.hoverQuery.matches && event.detail > 0) event.preventDefault();
    });
  }

  onHoverIn() {
    if (!this.hoverQuery.matches) return;
    clearTimeout(this.hoverTimeout);
    document.querySelectorAll('header-menu').forEach((menu) => {
      if (menu !== this && menu.mainDetailsToggle.hasAttribute('open')) menu.close();
    });
    if (!this.mainDetailsToggle.hasAttribute('open')) {
      this.mainDetailsToggle.setAttribute('open', '');
      this.mainDetailsToggle.querySelector('summary').setAttribute('aria-expanded', true);
    }
  }

  onHoverOut() {
    if (!this.hoverQuery.matches) return;
    clearTimeout(this.hoverTimeout);
    this.hoverTimeout = setTimeout(() => this.close(), 200);
  }

  onToggle() {
    if (!this.header) return;
    this.header.preventHide = this.mainDetailsToggle.open;

    if (document.documentElement.style.getPropertyValue('--header-bottom-position-desktop') !== '') return;
    document.documentElement.style.setProperty(
      '--header-bottom-position-desktop',
      `${Math.floor(this.header.getBoundingClientRect().bottom)}px`
    );
  }
}

customElements.define('header-menu', HeaderMenu);
