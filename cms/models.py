from django.conf import settings
from django.db import models
from django.utils import timezone


class PublicQuerySet(models.QuerySet):
    def visible(self):
        now = timezone.now()
        return self.filter(
            is_active=True,
            status=Publishable.Status.PUBLISHED,
            published_at__lte=now,
        )


class TimeStamped(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Publishable(TimeStamped):
    class Status(models.TextChoices):
        DRAFT = 'draft', 'Draft'
        PENDING = 'pending', 'Pending'
        APPROVED = 'approved', 'Approved'
        REJECTED = 'rejected', 'Rejected'
        PUBLISHED = 'published', 'Published'

    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    is_active = models.BooleanField(default=True)
    published_at = models.DateTimeField(default=timezone.now, db_index=True)

    objects = PublicQuerySet.as_manager()

    class Meta:
        abstract = True


class Author(TimeStamped):
    name = models.CharField(max_length=160)
    designation = models.CharField(max_length=160, blank=True)
    email = models.EmailField(unique=True)
    image_url = models.CharField(max_length=500, blank=True)
    linkedin_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    facebook_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)
    bio_content_url = models.TextField(blank=True)
    is_superuser = models.BooleanField(default=False)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class Subscriber(TimeStamped):
    name = models.CharField(max_length=160)
    email = models.EmailField(unique=True)
    organization = models.CharField(max_length=180, blank=True)
    otp = models.PositiveIntegerField(null=True, blank=True)
    otp_expiretime = models.DateTimeField(null=True, blank=True)
    otp_verified_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.email


class ContactMessage(TimeStamped):
    name = models.CharField(max_length=160)
    email = models.EmailField()
    phone = models.CharField(max_length=40, blank=True)
    message = models.TextField()
    source = models.CharField(max_length=80, default='website')
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.name} <{self.email}>'


class Category(TimeStamped):
    name = models.CharField(max_length=120, unique=True)
    description = models.TextField(blank=True)

    class Meta:
        verbose_name_plural = 'categories'
        ordering = ['name']

    def __str__(self):
        return self.name


class Banner(Publishable):
    title = models.CharField(max_length=180)
    subtitle = models.TextField(blank=True)
    image_url = models.CharField(max_length=500, blank=True)
    cta_label = models.CharField(max_length=80, blank=True)
    cta_url = models.CharField(max_length=255, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', '-published_at']

    def __str__(self):
        return self.title


class Insight(Publishable):
    title = models.CharField(max_length=220)
    slug = models.SlugField(unique=True)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='insights')
    content_url = models.CharField(max_length=500, blank=True)
    content = models.TextField(blank=True)
    image_note = models.TextField(blank=True)
    quote = models.TextField(blank=True)
    place = models.CharField(max_length=160, blank=True)
    time_to_read = models.PositiveIntegerField(default=8)
    date = models.DateField(default=timezone.localdate, db_index=True)
    author = models.ForeignKey(Author, on_delete=models.PROTECT, related_name='insights')
    approved_by = models.ForeignKey(
        Author,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='approved_insights',
    )
    like_count = models.PositiveIntegerField(default=0)
    comment_count = models.PositiveIntegerField(default=0)
    is_trending = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)

    class Meta:
        ordering = ['-date', '-published_at']

    def __str__(self):
        return self.title


class InsightMedia(TimeStamped):
    class MediaType(models.TextChoices):
        IMAGE = 'image', 'Image'
        VIDEO = 'video', 'Video'

    insight = models.ForeignKey(Insight, on_delete=models.CASCADE, related_name='media')
    title = models.CharField(max_length=180, blank=True)
    description = models.CharField(max_length=240, blank=True)
    media_url = models.TextField()
    thumbnail_url = models.CharField(max_length=500, blank=True)
    media_type = models.CharField(max_length=20, choices=MediaType.choices)
    mime_type = models.CharField(max_length=120, blank=True)
    file_size = models.PositiveIntegerField(default=0)
    duration = models.PositiveIntegerField(null=True, blank=True)
    width = models.PositiveIntegerField(null=True, blank=True)
    height = models.PositiveIntegerField(null=True, blank=True)
    format = models.CharField(max_length=40, blank=True)
    position = models.PositiveIntegerField(default=1)
    is_primary = models.BooleanField(default=False)

    class Meta:
        ordering = ['position', 'id']

    def __str__(self):
        return self.title or f'{self.insight.title} media'


class Speaker(TimeStamped):
    name = models.CharField(max_length=160)
    designation = models.CharField(max_length=160, blank=True)
    company = models.CharField(max_length=160, blank=True)
    image_url = models.CharField(max_length=500, blank=True)
    bio = models.TextField(blank=True)
    linkedin_url = models.URLField(blank=True)

    def __str__(self):
        return self.name


class Event(Publishable):
    title = models.CharField(max_length=220)
    slug = models.SlugField(unique=True)
    content_url = models.CharField(max_length=500, blank=True)
    excerpt = models.TextField(blank=True)
    description = models.TextField(blank=True)
    date = models.DateField(db_index=True)
    location = models.CharField(max_length=160)
    venue = models.CharField(max_length=180, blank=True)
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    time_slot = models.CharField(max_length=120, blank=True)
    download_count = models.PositiveIntegerField(default=0)
    category = models.CharField(max_length=120, blank=True)
    speakers = models.ManyToManyField(Speaker, through='EventSpeaker', related_name='events', blank=True)

    class Meta:
        ordering = ['-date', '-published_at']

    def __str__(self):
        return self.title


class EventMedia(TimeStamped):
    class MediaType(models.TextChoices):
        IMAGE = 'image', 'Image'
        VIDEO = 'video', 'Video'

    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='media')
    media_url = models.TextField()
    thumbnail_url = models.CharField(max_length=500, blank=True)
    media_type = models.CharField(max_length=20, choices=MediaType.choices)
    mime_type = models.CharField(max_length=120, blank=True)
    file_size = models.PositiveIntegerField(default=0)
    duration = models.PositiveIntegerField(null=True, blank=True)
    width = models.PositiveIntegerField(null=True, blank=True)
    height = models.PositiveIntegerField(null=True, blank=True)
    format = models.CharField(max_length=40, blank=True)
    position = models.PositiveIntegerField(default=1)
    is_primary = models.BooleanField(default=False)

    class Meta:
        ordering = ['position', 'id']


class EventSpeaker(TimeStamped):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    speaker = models.ForeignKey(Speaker, on_delete=models.CASCADE)
    position = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ['position']
        unique_together = ('event', 'speaker')


class EventSchedule(TimeStamped):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='schedules')
    title = models.CharField(max_length=220)
    description = models.TextField(blank=True)
    event_date = models.DateField()
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    venue = models.CharField(max_length=180, blank=True)
    position = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ['position', 'start_time', 'id']

    def __str__(self):
        return self.title


class Comment(TimeStamped):
    content_type = models.CharField(max_length=40)
    content_id = models.PositiveIntegerField()
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='replies')
    comment = models.TextField()
    like_count = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=20, default='visible')


class EventRegistration(TimeStamped):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='registrations')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)
    designation = models.CharField(max_length=160, blank=True)
    full_name = models.CharField(max_length=160)
    email = models.EmailField()
    organization = models.CharField(max_length=180, blank=True)
    interests = models.CharField(max_length=240, blank=True)
    otp = models.PositiveIntegerField(null=True, blank=True)
    otp_expire_at = models.DateTimeField(null=True, blank=True)
    otp_verify_at = models.DateTimeField(null=True, blank=True)


class InsightLike(TimeStamped):
    insight = models.ForeignKey(Insight, on_delete=models.CASCADE, related_name='likes')
    subscriber = models.ForeignKey(Subscriber, on_delete=models.CASCADE, related_name='insight_likes')
    liked_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ('insight', 'subscriber')
