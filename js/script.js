/**
 * VENTURE CONNECT - Interactive Script
 * Tagline: From Idea to Investment
 */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. Navigation & Header Scroll State
  // ------------------------------------------------------------------------
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile Menu Toggle
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu on link click
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (
        navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        navMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ------------------------------------------------------------------------
  // 2. Active Section Spy
  // ------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const observeOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0,
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observeOptions);

  sections.forEach((sec) => sectionObserver.observe(sec));

  // ------------------------------------------------------------------------
  // 3. Animated Number Counters
  // ------------------------------------------------------------------------
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsCounted = false;

  const animateCounters = () => {
    statNumbers.forEach((counter) => {
      const target = +counter.getAttribute('data-target');
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 1800;
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeOut * target);

        counter.textContent = currentVal + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = target + suffix;
        }
      };

      requestAnimationFrame(updateCount);
    });
  };

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !statsCounted) {
            statsCounted = true;
            animateCounters();
          }
        });
      },
      { threshold: 0.3 }
    );
    statsObserver.observe(statsSection);
  }

  // ------------------------------------------------------------------------
  // 4. Section 7: "Who Benefits?" Tab Switcher
  // ------------------------------------------------------------------------
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.benefits-panel');

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetPanelId = btn.getAttribute('data-target');

      // Update button active state
      tabButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      // Update panel visibility
      tabPanels.forEach((panel) => {
        if (panel.id === targetPanelId) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });

  // ------------------------------------------------------------------------
  // 5. Section 6: Core Modules - Architecture Preview Modal
  // ------------------------------------------------------------------------
  const moduleData = {
    'ideas-implementation': {
      title: 'Ideas & Implementation Module',
      badge: 'Core Founder Space',
      objective:
        'A dedicated workspace where founders showcase their startup ideas, articulate problem statements, validate business models, and track milestone implementation.',
      inputs: 'Startup Title, Problem Matrix, Proposed Solution, Pitch Deck, Milestone Roadmap, GitHub/Prototype URLs.',
      workflows:
        'Founders submit concepts → Peer & mentor feedback loops → Status progresses from Ideation to MVP to Market Ready.',
      outputs: 'Public/Private Profile Card, Implementation Progress Tracker, Verified Idea Portfolio.',
      note: 'Showcases the founder’s structured readiness before engaging investors.',
    },
    'hackathons-hub': {
      title: 'Hackathons & Innovation Hub',
      badge: 'Discovery & Competitions',
      objective:
        'A centralized opportunity hub where founders, researchers, and students discover hackathons, startup competitions, innovation challenges, and accelerator opportunities.',
      inputs: 'Organizer Credentials, Challenge Categories, Prize Pools, Timelines, Eligibility Criteria.',
      workflows:
        'Organizations publish events → Smart categorization matches relevant domains → Founders form teams and submit entries.',
      outputs: 'Real-time Event Calendar, Submission Deadlines, Verified Winner & Finalist Badges.',
      note: 'Catalyzes fast-paced prototype creation and student participation.',
    },
    'opportunities-hub': {
      title: 'Opportunities Hub',
      badge: 'Capital & Growth Programs',
      objective:
        'A curated marketplace where founders discover grant opportunities, angel networks, seed capital initiatives, and incubation cohorts.',
      inputs: 'Funding Stages (Pre-seed, Seed, Series A), Sector Focus, Grant Provider Profiles, Ticket Sizes.',
      workflows:
        'Investors & grant agencies list programs → Founders filter by sector and maturity → One-click application pipeline.',
      outputs: 'Personalized Funding Matchlist, Active Cohort Deadlines, Application Tracking Matrix.',
      note: 'Eliminates fragmented searches across dozens of separate sites.',
    },
    'applications-management': {
      title: 'Applications Management Module',
      badge: 'Centralized Pipeline',
      objective:
        'A unified tracking dashboard for submitting, reviewing, and managing applications across investors, hackathons, and incubation programs.',
      inputs: 'Standardized Startup Application Dossier, Pitch Decks, Financial Projections, Team Bios.',
      workflows:
        'Single application profile reused across multiple programs → Reviewers score with rubric → Real-time status updates.',
      outputs: 'Live Application Status (Under Review, Shortlisted, Interview, Accepted), Audit History.',
      note: 'Reduces administrative burden for both founders and program coordinators.',
    },
    'investor-connections': {
      title: 'Investor Connections Module',
      badge: 'Smart Discovery',
      objective:
        'Enables founders to discover verified investors aligned with their sector, and gives angels and venture capital firms curated deal flow access.',
      inputs: 'Investor Thesis, Preferred Ticket Size, Sector Focus, Founder Traction Metrics, Revenue Run-Rate.',
      workflows:
        'Investors search filtered startups → Request intro / pitch deck access → Mutual double opt-in intro protocol.',
      outputs: 'Verified Investor Profiles, Curated Deal Flow Feed, Direct Connection Channels.',
      note: 'Fosters high-relevance connections without cold email fatigue.',
    },
    'vc-readiness': {
      title: 'VC Readiness Assessment Module',
      badge: 'Indicative AI Evaluation',
      objective:
        'A conceptual AI-assisted diagnostic tool that helps founders evaluate their startup’s investment preparedness across 5 key pillars.',
      inputs: 'Business Model Clarity, Addressable Market Size (TAM/SAM/SOM), Team Composition, Product Traction, Financial Preparedness.',
      workflows:
        'Founders answer structured diagnostic assessment → Algorithm computes readiness benchmark score (0-100) → Actionable recommendations generated.',
      outputs: 'Readiness Benchmark Scorecard, Strength & Vulnerability Matrix, Step-by-Step Improvement Roadmap.',
      note: 'IMPORTANT: This is an indicative educational assessment, NOT an investment guarantee.',
    },
    'messaging-notifications': {
      title: 'Messaging & Notifications Module',
      badge: 'Real-Time Updates',
      objective:
        'Facilitates direct, context-aware communication between founders, investors, and program directors, accompanied by intelligent notification alerts.',
      inputs: 'Chat Threads, File Attachments, System Alert Preferences, Deadline Reminders.',
      workflows:
        'Event alerts broadcast on status change → In-app & email notification dispatch → Secure founder-investor conversation threads.',
      outputs: 'Instant Messages, Opportunity Reminders, Read Receipts, Application Milestone Alerts.',
      note: 'Ensures no critical pitch invite or application deadline is missed.',
    },
    'founder-community': {
      title: 'Founder Community Module',
      badge: 'Knowledge Network',
      objective:
        'A peer-to-peer knowledge sharing and collaborative environment where entrepreneurs exchange insights, lessons learned, and startup playbooks.',
      inputs: 'Founder Articles, Post-Mortem Reviews, Resource Guides, AMA (Ask Me Anything) Discussions.',
      workflows:
        'Founders author case studies → Community votes and comments → Curated knowledge repository built organically.',
      outputs: 'Trending Founder Insights, Collaborative Toolkits, Peer Mentorship Network.',
      note: 'Nurtures a supportive culture of open entrepreneurship.',
    },
  };

  const modalOverlay = document.getElementById('moduleModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalTitle = document.getElementById('modalTitle');
  const modalBadge = document.getElementById('modalBadge');
  const modalObjective = document.getElementById('modalObjective');
  const modalInputs = document.getElementById('modalInputs');
  const modalWorkflows = document.getElementById('modalWorkflows');
  const modalOutputs = document.getElementById('modalOutputs');
  const modalNote = document.getElementById('modalNote');

  const openModuleModal = (moduleId) => {
    const data = moduleData[moduleId];
    if (!data || !modalOverlay) return;

    modalTitle.textContent = data.title;
    modalBadge.textContent = data.badge;
    modalObjective.textContent = data.objective;
    modalInputs.textContent = data.inputs;
    modalWorkflows.textContent = data.workflows;
    modalOutputs.textContent = data.outputs;
    modalNote.textContent = data.note;

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModuleModal = () => {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('[data-module]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const moduleId = el.getAttribute('data-module');
      openModuleModal(moduleId);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModuleModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModuleModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      closeModuleModal();
    }
  });

  // ------------------------------------------------------------------------
  // 6. Section 10: Contact Form Submission (Pure JavaScript Client-Side)
  // ------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const formAlert = document.getElementById('formAlert');
  const submitBtn = document.getElementById('submitBtn');

  const showAlert = (type, message) => {
    if (!formAlert) return;
    formAlert.className = `form-alert ${type}`;
    formAlert.innerHTML = message;
    formAlert.style.display = 'block';
    formAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const clearAlert = () => {
    if (!formAlert) return;
    formAlert.style.display = 'none';
    formAlert.className = 'form-alert';
    formAlert.innerHTML = '';
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearAlert();

      const fullName = document.getElementById('full_name')?.value.trim();
      const email = document.getElementById('email')?.value.trim();
      const subject = document.getElementById('subject')?.value.trim();
      const message = document.getElementById('message')?.value.trim();

      // Client-side validation
      if (!fullName || fullName.length < 2) {
        showAlert('error', 'Please enter your full name (minimum 2 characters).');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        showAlert('error', 'Please enter a valid email address.');
        return;
      }

      if (!subject || subject.length < 3) {
        showAlert('error', 'Please enter a message subject (minimum 3 characters).');
        return;
      }

      if (!message || message.length < 10) {
        showAlert('error', 'Please enter a detailed message (minimum 10 characters).');
        return;
      }

      // Enter loading state
      if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
      }

      // Simulate instantaneous processing & store in browser storage matching MySQL table schema
      setTimeout(() => {
        const storedEnquiries = JSON.parse(localStorage.getItem('venture_connect_messages') || '[]');
        const newRecord = {
          id: storedEnquiries.length + 1,
          full_name: fullName,
          email: email,
          subject: subject,
          message: message,
          created_at: new Date().toISOString()
        };
        storedEnquiries.push(newRecord);
        localStorage.setItem('venture_connect_messages', JSON.stringify(storedEnquiries));

        showAlert(
          'success',
          `<strong>Thank you, ${fullName}!</strong> Your message has been received successfully. (Recorded matching the MySQL schema in <code>database/venture_connect.sql</code>).`
        );
        contactForm.reset();

        if (submitBtn) {
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
        }
      }, 500);
    });
  }

  // ------------------------------------------------------------------------
  // 7. Back to Top Button
  // ------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
