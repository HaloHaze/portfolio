document.addEventListener('DOMContentLoaded', () => {
    // Load Dynamic Content immediately
    loadPortfolioData();

    // Scroll Handlers
    const scrollContainer = document.getElementById('projects-grid');
    const scrollLeftBtn = document.getElementById('scroll-left');
    const scrollRightBtn = document.getElementById('scroll-right');

    if (scrollContainer && scrollLeftBtn && scrollRightBtn) {
        scrollLeftBtn.addEventListener('click', () => {
            scrollContainer.scrollBy({ left: -380, behavior: 'smooth' }); // Width + gap
        });

        scrollRightBtn.addEventListener('click', () => {
            scrollContainer.scrollBy({ left: 380, behavior: 'smooth' });
        });
    }


    // Theme Toggle
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;

    // Check for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add(savedTheme === 'dark' ? 'fa-sun' : 'fa-moon');
    }

    if (themeToggle) {
        // Set initial state based on current class or storage
        // Since default is dark, we check if light is saved/set
        if (savedTheme === 'light') {
            body.setAttribute('data-theme', 'light');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }

        themeToggle.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme');

            // If currently light, switch to dark (default)
            if (currentTheme === 'light') {
                body.removeAttribute('data-theme'); // Back to default (Dark)
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
                localStorage.setItem('theme', 'dark');
            } else {
                // If currently dark (default or explicit), switch to light
                body.setAttribute('data-theme', 'light');
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('toggle');
        });

        // Close mobile menu when a link is clicked
        document.querySelectorAll('.nav-links li a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('toggle');
            });
        });
    }

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form Submission (Placeholder)
    // Form Submission with AJAX
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;

            // Show loading state
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (response.ok) {
                    alert('Message sent successfully!');
                    contactForm.reset();
                } else {
                    alert(result.message || 'Failed to send message.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again later.');
            } finally {
                // Restore button state
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // Scroll Animation Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Function to observe elements (make it global so we can call it later)
    window.observeElements = function (elements) {
        elements.forEach((el, index) => {
            el.classList.add('hidden');
            // Add stagger delay if multiple elements
            if (elements.length > 1) {
                el.style.transitionDelay = `${index * 100}ms`;
            }
            observer.observe(el);
        });
    };

    // Observe static elements
    const staticElements = document.querySelectorAll('.hero-content, .section-title, .about-content, .contact-container');
    window.observeElements(staticElements);
});

async function loadPortfolioData() {
    console.log('Starting to load portfolio data...');
    try {
        // Add timestamp to prevent caching
        const response = await fetch('data/data.json?t=' + new Date().getTime());

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Data loaded successfully:', data);

        // Render Settings (Logo)
        if (data.settings && data.settings.logo) {
            const logoContainer = document.getElementById('logo-container');
            if (logoContainer && data.settings.logo.trim() !== '') {
                logoContainer.innerHTML = `<img src="${data.settings.logo}" alt="Logo">`;
            }
        }

        // Render Hero
        if (data.hero) {
            if (data.hero.title) {
                const titleEl = document.getElementById('hero-title');
                if (titleEl) titleEl.innerHTML = data.hero.title;
            }
            if (data.hero.subtitle) {
                const subtitleEl = document.getElementById('hero-subtitle');
                if (subtitleEl) subtitleEl.textContent = data.hero.subtitle;
            }
            if (data.hero.image) {
                const imgContainer = document.getElementById('hero-img-container');
                if (imgContainer && data.hero.image.trim() !== '') {
                    imgContainer.innerHTML = `<img src="${data.hero.image}" alt="Hero Image">`;
                }
            }
        }

        // Render About
        if (data.about) {
            const aboutTextContainer = document.getElementById('about-text-container');
            const aboutImgContainer = document.getElementById('about-img-container');

            if (data.about.description && aboutTextContainer) {
                // Split by newlines for paragraphs
                const paragraphs = data.about.description.split('\n').filter(p => p.trim() !== '');
                aboutTextContainer.innerHTML = paragraphs.map(p => `<p>${p}</p>`).join('');
            }

            if (data.about.image && aboutImgContainer) {
                // Check if image path is valid
                if (data.about.image.trim() !== '') {
                    aboutImgContainer.innerHTML = `<img src="${data.about.image}" alt="Profile Image" style="width:100%; border-radius:10px; box-shadow: 0 0 20px rgba(0,0,0,0.1);">`;
                }
            }
        }

        // Render Skills
        if (data.skills && data.skills.length > 0) {
            const skillsGrid = document.getElementById('skills-grid');
            if (skillsGrid) {
                skillsGrid.innerHTML = data.skills.map(skill => `
                    <div class="skill-card">
                        <i class="${skill.icon}"></i>
                        <h3>${skill.name}</h3>
                    </div>
                `).join('');
            }
        } else {
            console.log('No skills found in data.');
        }

        // Render Projects
        if (data.projects && data.projects.length > 0) {
            const projectsGrid = document.getElementById('projects-grid');
            if (projectsGrid) {
                projectsGrid.innerHTML = data.projects.map((project, index) => {
                    // Truncate description to keep it compact and predictable
                    const maxLength = 90;
                    const truncatedDesc = project.description.length > maxLength
                        ? project.description.substring(0, maxLength) + '...'
                        : project.description;

                    return `
                    <div class="project-card">
                        <div class="project-img" style="background-image: url('${project.image}'); background-size: cover; background-position: center;"></div>
                        <div class="project-info">
                            <div>
                                <h3>${project.title}</h3>
                                <p>${truncatedDesc} <span class="read-more-trigger" onclick="openModal(${index})">Read More</span></p>
                            </div>
                            <div class="project-links">
                                ${project.code_link ? `<a href="${project.code_link}" target="_blank"><i class="fab fa-github"></i> Code</a>` : ''}
                                ${project.demo_link ? `<a href="${project.demo_link}" target="_blank"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
                            </div>
                        </div>
                    </div>
                `}).join('');

                // Store projects data globally to access in modal
                window.projectsData = data.projects;
            }
        }

        // Observe dynamic elements after rendering
        // We use a small timeout to ensure DOM is updated
        setTimeout(() => {
            if (window.observeElements) {
                const dynamicElements = document.querySelectorAll('.skill-card, .project-card');
                window.observeElements(dynamicElements);
            }
        }, 100);

        // Observe dynamic elements after rendering
        // We use a small timeout to ensure DOM is updated
        setTimeout(() => {
            const dynamicElements = document.querySelectorAll('.skill-card, .project-card');
            if (window.observeElements) {
                window.observeElements(dynamicElements);
            }
        }, 100);

    } catch (error) {
        console.error('Error loading portfolio data:', error);
        // Alert the user so they see it
        alert('Error loading portfolio data. PLEASE CHECK CONSOLE (F12). Error: ' + error.message);
    }
}

// Modal Logic
const modal = document.getElementById('project-modal');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-description');
const modalCode = document.getElementById('modal-code');
const modalDemo = document.getElementById('modal-demo');
const closeModal = document.querySelector('.close-modal');

function openModal(index) {
    if (!window.projectsData || !window.projectsData[index]) return;

    const project = window.projectsData[index];

    modalImg.src = project.image;
    modalTitle.textContent = project.title; // Fix: Use textContent for security
    modalDesc.innerHTML = project.description.replace(/\n/g, '<br>'); // Preserve line breaks

    if (project.code_link) {
        modalCode.href = project.code_link;
        modalCode.style.display = 'inline-block';
    } else {
        modalCode.style.display = 'none';
    }

    if (project.demo_link) {
        modalDemo.href = project.demo_link;
        modalDemo.style.display = 'inline-block';
    } else {
        modalDemo.style.display = 'none';
    }

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

if (closeModal) {
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
}

// Close on outside click
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});
