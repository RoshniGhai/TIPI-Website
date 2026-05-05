import bleach
from rest_framework import serializers
from django.contrib.auth.models import Group, User

from .models import (
    Author,
    Banner,
    Category,
    Comment,
    ContactMessage,
    Event,
    EventMedia,
    EventRegistration,
    EventSchedule,
    EventSpeaker,
    Insight,
    InsightMedia,
    Speaker,
    Subscriber,
)


def media_url(obj, request=None):
    value = obj.thumbnail_url or obj.media_url
    if request and value and value.startswith('/media/'):
        return request.build_absolute_uri(value)
    return value


class BannerSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    image = serializers.CharField(source='image_url', read_only=True)
    excerpt = serializers.CharField(source='subtitle', read_only=True)
    href = serializers.CharField(source='cta_url', read_only=True)
    date = serializers.DateTimeField(source='published_at', format='%d %b %Y', read_only=True)
    publishedAt = serializers.DateTimeField(source='published_at', read_only=True)
    readTime = serializers.SerializerMethodField()
    author = serializers.SerializerMethodField()

    class Meta:
        model = Banner
        fields = ['id', 'title', 'excerpt', 'image', 'date', 'publishedAt', 'readTime', 'author', 'href', 'cta_label']

    def get_readTime(self, obj):
        return ''

    def get_author(self, obj):
        return ''


class InsightMediaSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    image = serializers.SerializerMethodField()
    type = serializers.SerializerMethodField()

    class Meta:
        model = InsightMedia
        fields = ['id', 'title', 'description', 'type', 'image', 'media_url', 'thumbnail_url', 'position', 'is_primary']

    def get_image(self, obj):
        return media_url(obj, self.context.get('request'))

    def get_type(self, obj):
        return obj.media_type.title()


class InsightSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='slug', read_only=True)
    author = serializers.CharField(source='author.name', read_only=True)
    category = serializers.CharField(source='category.name', read_only=True)
    excerpt = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    href = serializers.SerializerMethodField()
    date = serializers.DateField(format='%d %b %Y', read_only=True)
    publishedAt = serializers.DateTimeField(source='published_at', read_only=True)
    readTime = serializers.SerializerMethodField()
    featured = serializers.BooleanField(source='is_featured', read_only=True)
    trending = serializers.BooleanField(source='is_trending', read_only=True)
    media = InsightMediaSerializer(many=True, read_only=True)

    class Meta:
        model = Insight
        fields = [
            'id',
            'slug',
            'title',
            'category',
            'excerpt',
            'content',
            'image_note',
            'quote',
            'content_url',
            'place',
            'image',
            'date',
            'publishedAt',
            'readTime',
            'author',
            'tags',
            'featured',
            'trending',
            'like_count',
            'comment_count',
            'media',
            'href',
        ]

    def get_tags(self, obj):
        return [obj.category.name] if obj.category_id else []

    def get_excerpt(self, obj):
        if not obj.content:
            return ''
        return bleach.clean(obj.content, tags=[], strip=True)[:180]

    def get_image(self, obj):
        primary = obj.media.filter(is_primary=True).first() or obj.media.first()
        return media_url(primary, self.context.get('request')) if primary else ''

    def get_href(self, obj):
        return f'/insights/{obj.slug}'

    def get_readTime(self, obj):
        return f'{obj.time_to_read} Min Read'


class EventMediaSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    type = serializers.SerializerMethodField()

    class Meta:
        model = EventMedia
        fields = ['id', 'type', 'image', 'media_url', 'thumbnail_url', 'position', 'is_primary']

    def get_image(self, obj):
        return media_url(obj, self.context.get('request'))

    def get_type(self, obj):
        return obj.media_type.title()


class EventScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventSchedule
        fields = ['id', 'title', 'description', 'event_date', 'start_time', 'end_time', 'venue', 'position']


class EventSpeakerSerializer(serializers.ModelSerializer):
    speaker_name = serializers.CharField(source='speaker.name', read_only=True)
    speaker_designation = serializers.CharField(source='speaker.designation', read_only=True)
    speaker_company = serializers.CharField(source='speaker.company', read_only=True)
    speaker_image = serializers.SerializerMethodField()

    class Meta:
        model = EventSpeaker
        fields = [
            'id',
            'event',
            'speaker',
            'speaker_name',
            'speaker_designation',
            'speaker_company',
            'speaker_image',
            'position',
        ]

    def get_speaker_image(self, obj):
        value = obj.speaker.image_url
        request = self.context.get('request')
        if request and value and value.startswith('/media/'):
            return request.build_absolute_uri(value)
        return value


class EventSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='slug', read_only=True)
    image = serializers.SerializerMethodField()
    href = serializers.SerializerMethodField()
    date = serializers.DateField(format='%d %b %Y', read_only=True)
    publishedAt = serializers.DateTimeField(source='published_at', read_only=True)
    media = EventMediaSerializer(many=True, read_only=True)
    schedules = EventScheduleSerializer(many=True, read_only=True)
    event_speakers = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            'id',
            'slug',
            'title',
            'excerpt',
            'description',
            'content_url',
            'image',
            'date',
            'publishedAt',
            'location',
            'venue',
            'start_time',
            'end_time',
            'time_slot',
            'category',
            'download_count',
            'media',
            'schedules',
            'event_speakers',
            'href',
        ]

    def get_event_speakers(self, obj):
        return EventSpeakerSerializer(
            obj.eventspeaker_set.select_related('speaker').all(),
            many=True,
            context=self.context,
        ).data

    def get_image(self, obj):
        primary = obj.media.filter(is_primary=True).first() or obj.media.first()
        return media_url(primary, self.context.get('request')) if primary else ''

    def get_href(self, obj):
        return f'/events/{obj.slug}'


class SubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscriber
        fields = ['id', 'name', 'email', 'organization', 'created_at']
        read_only_fields = ['id', 'created_at']
        extra_kwargs = {'email': {'validators': []}}

    def create(self, validated_data):
        subscriber, _ = Subscriber.objects.update_or_create(
            email=validated_data['email'],
            defaults={
                'name': validated_data.get('name', ''),
                'organization': validated_data.get('organization', ''),
            },
        )
        return subscriber


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'phone', 'message', 'source', 'created_at']
        read_only_fields = ['id', 'created_at']


class CommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'parent', 'comment', 'created_at']
        read_only_fields = ['id', 'created_at']


class EventRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventRegistration
        fields = [
            'id',
            'designation',
            'full_name',
            'email',
            'organization',
            'interests',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class InsightLikeSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=160, required=False, allow_blank=True)
    email = serializers.EmailField()
    organization = serializers.CharField(max_length=180, required=False, allow_blank=True)


class CmsUserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'name', 'role', 'is_active', 'date_joined']
        read_only_fields = fields

    def get_role(self, obj):
        if obj.is_superuser or obj.groups.filter(name='Admin').exists():
            return 'Admin'
        return 'Author'

    def get_name(self, obj):
        full_name = obj.get_full_name().strip()
        return full_name or obj.username


class CmsUserCreateSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(choices=['Author', 'Admin'], write_only=True)
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'password', 'role', 'is_active']
        read_only_fields = ['id']

    def create(self, validated_data):
        role = validated_data.pop('role')
        password = validated_data.pop('password')
        user = User.objects.create_user(password=password, **validated_data)
        group, _ = Group.objects.get_or_create(name=role)
        user.groups.add(group)
        Author.objects.update_or_create(
            email=user.email,
            defaults={
                'name': user.get_full_name().strip() or user.username,
                'designation': role,
                'is_superuser': role == 'Admin',
            },
        )
        return user


class CmsAuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = [
            'id',
            'name',
            'designation',
            'email',
            'image_url',
            'linkedin_url',
            'instagram_url',
            'facebook_url',
            'twitter_url',
            'bio_content_url',
            'is_superuser',
        ]


class CmsCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']


class CmsInsightSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.name', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    media = InsightMediaSerializer(many=True, read_only=True)

    class Meta:
        model = Insight
        fields = [
            'id',
            'title',
            'slug',
            'category',
            'category_name',
            'content_url',
            'content',
            'image_note',
            'quote',
            'place',
            'time_to_read',
            'date',
            'author',
            'author_name',
            'approved_by',
            'like_count',
            'comment_count',
            'is_trending',
            'is_featured',
            'status',
            'is_active',
            'published_at',
            'created_at',
            'updated_at',
            'media',
        ]
        read_only_fields = ['id', 'approved_by', 'like_count', 'comment_count', 'created_at', 'updated_at']


class CmsEventSerializer(serializers.ModelSerializer):
    media = EventMediaSerializer(many=True, read_only=True)
    schedules = EventScheduleSerializer(many=True, read_only=True)
    event_speakers = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            'id',
            'title',
            'slug',
            'content_url',
            'excerpt',
            'description',
            'date',
            'location',
            'venue',
            'start_time',
            'end_time',
            'time_slot',
            'download_count',
            'category',
            'status',
            'is_active',
            'published_at',
            'created_at',
            'updated_at',
            'media',
            'schedules',
            'event_speakers',
        ]
        read_only_fields = ['id', 'download_count', 'created_at', 'updated_at']

    def get_event_speakers(self, obj):
        return EventSpeakerSerializer(
            obj.eventspeaker_set.select_related('speaker').all(),
            many=True,
            context=self.context,
        ).data


class CmsSpeakerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Speaker
        fields = ['id', 'name', 'designation', 'company', 'image_url', 'bio', 'linkedin_url']


class CmsEventSpeakerSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventSpeaker
        fields = ['id', 'event', 'speaker', 'position']


class CmsEventScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventSchedule
        fields = ['id', 'event', 'title', 'description', 'event_date', 'start_time', 'end_time', 'venue', 'position']


class CmsBannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = [
            'id',
            'title',
            'subtitle',
            'image_url',
            'cta_label',
            'cta_url',
            'order',
            'status',
            'is_active',
            'published_at',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
