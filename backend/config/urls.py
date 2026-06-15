from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("desk/", include("desk.urls")),
    path("api/v1/", include("catalog.urls")),
    path("api/v1/", include("inquiries.urls")),
]
