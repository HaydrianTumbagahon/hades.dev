import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { createPortal } from 'react-dom'
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

type Project = { name: string; category: string; year: string; image?: string; href?: string; fallback: string }

const projects: Project[] = [
  { name: 'Spendly', category: 'FINANCE TRACKER WEBSITE', year: '2026', image: 'finance-app', href: 'https://hades-spendly.vercel.app/', fallback: 'TRACK EVERY\nLITTLE THING' },
  { name: 'JustMyType', category: 'TYPING TEST WEBSITE', year: '2025', image: 'typetest-app', href: 'https://rvn-typing-test.vercel.app/', fallback: 'FIND YOUR\nRHYTHM' },
  { name: 'Kulinarya', category: 'PINOY DISHES WEBSITE', year: '2026', image: 'kulinarya', href: 'https://hades-kulinarya.vercel.app/', fallback: 'GOOD FOOD.\nLESS WASTE.' },
  { name: 'Manga Translator', category: 'MANGA TRANSLATOR WEBSITE', year: '2025', image: 'translate-app', href: 'https://hades-manga-translator.vercel.app/', fallback: 'READ BEYOND\nTHE PANEL' },
  { name: 'Serein', category: 'PROTOTYPE HOTEL BOOKING WEBSITE', year: '2026', image: 'serein', href: 'https://hades-serein.vercel.app/', fallback: 'COMING\nSOON' },
  { name: 'Velo', category: 'BIKE ARCHIVE', year: '2026', image: 'velo', href: 'https://hades-velo.vercel.app/', fallback: 'BIKE\nARCHIVE' },
  { name: 'Nether', category: 'BLOG', year: '2026', image: 'nether', href: 'https://hades-nether.vercel.app/', fallback: 'BLOG' },
  { name: 'Sonus', category: 'IEM ARCHIVE', year: '2026', image: 'sonus', href: 'https://hades-sonus.vercel.app/', fallback: 'IEM\nARCHIVE' },
]

type Certificate = { name: string; image: string; issuer?: string; detail?: string }

const certificateImages = import.meta.glob<string>('./assets/certificates/*', { eager: true, query: '?url', import: 'default' })

const certificates: Certificate[] = [
  { name: 'EF SET Certificate', image: 'EF Set.png', issuer: 'EF SET', detail: '22 JAN 2026' },
  { name: 'IT Customer Support Basics', image: 'IT Customer Support Basics.png', issuer: 'CISCO NETWORKING ACADEMY', detail: '27 APR 2026 · ID: 1ec69c21-aa74-47d8-acdd-2293e1a6f8f6' },
  { name: 'Network Support and Security', image: 'Network Support and Basics.png', issuer: 'CISCO NETWORKING ACADEMY', detail: '20 APR 2026' },
  { name: 'Certificate of Eligibility (COE)', image: 'CSC.png', issuer: 'CIVIL SERVICE COMMISSION', detail: '27 NOV 2025' },
  { name: 'Hardware and Upgrade Support', image: 'Hardare and Upgrade Support.png', issuer: 'CISCO NETWORKING ACADEMY', detail: '01 NOV 2026' },
  { name: 'Introduction to Modern AI', image: 'Introduction to Modern AI.png', issuer: 'CISCO NETWORKING ACADEMY', detail: '30 OCT 2026' },
  { name: 'Computer Hardware Basics', image: 'Computer Hardware Basics.png', issuer: 'CISCO NETWORKING ACADEMY', detail: '30 OCT 2026' },
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
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        element.classList.add('is-in')
        observer.unobserve(element)
      }
    }, { threshold: 0.16 })
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
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        element.classList.add('section-in-view')
        observer.unobserve(element)
      }
    }, { threshold: 0.02 })
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

  useEffect(() => {
    document.documentElement.classList.toggle('mobile-menu-open', menuOpen)
    document.body.classList.toggle('mobile-menu-open', menuOpen)
    if (menuOpen) lenis?.stop()
    else lenis?.start()

    return () => {
      document.documentElement.classList.remove('mobile-menu-open')
      document.body.classList.remove('mobile-menu-open')
      lenis?.start()
    }
  }, [lenis, menuOpen])

  return (
    <ReactLenis root options={{ lerp: 0.075, wheelMultiplier: 0.9, smoothWheel: true, syncTouch: false, autoRaf: true }}>
      <ScrollProgress />
      <SmoothHashNavigation />
      <CustomCursor />
      <header className={`site-header ${aboutOpen ? 'is-about-header' : ''}`}>
        <a className="wordmark" href={aboutOpen ? '/' : '#home'} onClick={aboutOpen ? (event) => { event.preventDefault(); closeMenu(); window.history.pushState(null, '', '/'); setAboutOpen(false); lenis?.scrollTo(0, { immediate: true }) } : closeMenu} aria-label="Hades home">Hades.dev</a>
        <button className="menu-toggle" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>
          <svg viewBox="0 0 32 32" aria-hidden="true"><path className="menu-line menu-line-top" d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22" /><path className="menu-line" d="M7 16 27 16" /></svg>
        </button>
      </header>
      <nav className={`mobile-menu ${menuOpen ? 'is-open' : ''}`} aria-label="Mobile navigation" inert={!menuOpen}>
        {navigation.map((item, index) => <a href={item === 'ABOUT' ? '/about' : item === 'CONTACT' ? '#contact-card' : `#${item.toLowerCase()}`} key={item} onClick={(event) => navigateItem(event, item)}><span>0{index + 1}</span>{item}</a>)}
        <p>DESIGNING DIGITAL THINGS WITH INTENTION.</p>
      </nav>
      <nav className="side-nav" aria-label="Section navigation">
        {navigation.map((item, index) => <a href={item === 'ABOUT' ? '/about' : item === 'CONTACT' ? '#contact-card' : `#${item.toLowerCase()}`} key={item} onClick={(event) => navigateItem(event, item)}><span>0{index + 1}</span>{item}</a>)}
      </nav>
      {aboutOpen ? <AboutPage onHome={() => { window.history.pushState(null, '', '/'); setAboutOpen(false) }} onContact={() => { window.history.pushState(null, '', '/about#contact-card'); setContactOpen(true) }} /> : <main>
        <MotionSection className="hero section-shell" id="home">
          <Reveal className="hero-topline"><span>PORTFOLIO / 2025—26</span><span>BASED IN THE PHILIPPINES / WORKING EVERYWHERE</span></Reveal>
          <Reveal className="hero-title-wrap"><h1 className="glitch-title">MAKE IT<br /><span>MATTER.</span></h1></Reveal>
          <Reveal className="hero-bottom"><a className="scroll-cue" href="#about"><ArrowDown size={16} strokeWidth={1.5} /><span>SCROLL TO EXPLORE</span></a></Reveal>
          <div className="hero-mark" aria-hidden="true">H</div>
        </MotionSection>
        <MotionSection className="about section-shell" id="about">
          <Reveal className="section-heading"><span>01 / ABOUT</span></Reveal>
          <div className="about-grid"><Reveal><h2 className="glitch-title">GOOD WORK<br />STARTS WITH<br /><span>GOOD QUESTIONS.</span></h2></Reveal><Reveal className="about-copy"><p className="lead">I bring thoughtful ideas to life through design and code.</p><p>I like taking an idea from a rough sketch to something people can actually use, while making sure the small details feel right along the way.</p><a className="text-link" href="/about" onClick={openAbout}>A LITTLE MORE ABOUT ME <ArrowUpRight size={15} /></a></Reveal></div>
        </MotionSection>
        <MotionSection className="skills section-shell" id="skills">
          <Reveal className="section-heading skills-heading"><span>02 / CAPABILITIES</span></Reveal>
          <Reveal className="skills-intro"><h2 className="glitch-title">SMALL DETAILS.<br /><span>BIG PICTURE.</span></h2><p>A focused toolkit for making ideas useful, distinct, and ready for the real world.</p></Reveal>
          <div className="skill-list">{capabilities.map(({ number, title, summary, technologies }) => {
            const isOpen = activeCapability === number
            return <Reveal className="skill-reveal" key={number}><div className={`skill-item ${isOpen ? 'is-expanded' : ''}`}><button className="skill-row" type="button" aria-expanded={isOpen} onClick={() => setActiveCapability(isOpen ? null : number)}><span>{number}</span><h3>{title}</h3><p>{summary}</p><ArrowUpRight size={17} /></button><div className="skill-detail" aria-hidden={!isOpen}><TechnologyMarquee technologies={technologies} /></div></div></Reveal>
          })}</div>
        </MotionSection>
        <MotionSection className="projects section-shell" id="projects">
          <Reveal className="section-heading"><span>03 / SELECTED PROJECTS</span></Reveal>
          <Reveal className="projects-heading"><h2 className="glitch-title">MADE WITH<br /><span>INTENTION.</span></h2><p>A few things shaped by curiosity,<br />collaboration, and a little bit of nerve.</p></Reveal>
          <div className="project-list">{projects.map((project, index) => <ProjectCard key={project.name} project={project} index={index} />)}</div>
        </MotionSection>
        <MotionSection className="contact section-shell" id="contact">
          <Reveal className="section-heading contact-heading"><span>04 / GET IN TOUCH</span></Reveal>
          <Reveal className="contact-content"><a href="#contact-card" onClick={openContact}>LET'S TALK<span><ArrowUpRight size={25} /></span></a></Reveal>
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
  const [activeCertificate, setActiveCertificate] = useState<{ certificate: Certificate; origin: HTMLButtonElement; scrollY: number } | null>(null)
  const originRef = useRef<HTMLButtonElement | null>(null)
  const originOpacityRef = useRef('')
  const openCertificate = (certificate: Certificate, event: React.MouseEvent<HTMLButtonElement>) => {
    originRef.current = event.currentTarget
    originOpacityRef.current = event.currentTarget.style.opacity
    event.currentTarget.style.opacity = '0'
    setActiveCertificate({ certificate, origin: event.currentTarget, scrollY: window.scrollY })
  }
  const closeCertificate = () => {
    setActiveCertificate(null)
  }

  useLayoutEffect(() => {
    if (activeCertificate || !originRef.current) return
    const origin = originRef.current
    origin.style.opacity = originOpacityRef.current
    originRef.current = null
    requestAnimationFrame(() => origin.focus({ preventScroll: true }))
  }, [activeCertificate])

  return (
    <main className="about-page">
      <section className="about-page-hero">
        <div className="about-page-intro">
          <Reveal className="portrait-holder"><div className="portrait-frame"><img className="portrait-image" src="/images/my-img.png" alt="Portrait of Haydrian Tumbagahon" /><span className="portrait-caption">PORTRAIT / 2026</span><span className="portrait-coordinates">14° 35' N<br />120° 59' E</span></div></Reveal>
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
        <Reveal className="section-heading certification-heading"><span>02 / CERTIFICATIONS</span></Reveal>
        <div className="certification-panel">
          <Reveal className="certification-intro"><h2>PROOF OF<br /><span>PROGRESS.</span></h2><p>A selection of language, networking, and technical support learning milestones.</p></Reveal>
          <div className="certification-list">
            {certificates.map((certificate, index) => (
              <Reveal className="certification-row-reveal" key={certificate.name}>
                <button className="certification-row" type="button" aria-label={`View certificate: ${certificate.name}`} onClick={(event) => openCertificate(certificate, event)}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <p>{certificate.name}{certificate.detail && <small>{certificate.detail}</small>}</p>
                  {certificate.issuer && <span>{certificate.issuer}</span>}
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="about-personality">
        <Reveal className="section-heading personality-heading"><span>03 / OFF THE SCREEN</span></Reveal>
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
      {activeCertificate && (
        <CertificateViewer
          certificate={activeCertificate.certificate}
          imageSrc={certificateImages[`./assets/certificates/${activeCertificate.certificate.image}`]}
          origin={activeCertificate.origin}
          scrollY={activeCertificate.scrollY}
          onClose={closeCertificate}
        />
      )}
    </main>
  )
}

function CertificateViewer({ certificate, imageSrc, origin, scrollY, onClose }: { certificate: Certificate; imageSrc: string | undefined; origin: HTMLButtonElement; scrollY: number; onClose: () => void }) {
  const lenis = useLenis()
  const [phase, setPhase] = useState<'opening' | 'open' | 'closing'>(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'open' : 'opening')
  const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>(imageSrc ? 'loading' : 'error')
  const backdropRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const imageSurfaceRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const magnifierRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const longPressRef = useRef<number | null>(null)
  const touchPointerRef = useRef<number | null>(null)
  const touchMagnifierActiveRef = useRef(false)
  const pointerPositionRef = useRef<{ x: number; y: number } | null>(null)
  const closingRef = useRef(false)

  useLayoutEffect(() => {
    const body = document.body
    const html = document.documentElement
    const root = document.getElementById('root')
    const bodyStyle = body.getAttribute('style')
    const htmlStyle = html.getAttribute('style')
    const rootWasInert = root?.inert ?? false
    const scrollbarWidth = window.innerWidth - html.clientWidth
    const bodyPaddingRight = Number.parseFloat(getComputedStyle(body).paddingRight) || 0
    lenis?.stop()
    if (root) root.inert = true
    html.style.overflow = 'hidden'
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'
    body.style.overflow = 'hidden'
    if (scrollbarWidth) body.style.paddingRight = `${bodyPaddingRight + scrollbarWidth}px`

    return () => {
      if (bodyStyle === null) body.removeAttribute('style')
      else body.setAttribute('style', bodyStyle)
      if (htmlStyle === null) html.removeAttribute('style')
      else html.setAttribute('style', htmlStyle)
      if (root) root.inert = rootWasInert
      lenis?.start()
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollY)
        lenis?.scrollTo(scrollY, { immediate: true, force: true })
      })
    }
  }, [lenis, scrollY])

  useLayoutEffect(() => {
    const panel = panelRef.current
    const initialRect = origin.getBoundingClientRect()
    const viewerRect = panel?.getBoundingClientRect()
    if (!panel || !viewerRect) return
    closeButtonRef.current?.focus({ preventScroll: true })
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    panel.style.transformOrigin = 'top left'
    const dx = initialRect.left - viewerRect.left
    const dy = initialRect.top - viewerRect.top
    const sx = initialRect.width / viewerRect.width
    const sy = initialRect.height / viewerRect.height
    const animation = panel.animate(
      [
        { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, opacity: 0.9 },
        { transform: 'translate(0, 0) scale(1, 1)', opacity: 1 },
      ],
      { duration: 760, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' },
    )
    animation.finished.then(() => {
      panel.style.transform = 'none'
      panel.style.transformOrigin = 'center'
      if (!closingRef.current) setPhase('open')
    }, () => {})
    return () => animation.cancel()
  }, [origin])

  useEffect(() => {
    const backdrop = backdropRef.current
    if (!backdrop) return
    const preventScroll = (event: Event) => event.preventDefault()
    backdrop.addEventListener('wheel', preventScroll, { passive: false })
    backdrop.addEventListener('touchmove', preventScroll, { passive: false })
    return () => {
      backdrop.removeEventListener('wheel', preventScroll)
      backdrop.removeEventListener('touchmove', preventScroll)
    }
  }, [])

  const hideMagnifier = useCallback(() => {
    if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current)
    animationFrameRef.current = null
    magnifierRef.current?.classList.remove('is-visible')
  }, [])

  const updateMagnifier = (x: number, y: number) => {
    pointerPositionRef.current = { x, y }
    if (animationFrameRef.current !== null) return
    animationFrameRef.current = requestAnimationFrame(() => {
      animationFrameRef.current = null
      const surface = imageSurfaceRef.current
      const image = imageRef.current
      const lens = magnifierRef.current
      const point = pointerPositionRef.current
      if (!surface || !image || !lens || !point || !image.naturalWidth || !image.naturalHeight) return
      const surfaceRect = surface.getBoundingClientRect()
      const imageRect = image.getBoundingClientRect()
      const scale = Math.min(imageRect.width / image.naturalWidth, imageRect.height / image.naturalHeight)
      const renderedWidth = image.naturalWidth * scale
      const renderedHeight = image.naturalHeight * scale
      const imageLeft = imageRect.left + (imageRect.width - renderedWidth) / 2
      const imageTop = imageRect.top + (imageRect.height - renderedHeight) / 2
      const imageX = point.x - imageLeft
      const imageY = point.y - imageTop
      if (imageX < 0 || imageY < 0 || imageX > renderedWidth || imageY > renderedHeight) {
        lens.classList.remove('is-visible')
        return
      }
      const zoom = 2.8
      const diameter = lens.offsetWidth
      lens.style.backgroundSize = `${renderedWidth * zoom}px ${renderedHeight * zoom}px`
      const desiredLeft = point.x - surfaceRect.left - diameter / 2
      const verticalOffset = touchMagnifierActiveRef.current ? diameter * 1.1 : diameter / 2
      const desiredTop = point.y - surfaceRect.top - verticalOffset
      const left = Math.min(Math.max(desiredLeft, 0), Math.max(0, surfaceRect.width - diameter))
      const top = Math.min(Math.max(desiredTop, 0), Math.max(0, surfaceRect.height - diameter))
      lens.style.backgroundPosition = `${point.x - surfaceRect.left - left - imageX * zoom}px ${point.y - surfaceRect.top - top - imageY * zoom}px`
      lens.style.transform = `translate3d(${left}px, ${top}px, 0)`
      lens.classList.add('is-visible')
    })
  }

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'touch' || imageStatus !== 'loaded') return
    touchPointerRef.current = event.pointerId
    touchMagnifierActiveRef.current = false
    pointerPositionRef.current = { x: event.clientX, y: event.clientY }
    event.currentTarget.setPointerCapture(event.pointerId)
    longPressRef.current = window.setTimeout(() => {
      touchMagnifierActiveRef.current = true
      const point = pointerPositionRef.current
      if (point) updateMagnifier(point.x, point.y)
    }, 350)
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') {
      if (touchPointerRef.current === event.pointerId) {
        pointerPositionRef.current = { x: event.clientX, y: event.clientY }
        if (touchMagnifierActiveRef.current) updateMagnifier(event.clientX, event.clientY)
      }
    } else if (imageStatus === 'loaded' && phase === 'open') {
      updateMagnifier(event.clientX, event.clientY)
    }
  }

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (touchPointerRef.current !== event.pointerId) return
    if (longPressRef.current !== null) window.clearTimeout(longPressRef.current)
    longPressRef.current = null
    touchPointerRef.current = null
    touchMagnifierActiveRef.current = false
    hideMagnifier()
  }

  const requestClose = useCallback(async () => {
    if (closingRef.current) return
    closingRef.current = true
    setPhase('closing')
    hideMagnifier()
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    await new Promise((resolve) => window.setTimeout(resolve, reducedMotion ? 120 : 180))
    const panel = panelRef.current
    if (!panel) {
      onClose()
      return
    }

    if (reducedMotion) {
      onClose()
      return
    }
    const viewerRect = panel.getBoundingClientRect()
    const targetRect = origin.getBoundingClientRect()
    const dx = targetRect.left - viewerRect.left
    const dy = targetRect.top - viewerRect.top
    const sx = targetRect.width / viewerRect.width
    const sy = targetRect.height / viewerRect.height
    panel.style.transformOrigin = 'top left'
    const animation = panel.animate(
      [
        { transform: 'translate(0, 0) scale(1, 1)', opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, opacity: 0.9 },
      ],
      { duration: 700, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' },
    )
    animation.finished.then(onClose, onClose)
  }, [hideMagnifier, onClose, origin])

  useEffect(() => {
    const panel = panelRef.current
    const closeButton = closeButtonRef.current
    if (!panel || !closeButton) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        void requestClose()
      } else if (event.key === 'Tab') {
        event.preventDefault()
        closeButton.focus()
      } else if ((event.key !== ' ' || event.target !== closeButton) && [' ', 'PageUp', 'PageDown', 'Home', 'End', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault()
      }
    }
    const onFocusIn = (event: FocusEvent) => {
      if (!panel.contains(event.target as Node)) closeButton.focus()
    }
    document.addEventListener('keydown', onKeyDown, true)
    document.addEventListener('focusin', onFocusIn, true)
    return () => {
      document.removeEventListener('keydown', onKeyDown, true)
      document.removeEventListener('focusin', onFocusIn, true)
    }
  }, [requestClose])

  const onBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) void requestClose()
  }

  const onPointerLeave = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'touch' || !touchMagnifierActiveRef.current) hideMagnifier()
  }

  useEffect(() => () => {
    if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current)
    if (longPressRef.current !== null) window.clearTimeout(longPressRef.current)
  }, [])

  const imageStyle: CSSProperties = imageSrc ? { backgroundImage: `url("${imageSrc}")` } : {}

  return createPortal(
    <div ref={backdropRef} className="certificate-viewer-backdrop" data-phase={phase} onClick={onBackdropClick}>
      <section ref={panelRef} className="certificate-viewer-panel" role="dialog" aria-modal="true" aria-label={`Certificate viewer: ${certificate.name}`}>
        <button ref={closeButtonRef} className="certificate-viewer-close" type="button" aria-label="Close certificate viewer" onClick={() => void requestClose()}><X size={22} /></button>
        <div
          ref={imageSurfaceRef}
          className="certificate-viewer-image-surface"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerLeave={onPointerLeave}
        >
          {imageStatus === 'loading' && <span className="certificate-viewer-status" role="status">LOADING CERTIFICATE…</span>}
          {imageStatus === 'error' && <span className="certificate-viewer-status" role="alert">CERTIFICATE IMAGE COULD NOT BE LOADED.</span>}
          {imageSrc && <img ref={imageRef} className="certificate-viewer-image" src={imageSrc} alt={certificate.name} onLoad={() => setImageStatus('loaded')} onError={() => setImageStatus('error')} />}
          <div ref={magnifierRef} className="certificate-viewer-magnifier" style={imageStyle} aria-hidden="true" />
        </div>
        <p className="certificate-viewer-caption">{certificate.name}</p>
      </section>
    </div>,
    document.body,
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

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [imageAvailable, setImageAvailable] = useState(Boolean(project.image))
  const cardClassName = `project-card${project.image ? ` project-image-${project.image}` : ''}`
  const cardContent = (
    <>
      <div className="project-art">
        <div className="project-art-fallback" aria-hidden="true"><span>{project.fallback}</span></div>
        {imageAvailable && project.image && <img src={`/images/${project.image}.png`} alt={`${project.name} application`} loading="lazy" onError={() => setImageAvailable(false)} />}
        <span className="project-open"><ArrowUpRight size={20} /></span>
      </div>
      <div className="project-info"><span>0{index + 1} / {project.category}</span><h3>{project.name}</h3><span>{project.year} <ArrowUpRight size={15} /></span></div>
    </>
  )
  return (
    <Reveal className="project-reveal">
      {project.href
        ? <a className={cardClassName} href={project.href} target="_blank" rel="noreferrer">{cardContent}</a>
        : <div className={cardClassName}>{cardContent}</div>}
    </Reveal>
  )
}