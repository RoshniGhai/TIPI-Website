/**
 * @typedef {{ label: string, href: string, hasDropdown?: boolean }} NavItem
 * @typedef {{ label: string, href: string }} Action
 * @typedef {{ id: string, title: string, excerpt?: string, image: string, date: string, readTime?: string, author?: string, tags?: string[], href: string }} Insight
 * @typedef {{ id: string, title: string, image: string, date: string, location: string, href: string }} EventCard
 * @typedef {{ id: string, title: string, type: 'Image' | 'Video', image: string, href: string, featured?: boolean }} MediaItem
 */

const asset = (name) => `/figma-assets/${name}`;

export const homePageContent = {
  logo: {
    mark: 'IPI',
    title: 'The India\nProsperity\nInitiative',
    image: asset('logo-header.svg'),
    footerImage: asset('logo-footer.svg'),
  },
  navigation: [
    { label: 'Verticals', href: '#verticals', hasDropdown: true },
    { label: 'Insights', href: '/insights' },
    { label: 'Events', href: '/events' },
    { label: 'People', href: '/people' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
  ],
  headerCta: { label: 'Subscribe', href: '#subscribe' },
  heroSlides: [
    {
      id: 'olympics-2028',
      slug: 'olympics-2028',
      title: 'India at Olympics 2028',
      excerpt:
        'A comprehensive analysis of India\'s growing presence and aspirations on the global sports stage ahead of the 2028 Olympics.',
      image: asset('hero.jpg'),
      date: '26 Feb 2026',
      readTime: '8 Min Read',
      author: 'Aryan Choudhary',
      href: '/insights/olympics-2028',
    },
    {
      id: 'national-ambition',
      slug: 'national-ambition',
      title: 'India Builds Global Sporting Ambition',
      excerpt:
        'A forward-looking view of infrastructure, talent pipelines, and civic pride powering the next generation.',
      image: asset('hero.jpg'),
      date: '12 Mar 2026',
      readTime: '6 Min Read',
      author: 'Anaya Singh',
      href: '/insights/national-ambition',
    },
    {
      id: 'city-games',
      slug: 'city-games',
      title: 'Cities Prepare for a Bigger Stage',
      excerpt:
        'How major urban centers are planning mobility, tourism, and public spaces for international events.',
      image: asset('hero.jpg'),
      date: '09 Apr 2026',
      readTime: '7 Min Read',
      author: 'Rhea Mehta',
      href: '/insights/city-games',
    },
    {
      id: 'flagship-moment',
      slug: 'flagship-moment',
      title: 'A Flagship Moment for Young India',
      excerpt:
        'Policy, participation, and opportunity come together in a year of national aspiration.',
      image: asset('hero.jpg'),
      date: '22 Apr 2026',
      readTime: '5 Min Read',
      author: 'Aryan Choudhary',
      href: '/insights/flagship-moment',
    },
  ],
  insights: [
    {
      id: 'g20-feature',
      slug: 'g20-feature',
      title: 'G20 Summit: Policy Innovations',
      excerpt:
        'Exploring the new policy frameworks and international collaborations emerging from the latest G20 summit and their impact on emerging economies.',
      content:
        'The latest G20 conversations point toward a more coordinated approach to resilient growth, digital public infrastructure, and trade partnerships. For India, the opportunity lies in translating diplomatic alignment into durable domestic capacity.',
      image: asset('insight-featured.jpg'),
      date: '26 Feb 2026',
      readTime: '8 Min Read',
      author: 'Aryan Choudhary',
      tags: ['Olympics', 'India'],
      href: '/insights/g20-feature',
      featured: true,
      media: [
        {
          id: 'parliament-video',
          title: 'Parliamentary Highlights',
          description: 'A short video from the latest public policy briefing.',
          type: 'Video',
          image: asset('media-featured.png'),
        },
      ],
    },
    {
      id: 'policy-house',
      slug: 'policy-house',
      title: 'Tech Regulation Debates',
      excerpt:
        'How governments are tackling the challenges of AI regulation while maintaining a pro-innovation stance in the tech sector.',
      content:
        'Technology regulation is shifting from broad principle-setting toward sector-specific guardrails. The best frameworks protect citizens while leaving room for experimentation, investment, and open competition.',
      image: asset('insight-1.png'),
      date: '26 Feb 2026',
      readTime: '8 Min Read',
      author: 'Anaya Singh',
      tags: ['Olympics', 'India'],
      href: '/insights/policy-house',
      media: [
        {
          id: 'print-image',
          title: 'Daily press briefing',
          description: 'A quiet moment from the daily press briefing desk.',
          type: 'Image',
          image: asset('media-1.png'),
        },
      ],
    },
    {
      id: 'voices',
      slug: 'voices',
      title: 'The Future of Urban Transit',
      excerpt:
        'A look into the sustainable mobility solutions being adopted by major metropolises to combat climate change and congestion.',
      content:
        'Urban transit is becoming a core economic policy question. Cities that integrate buses, rail, walking, cycling, and data systems can reduce congestion while expanding access to opportunity.',
      image: asset('insight-2.png'),
      date: '26 Feb 2026',
      readTime: '8 Min Read',
      author: 'Rhea Mehta',
      tags: ['Olympics', 'India'],
      href: '/insights/voices',
      media: [
        {
          id: 'columns',
          title: 'Public institutions',
          description: 'Institutional spaces shaping public conversation.',
          type: 'Image',
          image: asset('media-2.png'),
        },
      ],
    },
    {
      id: 'newspaper',
      slug: 'newspaper',
      title: 'Global Economic Outlook 2026',
      excerpt:
        'Leading economists weigh in on the anticipated growth trends, inflation risks, and market dynamics for the upcoming fiscal year.',
      content:
        'The 2026 economic outlook is marked by cautious optimism: moderating inflation, renewed capital investment, and tighter scrutiny of public spending. India remains well placed if productivity reforms continue.',
      image: asset('insight-3.png'),
      date: '26 Feb 2026',
      readTime: '8 Min Read',
      author: 'Aryan Choudhary',
      tags: ['Olympics', 'India'],
      href: '/insights/newspaper',
      media: [
        {
          id: 'climate',
          title: 'Civic climate action',
          description: 'Citizens and institutions working on climate action.',
          type: 'Image',
          image: asset('media-3.png'),
        },
      ],
    },
    {
      id: 'digital-public-infra',
      slug: 'digital-public-infra',
      title: 'Digital Public Infrastructure at Scale',
      excerpt:
        'How interoperable identity, payments, and data rails can unlock new models for inclusive service delivery.',
      content:
        'Digital public infrastructure succeeds when it is reliable, open, and citizen-centered. The next phase is less about launching rails and more about improving trust, consent, and last-mile usefulness.',
      image: asset('opportunity-insight-featured.jpg'),
      date: '20 Feb 2026',
      readTime: '7 Min Read',
      author: 'Meera Kapoor',
      tags: ['Technology', 'Governance'],
      href: '/insights/digital-public-infra',
      media: [
        {
          id: 'watch-video',
          title: 'Policy timepiece',
          description: 'A visual note on time, policy, and public memory.',
          type: 'Video',
          image: asset('media-4.png'),
        },
      ],
    },
    {
      id: 'manufacturing-corridors',
      slug: 'manufacturing-corridors',
      title: 'Manufacturing Corridors and Jobs',
      excerpt:
        'A field view of how logistics, skilling, and state capacity shape India’s manufacturing competitiveness.',
      content:
        'Manufacturing corridors are most effective when infrastructure planning is paired with training systems, predictable land processes, and supplier networks that help smaller firms scale.',
      image: asset('opportunity-insight-1.png'),
      date: '18 Feb 2026',
      readTime: '6 Min Read',
      author: 'Kabir Rao',
      tags: ['Economy', 'Jobs'],
      href: '/insights/manufacturing-corridors',
    },
    {
      id: 'green-finance',
      slug: 'green-finance',
      title: 'Green Finance for Growing Cities',
      excerpt:
        'Why municipal finance reform is becoming central to climate resilience and urban prosperity.',
      content:
        'Green finance must move closer to city governments. Better project preparation, transparent revenue models, and accountable delivery can unlock long-term capital for resilience.',
      image: asset('opportunity-insight-2.png'),
      date: '15 Feb 2026',
      readTime: '5 Min Read',
      author: 'Naina Bose',
      tags: ['Climate', 'Cities'],
      href: '/insights/green-finance',
    },
    {
      id: 'sports-economy',
      slug: 'sports-economy',
      title: 'The Sports Economy Opportunity',
      excerpt:
        'A closer look at stadiums, leagues, athlete pipelines, and the public value of sporting ecosystems.',
      content:
        'Sports policy is increasingly economic policy. Strong local leagues, transparent federations, and better facilities can create jobs while strengthening civic pride.',
      image: asset('detail-similar-3.png'),
      date: '12 Feb 2026',
      readTime: '8 Min Read',
      author: 'Aryan Choudhary',
      tags: ['Sports', 'Growth'],
      href: '/insights/sports-economy',
    },
    {
      id: 'public-health-systems',
      slug: 'public-health-systems',
      title: 'Public Health Systems After the Pandemic',
      excerpt:
        'What resilient primary care, data systems, and local delivery networks can teach policymakers.',
      content:
        'Public health resilience depends on everyday capacity, not only emergency response. The strongest systems invest in local clinics, surveillance, supply chains, and trust.',
      image: asset('detail-similar-2.png'),
      date: '09 Feb 2026',
      readTime: '9 Min Read',
      author: 'Rhea Mehta',
      tags: ['Health', 'Policy'],
      href: '/insights/public-health-systems',
    },
  ],
  events: [
    {
      id: 'auto-expo-1',
      slug: 'auto-expo-1',
      title: 'Auto Expo (Upcoming)',
      image: asset('event-1.png'),
      date: '26 Nov 2026',
      location: 'New Delhi, India',
      href: '/events/auto-expo-1',
    },
    {
      id: 'auto-expo-2',
      slug: 'auto-expo-2',
      title: 'Auto Expo',
      image: asset('event-2.png'),
      date: '26 Feb 2026',
      location: 'New Delhi, India',
      href: '/events/auto-expo-2',
    },
    {
      id: 'auto-expo-3',
      slug: 'auto-expo-3',
      title: 'Auto Expo (Upcoming)',
      image: asset('event-3.png'),
      date: '15 Dec 2026',
      location: 'New Delhi, India',
      href: '/events/auto-expo-3',
    },
    {
      id: 'auto-expo-4',
      slug: 'auto-expo-4',
      title: 'Auto Expo (Past)',
      image: asset('event-1.png'),
      date: '01 Mar 2026',
      location: 'New Delhi, India',
      href: '/events/auto-expo-4',
    },
    {
      id: 'auto-expo-5',
      slug: 'auto-expo-5',
      title: 'Tech Summit (Upcoming)',
      image: asset('event-2.png'),
      date: '20 Nov 2026',
      location: 'Bangalore, India',
      href: '/events/auto-expo-5',
    },
    {
      id: 'auto-expo-6',
      slug: 'auto-expo-6',
      title: 'Global Forum (Upcoming)',
      image: asset('event-3.png'),
      date: '05 Dec 2026',
      location: 'Mumbai, India',
      href: '/events/auto-expo-6',
    },
    {
      id: 'auto-expo-7',
      slug: 'auto-expo-7',
      title: 'Policy Workshop (Past)',
      image: asset('event-1.png'),
      date: '15 Feb 2026',
      location: 'New Delhi, India',
      href: '/events/auto-expo-7',
    },
  ],
  mediaGallery: [
    {
      id: 'parliament-video',
      title: 'Parliamentary Highlights',
      description: 'A short video from the latest public policy briefing.',
      type: 'Video',
      image: asset('media-featured.png'),
      insightId: 'g20-feature',
      href: '/insights/g20-feature#media-parliament-video',
      featured: true,
    },
    {
      id: 'print-image',
      title: 'Daily press briefing',
      description: 'A quiet moment from the daily press briefing desk.',
      type: 'Image',
      image: asset('media-1.png'),
      insightId: 'policy-house',
      href: '/insights/policy-house#media-print-image',
    },
    {
      id: 'columns',
      title: 'Public institutions',
      description: 'Institutional spaces shaping public conversation.',
      type: 'Image',
      image: asset('media-2.png'),
      insightId: 'voices',
      href: '/insights/voices#media-columns',
    },
    {
      id: 'climate',
      title: 'Civic climate action',
      description: 'Citizens and institutions working on climate action.',
      type: 'Image',
      image: asset('media-3.png'),
      insightId: 'newspaper',
      href: '/insights/newspaper#media-climate',
    },
    {
      id: 'watch-video',
      title: 'Policy timepiece',
      description: 'A visual note on time, policy, and public memory.',
      type: 'Video',
      image: asset('media-4.png'),
      insightId: 'digital-public-infra',
      href: '/insights/digital-public-infra#media-watch-video',
    },
  ],
  footer: {
    subscribeText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
    cta: { label: 'Subscribe', href: '#subscribe' },
    links: [
      { label: 'Insights', href: '/insights' },
      { label: 'Events', href: '/events' },
      { label: 'People', href: '/people' },
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  },
};
