document.addEventListener('DOMContentLoaded', () => {
	// Sidebar Menu Toggle
	const menuButton = document.querySelector('.sidebar__menu__button');
	const sidebarMenu = document.querySelector('.sidebar__menu__wrapper');
	if (menuButton && sidebarMenu) {
		menuButton.addEventListener('click', () => {
			menuButton.classList.toggle('sidebar__menu__button--open');
			sidebarMenu.classList.toggle('sidebar__menu__wrapper--open');
		});
		menuButton.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				menuButton.click();
			}
		});
	}

	//hero-Slider
	var sliderBgSetting = document.querySelectorAll(".slide-bg-image");
	sliderBgSetting.forEach(function(el) {
		const bg = el.getAttribute("data-background");
		if (bg) {
			el.style.backgroundImage = `url(${bg})`;
		}
	});

	// Delay Swiper init slightly to ensure DOM is ready260101000001052
	window.addEventListener("load", function() {
		const swiperOptions = {
			loop: true,
			speed: 2000,
			grabCursor: false,
			parallax: true,
			watchSlidesProgress: true,
			autoplay: {
				delay: 15000,
				disableOnInteraction: false,
			},
			pagination: {
				el: ".swiper-pagination",
				clickable: true,
			},
			mousewheel: {
				invert: true,
				sensitivity: 1,
			},
			navigation: {
				nextEl: ".swiper-button-next",
				prevEl: ".swiper-button-prev",
			},
			on: {
				init: function() {
					this.autoplay.start(); // ensure autoplay is triggered correctly
				},
			}
		};

		// Now init Swiper after everything is set
		const swiper = new Swiper(".swiper-container", swiperOptions);
	});

	//products
	const machineSwiper = new Swiper('.mySwiper', {
		loop: true,
		autoplay: {
			delay: 3500,
			disableOnInteraction: false
		},
		slidesPerView: 1,
		spaceBetween: 20,
		breakpoints: {
			768: {
				slidesPerView: 2,
			},
			1024: {
				slidesPerView: 3,
			}
		},
		grabCursor: true,
		centeredSlides: false,
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},
		navigation: {
			nextEl: '#nextBtn', // <-- your custom button ID
			prevEl: '#prevBtn', // <-- your custom button ID
		}
	});

	// Navigation Blob Effect
	const blob = document.getElementById('blob');
	let activeItem = null;

	if (blob) {
		const navItems = document.querySelectorAll('nav ul li:not(#blob)');
		activeItem = document.querySelector('nav ul .active') || navItems[0];

		function animateBlob(from, to) {
			const blobRect = blob.getBoundingClientRect();
			const fromRect = from.getBoundingClientRect();
			const toRect = to.getBoundingClientRect();

			const parentRect = blob.parentElement.getBoundingClientRect();

			blob.animate(
				[{
						left: `${blob.offsetLeft}px`,
						top: `${blob.offsetTop}px`,
						width: `${blob.offsetWidth}px`,
						height: `${blob.offsetHeight}px`
					},
					{
						left: `${to.offsetLeft}px`,
						top: `${to.offsetTop}px`,
						width: `${to.clientWidth}px`,
						height: `${to.clientHeight}px`
					}
				], {
					duration: 400,
					easing: 'cubic-bezier(0.87, 0, 0.13, 1)',
					fill: 'forwards'
				}
			);
		}

		navItems.forEach((item) => {
			item.addEventListener('click', () => {
				navItems.forEach((nav) => nav.classList.remove('active'));
				item.classList.add('active');
				animateBlob(blob, item);
				activeItem = item;
			});

			item.addEventListener('mouseover', () => animateBlob(blob, item));
			item.addEventListener('mouseout', () => animateBlob(blob, activeItem));
		});

		// Initial blob position (animated on load)
		window.addEventListener('load', () => {
			animateBlob(blob, activeItem);
		});
	}

	// Deal Product Slider
	const dealSwiper = new Swiper('.deal-product-swiper', {
		loop: true,
		speed: 1000,
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
		breakpoints: {
			0: {
				slidesPerView: 1
			},
			480: {
				slidesPerView: 1
			},
			768: {
				slidesPerView: 1
			},
			992: {
				slidesPerView: 1
			},
			1200: {
				slidesPerView: 1
			},
		},
	});

	// Brand Logos Slider
	const brandSwiper = new Swiper('.brand-swiper', {
		slidesPerView: 'auto',
		spaceBetween: 60,
		loop: true,
		speed: 4000,
		autoplay: {
			delay: 0,
			disableOnInteraction: false
		},
		allowTouchMove: false,
	});

	// Footer Year
	const footerYearElement = document.getElementById('footer-year');
	if (footerYearElement) {
		const currentYear = new Date().getFullYear();
		const companyName = 'NEOSPACE INTEGRALS';
		footerYearElement.innerHTML = `© ${currentYear} ${companyName}`;
	}

	// WhatsApp Chat Toggle
	const whatsappBtn = document.getElementById('whatsapp-btn');
	const chatPopup = document.getElementById('chat-popup');
	const agentOptions = document.querySelectorAll('.agent-option');

	if (whatsappBtn && chatPopup) {
		whatsappBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			const isActive = whatsappBtn.classList.toggle('active');
			chatPopup.classList.toggle('show', isActive);
			if (isActive) {
				agentOptions.forEach((option) => {
					option.style.animation = 'none';
					option.offsetHeight;
					option.style.animation = '';
				});
			}
		});

		agentOptions.forEach((option) => {
			option.addEventListener('click', () => {
				chatPopup.classList.remove('show');
				whatsappBtn.classList.remove('active');
			});
		});
	}

	// Debounce function to limit resize event frequency
	function debounce(func, wait) {
		let timeout;
		return function executedFunction(...args) {
			const later = () => {
				clearTimeout(timeout);
				func(...args);
			};
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
		};
	}

	// Handle resize (without GSAP ScrollSmoother)
	const handleResize = debounce(() => {
		if (blob && activeItem) {
			updateBlob();
		}
	}, 100);

	window.addEventListener('resize', handleResize);
});

// FAQ
function initFaq() {
	document.querySelectorAll('.accordion-header').forEach(header => {
		header.addEventListener('click', () => {
			const accordion = header.parentElement;
			const isActive = accordion.classList.contains('active');
			const content = accordion.querySelector('.accordion-content');

			// Defensive: Only proceed if content exists
			if (!content) return;

			// Close all accordions
			document.querySelectorAll('.accordion').forEach(acc => {
				acc.classList.remove('active');
				const accContent = acc.querySelector('.accordion-content');
				if (accContent) accContent.style.maxHeight = null;
			});

			// Open the clicked accordion
			if (!isActive) {
				accordion.classList.add('active');
				content.style.maxHeight = content.scrollHeight + 'px';
			}
		});
	});
}
document.addEventListener('DOMContentLoaded', initFaq);

// sidebar
$(".right-sidebar-button").on("click", function() {
	$(".right-sidebar-menu").addClass("show-right-menu");
});
$(".right-sidebar-close-btn").on("click", function() {
	$(".right-sidebar-menu").removeClass("show-right-menu");
});

$(".menu-btn").on("click", function() {
	$(".sidebar-menu").addClass("active");
});
$(".sidebar-menu-close").on("click", function() {
	$(".sidebar-menu").removeClass("active");
});

// wow js
jQuery(window).on("load", function() {
	window.wow = new WOW({
		boxClass: "wow",
		animateClass: "animate__animated",
		offset: 80,
		mobile: true,
		live: true
	});
	window.wow.init();
});
//product-modal
//grid-item-viewer
document.addEventListener('DOMContentLoaded', () => {
	const gridItems = document.querySelectorAll('.grid-item');
	const modals = document.querySelectorAll('.modal');
	let activeModal = null;

	// Open modal
	const openModal = (modal) => {
		modal.classList.add('active');
		document.body.classList.add('modal-open');
		activeModal = modal;
		modal.querySelector('.modal-text-container')?.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	};

	// Close modal
	const closeModal = (modal) => {
		modal.classList.remove('active');
		document.body.classList.remove('modal-open');
		activeModal = null;
	};

	// Grid item click handler
	gridItems.forEach(item => {
		item.addEventListener('click', () => {
			const modalId = item.dataset.modal;
			const modal = document.getElementById(modalId);
			if (modal) openModal(modal);
		});

		// Optimized hover effects
		let isHovering = false;
		item.addEventListener('mouseenter', () => {
			isHovering = true;
		});
		item.addEventListener('mouseleave', () => {
			isHovering = false;
			item.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
		});
		item.addEventListener('mousemove', (e) => {
			if (!isHovering) return;
			const rect = item.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;
			const centerX = rect.width / 2;
			const centerY = rect.height / 2;
			const rotateX = (y - centerY) / 15;
			const rotateY = (centerX - x) / 15;
			item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
		});
	});
	// Close button and overlay click handlers
	modals.forEach(modal => {
		const closeBtn = modal.querySelector('.close-btn1');
		closeBtn.addEventListener('click', () => closeModal(modal));
		modal.addEventListener('click', (e) => {
			if (e.target === modal) closeModal(modal);
		});
	});
	// Keyboard navigation
	document.addEventListener('keydown', (e) => {
		if (!activeModal) return;
		const currentIndex = Array.from(modals).findIndex(m => m === activeModal);
		let nextModal;

		if (e.key === 'Escape') {
			closeModal(activeModal);
		} else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
			e.preventDefault();
			nextModal = modals[(currentIndex + 1) % modals.length];
		} else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
			e.preventDefault();
			nextModal = modals[(currentIndex - 1 + modals.length) % modals.length];
		}

		if (nextModal) {
			closeModal(activeModal);
			setTimeout(() => openModal(nextModal), 200);
		}
	});

	// Touch support
	modals.forEach(modal => {
		const modalContent = modal.querySelector('.modal-content');
		let startX = 0;
		let isSwipe = false;

		modalContent.addEventListener('touchstart', (e) => {
			startX = e.touches[0].clientX;
			isSwipe = false;
		}, {
			passive: true
		});

		modalContent.addEventListener('touchmove', (e) => {
			if (!startX) return;
			const diffX = e.touches[0].clientX - startX;
			if (Math.abs(diffX) > 50) {
				isSwipe = true;
				e.preventDefault();
				const progress = Math.min(Math.abs(diffX) / 200, 1);
				modalContent.style.transform = `scale(${1 - progress * 0.2})`;
				modalContent.style.opacity = 1 - progress * 0.3;
			}
		}, {
			passive: false
		});

		modalContent.addEventListener('touchend', (e) => {
			if (!isSwipe) {
				startX = 0;
				return;
			}
			const diffX = e.changedTouches[0].clientX - startX;
			modalContent.style.transform = '';
			modalContent.style.opacity = '';
			if (Math.abs(diffX) > 100) {
				const currentIndex = Array.from(modals).findIndex(m => m === modal);
				let nextModal;
				if (diffX > 0) {
					nextModal = modals[(currentIndex - 1 + modals.length) % modals.length];
				} else {
					nextModal = modals[(currentIndex + 1) % modals.length];
				}
				closeModal(modal);
				setTimeout(() => openModal(nextModal), 200);
			}
			startX = 0;
			isSwipe = false;
		}, {
			passive: true
		});
	});

	// Image loading
	const images = document.querySelectorAll('.grid-item img, .modal-image img, .content-image img');
	const imageObserver = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				const img = entry.target;
				img.style.filter = 'blur(0px)';
				img.style.opacity = '1';
				imageObserver.unobserve(img);
			}
		});
	}, {
		threshold: 0.1
	});

	images.forEach(img => {
		img.style.filter = 'blur(5px)';
		img.style.opacity = '0.8';

		imageObserver.observe(img);
	});

	// Parallax effect on modal scroll
	modals.forEach(modal => {
		const textContainer = modal.querySelector('.modal-text-container');
		textContainer.addEventListener('scroll', () => {
			const modalImage = modal.querySelector('.modal-image img');
			const scrollTop = textContainer.scrollTop;
			const scrollHeight = textContainer.scrollHeight - textContainer.clientHeight;
			const scrollPercent = scrollTop / scrollHeight;
			if (modalImage) {
				modalImage.style.transform = `translateY(${scrollPercent * 20}px) scale(1.05)`;
			}
		});
	});

	// Throttled resize handler
	let resizeTimeout;
	window.addEventListener('resize', () => {
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(() => {
			gridItems.forEach(item => {
				item.style.transform = '';
			});
		}, 150);
	});
});
//Products-card
function updateSelectedProduct(card) {
	const title = card.dataset.title;
	const image = card.dataset.image;
	const description = card.dataset.description;
	const highlights = JSON.parse(card.dataset.highlights);

	const selectedProduct = document.getElementById('selectedProduct');
	const imageElement = document.getElementById('selectedImage');
	const titleElement = document.getElementById('selectedTitle');
	const descriptionElement = document.getElementById('selectedDescription');
	const highlightsList = document.getElementById('selectedHighlights');

	// First, remove the active class to reset animations
	selectedProduct.classList.remove('active');

	// Force reflow to ensure the removal takes effect before re-adding
	void selectedProduct.offsetWidth;

	// Update content
	imageElement.src = image;
	imageElement.alt = title;
	titleElement.textContent = title;
	descriptionElement.textContent = description;

	// Clear and re-add highlights
	highlightsList.innerHTML = ''; // 🔥 clear old highlights

	highlights.forEach((point, i) => {
		const li = document.createElement('li');

		// Add icon
		const icon = document.createElement('i');
		icon.className = 'fa-solid fa-circle-dot';
		icon.style.marginRight = '0.5rem';
		li.appendChild(icon);

		// Add text
		li.appendChild(document.createTextNode(point));

		// Animation styling
		li.style.animationDelay = `${0.3 + i * 0.1}s`;
		li.style.animation = 'fadeUp 0.6s ease forwards';

		highlightsList.appendChild(li);
	});

	// Re-add the active class to trigger animations
	selectedProduct.classList.add('active');

	// Update card active states
	document.querySelectorAll('.product-card').forEach(c => c.classList.remove('active'));
	card.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
	const cards = document.querySelectorAll('.product-card');
	cards.forEach(card => {
		card.addEventListener('click', () => updateSelectedProduct(card));
	});

	// Load default product
	const defaultCard = document.querySelector('.product-card.active') || cards[0];
	if (defaultCard) updateSelectedProduct(defaultCard);
});