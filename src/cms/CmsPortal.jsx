import { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  FileText,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  PenLine,
  Plus,
  Search,
  Settings,
  UserPlus,
  Users,
  XCircle,
} from 'lucide-react';
import {
  clearCmsToken,
  cmsConfig,
  cmsDashboard,
  cmsEvents,
  cmsInsights,
  cmsLogin,
  cmsLookups,
  cmsMe,
  cmsUsers,
  createCmsAuthor,
  createCmsCategory,
  createCmsEvent,
  createCmsInsight,
  createCmsSpeaker,
  createCmsUser,
  getCmsToken,
  runEventAction,
  runInsightAction,
} from './cmsApi.js';
import { RichTextEditor } from './RichTextEditor.jsx';
import styles from './CmsPortal.module.css';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'content', label: 'Insights', icon: FileText },
  { id: 'events', label: 'Events', icon: CalendarDays },
  { id: 'people', label: 'People', icon: Users, adminOnly: true },
  { id: 'settings', label: 'Settings', icon: Settings },
];

function statusClass(status) {
  return `${styles.status} ${styles[`status_${status}`] || ''}`;
}

function LoginView({ onLogin }) {
  const [form, setForm] = useState({ username: 'cmsadmin', password: 'admin123' });
  const [status, setStatus] = useState('idle');

  async function submit(event) {
    event.preventDefault();
    setStatus('loading');
    try {
      const user = await cmsLogin(form);
      onLogin(user);
    } catch {
      setStatus('error');
    }
  }

  return (
    <main className={styles.loginPage}>
      <section className={styles.loginPanel}>
        <p className={styles.eyebrow}>TIPI CMS Portal</p>
        <h1>Editorial command center</h1>
        <p>Manage insights, events, approvals, and publishing from one secure workspace.</p>
        <form onSubmit={submit}>
          <label>
            Username
            <input
              value={form.username}
              onChange={(event) => setForm({ ...form, username: event.target.value })}
              autoComplete="username"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              autoComplete="current-password"
              required
            />
          </label>
          <button type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Signing in...' : 'Sign in'}
          </button>
          {status === 'error' ? <span className={styles.errorText}>Invalid CMS credentials.</span> : null}
        </form>
        <div className={styles.loginHint}>
          <span>Admin: cmsadmin / admin123</span>
          <span>Author: cmsauthor / author123</span>
        </div>
      </section>
    </main>
  );
}

function Shell({ user, activeView, setActiveView, onLogout, children }) {
  const visibleNav = navItems.filter((item) => !item.adminOnly || user.role === 'Admin');

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span>TP</span>
          <div>
            <strong>CMS Portal</strong>
            <small>{user.role} Workspace</small>
          </div>
        </div>
        <nav>
          {visibleNav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                className={activeView === item.id ? styles.activeNav : ''}
                type="button"
                onClick={() => setActiveView(item.id)}
                key={item.id}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <button className={styles.helpButton} type="button">
          <HelpCircle size={18} />
          Help Center
        </button>
      </aside>
      <div className={styles.workspace}>
        <header className={styles.topbar}>
          <label className={styles.search}>
            <Search size={18} />
            <input placeholder="Search Insights, Events, or Members..." />
          </label>
          <button className={styles.createButton} type="button" onClick={() => setActiveView('create')}>
            <Plus size={18} />
            Create New
          </button>
          <button className={styles.logoutButton} type="button" onClick={onLogout}>
            <LogOut size={18} />
            Logout
          </button>
        </header>
        {children}
      </div>
    </div>
  );
}

function Dashboard({ data, setActiveView }) {
  const metrics = data?.metrics || {};
  const activity = data?.activity || [];

  return (
    <section className={styles.view}>
      <div className={styles.viewHeader}>
        <p className={styles.eyebrow}>Centralized Content Performance & Strategic Overview</p>
        <h1>Dashboard</h1>
      </div>
      <div className={styles.metricGrid}>
        <article>
          <span>Website Traffic Analysis</span>
          <strong>{metrics.traffic || '+12%'}</strong>
          <small>this month</small>
        </article>
        <article>
          <span>Total Insights Published</span>
          <strong>{metrics.insights || 0}</strong>
          <small>Manage publications</small>
        </article>
        <article>
          <span>Upcoming Events</span>
          <strong>{metrics.events || 0}</strong>
          <small>Next major: Digital Economy Summit</small>
        </article>
        <article>
          <span>Pending Reviews</span>
          <strong>{metrics.pendingReviews || 0}</strong>
          <small>Needs admin attention</small>
        </article>
      </div>
      <div className={styles.dashboardGrid}>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Recent Content Activity</h2>
            <button type="button">View Audit Log</button>
          </div>
          <div className={styles.activityList}>
            {activity.map((item) => (
              <article key={`${item.type}-${item.title}`}>
                <strong>{item.type}: {item.title}</strong>
                <span>{item.status}</span>
              </article>
            ))}
          </div>
        </section>
        <section className={styles.card}>
          <h2>Strategic Quick Actions</h2>
          <div className={styles.quickGrid}>
            <button type="button" onClick={() => setActiveView('create')}><PenLine size={18} />Post Insight</button>
            <button type="button" onClick={() => setActiveView('events')}><CalendarDays size={18} />Create Event</button>
            <button type="button"><BarChart3 size={18} />Full Report</button>
          </div>
          <div className={styles.spotlight}>
            <span>Editorial Spotlight</span>
            <strong>{data?.spotlight?.title || 'Modernizing the Silk Road: Infrastructure 2030'}</strong>
            <p>{data?.spotlight?.content || 'Review the latest multimodal transport study for the western corridor.'}</p>
          </div>
        </section>
      </div>
    </section>
  );
}

function ContentTable({ title, items, type, user, refresh }) {
  const rows = items || [];
  const defaultContentFilter = title === 'Events' ? 'event' : 'all';
  const [contentFilter, setContentFilter] = useState(defaultContentFilter);
  const [statusFilter, setStatusFilter] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');

  useEffect(() => {
    setContentFilter(defaultContentFilter);
    setStatusFilter('');
    setAuthorFilter('');
  }, [defaultContentFilter]);

  const statuses = useMemo(
    () => [...new Set(rows.map((item) => item.status).filter(Boolean))].sort(),
    [rows],
  );
  const authors = useMemo(
    () => [
      ...new Set(
        rows
          .map((item) => (item.contentType || type) === 'insight' ? item.author_name : 'TIPI Editorial')
          .filter(Boolean),
      ),
    ].sort(),
    [rows, type],
  );
  const filteredRows = useMemo(
    () =>
      rows.filter((item) => {
        const itemType = item.contentType || type;
        const itemAuthor = itemType === 'insight' ? item.author_name || 'TIPI Editorial' : 'TIPI Editorial';
        const matchesContent = contentFilter === 'all' || itemType === contentFilter;
        const matchesStatus = !statusFilter || item.status === statusFilter;
        const matchesAuthor = !authorFilter || itemAuthor === authorFilter;

        return matchesContent && matchesStatus && matchesAuthor;
      }),
    [authorFilter, contentFilter, rows, statusFilter, type],
  );

  async function action(item, workflowAction) {
    const itemType = item.contentType || type;
    if (itemType === 'insight') {
      await runInsightAction(item.id, workflowAction);
    } else {
      await runEventAction(item.id, workflowAction);
    }
    refresh();
  }

  return (
    <section className={styles.view}>
      <div className={styles.viewHeader}>
        <p className={styles.eyebrow}>Content Library</p>
        <h1>{title}</h1>
        <p>Manage the digital footprint of the initiative through focused editorial control.</p>
      </div>
      <div className={styles.filters}>
        <button
          className={contentFilter === 'all' ? styles.activeFilter : ''}
          type="button"
          onClick={() => setContentFilter('all')}
        >
          All Content
        </button>
        <button
          className={contentFilter === 'insight' ? styles.activeFilter : ''}
          type="button"
          onClick={() => setContentFilter('insight')}
        >
          Insights
        </button>
        <button
          className={contentFilter === 'event' ? styles.activeFilter : ''}
          type="button"
          onClick={() => setContentFilter('event')}
        >
          Events
        </button>
        <select
          aria-label="Filter by status"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="">All Statuses</option>
          {statuses.map((statusOption) => (
            <option key={statusOption} value={statusOption}>{statusOption}</option>
          ))}
        </select>
        <select
          aria-label="Filter by author"
          value={authorFilter}
          onChange={(event) => setAuthorFilter(event.target.value)}
        >
          <option value="">Any Author</option>
          {authors.map((authorOption) => (
            <option key={authorOption} value={authorOption}>{authorOption}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => {
            setContentFilter(defaultContentFilter);
            setStatusFilter('');
            setAuthorFilter('');
          }}
        >
          Reset
        </button>
      </div>
      <div className={styles.tableCard}>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Author</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((item) => (
              <tr key={`${item.contentType || type}-${item.id}`}>
                <td>
                  <strong>{item.title}</strong>
                  <span>{(item.contentType || type) === 'insight' ? 'Insights Piece' : 'Event'}</span>
                </td>
                <td>{item.category_name || item.category || 'General'}</td>
                <td>{item.author_name || 'TIPI Editorial'}</td>
                <td>{item.date}</td>
                <td><span className={statusClass(item.status)}>{item.status}</span></td>
                <td>
                  <div className={styles.rowActions}>
                    {user.role === 'Author' && item.status === 'draft' ? (
                      <button type="button" onClick={() => action(item, 'submit')}>Submit</button>
                    ) : null}
                    {user.role === 'Admin' && item.status === 'pending' ? (
                      <>
                        <button type="button" onClick={() => action(item, 'approve')}><CheckCircle2 size={14} />Approve</button>
                        <button type="button" onClick={() => action(item, 'reject')}><XCircle size={14} />Reject</button>
                      </>
                    ) : null}
                    {user.role === 'Admin' && item.status !== 'published' ? (
                      <button type="button" onClick={() => action(item, 'publish')}>Publish</button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
            {!filteredRows.length ? (
              <tr>
                <td colSpan="6" className={styles.emptyCell}>No content matches these filters.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function CreateContent({ user, lookups, refresh, setActiveView }) {
  const [kind, setKind] = useState('insight');
  const [status, setStatus] = useState('idle');
  const [mediaConfig, setMediaConfig] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [eventSchedules, setEventSchedules] = useState([{ id: 1 }]);
  const [eventSpeakers, setEventSpeakers] = useState([{ id: 1 }]);
  const firstCategory = lookups.categories?.[0]?.id || '';

  useEffect(() => {
    cmsConfig()
      .then(setMediaConfig)
      .catch(() => setMediaConfig(null));
  }, []);

  const getBase64 = (file) => new Promise((resolve) => {
    if (!file || file.size === 0) return resolve('');
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => resolve('');
  });

  function handleTitleChange(e) {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(
      newTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
    );
  }

  async function save(formElement, action) {
    const form = new FormData(formElement);
    setStatus('loading');
    setErrorMessage('');
    
    try {
      const imageBase64 = await getBase64(form.get('image'));
      const mediaBase64 = await getBase64(form.get('media'));

      const extraImagesFiles = form.getAll('extra_images');
      const extraImagesBase64 = await Promise.all(extraImagesFiles.map(getBase64));
      const hasUploadedMedia = Boolean(imageBase64 || mediaBase64 || extraImagesBase64.some(Boolean));
      if (hasUploadedMedia && mediaConfig?.productionUploadReady === false) {
        throw new Error('Cloudinary is not configured on the backend. Add Cloudinary env variables in Railway, redeploy, then upload images.');
      }

      if (kind === 'insight') {
        await createCmsInsight({
          action,
          title: form.get('title'),
          slug: form.get('slug'),
          category: form.get('category') || firstCategory,
          author: form.get('author') || undefined,
          content: form.get('content'),
          image_note: form.get('image_note'),
          quote: form.get('quote') || '',
          content_url: form.get('content_url'),
          image: imageBase64,
          media: mediaBase64,
          media_url: form.get('media_url'),
          media_type: form.get('media_type'),
          thumbnail_url: form.get('thumbnail_url'),
          media_position: Number(form.get('media_position') || 2),
          media_title: form.get('media_title'),
          media_description: form.get('media_description'),
          extra_images: extraImagesBase64.filter(Boolean),
          place: form.get('place'),
          time_to_read: Number(form.get('time_to_read') || 8),
          date: form.get('date'),
          is_trending: form.get('is_trending') === 'on',
          is_featured: form.get('is_featured') === 'on',
          published_at: new Date().toISOString(),
        });
      } else {
        const schedules = eventSchedules.map((schedule, index) => ({
          description: form.get(`schedule_description_${schedule.id}`),
          end_time: form.get(`schedule_end_time_${schedule.id}`),
          event_date: form.get(`schedule_date_${schedule.id}`) || form.get('date'),
          position: Number(form.get(`schedule_position_${schedule.id}`) || index + 1),
          start_time: form.get(`schedule_start_time_${schedule.id}`),
          title: form.get(`schedule_title_${schedule.id}`),
          venue: form.get(`schedule_venue_${schedule.id}`),
        })).filter((schedule) => schedule.title);
        const speakers = await Promise.all(eventSpeakers.map(async (speaker, index) => ({
          bio: form.get(`speaker_bio_${speaker.id}`),
          company: form.get(`speaker_company_${speaker.id}`),
          designation: form.get(`speaker_designation_${speaker.id}`),
          image: await getBase64(form.get(`speaker_image_${speaker.id}`)),
          image_url: form.get(`speaker_image_url_${speaker.id}`),
          linkedin_url: form.get(`speaker_linkedin_${speaker.id}`),
          name: form.get(`speaker_name_${speaker.id}`),
          position: Number(form.get(`speaker_position_${speaker.id}`) || index + 1),
        })));
        await createCmsEvent({
          action,
          title: form.get('title'),
          slug: form.get('slug'),
          excerpt: form.get('content'),
          description: form.get('content'),
          content_url: form.get('content_url'),
          image: imageBase64,
          media_url: form.get('media_url'),
          media_type: form.get('media_type'),
          thumbnail_url: form.get('thumbnail_url'),
          media_position: Number(form.get('media_position') || 1),
          schedules,
          date: form.get('date'),
          location: form.get('place'),
          venue: form.get('venue'),
          start_time: form.get('start_time'),
          end_time: form.get('end_time'),
          time_slot: form.get('time_slot'),
          category: form.get('event_category'),
          speakers: speakers.filter((speaker) => speaker.name),
          published_at: new Date().toISOString(),
        });
      }
      await refresh();
      setStatus('success');
      setActiveView(kind === 'insight' ? 'content' : 'events');
    } catch (error) {
      setErrorMessage(error?.message || '');
      setStatus('error');
    }
  }

  async function submit(event, action) {
    event.preventDefault();
    await save(event.currentTarget, action);
  }

  const authorSubmitLabel = user.role === 'Author' ? 'Submit for Approval' : 'Publish Now';
  const primaryAction = user.role === 'Author' ? 'submit' : 'publish';

  return (
    <section className={styles.view}>
      <div className={styles.viewHeader}>
        <p className={styles.eyebrow}>Content Creation</p>
        <h1>Create New {kind === 'insight' ? 'Insight' : 'Event'}</h1>
      </div>
      <div className={styles.segmented}>
        <button className={kind === 'insight' ? styles.selected : ''} type="button" onClick={() => setKind('insight')}>Insight</button>
        <button className={kind === 'event' ? styles.selected : ''} type="button" onClick={() => setKind('event')}>Event</button>
      </div>
      <form className={styles.editorForm} onSubmit={(event) => submit(event, primaryAction)}>
        <label>Title<input name="title" value={title} onChange={handleTitleChange} required /></label>
        <label>Slug<input name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required placeholder="future-of-rural-fintech" /></label>
        {kind === 'insight' ? (
          <label>Category
            <select name="category" defaultValue={firstCategory} required>
              {lookups.categories?.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}
            </select>
          </label>
        ) : (
          <label>Event Category<input name="event_category" defaultValue="Leadership Summit" /></label>
        )}
        {kind === 'insight' ? (
          <label>Author
            <select name="author" defaultValue="">
              <option value="">Current CMS user</option>
              {lookups.authors?.map((author) => <option value={author.id} key={author.id}>{author.name}</option>)}
            </select>
          </label>
        ) : null}
        <label>Place / Location<input name="place" required /></label>
        <label>Date<input name="date" type="date" required /></label>
        {kind === 'event' ? (
          <>
            <label>Venue<input name="venue" placeholder="Main Hall / Virtual Hub" /></label>
            <label>Start Time<input name="start_time" type="time" /></label>
            <label>End Time<input name="end_time" type="time" /></label>
            <label>Time Slot<input name="time_slot" placeholder="10:00 AM - 04:00 PM" /></label>
          </>
        ) : null}
        {kind === 'insight' ? <label>Time to Read<input name="time_to_read" type="number" defaultValue="8" min="1" /></label> : null}
        <label className={styles.fullField}>Content URL<input name="content_url" placeholder="s3:// or /content/article.html" /></label>
        
        {kind === 'insight' ? (
          <div className={styles.uploadTemplate}>
            <label>Cover Image
              <input type="file" name="image" accept="image/*" />
              <span>Recommended 1200 x 675 px, 16:9. This becomes the public card and hero image.</span>
            </label>
            <label>Top Multimedia
              <input type="file" name="media" accept="video/*,image/*" />
              <span>Optional video/image for the detail page media block. Use 16:9 assets.</span>
            </label>
            <label>External Media URL
              <input name="media_url" placeholder="/media/... or https://..." />
              <span>Use this if media is already uploaded elsewhere.</span>
            </label>
            <label>Media Type
              <select name="media_type" defaultValue="image">
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </label>
            <label>Thumbnail URL
              <input name="thumbnail_url" placeholder="Required when media type is video" />
              <span>Used as the visible image for videos.</span>
            </label>
            <label>Carousel Position
              <input name="media_position" type="number" min="1" defaultValue="2" />
              <span>Controls media order inside carousel/gallery.</span>
            </label>
            <label>Media One-liner
              <input name="media_description" placeholder="One-line context shown with this media" />
            </label>
            <label>Media Title
              <input name="media_title" placeholder="Short title for media block" />
            </label>
            <label className={styles.fullField}>Extra Images
              <input type="file" name="extra_images" accept="image/*" multiple />
              <span>Optional gallery images, also displayed in a fixed 16:9 template.</span>
            </label>
          </div>
        ) : (
          <div className={styles.uploadTemplate}>
            <label>Event Cover Image
              <input type="file" name="image" accept="image/*" />
              <span>Recommended 1200 x 675 px, 16:9. Nearest upcoming event appears first on homepage.</span>
            </label>
            <label>External Media URL<input name="media_url" placeholder="/media/... or https://..." /></label>
            <label>Media Type
              <select name="media_type" defaultValue="image">
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </label>
            <label>Thumbnail URL<input name="thumbnail_url" placeholder="Required when video is there" /></label>
            <label>Media Position<input name="media_position" type="number" min="1" defaultValue="1" /></label>
          </div>
        )}

        <div className={styles.fullField}>
          <RichTextEditor
            label="Editorial Body"
            name="content"
            placeholder="Use headings, paragraphs, bullet lists, quotes, bold text, and links."
            required
            rows={10}
          />
        </div>
        {kind === 'insight' ? (
          <>
            <div className={styles.fullField}>
              <RichTextEditor
                label="Paragraph Below Image (Optional)"
                name="image_note"
                placeholder="Add optional formatted text that appears below the insight image and above the quote."
                rows={4}
              />
            </div>
            <div className={styles.fullField}>
              <RichTextEditor
                label="Quote (Optional)"
                name="quote"
                placeholder="Add an optional formatted pull quote."
                rows={4}
              />
            </div>
          </>
        ) : null}
        {kind === 'insight' ? (
          <div className={styles.checks}>
            <label><input name="is_trending" type="checkbox" /> Trending</label>
            <label><input name="is_featured" type="checkbox" /> Featured</label>
          </div>
        ) : null}
        {kind === 'event' ? (
          <>
            <section className={`${styles.fullField} ${styles.repeatSection}`}>
              <div className={styles.repeatHeader}>
                <div>
                  <h2>Event Schedule</h2>
                  <p>Add all agenda rows that should appear on the event detail page.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEventSchedules((items) => [...items, { id: Date.now() }])}
                >
                  <Plus size={16} />
                  Add Schedule
                </button>
              </div>
              {eventSchedules.map((schedule, index) => (
                <div className={styles.repeatCard} key={schedule.id}>
                  <label>Schedule Title<input name={`schedule_title_${schedule.id}`} placeholder="Opening Keynote" /></label>
                  <label>Schedule Date<input name={`schedule_date_${schedule.id}`} type="date" /></label>
                  <label>Start Time<input name={`schedule_start_time_${schedule.id}`} type="time" /></label>
                  <label>End Time<input name={`schedule_end_time_${schedule.id}`} type="time" /></label>
                  <label>Venue<input name={`schedule_venue_${schedule.id}`} placeholder="Main Hall" /></label>
                  <label>Order<input name={`schedule_position_${schedule.id}`} type="number" min="1" defaultValue={index + 1} /></label>
                  <div className={styles.fullField}>
                    <RichTextEditor
                      label="Schedule Description"
                      name={`schedule_description_${schedule.id}`}
                      placeholder="Add formatted schedule details."
                      rows={3}
                    />
                  </div>
                  {eventSchedules.length > 1 ? (
                    <button
                      className={styles.removeButton}
                      type="button"
                      onClick={() => setEventSchedules((items) => items.filter((item) => item.id !== schedule.id))}
                    >
                      Remove Schedule
                    </button>
                  ) : null}
                </div>
              ))}
            </section>

            <section className={`${styles.fullField} ${styles.repeatSection}`}>
              <div className={styles.repeatHeader}>
                <div>
                  <h2>Event Speakers</h2>
                  <p>Add multiple speakers with image, designation, organization, and display order.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEventSpeakers((items) => [...items, { id: Date.now() }])}
                >
                  <Plus size={16} />
                  Add Speaker
                </button>
              </div>
              {eventSpeakers.map((speaker, index) => (
                <div className={styles.repeatCard} key={speaker.id}>
                  <label>Speaker Name<input name={`speaker_name_${speaker.id}`} placeholder="Speaker name" /></label>
                  <label>Speaker Designation<input name={`speaker_designation_${speaker.id}`} placeholder="Founder / Policy Expert" /></label>
                  <label>Owner or Founder<input name={`speaker_company_${speaker.id}`} placeholder="Company / Organization" /></label>
                  <label>Speaker Image
                    <input name={`speaker_image_${speaker.id}`} type="file" accept="image/*" />
                    <span>Recommended square portrait, minimum 600 x 600 px.</span>
                  </label>
                  <label>Speaker Image URL<input name={`speaker_image_url_${speaker.id}`} placeholder="/media/... or https://..." /></label>
                  <label>Speaker LinkedIn<input name={`speaker_linkedin_${speaker.id}`} placeholder="https://linkedin.com/in/..." /></label>
                  <label>Speaker Order<input name={`speaker_position_${speaker.id}`} type="number" min="1" defaultValue={index + 1} /></label>
                  <div className={styles.fullField}>
                    <RichTextEditor
                      label="Speaker Bio"
                      name={`speaker_bio_${speaker.id}`}
                      placeholder="Optional formatted speaker bio."
                      rows={3}
                    />
                  </div>
                  {eventSpeakers.length > 1 ? (
                    <button
                      className={styles.removeButton}
                      type="button"
                      onClick={() => setEventSpeakers((items) => items.filter((item) => item.id !== speaker.id))}
                    >
                      Remove Speaker
                    </button>
                  ) : null}
                </div>
              ))}
            </section>
          </>
        ) : null}
        <div className={styles.formActions}>
          <button type="submit">{authorSubmitLabel}</button>
          <button type="button" onClick={(event) => save(event.currentTarget.form, 'draft')}>Save Draft</button>
        </div>
        {mediaConfig?.productionUploadReady === false ? (
          <p className={styles.errorText}>
            Cloudinary is not configured on the backend. Uploaded images will not appear on the live website until Railway has Cloudinary env variables.
          </p>
        ) : null}
        {status === 'error' ? (
          <p className={styles.errorText}>{errorMessage || 'Unable to save content. Check required fields.'}</p>
        ) : null}
      </form>
    </section>
  );
}

function UsersView({ users, refresh }) {
  const [status, setStatus] = useState('idle');

  async function submit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setStatus('loading');
    try {
      await createCmsUser({
        username: data.get('username'),
        email: data.get('email'),
        first_name: data.get('first_name'),
        last_name: data.get('last_name'),
        role: data.get('role'),
        password: data.get('password'),
        is_active: true,
      });
      event.currentTarget.reset();
      await refresh();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section className={styles.view}>
      <div className={styles.viewHeader}>
        <p className={styles.eyebrow}>People</p>
        <h1>User Management</h1>
        <p>Admin users can create CMS members and assign Author or Admin access.</p>
      </div>
      <form className={styles.userForm} onSubmit={submit}>
        <input name="first_name" placeholder="First name" required />
        <input name="last_name" placeholder="Last name" required />
        <input name="username" placeholder="Username" required />
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required />
        <select name="role" defaultValue="Author">
          <option>Author</option>
          <option>Admin</option>
        </select>
        <button type="submit"><UserPlus size={16} />Create User</button>
      </form>
      {status === 'error' ? <p className={styles.errorText}>Unable to create user.</p> : null}
      <div className={styles.userGrid}>
        {users.map((cmsUser) => (
          <article key={cmsUser.id}>
            <strong>{cmsUser.name}</strong>
            <span>{cmsUser.email}</span>
            <small>{cmsUser.role}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function SettingsView({ lookups, refresh }) {
  const [status, setStatus] = useState('idle');

  async function submit(event, type) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setStatus('loading');
    try {
      if (type === 'category') {
        await createCmsCategory({
          name: data.get('name'),
          description: data.get('description'),
        });
      } else if (type === 'author') {
        await createCmsAuthor({
          name: data.get('name'),
          designation: data.get('designation'),
          email: data.get('email'),
          image_url: data.get('image_url'),
          linkedin_url: data.get('linkedin_url'),
          instagram_url: data.get('instagram_url'),
          facebook_url: data.get('facebook_url'),
          twitter_url: data.get('twitter_url'),
          bio_content_url: data.get('bio_content_url'),
        });
      } else {
        await createCmsSpeaker({
          name: data.get('name'),
          designation: data.get('designation'),
          company: data.get('company'),
          image_url: data.get('image_url'),
          bio: data.get('bio'),
          linkedin_url: data.get('linkedin_url'),
        });
      }
      event.currentTarget.reset();
      await refresh();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section className={styles.view}>
      <div className={styles.viewHeader}>
        <p className={styles.eyebrow}>Settings</p>
        <h1>Taxonomy, Authors & Speakers</h1>
        <p>Optional fields from the format sheet are managed here and reused while creating insights and events.</p>
      </div>
      <div className={styles.settingsGrid}>
        <form className={styles.settingsForm} onSubmit={(event) => submit(event, 'category')}>
          <h2>Category</h2>
          <input name="name" placeholder="Category name" required />
          <RichTextEditor
            label="Content of category"
            name="description"
            placeholder="Add formatted category context."
            rows={4}
          />
          <button type="submit">Save Category</button>
        </form>
        <form className={styles.settingsForm} onSubmit={(event) => submit(event, 'author')}>
          <h2>Author</h2>
          <input name="name" placeholder="Name" required />
          <input name="designation" placeholder="Designation" />
          <input name="email" type="email" placeholder="Email" required />
          <input name="image_url" placeholder="Image URL" />
          <input name="linkedin_url" placeholder="LinkedIn URL" />
          <input name="instagram_url" placeholder="Instagram URL" />
          <input name="facebook_url" placeholder="Facebook URL" />
          <input name="twitter_url" placeholder="Twitter/X URL" />
          <input name="bio_content_url" placeholder="About document link" />
          <button type="submit">Save Author</button>
        </form>
        <form className={styles.settingsForm} onSubmit={(event) => submit(event, 'speaker')}>
          <h2>Event Speaker</h2>
          <input name="name" placeholder="Speaker name" required />
          <input name="designation" placeholder="Speaker designation" />
          <input name="company" placeholder="Owner or founder / company" />
          <input name="image_url" placeholder="Speaker image URL" />
          <RichTextEditor
            label="Speaker bio"
            name="bio"
            placeholder="Add formatted speaker bio."
            rows={4}
          />
          <input name="linkedin_url" placeholder="LinkedIn URL" />
          <button type="submit">Save Speaker</button>
        </form>
      </div>
      {status === 'error' ? <p className={styles.errorText}>Unable to save settings item.</p> : null}
      <div className={styles.lookupGrid}>
        <article>
          <strong>Categories</strong>
          {lookups.categories?.map((item) => <span key={item.id}>{item.name}</span>)}
        </article>
        <article>
          <strong>Authors</strong>
          {lookups.authors?.map((item) => <span key={item.id}>{item.name}</span>)}
        </article>
        <article>
          <strong>Speakers</strong>
          {lookups.speakers?.map((item) => <span key={item.id}>{item.name}</span>)}
        </article>
      </div>
    </section>
  );
}

export function CmsPortal() {
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [dashboard, setDashboard] = useState(null);
  const [insights, setInsights] = useState([]);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [lookups, setLookups] = useState({ authors: [], categories: [] });
  const [status, setStatus] = useState(getCmsToken() ? 'loading' : 'login');

  const isAdmin = user?.role === 'Admin';

  async function loadAll() {
    const [dashboardData, lookupData, insightData, eventData] = await Promise.all([
      cmsDashboard(),
      cmsLookups(),
      cmsInsights(),
      cmsEvents(),
    ]);
    setDashboard(dashboardData);
    setLookups(lookupData);
    setInsights(insightData);
    setEvents(eventData);
    if (isAdmin) {
      setUsers(await cmsUsers());
    }
  }

  useEffect(() => {
    if (!getCmsToken()) {
      return;
    }
    cmsMe()
      .then((me) => {
        setUser(me);
        setStatus('ready');
      })
      .catch(() => {
        clearCmsToken();
        setStatus('login');
      });
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }
    loadAll().catch(() => {});
  }, [user]);

  const allContent = useMemo(
    () => [
      ...insights.map((item) => ({ ...item, contentType: 'insight' })),
      ...events.map((item) => ({ ...item, contentType: 'event' })),
    ],
    [insights, events],
  );

  function logout() {
    clearCmsToken();
    setUser(null);
    setStatus('login');
  }

  if (status === 'login') {
    return <LoginView onLogin={(nextUser) => { setUser(nextUser); setStatus('ready'); }} />;
  }

  if (!user) {
    return <main className={styles.loading}>Loading CMS...</main>;
  }

  return (
    <Shell user={user} activeView={activeView} setActiveView={setActiveView} onLogout={logout}>
      {activeView === 'dashboard' ? <Dashboard data={dashboard} setActiveView={setActiveView} /> : null}
      {activeView === 'content' ? <ContentTable title="Content Library" items={allContent} type="insight" user={user} refresh={loadAll} /> : null}
      {activeView === 'events' ? <ContentTable title="Events" items={events} type="event" user={user} refresh={loadAll} /> : null}
      {activeView === 'create' ? <CreateContent user={user} lookups={lookups} refresh={loadAll} setActiveView={setActiveView} /> : null}
      {activeView === 'people' && isAdmin ? <UsersView users={users} refresh={loadAll} /> : null}
      {activeView === 'settings' ? <SettingsView lookups={lookups} refresh={loadAll} /> : null}
    </Shell>
  );
}
