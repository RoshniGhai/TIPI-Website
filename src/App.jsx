import { useEffect, useMemo, useState } from 'react';
import { Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Header } from './components/Header/Header.jsx';
import { HeroCarousel } from './components/HeroCarousel/HeroCarousel.jsx';
import { InsightsSection } from './components/InsightsSection/InsightsSection.jsx';
import { EventsCarousel } from './components/EventsCarousel/EventsCarousel.jsx';
import { MediaGallery } from './components/MediaGallery/MediaGallery.jsx';
import { OpportunityView } from './components/OpportunityView/OpportunityView.jsx';
import { InsightsView } from './components/InsightsView/InsightsView.jsx';
import { InsightDetailView } from './components/InsightDetailView/InsightDetailView.jsx';
import { EventsView } from './components/EventsView/EventsView.jsx';
import { EventDetailView } from './components/EventDetailView/EventDetailView.jsx';
import { AboutView } from './components/AboutView/AboutView.jsx';
import { PeopleView } from './components/PeopleView/PeopleView.jsx';
import { PersonDetailView } from './components/PersonDetailView/PersonDetailView.jsx';
import { ContactView } from './components/ContactView/ContactView.jsx';
import { Footer } from './components/Footer/Footer.jsx';
import { SubscribeModal } from './components/SubscribeModal/SubscribeModal.jsx';
import { CmsPortal } from './cms/CmsPortal.jsx';
import { getEvent, getEvents, getInsight, getInsights } from './services/api.js';
import { getHomePageContent } from './services/homePageService.js';
import styles from './App.module.css';

function getActiveView(pathname) {
  if (pathname.startsWith('/insights/')) return 'insightDetail';
  if (pathname === '/insights') return 'insights';
  if (pathname.startsWith('/events/')) return 'eventDetail';
  if (pathname === '/events') return 'events';
  if (pathname.startsWith('/people/')) return 'personDetail';
  if (pathname === '/people') return 'people';
  if (pathname === '/about') return 'about';
  if (pathname === '/contact') return 'contact';
  if (pathname === '/opportunity') return 'opportunity';
  return 'home';
}

function ScrollToTop() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (hash) {
      window.setTimeout(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 80);
      return;
    }

    window.scrollTo(0, 0);
  }, [hash, pathname]);

  return null;
}

function HomeView({ content }) {
  return (
    <>
      <HeroCarousel slides={content.heroSlides} />
      <InsightsSection insights={content.insights.slice(0, 4)} />
      <EventsCarousel events={content.events} />
      <MediaGallery items={content.mediaGallery} />
    </>
  );
}

function useAsyncContent(loader, fallback, dependencies) {
  const [data, setData] = useState(fallback);

  useEffect(() => {
    let isMounted = true;

    loader()
      .then((result) => {
        if (isMounted) {
          setData(result);
        }
      })
      .catch(() => {
        if (isMounted) {
          setData(fallback);
        }
      });

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return data;
}

function InsightsRoute({ content }) {
  const insights = useAsyncContent(getInsights, content.insights, [content.insights]);

  return <InsightsView insights={insights} />;
}

function InsightDetailRoute({ content }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const fallbackInsights = useMemo(
    () => [...content.insights, ...content.heroSlides],
    [content.heroSlides, content.insights],
  );
  const insights = useAsyncContent(getInsights, fallbackInsights, [fallbackInsights]);
  const fallback = insights.find((item) => item.slug === slug || item.id === slug) || insights[0];
  const insight = useAsyncContent(() => getInsight(slug), fallback, [slug, fallback]);

  return <InsightDetailView insight={insight} insights={insights} onBack={() => navigate('/insights')} />;
}

function EventsRoute({ content }) {
  const events = useAsyncContent(getEvents, content.events, [content.events]);

  return <EventsView events={events} />;
}

function EventDetailRoute({ content }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const fallback = content.events.find((item) => item.slug === slug || item.id === slug) || content.events[0];
  const event = useAsyncContent(() => getEvent(slug), fallback, [slug, fallback]);

  return <EventDetailView event={event} onBack={() => navigate('/events')} />;
}

function App() {
  const [content, setContent] = useState(null);
  const [status, setStatus] = useState('loading');
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const activeView = getActiveView(location.pathname);

  useEffect(() => {
    let isMounted = true;

    getHomePageContent()
      .then((data) => {
        if (isMounted) {
          setContent(data);
          setStatus('ready');
        }
      })
      .catch(() => {
        if (isMounted) {
          setStatus('error');
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (location.pathname.startsWith('/cms')) {
    return (
      <>
        <ScrollToTop />
        <Routes>
          <Route path="/cms/*" element={<CmsPortal />} />
        </Routes>
      </>
    );
  }

  const openRoute = (route) => {
    navigate(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const routeByView = {
    home: '/',
    opportunity: '/opportunity',
    insights: '/insights',
    events: '/events',
    about: '/about',
    people: '/people',
    contact: '/contact',
  };

  if (status === 'loading') {
    return <main className={styles.state}>Loading website content...</main>;
  }

  if (status === 'error') {
    return <main className={styles.state}>Unable to load website content.</main>;
  }

  return (
    <>
      <ScrollToTop />
      <Header
        logo={content.logo}
        navItems={content.navigation}
        cta={content.headerCta}
        activeView={activeView}
        onVerticalSelect={(view) => openRoute(routeByView[view] || '/')}
        onNavSelect={(view) => openRoute(routeByView[view] || '/')}
        onSubscribe={() => setIsSubscribeOpen(true)}
      />
      <main className={styles.page}>
        <Routes>
          <Route path="/" element={<HomeView content={content} />} />
          <Route path="/opportunity" element={<OpportunityView />} />
          <Route path="/insights" element={<InsightsRoute content={content} />} />
          <Route path="/insights/:slug" element={<InsightDetailRoute content={content} />} />
          <Route path="/events" element={<EventsRoute content={content} />} />
          <Route path="/events/:slug" element={<EventDetailRoute content={content} />} />
          <Route path="/about" element={<AboutView />} />
          <Route path="/people" element={<PeopleView onPersonSelect={() => openRoute('/people/meera-kapoor')} />} />
          <Route path="/people/:slug" element={<PersonDetailView onBack={() => openRoute('/people')} />} />
          <Route path="/contact" element={<ContactView />} />
        </Routes>
      </main>
      <Footer logo={content.logo} footer={content.footer} onSubscribe={() => setIsSubscribeOpen(true)} />
      <SubscribeModal isOpen={isSubscribeOpen} onClose={() => setIsSubscribeOpen(false)} />
    </>
  );
}

export default App;
