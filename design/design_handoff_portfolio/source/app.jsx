/* global React, ReactDOM, Nav, Hero, WorkSection, WritingSection, ContactFooter,
   ProjectDetail, ArchiveView, BlogPost, WritingIndex, lucide */
const { useState, useEffect } = React;

function App() {
  const [lang, setLang] = useState('en');
  const [view, setView] = useState({ route: 'home', id: null });
  const go = (route, id = null) => {
    if (route === 'about') {
      setView({ route: 'home', id: null });
      setTimeout(() => {
        const el = document.getElementById('about');
        const sc = document.querySelector('.lv-scroll');
        if (el && sc) sc.scrollTo({ top: el.offsetTop - 64, behavior: 'smooth' });
      }, 60);
      return;
    }
    setView({ route, id });
    document.querySelector('.lv-scroll')?.scrollTo({ top: 0, behavior: 'auto' });
  };
  // active nav id for highlight
  const navId = ['work', 'project', 'archive'].includes(view.route) ? 'work'
    : ['writing', 'post'].includes(view.route) ? 'writing'
    : view.route === 'about' ? 'about' : '';

  useEffect(() => { if (window.lucide) lucide.createIcons(); });

  let content;
  switch (view.route) {
    case 'project': content = <ProjectDetail id={view.id} lang={lang} go={go} />; break;
    case 'archive': content = <ArchiveView lang={lang} go={go} />; break;
    case 'post': content = <BlogPost id={view.id} lang={lang} go={go} />; break;
    case 'writing': content = <WritingIndex lang={lang} go={go} />; break;
    case 'about': content = <AboutView lang={lang} go={go} />; break;
    default: content = (
      <React.Fragment>
        <Hero lang={lang} go={go} />
        <AboutView lang={lang} go={go} embedded={true} />
        <WorkSection lang={lang} go={go} />
        <WritingSection lang={lang} go={go} />
        <Testimonials lang={lang} />
        <ContactFooter lang={lang} go={go} />
      </React.Fragment>
    );
  }
  const inner = view.route === 'home';
  return (
    <div className="lv-app">
      <Nav route={navId} go={go} lang={lang} setLang={setLang} />
      <main className={`lv-scroll ${inner ? '' : 'lv-scroll-pad'}`}>
        {content}
        {!inner && view.route !== 'home' && <MiniFooter />}
      </main>
    </div>
  );
}

function AboutView_OLD_UNUSED({ lang, go }) {
  const isP = lang === 'pt';
  return null;
}

function MiniFooter() {
  return (
    <div className="lv-footer-bar lv-footer-bar-mini">
      <div className="lv-footer-mark"><span className="lv-footer-lv">LV</span>
        <span className="lv-footer-name">Leonardo Lima de Vasconcellos</span></div>
      <span className="lv-footer-meta">Joinville · SC · Brasil</span>
    </div>
  );
}

Object.assign(window, { MiniFooter });
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
