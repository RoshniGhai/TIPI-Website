from django.contrib import admin

from .models import (
    Author,
    Banner,
    Category,
    Comment,
    ContactMessage,
    Event,
    EventMedia,
    EventRegistration,
    EventSpeaker,
    Insight,
    InsightLike,
    InsightMedia,
    Speaker,
    Subscriber,
)


class InsightMediaInline(admin.TabularInline):
    model = InsightMedia
    extra = 1


class EventMediaInline(admin.TabularInline):
    model = EventMedia
    extra = 1


class EventSpeakerInline(admin.TabularInline):
    model = EventSpeaker
    extra = 1


@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ('name', 'designation', 'email', 'is_superuser')
    search_fields = ('name', 'email', 'designation')


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name',)


@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'is_active', 'published_at', 'order')
    list_filter = ('status', 'is_active')
    search_fields = ('title', 'subtitle')
    ordering = ('order', '-published_at')


@admin.register(Insight)
class InsightAdmin(admin.ModelAdmin):
    inlines = [InsightMediaInline]
    list_display = ('title', 'category', 'author', 'status', 'is_active', 'is_trending', 'is_featured', 'date')
    list_filter = ('status', 'is_active', 'is_trending', 'is_featured', 'category', 'date')
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ('title', 'content', 'author__name')
    ordering = ('-date', '-published_at')


@admin.register(Speaker)
class SpeakerAdmin(admin.ModelAdmin):
    list_display = ('name', 'designation', 'company')
    search_fields = ('name', 'company', 'designation')


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    inlines = [EventMediaInline, EventSpeakerInline]
    list_display = ('title', 'location', 'date', 'status', 'is_active', 'published_at')
    list_filter = ('status', 'is_active', 'date', 'published_at')
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ('title', 'excerpt', 'description', 'location')
    ordering = ('-date', '-published_at')


admin.site.register(Subscriber)
admin.site.register(Comment)
admin.site.register(EventRegistration)
admin.site.register(InsightLike)


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'source', 'is_read', 'created_at')
    list_filter = ('is_read', 'source', 'created_at')
    search_fields = ('name', 'email', 'phone', 'message')
    readonly_fields = ('created_at', 'updated_at')
