/* ── Smooth scroll buttons ──────────────────────────────────── */
document.querySelectorAll('[data-scroll]').forEach(btn => {
    btn.addEventListener('click', () => {
        const target = document.getElementById(btn.getAttribute('data-scroll'))
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
})

/* ── Sliding tab indicator ──────────────────────────────────── */
const tabTrack     = document.getElementById('tabTrack')
const indicator    = document.getElementById('tabIndicator')
const tabButtons   = Array.from(document.querySelectorAll('[data-tab]'))
const tabPanels    = Array.from(document.querySelectorAll('[data-panel]'))
const tabPanelWrap = document.querySelector('[data-tab-panels]')

function moveIndicator(btn) {
    // offsetLeft relative to tabTrack (the indicator's offsetParent via position:relative)
    indicator.style.left  = btn.offsetLeft + 'px'
    indicator.style.width = btn.offsetWidth + 'px'
}

function setPanelHeight(panel) {
    if (!tabPanelWrap || !panel) return
    tabPanelWrap.style.height = panel.offsetHeight + 'px'
}

function replayStagger(panel) {
    panel.querySelectorAll('[data-stagger]').forEach(el => {
        el.style.animation = 'none'
        void el.offsetHeight    // force reflow
        el.style.animation = ''
    })
}

function activateTab(tabId) {
    const nextPanel = tabPanels.find(p => p.dataset.panel === tabId)
    if (!nextPanel) return

    tabButtons.forEach(b => {
        const active = b.dataset.tab === tabId
        b.dataset.active = active ? 'true' : 'false'
        b.setAttribute('aria-selected', active ? 'true' : 'false')
        b.tabIndex = active ? 0 : -1
        if (active) moveIndicator(b)
    })

    tabPanels.forEach(p => {
        const active = p.dataset.panel === tabId
        p.dataset.active = active ? 'true' : 'false'
        if (active) replayStagger(p)
    })

    requestAnimationFrame(() => setPanelHeight(nextPanel))
}

// Init on load (wait a frame so layout is ready)
requestAnimationFrame(() => {
    const defTab = tabButtons.find(b => b.dataset.active === 'true')?.dataset.tab
    activateTab(defTab || tabButtons[0].dataset.tab)
})

window.addEventListener('resize', () => {
    const active = tabPanels.find(p => p.dataset.active === 'true')
    setPanelHeight(active)
    const activeBtn = tabButtons.find(b => b.dataset.active === 'true')
    if (activeBtn) moveIndicator(activeBtn)
})

tabButtons.forEach(b => b.addEventListener('click', () => activateTab(b.dataset.tab)))


/* ── Intersection observer for scroll reveals ───────────────── */
const revealObserver = new IntersectionObserver(
    entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            revealObserver.unobserve(entry.target)
        }
    }),
    { threshold: 0.12 }
)
document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el))