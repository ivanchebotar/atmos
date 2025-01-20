import '../plugins/initMobileNavPlugin';

// mobile menu init
export function initMobileNav() {
	jQuery('body').mobileNav({
		menuActiveClass: 'nav-active',
		menuOpener: '.nav-opener'
	});
}
