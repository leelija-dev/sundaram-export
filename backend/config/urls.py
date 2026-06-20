from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from django.views.generic import RedirectView

urlpatterns = [
    path("", RedirectView.as_view(pattern_name="desk:dashboard", permanent=False)),
    path("admin/", admin.site.urls),
    path("desk/", include("desk.urls")),
    path("api/v1/", include("catalog.urls")),
    path("api/v1/", include("inquiries.urls")),
]

if settings.DEBUG or settings.SERVE_MEDIA:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
