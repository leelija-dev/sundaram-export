from django.conf import settings
from django.contrib.auth.views import redirect_to_login
from django.shortcuts import redirect
from django.urls import reverse


class AdminAccessMiddleware:
    """Block /admin/ for anonymous users and non-staff accounts."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path.startswith("/admin/"):
            user = request.user
            if not user.is_authenticated:
                return redirect_to_login(request.get_full_path(), login_url=settings.LOGIN_URL)
            if not (user.is_staff or user.is_superuser):
                return redirect(reverse("desk:dashboard"))
        return self.get_response(request)
