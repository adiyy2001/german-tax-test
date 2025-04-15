// Wrap code in an IIFE (Immediately Invoked Function Expression)
// to avoid polluting the global scope and ensure 'use strict' context.
(function() {
    'use strict';

    /**
     * -------------------------------------
     * Configuration & Constants
     * -------------------------------------
     */
    const config = {
        // Class added to header when scrolled
        scrolledHeaderClass: 'scrolled',
        // Offset in pixels before adding scrolled class
        scrollOffset: 50,
        // Class for mobile menu toggle button
        navToggleSelector: '.nav-toggle',
        // Class for the navigation list (mobile menu)
        navListSelector: '.nav-list',
        // Class added to nav list when open
        navOpenClass: 'is-open',
        // Class added to body when nav is open to prevent scrolling
        bodyNavOpenClass: 'nav-open-no-scroll',
        // Selector for navigation links (for smooth scroll & active state)
        navLinkSelector: '.nav-link',
        // Selector for sections to track for active nav state
        scrollSpySectionSelector: 'main > section[id]',
        // Class added to the active navigation link
        activeNavLinkClass: 'active',
        // Offset for scroll spy activation (adjust based on sticky header height)
        scrollSpyOffset: 100, // Pixels
        // Selector for elements to animate on scroll
        scrollRevealSelector: '.reveal-on-scroll',
        // Class added when element is visible in viewport
        scrollRevealVisibleClass: 'is-visible',
        // Intersection Observer threshold for scroll reveal (0 to 1)
        scrollRevealThreshold: 0.15,
        // Selector for the "Rozlicz się" form
        settleFormSelector: '#settle-form',
        // Selector for the message area in the settle form
        settleFormMessageSelector: '#settle-form-message',
        // Selector for the contact form
        contactFormSelector: '#contact-form',
        // Selector for the message area in the contact form
        contactFormMessageSelector: '#contact-form-message',
        // Selector for the link that opens the privacy policy modal
        privacyModalLinkSelector: '#privacy-policy-link',
        // Selector for the privacy policy modal itself
        privacyModalSelector: '#privacy-policy-modal',
        // Selector for the close button within the modal
        modalCloseSelector: '.modal-close',
        // Selector for the copyright year span
        currentYearSelector: '#current-year',
        // Selector for skip links (to potentially hide on interaction)
        skipLinkSelector: '.skip-link',
    };

    /**
     * -------------------------------------
     * DOM Ready Execution
     * -------------------------------------
     * Waits for the HTML to be fully parsed before running scripts.
     */
    document.addEventListener('DOMContentLoaded', () => {
        console.log('German Tax Website Initializing...'); // Debug message

        try {
            initStickyHeader();
            initMobileNavigation();
            initSmoothScroll();
            initScrollSpy();
            initScrollReveal();
            initSettleForm();
            initContactForm();
            initPrivacyModal();
            updateCopyrightYear();
            // initSkipLinkFocusManagement(); // Optional: enhance skip links

            console.log('German Tax Website Initialization Complete.'); // Debug message
        } catch (error) {
            console.error("Error during initialization:", error);
            // Optionally display a user-friendly error message on the page
        }
    });

    /**
     * -------------------------------------
     * Feature Initializations
     * -------------------------------------
     */

    /**
     * Adds/Removes a class to the header when the page is scrolled.
     */
    function initStickyHeader() {
        const header = document.querySelector('.site-header');
        if (!header) {
            console.warn("Sticky header element not found.");
            return;
        }

        const handleScroll = () => {
            if (window.scrollY > config.scrollOffset) {
                header.classList.add(config.scrolledHeaderClass);
            } else {
                header.classList.remove(config.scrolledHeaderClass);
            }
        };

        // Initial check in case the page loads already scrolled
        handleScroll();

        // Add scroll event listener
        window.addEventListener('scroll', debounce(handleScroll, 10)); // Debounce for performance
        console.log("Sticky Header initialized.");
    }

    /**
     * Handles the mobile navigation toggle and menu behavior.
     */
    function initMobileNavigation() {
        const navToggle = document.querySelector(config.navToggleSelector);
        const navList = document.querySelector(config.navListSelector);

        if (!navToggle || !navList) {
            console.warn("Mobile navigation elements not found.");
            return;
        }

        const toggleMenu = () => {
            const isOpen = navList.classList.contains(config.navOpenClass);
            navList.classList.toggle(config.navOpenClass);
            navToggle.setAttribute('aria-expanded', !isOpen);
            document.body.classList.toggle(config.bodyNavOpenClass, !isOpen); // Toggle body class
            console.log(`Mobile menu toggled: ${!isOpen ? 'Open' : 'Closed'}`);
        };

        navToggle.addEventListener('click', toggleMenu);

        // Close menu when a nav link is clicked (useful for one-page sites)
        navList.addEventListener('click', (event) => {
            if (event.target.matches(config.navLinkSelector)) {
                if (navList.classList.contains(config.navOpenClass)) {
                    toggleMenu(); // Close the menu
                }
            }
        });

        // Close menu if clicked outside the nav list or toggle button
        document.addEventListener('click', (event) => {
             if (!navList.contains(event.target) && !navToggle.contains(event.target)) {
                 if (navList.classList.contains(config.navOpenClass)) {
                    toggleMenu(); // Close the menu
                }
             }
        });

        // Close menu on 'Escape' key press
         document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && navList.classList.contains(config.navOpenClass)) {
                toggleMenu();
            }
        });

        console.log("Mobile Navigation initialized.");
    }

    /**
     * Implements smooth scrolling for anchor links within the page.
     */
    function initSmoothScroll() {
        const links = document.querySelectorAll(`a[href^="#"]:not([href="#"]):not([href="#${config.privacyModalSelector.substring(1)}"])`); // Exclude empty hash and modal link

        links.forEach(link => {
            link.addEventListener('click', function(event) {
                const targetId = this.getAttribute('href');
                // Check if it's a valid internal link
                if (targetId.length > 1 && targetId.startsWith('#')) {
                    const targetElement = document.querySelector(targetId);

                    if (targetElement) {
                        event.preventDefault(); // Prevent default jump
                        console.log(`Smooth scrolling to: ${targetId}`);

                        const headerOffset = document.querySelector('.site-header')?.offsetHeight || 0; // Get header height dynamically
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 20; // Adjust offset (e.g., 20px extra space)

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });

                        // Optionally update URL hash without jump
                        // history.pushState(null, null, targetId);

                        // Set focus to the target element for accessibility after scroll
                        setTimeout(() => {
                             targetElement.setAttribute('tabindex', '-1'); // Make it focusable
                             targetElement.focus({ preventScroll: true }); // Set focus without scrolling again
                             // Optionally remove tabindex after a delay if not needed permanently
                             // setTimeout(() => targetElement.removeAttribute('tabindex'), 1000);
                        }, 800); // Adjust delay based on scroll duration


                    } else {
                        console.warn(`Smooth scroll target element not found for href: ${targetId}`);
                    }
                }
            });
        });
        console.log("Smooth Scroll initialized.");
    }

    /**
     * Highlights the active navigation link based on scroll position (Scroll Spy).
     */
    function initScrollSpy() {
        const sections = document.querySelectorAll(config.scrollSpySectionSelector);
        const navLinks = document.querySelectorAll(`${config.navListSelector} ${config.navLinkSelector}[href^="#"]`); // Only internal links

        if (sections.length === 0 || navLinks.length === 0) {
            console.warn("Scroll Spy elements (sections or nav links) not found.");
            return;
        }

        const activateNavLink = (id) => {
            navLinks.forEach(link => {
                link.classList.remove(config.activeNavLinkClass);
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add(config.activeNavLinkClass);
                    // Optionally update ARIA current state
                    link.setAttribute('aria-current', 'page');
                } else {
                     link.removeAttribute('aria-current');
                }
            });
             // console.log(`Scroll Spy activated link for section: #${id}`);
        };

        const handleScrollSpy = () => {
            let currentSectionId = null;
            const scrollPosition = window.pageYOffset + config.scrollSpyOffset;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    currentSectionId = section.getAttribute('id');
                }
            });

            // Handle edge case: if scrolled past the last section
             const lastSection = sections[sections.length - 1];
             if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 50) { // Near bottom of page
                  currentSectionId = lastSection.getAttribute('id');
             }

            // Handle edge case: scrolled to the very top
            if (window.pageYOffset < sections[0].offsetTop - config.scrollSpyOffset) {
                currentSectionId = null; // No section active at the top
            }


            if (currentSectionId) {
                activateNavLink(currentSectionId);
            } else {
                 // No section is active, remove active class from all
                 navLinks.forEach(link => {
                     link.classList.remove(config.activeNavLinkClass);
                     link.removeAttribute('aria-current');
                 });
            }
        };

        // Initial check
        handleScrollSpy();

        // Add scroll event listener
        window.addEventListener('scroll', debounce(handleScrollSpy, 50)); // Debounce frequently called handler

        console.log("Scroll Spy initialized.");
    }

    /**
     * Reveals elements as they enter the viewport using Intersection Observer.
     */
    function initScrollReveal() {
        const elementsToReveal = document.querySelectorAll(config.scrollRevealSelector);

        if (elementsToReveal.length === 0) {
            console.info("No elements found for scroll reveal.");
            return;
        }

        if (!('IntersectionObserver' in window)) {
            console.warn("IntersectionObserver not supported. Scroll reveal animations disabled.");
            // Fallback: Make all elements visible immediately
            elementsToReveal.forEach(el => el.classList.add(config.scrollRevealVisibleClass));
            return;
        }

        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(config.scrollRevealVisibleClass);
                    // Optional: Unobserve after reveal for performance
                    observer.unobserve(entry.target);
                    // console.log(`Revealed element: `, entry.target.id || entry.target.classList[0]);
                }
                // Note: No need to remove the class if you want the animation only once
            });
        };

        const observerOptions = {
            root: null, // Use the viewport as the root
            rootMargin: '0px',
            threshold: config.scrollRevealThreshold // Percentage of element visibility needed
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        elementsToReveal.forEach(el => observer.observe(el));

        console.log("Scroll Reveal initialized for", elementsToReveal.length, "elements.");
    }

    /**
     * Handles the "Rozlicz się" form submission (client-side simulation).
     */
    function initSettleForm() {
        const form = document.querySelector(config.settleFormSelector);
        const messageArea = document.querySelector(config.settleFormMessageSelector);

        if (!form || !messageArea) {
            console.warn("Settle form elements not found.");
            return;
        }

        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent actual form submission
            console.log("Settle form submitted (simulation).");

            // Basic Validation (HTML5 required should handle most)
            if (!form.checkValidity()) {
                displayFormMessage(messageArea, 'Proszę wypełnić wszystkie wymagane pola.', 'error');
                // Optionally trigger browser's default validation UI
                 form.reportValidity();
                return;
            }

            // --- Simulation Logic ---
            // In a real app, you would gather data and send it via AJAX.
            // Here, we just simulate success.

            const formData = new FormData(form);
            // Example: Log form data to console
            console.log("Settle Form Data:");
            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }

            // Display success message
            displayFormMessage(messageArea, 'Dane wstępne przyjęte! Zostaniesz przekierowany do kroku 2 (dołączanie dokumentów). W tym demo proces kończy się tutaj.', 'success');

            // Optionally disable the form or button after submission
            form.querySelector('button[type="submit"]').disabled = true;
            form.querySelector('button[type="submit"]').textContent = 'Przetwarzanie...';

            // Simulate further action (e.g., redirect or showing next step)
            setTimeout(() => {
                // Reset button state for demo purposes if needed
                // form.querySelector('button[type="submit"]').disabled = false;
                // form.querySelector('button[type="submit"]').textContent = 'Przejdź do Kroku 2 (Wysłanie Danych)';
                // form.reset(); // Optionally reset the form
                console.log("Simulating transition to Step 2...");
                // In a real multi-step form, you'd hide this step and show the next.
            }, 3000); // Delay for 3 seconds
        });

        console.log("Settle Form initialized.");
    }

    /**
     * Handles the contact form submission (client-side simulation).
     */
    function initContactForm() {
        const form = document.querySelector(config.contactFormSelector);
        const messageArea = document.querySelector(config.contactFormMessageSelector);

        if (!form || !messageArea) {
            console.warn("Contact form elements not found.");
            return;
        }

        form.addEventListener('submit', function(event) {
            event.preventDefault();
            console.log("Contact form submitted (simulation).");

            if (!form.checkValidity()) {
                displayFormMessage(messageArea, 'Proszę wypełnić wszystkie wymagane pola i wyrazić zgodę.', 'error');
                 form.reportValidity();
                return;
            }

            // --- Simulation ---
            const formData = new FormData(form);
            const name = formData.get('contact_name');
            const email = formData.get('contact_email');
            const message = formData.get('contact_message');

            // Display temporary processing message
             displayFormMessage(messageArea, 'Wysyłanie wiadomości...', 'processing'); // Use a neutral style for processing
             form.querySelector('button[type="submit"]').disabled = true;


            // Simulate sending data (replace with actual AJAX call)
            // In this demo, we'll just show success after a short delay
            // Or prepare a mailto link
            console.log("Contact Form Data:", { name, email, message });

            setTimeout(() => {
                displayFormMessage(messageArea, `Dziękujemy ${escapeHTML(name)}! Twoja wiadomość została wysłana (symulacja). Odpowiemy wkrótce.`, 'success');
                form.reset(); // Clear the form
                form.querySelector('button[type="submit"]').disabled = false; // Re-enable button
            }, 1500); // Simulate network delay

             // --- Alternative: Prepare mailto link ---
             /*
             const subject = "Zapytanie ze strony German Tax";
             const body = `Imię i nazwisko: ${name}\nEmail: ${email}\nTelefon: ${formData.get('contact_phone') || 'Nie podano'}\n\nWiadomość:\n${message}`;
             const mailtoLink = `mailto:kontakt@german-tax.pl?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
             // Instead of showing success, you could open the mail client:
             // window.location.href = mailtoLink;
             // displayFormMessage(messageArea, 'Proszę sprawdzić klienta poczty e-mail, aby wysłać wiadomość.', 'success');
             // form.reset();
             // form.querySelector('button[type="submit"]').disabled = false;
             */
        });

        console.log("Contact Form initialized.");
    }

    /**
     * Handles opening and closing the privacy policy modal.
     */
    function initPrivacyModal() {
        const modalLink = document.querySelector(config.privacyModalLinkSelector);
        const modal = document.querySelector(config.privacyModalSelector);
        const closeButtons = modal ? modal.querySelectorAll(config.modalCloseSelector) : [];

        if (!modalLink || !modal || closeButtons.length === 0) {
            console.warn("Privacy policy modal elements not found.");
            return;
        }

        const openModal = (event) => {
            event.preventDefault(); // Prevent link navigation if it's an anchor
            console.log("Opening privacy modal.");
            modal.hidden = false;
            // Trap focus inside the modal
            trapFocus(modal);
            // Optional: Add class to body to prevent background scroll
             document.body.style.overflow = 'hidden';
        };

        const closeModal = () => {
            console.log("Closing privacy modal.");
            modal.hidden = true;
             document.body.style.overflow = ''; // Restore scroll
             // Return focus to the element that opened the modal
             modalLink.focus();
        };

        modalLink.addEventListener('click', openModal);

        closeButtons.forEach(button => {
            button.addEventListener('click', closeModal);
        });

        // Close modal on backdrop click
        modal.addEventListener('click', (event) => {
            if (event.target === modal) { // Check if the click was directly on the backdrop
                closeModal();
            }
        });

        // Close modal on 'Escape' key press
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !modal.hidden) {
                closeModal();
            }
        });

        console.log("Privacy Modal initialized.");
    }

    /**
     * Updates the copyright year in the footer.
     */
    function updateCopyrightYear() {
        const yearSpan = document.querySelector(config.currentYearSelector);
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
            console.log("Copyright year updated.");
        } else {
             console.warn("Copyright year span not found.");
        }
    }

    /**
    * Optional: Hides skip links after they lose focus if user interacts with page.
    * Improves visual cleanliness after initial navigation aid.
    */
   /*
   function initSkipLinkFocusManagement() {
       const skipLinks = document.querySelectorAll(config.skipLinkSelector);
       if (skipLinks.length === 0) return;

       let hasInteracted = false;

       const hideSkipLinks = () => {
           if (hasInteracted) {
               skipLinks.forEach(link => {
                   // Check if the link itself or its target has focus
                    const targetElement = document.querySelector(link.getAttribute('href'));
                    if (document.activeElement !== link && document.activeElement !== targetElement) {
                         link.style.top = '-10em'; // Hide it again
                    }
               });
           }
       };

       // Mark interaction on first scroll or click anywhere
       const markInteraction = () => {
           hasInteracted = true;
           window.removeEventListener('scroll', markInteraction, { once: true });
           document.body.removeEventListener('click', markInteraction, { once: true });
       };

       window.addEventListener('scroll', markInteraction, { once: true });
       document.body.addEventListener('click', markInteraction, { once: true });

       // Check on blur from skip links
       skipLinks.forEach(link => {
           link.addEventListener('blur', () => {
               // Use a small delay to allow focus to shift to the target
               setTimeout(hideSkipLinks, 50);
           });
       });

        console.log("Skip Link Focus Management initialized.");
   }
   */


    /**
     * -------------------------------------
     * Utility Functions
     * -------------------------------------
     */

    /**
     * Debounce function to limit the rate at which a function can fire.
     * @param {Function} func - The function to debounce.
     * @param {number} wait - The delay in milliseconds.
     * @param {boolean} immediate - Trigger the function on the leading edge instead of the trailing.
     * @returns {Function} - The debounced function.
     */
    function debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const context = this;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

     /**
     * Displays a message in a designated form message area.
     * @param {HTMLElement} messageArea - The element to display the message in.
     * @param {string} message - The message text.
     * @param {'success' | 'error' | 'processing' | 'info'} type - The type of message.
     */
    function displayFormMessage(messageArea, message, type = 'info') {
        if (!messageArea) return;

        // Remove previous type classes
        messageArea.classList.remove('form-message--success', 'form-message--error', 'form-message--processing', 'form-message--info');

        // Add the new type class
        messageArea.classList.add(`form-message--${type}`);

        // Set message content (use textContent for security)
        messageArea.textContent = message;

        // Make sure the area is visible
        messageArea.style.display = 'block'; // Or use appropriate CSS class

        // Optional: Scroll to the message if it's off-screen
        // messageArea.scrollIntoView({ behavior: 'smooth', block: 'center' });

        console.log(`Form Message (${type}): ${message}`);
    }

    /**
     * Basic HTML escaping function.
     * @param {string} str - The string to escape.
     * @returns {string} - The escaped string.
     */
    function escapeHTML(str) {
         if (str === null || str === '') return '';
        return str.toString()
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    /**
     * Traps focus within a given element (e.g., a modal).
     * @param {HTMLElement} element - The element within which to trap focus.
     */
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];

        element.addEventListener('keydown', function(e) {
            const isTabPressed = e.key === 'Tab' || e.keyCode === 9;

            if (!isTabPressed) {
                return;
            }

            if (e.shiftKey) /* shift + tab */ {
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else /* tab */ {
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        });

        // Focus the first element when the modal opens
        firstFocusableElement.focus();
    }

// End of IIFE
})();