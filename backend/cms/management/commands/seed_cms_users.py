from django.contrib.auth.models import Group, User
from django.core.management.base import BaseCommand

from cms.models import Author


class Command(BaseCommand):
    help = 'Create default CMS roles and demo users.'

    def handle(self, *args, **options):
        admin_group, _ = Group.objects.get_or_create(name='Admin')
        author_group, _ = Group.objects.get_or_create(name='Author')

        admin, _ = User.objects.update_or_create(
            username='cmsadmin',
            defaults={
                'email': 'cmsadmin@tipi.local',
                'first_name': 'CMS',
                'last_name': 'Admin',
                'is_staff': True,
                'is_superuser': True,
                'is_active': True,
            },
        )
        admin.set_password('admin123')
        admin.save()
        admin.groups.set([admin_group])

        author, _ = User.objects.update_or_create(
            username='cmsauthor',
            defaults={
                'email': 'cmsauthor@tipi.local',
                'first_name': 'CMS',
                'last_name': 'Author',
                'is_staff': False,
                'is_superuser': False,
                'is_active': True,
            },
        )
        author.set_password('author123')
        author.save()
        author.groups.set([author_group])

        for user, role in [(admin, 'Admin'), (author, 'Author')]:
            Author.objects.update_or_create(
                email=user.email,
                defaults={
                    'name': user.get_full_name(),
                    'designation': role,
                    'is_superuser': role == 'Admin',
                },
            )

        self.stdout.write(self.style.SUCCESS('CMS users created: cmsadmin/admin123 and cmsauthor/author123.'))
