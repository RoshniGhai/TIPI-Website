from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from cms.models import Author, Banner, Category, Event, EventMedia, Insight, InsightMedia, Publishable


class Command(BaseCommand):
    help = 'Create dummy published banners, insights, media, and events for local API testing.'

    def handle(self, *args, **options):
        now = timezone.now()
        author, _ = Author.objects.update_or_create(
            email='aryan@example.com',
            defaults={'name': 'Aryan Choudhary', 'designation': 'Policy Writer'},
        )
        category, _ = Category.objects.update_or_create(name='Policy')

        Banner.objects.update_or_create(
            title='India at Olympics 2028',
            defaults={
                'subtitle': 'Policy, participation, and opportunity come together in a year of national aspiration.',
                'image_url': '/figma-assets/hero.jpg',
                'cta_label': 'Read More',
                'cta_url': '/insights/g20-feature',
                'status': Publishable.Status.PUBLISHED,
                'is_active': True,
                'published_at': now,
                'order': 1,
            },
        )

        insight_specs = [
            ('g20-feature', 'G20 Summit: Policy Innovations', '/figma-assets/insight-featured.jpg', '/figma-assets/media-featured.png', 'video'),
            ('policy-house', 'Tech Regulation Debates', '/figma-assets/insight-1.png', '/figma-assets/media-1.png', 'image'),
            ('voices', 'The Future of Urban Transit', '/figma-assets/insight-2.png', '/figma-assets/media-2.png', 'image'),
            ('newspaper', 'Global Economic Outlook 2026', '/figma-assets/insight-3.png', '/figma-assets/media-3.png', 'image'),
            ('digital-public-infra', 'Digital Public Infrastructure at Scale', '/figma-assets/opportunity-insight-featured.jpg', '/figma-assets/media-4.png', 'video'),
        ]

        for index, (slug, title, cover, media, media_type) in enumerate(insight_specs, start=1):
            insight, _ = Insight.objects.update_or_create(
                slug=slug,
                defaults={
                    'title': title,
                    'category': category,
                    'content': 'This CMS-managed insight is returned by DRF only when approved or published.',
                    'place': 'India',
                    'time_to_read': 6 + index,
                    'date': (now - timedelta(days=index)).date(),
                    'author': author,
                    'is_trending': True,
                    'is_featured': index == 1,
                    'status': Publishable.Status.PUBLISHED,
                    'is_active': True,
                    'published_at': now - timedelta(days=index),
                },
            )
            InsightMedia.objects.update_or_create(
                insight=insight,
                position=1,
                defaults={
                    'title': title,
                    'description': 'Primary visual linked to this insight.',
                    'media_url': cover,
                    'thumbnail_url': cover,
                    'media_type': InsightMedia.MediaType.IMAGE,
                    'is_primary': True,
                },
            )
            InsightMedia.objects.update_or_create(
                insight=insight,
                position=2,
                defaults={
                    'title': f'{title} media',
                    'description': 'Homepage media routes directly to this insight detail page.',
                    'media_url': media,
                    'thumbnail_url': media,
                    'media_type': media_type,
                    'is_primary': False,
                },
            )

        for index in range(1, 5):
            event, _ = Event.objects.update_or_create(
                slug=f'auto-expo-{index}',
                defaults={
                    'title': 'The Digital Sovereignty Dialogues 2026' if index == 1 else f'Policy Forum {index}',
                    'excerpt': 'A CMS-managed event bringing together leaders across policy, technology, and growth.',
                    'description': 'This event appears on the website only when published.',
                    'date': (now + timedelta(days=20 + index)).date(),
                    'location': 'New Delhi, India',
                    'time_slot': '10:00 AM - 05:00 PM',
                    'category': 'Annual Leadership Summit',
                    'status': Publishable.Status.PUBLISHED,
                    'is_active': True,
                    'published_at': now - timedelta(hours=index),
                },
            )
            EventMedia.objects.update_or_create(
                event=event,
                position=1,
                defaults={
                    'media_url': f'/figma-assets/event-{min(index, 3)}.png',
                    'thumbnail_url': f'/figma-assets/event-{min(index, 3)}.png',
                    'media_type': EventMedia.MediaType.IMAGE,
                    'is_primary': True,
                },
            )

        past_events = [
            (
                'prosperity-roundtable-2025',
                'Prosperity Roundtable 2025',
                'A closed-door discussion on jobs, capital formation, and state capacity.',
                'Mumbai, India',
                '/figma-assets/event-1.png',
                45,
            ),
            (
                'public-policy-summit-2025',
                'Public Policy Summit 2025',
                'A public convening on regulation, innovation, and inclusive economic growth.',
                'Bengaluru, India',
                '/figma-assets/event-2.png',
                90,
            ),
            (
                'growth-dialogues-2024',
                'Growth Dialogues 2024',
                "Leaders from industry and academia explored India's long-term prosperity agenda.",
                'New Delhi, India',
                '/figma-assets/event-3.png',
                160,
            ),
        ]

        for index, (slug, title, excerpt, location, image, days_ago) in enumerate(past_events, start=1):
            event, _ = Event.objects.update_or_create(
                slug=slug,
                defaults={
                    'title': title,
                    'excerpt': excerpt,
                    'description': f'{title} is a past CMS-managed event available through the Events archive.',
                    'date': (now - timedelta(days=days_ago)).date(),
                    'location': location,
                    'time_slot': '10:00 AM - 04:00 PM',
                    'category': 'Past Event',
                    'status': Publishable.Status.PUBLISHED,
                    'is_active': True,
                    'published_at': now - timedelta(days=days_ago),
                },
            )
            EventMedia.objects.update_or_create(
                event=event,
                position=1,
                defaults={
                    'media_url': image,
                    'thumbnail_url': image,
                    'media_type': EventMedia.MediaType.IMAGE,
                    'is_primary': True,
                },
            )

        self.stdout.write(self.style.SUCCESS('Dummy CMS content created.'))
