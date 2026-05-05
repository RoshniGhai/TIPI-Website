import base64
import mimetypes
import uuid

import bleach
import cloudinary.uploader
from django.conf import settings
from django.db import transaction
from django.db.models import F
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import ValidationError
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView
from rest_framework.permissions import BasePermission, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    Author,
    Banner,
    Category,
    Comment,
    Event,
    EventMedia,
    EventRegistration,
    EventSchedule,
    EventSpeaker,
    Insight,
    InsightLike,
    InsightMedia,
    Speaker,
    Subscriber,
)
from .serializers import (
    BannerSerializer,
    CmsAuthorSerializer,
    CmsBannerSerializer,
    CmsCategorySerializer,
    CmsEventScheduleSerializer,
    CmsEventSerializer,
    CmsEventSpeakerSerializer,
    CmsInsightSerializer,
    CmsSpeakerSerializer,
    CmsUserCreateSerializer,
    CmsUserSerializer,
    CommentCreateSerializer,
    ContactMessageSerializer,
    EventSerializer,
    EventRegistrationSerializer,
    InsightMediaSerializer,
    InsightSerializer,
    InsightLikeSerializer,
    SubscriberSerializer,
)


def user_role(user):
    if user.is_superuser or user.groups.filter(name='Admin').exists():
        return 'Admin'
    return 'Author'


def is_cms_admin(user):
    return user.is_authenticated and user_role(user) == 'Admin'


def author_for_user(user):
    author, _ = Author.objects.update_or_create(
        email=user.email or f'{user.username}@tipi.local',
        defaults={
            'name': user.get_full_name().strip() or user.username,
            'designation': user_role(user),
            'is_superuser': user_role(user) == 'Admin',
        },
    )
    return author


def cloudinary_is_configured():
    config = cloudinary.config()
    return bool(config.cloud_name and config.api_key and config.api_secret)


def save_cms_data_url(data_url, folder='cms'):
    if not data_url or not isinstance(data_url, str) or ';base64,' not in data_url:
        return ''
    if cloudinary_is_configured():
        upload = cloudinary.uploader.upload(
            data_url,
            folder=f'tipi/{folder}'.strip('/'),
            resource_type='auto',
            overwrite=False,
        )
        return upload.get('secure_url') or upload.get('url') or ''

    if not settings.DEBUG:
        raise ValidationError({
            'media': 'Cloudinary is not configured on the backend. Add CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET before uploading CMS images.'
        })

    header, encoded = data_url.split(';base64,', 1)
    mime_type = header.replace('data:', '')
    extension = mimetypes.guess_extension(mime_type) or '.bin'
    filename = f'{uuid.uuid4().hex}{extension}'
    directory = settings.MEDIA_ROOT / folder
    directory.mkdir(parents=True, exist_ok=True)
    path = directory / filename
    path.write_bytes(base64.b64decode(encoded))
    return f'{settings.MEDIA_URL}{folder}/{filename}'


def save_or_keep_media_url(value, folder='cms'):
    if value and isinstance(value, str) and ';base64,' in value:
        return save_cms_data_url(value, folder)
    return value or ''


def save_or_keep_image_url(value, folder='cms'):
    return save_or_keep_media_url(value, folder)


ALLOWED_RICH_TEXT_TAGS = [
    'a',
    'blockquote',
    'br',
    'em',
    'h2',
    'h3',
    'h4',
    'li',
    'ol',
    'p',
    'strong',
    'ul',
]
ALLOWED_RICH_TEXT_ATTRIBUTES = {
    'a': ['href', 'rel', 'target'],
}


def sanitize_rich_text(value):
    if not value:
        return ''

    cleaned = bleach.clean(
        str(value),
        tags=ALLOWED_RICH_TEXT_TAGS,
        attributes=ALLOWED_RICH_TEXT_ATTRIBUTES,
        protocols=['http', 'https', 'mailto'],
        strip=True,
    )
    return bleach.linkify(cleaned)


def sanitize_content_fields(data, fields):
    for field in fields:
        if field in data:
            data[field] = sanitize_rich_text(data.get(field))


def as_list(value):
    return value if isinstance(value, list) else []


class IsCmsUser(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_active


class IsCmsAdmin(BasePermission):
    def has_permission(self, request, view):
        return is_cms_admin(request.user)


class HomepageView(APIView):
    def get(self, request):
        banners = Banner.objects.visible()
        insights = Insight.objects.visible()
        events = Event.objects.visible().filter(date__gte=timezone.localdate()).order_by('date', '-published_at')
        media = InsightMedia.objects.filter(insight__in=insights).select_related('insight').order_by('insight__date', 'position')[:8]

        return Response(
            {
                'logo': {
                    'title': 'The India\nProsperity\nInitiative',
                    'image': '/figma-assets/logo-header.svg',
                    'footerImage': '/figma-assets/logo-footer.svg',
                },
                'navigation': [
                    {'label': 'Verticals', 'href': '#verticals', 'hasDropdown': True},
                    {'label': 'Insights', 'href': '/insights'},
                    {'label': 'Events', 'href': '/events'},
                    {'label': 'People', 'href': '/people'},
                    {'label': 'About Us', 'href': '/about'},
                    {'label': 'Contact Us', 'href': '/contact'},
                ],
                'headerCta': {'label': 'Subscribe', 'href': '#subscribe'},
                'heroSlides': BannerSerializer(banners, many=True, context={'request': request}).data,
                'insights': InsightSerializer(insights[:4], many=True, context={'request': request}).data,
                'events': EventSerializer(events[:6], many=True, context={'request': request}).data,
                'mediaGallery': [
                    {
                        **InsightMediaSerializer(item, context={'request': request}).data,
                        'insightId': item.insight.slug,
                        'href': f'/insights/{item.insight.slug}#media-{item.id}',
                        'featured': index == 0,
                    }
                    for index, item in enumerate(media)
                ],
                'footer': {
                    'subscribeText': 'Ideas, events, and research from The India Prosperity Initiative.',
                    'cta': {'label': 'Subscribe', 'href': '#subscribe'},
                    'links': [
                        {'label': 'Insights', 'href': '/insights'},
                        {'label': 'Events', 'href': '/events'},
                        {'label': 'People', 'href': '/people'},
                        {'label': 'About Us', 'href': '/about'},
                        {'label': 'Contact', 'href': '/contact'},
                    ],
                },
            }
        )


class InsightListView(ListAPIView):
    serializer_class = InsightSerializer

    def get_queryset(self):
        return Insight.objects.visible().select_related('author', 'category').prefetch_related('media')


class InsightDetailView(RetrieveAPIView):
    serializer_class = InsightSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        return Insight.objects.visible().select_related('author', 'category').prefetch_related('media')


class EventListView(ListAPIView):
    serializer_class = EventSerializer

    def get_queryset(self):
        return Event.objects.visible().prefetch_related('media', 'speakers')


class EventDetailView(RetrieveAPIView):
    serializer_class = EventSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        return Event.objects.visible().prefetch_related('media', 'speakers')


class SubscriberCreateView(CreateAPIView):
    serializer_class = SubscriberSerializer


class ContactMessageCreateView(CreateAPIView):
    serializer_class = ContactMessageSerializer


class InsightCommentCreateView(CreateAPIView):
    serializer_class = CommentCreateSerializer

    def perform_create(self, serializer):
        insight = get_object_or_404(Insight.objects.visible(), slug=self.kwargs['slug'])
        serializer.save(content_type='insight', content_id=insight.id)
        Insight.objects.filter(id=insight.id).update(comment_count=F('comment_count') + 1)


class EventRegistrationCreateView(CreateAPIView):
    serializer_class = EventRegistrationSerializer

    def perform_create(self, serializer):
        event = get_object_or_404(Event.objects.visible(), slug=self.kwargs['slug'])
        serializer.save(event=event)


class InsightLikeCreateView(APIView):
    def post(self, request, slug):
        serializer = InsightLikeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        insight = get_object_or_404(Insight.objects.visible(), slug=slug)

        with transaction.atomic():
            subscriber, _ = Subscriber.objects.update_or_create(
                email=data['email'],
                defaults={
                    'name': data.get('name', ''),
                    'organization': data.get('organization', ''),
                },
            )
            _, created = InsightLike.objects.get_or_create(insight=insight, subscriber=subscriber)
            if created:
                Insight.objects.filter(id=insight.id).update(like_count=F('like_count') + 1)

        insight.refresh_from_db(fields=['like_count'])
        return Response({'liked': True, 'created': created, 'like_count': insight.like_count})


class CmsLoginView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if not user or not user.is_active:
            return Response({'detail': 'Invalid CMS credentials.'}, status=status.HTTP_400_BAD_REQUEST)

        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'user': CmsUserSerializer(user).data})


class CmsMeView(APIView):
    permission_classes = [IsAuthenticated, IsCmsUser]

    def get(self, request):
        return Response(CmsUserSerializer(request.user).data)


class CmsConfigView(APIView):
    permission_classes = [IsAuthenticated, IsCmsUser]

    def get(self, request):
        config = cloudinary.config()
        return Response(
            {
                'mediaStorage': 'cloudinary' if cloudinary_is_configured() else 'local',
                'cloudinaryConfigured': cloudinary_is_configured(),
                'cloudinaryCloudName': config.cloud_name or '',
                'productionUploadReady': settings.DEBUG or cloudinary_is_configured(),
            }
        )


class CmsDashboardView(APIView):
    permission_classes = [IsAuthenticated, IsCmsUser]

    def get(self, request):
        pending = Insight.objects.filter(status='pending').count() + Event.objects.filter(status='pending').count()
        return Response(
            {
                'metrics': {
                    'traffic': '+12%',
                    'insights': Insight.objects.filter(status='published').count(),
                    'events': Event.objects.filter(date__gte=timezone.localdate(), is_active=True).count(),
                    'pendingReviews': pending,
                },
                'activity': [
                    {'title': item.title, 'type': 'Insight', 'status': item.status, 'updatedAt': item.updated_at}
                    for item in Insight.objects.select_related('author', 'category').order_by('-updated_at')[:5]
                ],
                'spotlight': Insight.objects.filter(is_featured=True).order_by('-updated_at').values('title', 'content').first(),
            }
        )


class CmsLookupView(APIView):
    permission_classes = [IsAuthenticated, IsCmsUser]

    def get(self, request):
        return Response(
            {
                'authors': CmsAuthorSerializer(Author.objects.all(), many=True).data,
                'categories': CmsCategorySerializer(Category.objects.all(), many=True).data,
                'events': CmsEventSerializer(Event.objects.all().order_by('-date')[:50], many=True).data,
                'speakers': CmsSpeakerSerializer(Speaker.objects.all(), many=True).data,
                'statuses': ['draft', 'pending', 'approved', 'rejected', 'published'],
            }
        )


class CmsInsightCollectionView(APIView):
    permission_classes = [IsAuthenticated, IsCmsUser]

    def get(self, request):
        queryset = Insight.objects.select_related('author', 'category').prefetch_related('media').order_by('-updated_at')
        if user_role(request.user) == 'Author':
            queryset = queryset.filter(author__email=request.user.email)
        return Response(CmsInsightSerializer(queryset, many=True).data)

    def post(self, request):
        data = request.data.copy()
        sanitize_content_fields(data, ['content', 'image_note', 'quote'])
        action = data.pop('action', None)
        image_base64 = data.pop('image', None)
        media_base64 = data.pop('media', None)
        media_type = data.pop('media_type', '')
        thumbnail_url = data.pop('thumbnail_url', '')
        media_position = data.pop('media_position', None)
        external_media_url = data.pop('media_url', '')
        extra_images = data.pop('extra_images', [])
        quote = data.pop('quote', '')
        media_title = data.pop('media_title', '')
        media_description = data.pop('media_description', '')
        data['quote'] = quote

        current_author = author_for_user(request.user)
        if user_role(request.user) == 'Author':
            data['author'] = current_author.id
            data['status'] = 'pending' if action == 'submit' else 'draft'
        else:
            data.setdefault('author', current_author.id)
            data['status'] = data.get('status') or ('published' if action == 'publish' else 'draft')
        
        serializer = CmsInsightSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()

        if image_base64:
            image_url = save_cms_data_url(image_base64, 'cms/insights')
            if image_url:
                InsightMedia.objects.create(
                    insight=instance,
                    title=f'{instance.title} cover',
                    description='CMS cover image. Recommended ratio: 16:9, minimum 1200 x 675 px.',
                    media_url=image_url,
                    thumbnail_url=image_url,
                    media_type='image',
                    is_primary=True,
                    position=int(media_position or 1),
                )
        if media_base64 or external_media_url:
            detected_type = media_type or ('video' if 'video' in str(media_base64)[:30] else 'image')
            media_url = save_or_keep_media_url(external_media_url, 'cms/insights') or save_cms_data_url(media_base64, 'cms/insights')
            if media_url:
                InsightMedia.objects.create(
                    insight=instance,
                    title=media_title or f'{instance.title} media',
                    description=media_description or 'CMS media block. Image ratio: 16:9; video thumbnail recommended.',
                    media_url=media_url,
                    thumbnail_url=thumbnail_url or media_url,
                    media_type=detected_type,
                    is_primary=False,
                    position=int(media_position or 2),
                )
        for idx, extra_img in enumerate(extra_images, start=3):
            if extra_img:
                extra_url = save_cms_data_url(extra_img, 'cms/insights')
                if extra_url:
                    InsightMedia.objects.create(
                        insight=instance,
                        title=f'{instance.title} image {idx - 2}',
                        description='CMS gallery image. Recommended ratio: 16:9.',
                        media_url=extra_url,
                        thumbnail_url=extra_url,
                        media_type='image',
                        is_primary=False,
                        position=idx,
                    )

        return Response(CmsInsightSerializer(instance).data, status=status.HTTP_201_CREATED)


class CmsInsightDetailView(APIView):
    permission_classes = [IsAuthenticated, IsCmsUser]

    def get_object(self, request, pk):
        queryset = Insight.objects.select_related('author', 'category').prefetch_related('media')
        if user_role(request.user) == 'Author':
            queryset = queryset.filter(author__email=request.user.email)
        return get_object_or_404(queryset, pk=pk)

    def patch(self, request, pk):
        instance = self.get_object(request, pk)
        if user_role(request.user) == 'Author' and instance.status not in ['draft', 'rejected']:
            return Response({'detail': 'Submitted content cannot be edited by author.'}, status=status.HTTP_403_FORBIDDEN)
        data = request.data.copy()
        sanitize_content_fields(data, ['content', 'image_note', 'quote'])
        serializer = CmsInsightSerializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        return Response(CmsInsightSerializer(instance).data)


class CmsInsightActionView(APIView):
    permission_classes = [IsAuthenticated, IsCmsUser]

    def post(self, request, pk, action):
        insight = get_object_or_404(Insight.objects.select_related('author'), pk=pk)
        role = user_role(request.user)
        if action == 'submit' and role == 'Author':
            if insight.author.email != request.user.email:
                return Response({'detail': 'You can submit only your own content.'}, status=status.HTTP_403_FORBIDDEN)
            insight.status = 'pending'
        elif action in ['approve', 'reject', 'publish']:
            if role != 'Admin':
                return Response({'detail': 'Admin permission required.'}, status=status.HTTP_403_FORBIDDEN)
            if action == 'approve':
                insight.status = 'approved'
                insight.approved_by = author_for_user(request.user)
            elif action == 'reject':
                insight.status = 'rejected'
            else:
                insight.status = 'published'
                insight.published_at = timezone.now()
                insight.approved_by = author_for_user(request.user)
        else:
            return Response({'detail': 'Invalid workflow action.'}, status=status.HTTP_400_BAD_REQUEST)
        insight.save()
        return Response(CmsInsightSerializer(insight).data)


class CmsEventCollectionView(APIView):
    permission_classes = [IsAuthenticated, IsCmsUser]

    def get(self, request):
        queryset = Event.objects.prefetch_related('media').order_by('-updated_at')
        return Response(CmsEventSerializer(queryset, many=True).data)

    def post(self, request):
        data = request.data.copy()
        sanitize_content_fields(data, ['excerpt', 'description'])
        action = data.pop('action', None)
        image_base64 = data.pop('image', None)
        media_type = data.pop('media_type', '')
        thumbnail_url = data.pop('thumbnail_url', '')
        media_position = data.pop('media_position', None)
        external_media_url = data.pop('media_url', '')
        schedule_title = data.pop('schedule_title', '')
        schedule_description = data.pop('schedule_description', '')
        schedule_description = sanitize_rich_text(schedule_description)
        schedule_position = data.pop('schedule_position', None)
        schedules = as_list(data.pop('schedules', []))
        speaker_name = data.pop('speaker_name', '')
        speaker_designation = data.pop('speaker_designation', '')
        speaker_company = data.pop('speaker_company', '')
        speaker_image = data.pop('speaker_image', '')
        speaker_position = data.pop('speaker_position', None)
        speakers = as_list(data.pop('speakers', []))
        data['status'] = data.get('status') or ('published' if user_role(request.user) == 'Admin' and action == 'publish' else 'pending')
        serializer = CmsEventSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        if image_base64 or external_media_url:
            image_url = save_or_keep_media_url(external_media_url, 'cms/events') or save_cms_data_url(image_base64, 'cms/events')
            if image_url:
                EventMedia.objects.create(
                    event=instance,
                    media_url=image_url,
                    thumbnail_url=thumbnail_url or image_url,
                    media_type=media_type or 'image',
                    is_primary=True,
                    position=int(media_position or 1),
                )
        if schedule_title:
            EventSchedule.objects.create(
                event=instance,
                title=schedule_title,
                description=schedule_description,
                event_date=instance.date,
                start_time=instance.start_time,
                end_time=instance.end_time,
                venue=instance.venue or instance.location,
                position=int(schedule_position or 1),
            )
        for index, schedule in enumerate(schedules, start=1):
            title = schedule.get('title') if isinstance(schedule, dict) else ''
            if not title:
                continue
            EventSchedule.objects.create(
                event=instance,
                title=title,
                description=sanitize_rich_text(schedule.get('description', '')),
                event_date=schedule.get('event_date') or instance.date,
                start_time=schedule.get('start_time') or None,
                end_time=schedule.get('end_time') or None,
                venue=schedule.get('venue') or instance.venue or instance.location,
                position=int(schedule.get('position') or index),
            )
        if speaker_name:
            saved_speaker_image = save_or_keep_image_url(speaker_image, 'cms/speakers')
            speaker, _ = Speaker.objects.update_or_create(
                name=speaker_name,
                defaults={
                    'designation': speaker_designation,
                    'company': speaker_company,
                    'image_url': saved_speaker_image,
                },
            )
            EventSpeaker.objects.update_or_create(
                event=instance,
                speaker=speaker,
                defaults={'position': int(speaker_position or 1)},
            )
        for index, speaker_data in enumerate(speakers, start=1):
            if not isinstance(speaker_data, dict) or not speaker_data.get('name'):
                continue
            image_value = speaker_data.get('image') or speaker_data.get('image_url') or ''
            saved_image = save_or_keep_media_url(image_value, 'cms/speakers')
            speaker, _ = Speaker.objects.update_or_create(
                name=speaker_data.get('name'),
                defaults={
                    'designation': speaker_data.get('designation', ''),
                    'company': speaker_data.get('company', ''),
                    'image_url': saved_image,
                    'bio': sanitize_rich_text(speaker_data.get('bio', '')),
                    'linkedin_url': speaker_data.get('linkedin_url', ''),
                },
            )
            EventSpeaker.objects.update_or_create(
                event=instance,
                speaker=speaker,
                defaults={'position': int(speaker_data.get('position') or index)},
            )
        return Response(CmsEventSerializer(instance).data, status=status.HTTP_201_CREATED)


class CmsCategoryCollectionView(APIView):
    permission_classes = [IsAuthenticated, IsCmsUser]

    def get(self, request):
        return Response(CmsCategorySerializer(Category.objects.all(), many=True).data)

    def post(self, request):
        data = request.data.copy()
        sanitize_content_fields(data, ['description'])
        serializer = CmsCategorySerializer(data=data)
        serializer.is_valid(raise_exception=True)
        category = serializer.save()
        return Response(CmsCategorySerializer(category).data, status=status.HTTP_201_CREATED)


class CmsAuthorCollectionView(APIView):
    permission_classes = [IsAuthenticated, IsCmsUser]

    def get(self, request):
        return Response(CmsAuthorSerializer(Author.objects.all(), many=True).data)

    def post(self, request):
        data = request.data.copy()
        data['image_url'] = save_or_keep_image_url(data.get('image_url'), 'cms/authors')
        serializer = CmsAuthorSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        author = serializer.save()
        return Response(CmsAuthorSerializer(author).data, status=status.HTTP_201_CREATED)


class CmsSpeakerCollectionView(APIView):
    permission_classes = [IsAuthenticated, IsCmsUser]

    def get(self, request):
        return Response(CmsSpeakerSerializer(Speaker.objects.all(), many=True).data)

    def post(self, request):
        data = request.data.copy()
        sanitize_content_fields(data, ['bio'])
        data['image_url'] = save_or_keep_image_url(data.get('image_url'), 'cms/speakers')
        serializer = CmsSpeakerSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        speaker = serializer.save()
        return Response(CmsSpeakerSerializer(speaker).data, status=status.HTTP_201_CREATED)


class CmsEventSpeakerCreateView(APIView):
    permission_classes = [IsAuthenticated, IsCmsUser]

    def post(self, request):
        serializer = CmsEventSpeakerSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        event_speaker = serializer.save()
        return Response(CmsEventSpeakerSerializer(event_speaker).data, status=status.HTTP_201_CREATED)


class CmsEventScheduleCreateView(APIView):
    permission_classes = [IsAuthenticated, IsCmsUser]

    def post(self, request):
        data = request.data.copy()
        sanitize_content_fields(data, ['description'])
        serializer = CmsEventScheduleSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        schedule = serializer.save()
        return Response(CmsEventScheduleSerializer(schedule).data, status=status.HTTP_201_CREATED)


class CmsEventActionView(APIView):
    permission_classes = [IsAuthenticated, IsCmsAdmin]

    def post(self, request, pk, action):
        event = get_object_or_404(Event, pk=pk)
        if action not in ['approve', 'reject', 'publish']:
            return Response({'detail': 'Invalid workflow action.'}, status=status.HTTP_400_BAD_REQUEST)
        event.status = {'approve': 'approved', 'reject': 'rejected', 'publish': 'published'}[action]
        if action == 'publish':
            event.published_at = timezone.now()
        event.save()
        return Response(CmsEventSerializer(event).data)


class CmsBannerCollectionView(APIView):
    permission_classes = [IsAuthenticated, IsCmsAdmin]

    def get(self, request):
        return Response(CmsBannerSerializer(Banner.objects.all().order_by('order', '-updated_at'), many=True).data)

    def post(self, request):
        data = request.data.copy()
        data['image_url'] = save_or_keep_image_url(data.get('image_url'), 'cms/banners')
        serializer = CmsBannerSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        return Response(CmsBannerSerializer(instance).data, status=status.HTTP_201_CREATED)


class CmsUserCollectionView(APIView):
    permission_classes = [IsAuthenticated, IsCmsAdmin]

    def get(self, request):
        return Response(CmsUserSerializer(User.objects.all().order_by('-date_joined'), many=True).data)

    def post(self, request):
        serializer = CmsUserCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(CmsUserSerializer(user).data, status=status.HTTP_201_CREATED)
