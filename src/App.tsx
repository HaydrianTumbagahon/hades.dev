import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowDown, ArrowUpRight, BriefcaseBusiness, X } from 'lucide-react'
import type { IconType } from 'react-icons'
import { FaFacebookF, FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa'
import {
  SiCss,
  SiFigma,
  SiGit,
  SiGimp,
  SiHtml5,
  SiJira,
  SiJavascript,
  SiGooglesheets,
  SiNodedotjs,
  SiNotion,
  SiReact,
  SiTailwindcss,
  SiTypescript,
  SiVite,
  SiWordpress,
  SiTrello,
} from 'react-icons/si'
import { ReactLenis, useLenis } from 'lenis/react'
import 'lenis/dist/lenis.css'
import './index.css'

const navigation = ['HOME', 'ABOUT', 'SKILLS', 'PROJECTS', 'CONTACT']

const capabilities: { number: string; title: string; summary: string; technologies: { name: string; icon: IconType }[] }[] = [
  { number: '01', title: 'DIGITAL DESIGN', summary: 'Interfaces / Art direction / Prototyping', technologies: [{ name: 'Figma', icon: SiFigma }, { name: 'GIMP', icon: SiGimp }, { name: 'Notion', icon: SiNotion }, { name: 'WordPress', icon: SiWordpress }] },
  { number: '02', title: 'FRONTEND DEVELOPMENT', summary: 'React / TypeScript / Responsive UI', technologies: [{ name: 'React', icon: SiReact }, { name: 'TypeScript', icon: SiTypescript }, { name: 'JavaScript', icon: SiJavascript }, { name: 'Tailwind CSS', icon: SiTailwindcss }, { name: 'HTML5', icon: SiHtml5 }, { name: 'CSS3', icon: SiCss }] },
  { number: '03', title: 'CREATIVE TECHNOLOGY', summary: 'Interaction / Experiments / Systems', technologies: [{ name: 'Vite', icon: SiVite }, { name: 'Node.js', icon: SiNodedotjs }, { name: 'React', icon: SiReact }, { name: 'Git', icon: SiGit }] },
  { number: '04', title: 'DESIGN SYSTEMS', summary: 'Foundations / Components / Documentation', technologies: [{ name: 'Figma', icon: SiFigma }, { name: 'Notion', icon: SiNotion }, { name: 'WordPress', icon: SiWordpress }, { name: 'Git', icon: SiGit }] },
  { number: '05', title: 'ADMINISTRATIVE', summary: 'Organization / Operations / Communication', technologies: [{ name: 'Google Sheets', icon: SiGooglesheets }, { name: 'Notion', icon: SiNotion }, { name: 'Trello', icon: SiTrello }, { name: 'Jira', icon: SiJira }] },
]

const projects = [
  { name: "Where'd it go?", category: 'FINANCE APP', year: '2025', image: 'finance-app', href: 'https://rvn-finance-app.vercel.app/', fallback: 'TRACK EVERY\nLITTLE THING' },
  { name: "that's my type", category: 'TYPETEST APP', year: '2025', image: 'typetest-app', href: 'https://rvn-typing-test.vercel.app/', fallback: 'FIND YOUR\nRHYTHM' },
  { name: 'savr', category: 'FOOD APP', year: '2025', image: 'food-app', href: 'https://rvn-savr.vercel.app/', fallback: 'GOOD FOOD.\nLESS WASTE.' },
  { name: 'manga translator', category: 'TRANSLATION APP', year: '2025', image: 'translate-app', href: 'https://rvn-manga-translator.vercel.app/', fallback: 'READ BEYOND\nTHE PANEL' },
]

function ScrollProgress() {
  const progressRef = useRef<HTMLDivElement>(null)
  useLenis((lenis) => {
    if (progressRef.current) progressRef.current.style.transform = `scaleX(${lenis.progress})`
  })
  return <div className="scroll-progress" ref={progressRef} aria-hidden="true" />
}

function SmoothHashNavigation() {
  const lenis = useLenis()
  const pendingScroll = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const navigate = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      if (!(event.target instanceof Element)) return
      const link = event.target.closest<HTMLAnchorElement>('a[href^="#"]')
      if (!link) return
      const section = document.querySelector<HTMLElement>(link.hash)
      if (!section) return
      event.preventDefault()
      window.history.pushState(null, '', link.hash)
      if (pendingScroll.current) clearTimeout(pendingScroll.current)
      pendingScroll.current = setTimeout(() => {
        lenis?.scrollTo(section, { duration: 1.4, easing: (progress) => 1 - Math.pow(1 - progress, 4) })
        pendingScroll.current = null
      }, 140)
    }

    document.addEventListener('click', navigate)
    return () => {
      document.removeEventListener('click', navigate)
      if (pendingScroll.current) clearTimeout(pendingScroll.current)
    }
  }, [lenis])

  return null
}

function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    document.documentElement.classList.add('custom-cursor-enabled')
    let frame = 0
    let pointerX = 0
    let pointerY = 0
    let cursorX = 0
    let cursorY = 0
    let velocityX = 0
    let velocityY = 0
    let lastTime = 0
    let target: HTMLElement | null = null
    let decoration: HTMLElement | null = null
    let targetX = 0
    let targetY = 0

    const updateTargetPosition = () => {
      if (!target?.isConnected) return
      const bounds = target.getBoundingClientRect()
      targetX = bounds.left + bounds.width / 2
      targetY = bounds.top + bounds.height / 2
    }

    const setTarget = (nextTarget: HTMLElement | null) => {
      if (target === nextTarget) return
      decoration?.classList.remove('cursor-snapped')
      target = nextTarget
      decoration = target?.closest<HTMLElement>('.project-card, .skill-item') ?? target
      decoration?.classList.add('cursor-snapped')
      cursorRef.current?.classList.toggle('is-snapped', Boolean(target))
      updateTargetPosition()
    }

    const animate = (time: number) => {
      const cursor = cursorRef.current
      if (!cursor) return
      const deltaTime = Math.min((time - (lastTime || time)) / 1000, 0.032)
      lastTime = time
      let destinationX = pointerX
      let destinationY = pointerY
      if (target?.isConnected) {
        destinationX = targetX
        destinationY = targetY
      } else if (target) {
        setTarget(null)
      }

      const stiffness = target ? 150 : 220
      const damping = target ? 15 : 25
      velocityX += ((destinationX - cursorX) * stiffness - velocityX * damping) * deltaTime
      velocityY += ((destinationY - cursorY) * stiffness - velocityY * damping) * deltaTime
      cursorX += velocityX * deltaTime
      cursorY += velocityY * deltaTime
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`

      const settled = Math.abs(destinationX - cursorX) + Math.abs(destinationY - cursorY) < 0.35 && Math.abs(velocityX) + Math.abs(velocityY) < 1
      if (!settled) frame = requestAnimationFrame(animate)
      else frame = 0
    }

    const requestAnimation = () => {
      if (!frame) frame = requestAnimationFrame(animate)
    }

    const move = (event: PointerEvent) => {
      pointerX = event.clientX
      pointerY = event.clientY
      const pointerTarget = event.target instanceof Element
        ? event.target.closest<HTMLElement>('.project-card, .skill-item, a, button, [role="button"]')
        : null
      setTarget(pointerTarget)
      cursorRef.current?.classList.toggle('is-visible', !pointerTarget)
      requestAnimation()
    }
    const hide = () => {
      setTarget(null)
      cursorRef.current?.classList.remove('is-visible')
    }
    const onScroll = () => {
      updateTargetPosition()
      requestAnimation()
    }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('pointerleave', hide)
    return () => {
      cancelAnimationFrame(frame)
      decoration?.classList.remove('cursor-snapped')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('pointerleave', hide)
      document.documentElement.classList.remove('custom-cursor-enabled')
    }
  }, [])
  return <div className="custom-cursor" ref={cursorRef} aria-hidden="true" />
}

function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => element.classList.toggle('is-in', entry.isIntersecting), { threshold: 0.16 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>
}

function MotionSection({ children, className, id }: { children: ReactNode; className: string; id: string }) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => element.classList.toggle('section-in-view', entry.isIntersecting), { threshold: 0.02 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  return <section ref={ref} className={`motion-section ${className}`} id={id}>{children}</section>
}

function AppContent() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeCapability, setActiveCapability] = useState<string | null>(null)
  const [aboutOpen, setAboutOpen] = useState(window.location.pathname === '/about')
  const [contactOpen, setContactOpen] = useState(window.location.hash === '#contact-card')
  const lenis = useLenis()
  const closeMenu = () => setMenuOpen(false)
  const openAbout = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    closeMenu()
    window.history.pushState(null, '', '/about')
    setAboutOpen(true)
    setContactOpen(false)
    lenis?.scrollTo(0, { immediate: true })
  }
  const openContact = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    closeMenu()
    window.history.pushState(null, '', `${window.location.pathname}#contact-card`)
    setContactOpen(true)
  }
  const navigateItem = (event: React.MouseEvent<HTMLAnchorElement>, item: string) => {
    if (item === 'ABOUT') return openAbout(event)
    if (item === 'CONTACT') return openContact(event)
    if (item === 'HOME' && aboutOpen) {
      event.preventDefault()
      closeMenu()
      window.history.pushState(null, '', '/')
      setAboutOpen(false)
      lenis?.scrollTo(0, { immediate: true })
      return
    }
    if (aboutOpen) {
      event.preventDefault()
      closeMenu()
      window.history.pushState(null, '', '/')
      setAboutOpen(false)
      window.setTimeout(() => {
        const section = document.getElementById(item.toLowerCase())
        if (section) lenis?.scrollTo(section, { duration: 1.25 })
      }, 160)
      return
    }
    closeMenu()
  }

  useEffect(() => {
    const onPopState = () => {
      setAboutOpen(window.location.pathname === '/about')
      setContactOpen(window.location.hash === '#contact-card')
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && contactOpen) window.history.back()
    }
    window.addEventListener('popstate', onPopState)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('popstate', onPopState)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [contactOpen])

  return (
    <ReactLenis root options={{ lerp: 0.075, wheelMultiplier: 0.9, smoothWheel: true, syncTouch: false, autoRaf: true }}>
      <ScrollProgress />
      <SmoothHashNavigation />
      <CustomCursor />
      <header className={`site-header ${aboutOpen ? 'is-about-header' : ''}`}>
        <a className="wordmark" href={aboutOpen ? '/' : '#home'} onClick={aboutOpen ? (event) => { event.preventDefault(); closeMenu(); window.history.pushState(null, '', '/'); setAboutOpen(false); lenis?.scrollTo(0, { immediate: true }) } : closeMenu} aria-label="Hades home">Hades.dev</a>
        <div className="header-meta"><span>INDEPENDENT DESIGNER & DEVELOPER</span><span>AVAILABLE FOR SELECT PROJECTS</span></div>
        <button className="menu-toggle" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>
          <span className="menu-toggle-label">{menuOpen ? 'CLOSE' : 'MENU'}</span>
          <svg viewBox="0 0 32 32" aria-hidden="true"><path className="menu-line menu-line-top" d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22" /><path className="menu-line" d="M7 16 27 16" /></svg>
        </button>
      </header>
      <nav className={`mobile-menu ${menuOpen ? 'is-open' : ''}`} aria-label="Mobile navigation" inert={!menuOpen}>
        {navigation.map((item, index) => <a href={item === 'ABOUT' ? '/about' : item === 'CONTACT' ? '#contact-card' : `#${item.toLowerCase()}`} key={item} onClick={(event) => navigateItem(event, item)}><span>0{index + 1}</span>{item}</a>)}
        <p>DESIGNING DIGITAL THINGS WITH INTENTION.</p>
      </nav>
      {!aboutOpen && <nav className="side-nav" aria-label="Section navigation">
        {navigation.map((item, index) => <a href={item === 'ABOUT' ? '/about' : item === 'CONTACT' ? '#contact-card' : `#${item.toLowerCase()}`} key={item} onClick={(event) => navigateItem(event, item)}><span>0{index + 1}</span>{item}</a>)}
      </nav>}
      {aboutOpen ? <AboutPage onHome={() => { window.history.pushState(null, '', '/'); setAboutOpen(false) }} onContact={() => { window.history.pushState(null, '', '/about#contact-card'); setContactOpen(true) }} /> : <main>
        <MotionSection className="hero section-shell" id="home">
          <Reveal className="hero-topline"><span>PORTFOLIO / 2025—26</span><span>BASED IN THE PHILIPPINES / WORKING EVERYWHERE</span></Reveal>
          <Reveal className="hero-title-wrap"><p className="eyebrow">THE DIGITAL PRACTICE OF HADES</p><h1 className="glitch-title">MAKE IT<br /><span>MATTER.</span></h1></Reveal>
          <Reveal className="hero-bottom"><p>Independent creative developer<br />building considered digital experiences.</p><a className="scroll-cue" href="#about"><ArrowDown size={16} strokeWidth={1.5} /><span>SCROLL TO EXPLORE</span></a><span className="hero-index">001—005</span></Reveal>
          <div className="hero-mark" aria-hidden="true">H<span>↗</span></div>
        </MotionSection>
        <MotionSection className="about section-shell" id="about">
          <Reveal className="section-heading"><span>01 / ABOUT</span><span>A PRACTICE IN PROGRESS</span></Reveal>
          <div className="about-grid"><Reveal><h2 className="glitch-title">GOOD WORK<br />STARTS WITH<br /><span>GOOD QUESTIONS.</span></h2></Reveal><Reveal className="about-copy"><p className="lead">I bring thoughtful ideas to life through design and code.</p><p>From the first sketch to the final interaction, I care about the details that make a digital experience feel clear, human, and unmistakably its own.</p><a className="text-link" href="/about" onClick={openAbout}>A LITTLE MORE ABOUT ME <ArrowUpRight size={15} /></a></Reveal></div>
          <Reveal className="about-stamp"><span>INDEPENDENT<br />BY DESIGN</span><span>H / 26</span></Reveal>
        </MotionSection>
        <MotionSection className="skills section-shell" id="skills">
          <Reveal className="section-heading"><span>02 / CAPABILITIES</span><span>THOUGHTFULLY, END TO END</span></Reveal>
          <Reveal className="skills-intro"><h2 className="glitch-title">SMALL DETAILS.<br /><span>BIG PICTURE.</span></h2><p>A focused toolkit for making ideas useful, distinct, and ready for the real world.</p></Reveal>
          <div className="skill-list">{capabilities.map(({ number, title, summary, technologies }) => {
            const isOpen = activeCapability === number
            return <Reveal className="skill-reveal" key={number}><div className={`skill-item ${isOpen ? 'is-expanded' : ''}`}><button className="skill-row" type="button" aria-expanded={isOpen} onClick={() => setActiveCapability(isOpen ? null : number)}><span>{number}</span><h3>{title}</h3><p>{summary}</p><ArrowUpRight size={17} /></button><div className="skill-detail" aria-hidden={!isOpen}><TechnologyMarquee technologies={technologies} /></div></div></Reveal>
          })}</div>
        </MotionSection>
        <MotionSection className="projects section-shell" id="projects">
          <Reveal className="section-heading"><span>03 / SELECTED WORK</span><span>2025—2026</span></Reveal>
          <Reveal className="projects-heading"><h2 className="glitch-title">MADE WITH<br /><span>INTENTION.</span></h2><p>A few things shaped by curiosity,<br />collaboration, and a little bit of nerve.</p></Reveal>
          <div className="project-list">{projects.map((project, index) => <ProjectCard key={project.image} project={project} index={index} />)}</div>
        </MotionSection>
        <MotionSection className="contact section-shell" id="contact">
          <Reveal className="section-heading"><span>04 / GET IN TOUCH</span><span>GOOD THINGS START WITH A HELLO</span></Reveal>
          <Reveal className="contact-content"><p>HAVE A GOOD<br />ONE IN MIND?</p><a href="#contact-card" onClick={openContact}>LET'S TALK<span><ArrowUpRight size={25} /></span></a></Reveal>
          <Reveal className="footer-reveal"><footer className="site-footer"><a className="footer-mark" href="#home">Hades.dev</a><div className="footer-links"><a href="https://github.com/HaydrianTumbagahon" aria-label="GitHub" target="_blank" rel="noreferrer"><FaGithub size={17} /></a><a href="https://www.linkedin.com/in/haydrian-c-tumbagahon" aria-label="LinkedIn" target="_blank" rel="noreferrer"><FaLinkedin size={17} /></a><a href="https://ph.jobstreet.com/profiles/haydrian-tumbagahon-62LGt0PkQD" aria-label="JobStreet" target="_blank" rel="noreferrer"><BriefcaseBusiness size={17} /></a></div><p>© 2026 HADES. MADE WITH INTENTION.</p><a className="back-top" href="#home">BACK TO TOP ↑</a></footer></Reveal>
        </MotionSection>
      </main>}
      {contactOpen && <ContactCard onClose={() => window.history.back()} />}
    </ReactLenis>
  )
}

export default function App() {
  return <AppContent />
}

function AboutPage({ onHome, onContact }: { onHome: () => void; onContact: () => void }) {
  return (
    <main className="about-page">
      <section className="about-page-hero">
        <div className="about-page-meta"><span>ABOUT / HAYDRIAN</span><span>UPDATED / 2026</span></div>
        <div className="about-page-intro">
          <Reveal className="portrait-holder"><div className="portrait-frame"><img className="portrait-image" src="/images/my-img.png" alt="Portrait of Haydrian Tumbagahon" /><span className="portrait-caption">PORTRAIT / 2026</span><i>14° 35' N<br />120° 59' E</i></div></Reveal>
          <Reveal className="about-page-title"><p className="eyebrow">DESIGNER / DEVELOPER / ALWAYS LEARNING</p><h1 className="glitch-title">HAYDRIAN<br /><span>TUMBAGAHON.</span></h1><p className="about-page-lead">I like making useful things feel considered, clear, and a little more human.</p></Reveal>
        </div>
      </section>
      <section className="about-timeline">
        <Reveal className="section-heading"><span>01 / A SHORT HISTORY</span><span>STILL IN PROGRESS</span></Reveal>
        <div className="timeline-list">
          <Reveal className="timeline-row"><span>NEXT CHAPTER</span><h2>MORE TO DISCOVER</h2><p>I’m excited to keep exploring new skills, technologies, and challenges, and to learn from the different perspectives of other professionals.</p></Reveal>
          <Reveal className="timeline-row"><span>2025 — 2026</span><h2>FREELANCE TEACHER'S AIDE</h2><p>Supporting students gave me room to bring creativity into learning activities, adapt to different needs, and collaborate with educators. The experience strengthened my communication, patience, and ability to contribute as part of a team.</p></Reveal>
          <Reveal className="timeline-row"><span>2025 — 2026</span><h2>TECH SUPPORT REPRESENTATIVE</h2><p>My first job introduced me to professional technical support: listening carefully, helping people work through technology issues, and communicating clear next steps. It also gave me a first-hand view of the pace and teamwork of a busy workplace.</p></Reveal>
          <Reveal className="timeline-row"><span>2024 — 2025</span><h2>TECH SUPPORT & OFFICE SUPPORT INTERN</h2><p>At the DILG branch in SJDM, Bulacan, I helped with technology and office support tasks and got my first close look at a professional office environment. It was a valuable introduction to workplace communication, organization, and supporting day-to-day operations.</p></Reveal>
        </div>
      </section>
      <section className="about-certifications">
        <Reveal className="section-heading"><span>02 / CERTIFICATIONS</span><span>COURSES & CREDENTIALS</span></Reveal>
        <div className="certification-panel">
          <Reveal className="certification-intro"><span>01 — 05</span><h2>PROOF OF<br /><span>PROGRESS.</span></h2><p>A selection of language, networking, and technical support learning milestones.</p></Reveal>
          <div className="certification-list">
            <Reveal className="certification-row"><span>01</span><p><a href="https://cert.efset.org/7NgAYc" target="_blank" rel="noreferrer">EF SET Certificate <ArrowUpRight size={13} /></a><small>22 JAN 2026</small></p><span>EF SET</span></Reveal>
            <Reveal className="certification-row"><span>02</span><p>Getting Started with Cisco Packet Tracer<small>12 APR 2026 · ID: c656fd40-fe75-438d-9515-7ff6f222b2a3</small></p><span>CISCO NETWORKING ACADEMY</span></Reveal>
            <Reveal className="certification-row"><span>03</span><p>IT Customer Support Basics<small>27 APR 2026 · ID: 1ec69c21-aa74-47d8-acdd-2293e1a6f8f6</small></p><span>CISCO NETWORKING ACADEMY</span></Reveal>
            <Reveal className="certification-row"><span>04</span><p><a href="https://www.credly.com/badges/58eb3455-a327-4e52-9066-b6ed97b02bc8" target="_blank" rel="noreferrer">Network Support and Security <ArrowUpRight size={13} /></a><small>20 APR 2026</small></p><span>CISCO NETWORKING ACADEMY</span></Reveal>
            <Reveal className="certification-row"><span>05</span><p>Certificate of Eligibility (COE)<small>27 NOV 2025</small></p><span>CIVIL SERVICE COMMISSION</span></Reveal>
          </div>
        </div>
      </section>
      <section className="about-personality">
        <Reveal className="section-heading"><span>03 / OFF THE SCREEN</span><span>THE THINGS THAT KEEP ME CURIOUS</span></Reveal>
        <div className="personality-grid">
          <Reveal className="personality-item"><span>01 / INTERESTS</span><h2>WHAT'S<br />NEXT?</h2><p>I’m interested in web development with AI, new devices and software, and the ways emerging AI tools can support creative work. I also enjoy learning about practical IT support in an office environment.</p></Reveal>
          <Reveal className="personality-item"><span>02 / HOBBIES</span><h2>BUILD. PLAY.<br />RIDE.</h2><p>I create websites to test my skills and explore new technologies. I enjoy strategic turn-based games like Reverse: 1999 and Honkai: Star Rail, competitive games like Valorant, and getting out for a bike ride.</p></Reveal>
          <Reveal className="personality-item"><span>03 / GOAL</span><h2>GROW<br />TOGETHER.</h2><p>I hope to join a team even as I continue learning, build new skills, take on new experiences, and meet promising people who bring energy and fun to working together.</p></Reveal>
        </div>
      </section>
      <section className="about-page-end">
        <Reveal><p>HAVE A GOOD ONE IN MIND?</p><button type="button" className="text-link about-contact-trigger" onClick={onContact}>LET'S TALK <ArrowUpRight size={17} /></button></Reveal>
        <button type="button" className="text-link about-home-trigger" onClick={onHome}>← BACK TO THE WORK</button>
      </section>
    </main>
  )
}

function ContactCard({ onClose }: { onClose: () => void }) {
  const lenis = useLenis()
  useEffect(() => {
    document.documentElement.classList.add('contact-dialog-open')
    lenis?.stop()
    return () => {
      document.documentElement.classList.remove('contact-dialog-open')
      lenis?.start()
    }
  }, [lenis])

  return (
    <div className="contact-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }} onTouchStart={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="contact-card" role="dialog" aria-modal="true" aria-labelledby="contact-card-title">
        <div className="contact-card-top"><span>H / DIRECT LINE</span><button className="contact-close" type="button" onClick={onClose} aria-label="Close contact card"><X size={19} /></button></div>
        <div className="contact-card-body"><div className="contact-card-identity"><p className="eyebrow">INDEPENDENT DESIGNER & DEVELOPER</p><h2 id="contact-card-title">HAYDRIAN<br /><span>TUMBAGAHON.</span></h2><a className="contact-card-copy contact-email" href="mailto:haydriantumbagahon1205@gmail.com">haydriantumbagahon1205@gmail.com <ArrowUpRight size={17} /></a></div></div>
        <div className="contact-socials" aria-label="Social links"><a href="https://www.facebook.com/haydrian.tumbagahon/" target="_blank" rel="noreferrer" aria-label="Facebook"><FaFacebookF /></a><a href="https://www.instagram.com/htumbagahon/" target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a><a href="https://github.com/HaydrianTumbagahon" target="_blank" rel="noreferrer" aria-label="GitHub"><FaGithub /></a><a href="https://www.linkedin.com/in/haydrian-c-tumbagahon" target="_blank" rel="noreferrer" aria-label="LinkedIn"><FaLinkedin /></a><a href="mailto:haydriantumbagahon1205@gmail.com" aria-label="Email"><ArrowUpRight size={17} /></a></div>
        <div className="contact-card-bottom"><span>MANILA, PHILIPPINES</span><span>HAYDRIAN TUMBAGAHON / 2026</span></div>
      </section>
    </div>
  )
}

function TechnologyMarquee({ technologies }: { technologies: { name: string; icon: IconType }[] }) {
  const items = Array.from({ length: 8 }, (_, copyIndex) => technologies.map((technology, index) => ({ ...technology, copyIndex, index }))).flat()
  return (
    <div className="technology-window" aria-label={`Technologies: ${technologies.map(({ name }) => name).join(', ')}`}>
      <div className="technology-track">
        {items.map(({ name, icon: Icon, copyIndex, index }) => <span className="technology-item" key={`${name}-${copyIndex}-${index}`} aria-hidden={copyIndex > 0}><Icon aria-hidden="true" /><span>{name}</span></span>)}
      </div>
    </div>
  )
}

function ProjectCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  const [imageAvailable, setImageAvailable] = useState(true)
  return (
    <Reveal className="project-reveal">
      <a className={`project-card project-image-${project.image}`} href={project.href} target="_blank" rel="noreferrer">
        <div className="project-art">
          <div className="project-art-fallback" aria-hidden="true"><span>{project.fallback}</span><i>H / 0{index + 1}</i></div>
          {imageAvailable && <img src={`/images/${project.image}.png`} alt={`${project.name} application`} loading="lazy" onError={() => setImageAvailable(false)} />}
          <span className="project-open"><ArrowUpRight size={20} /></span>
        </div>
        <div className="project-info"><span>0{index + 1} / {project.category}</span><h3>{project.name}</h3><span>{project.year} <ArrowUpRight size={15} /></span></div>
      </a>
    </Reveal>
  )
}