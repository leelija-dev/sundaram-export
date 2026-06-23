from django.shortcuts import redirect
from django.urls import reverse


class AdminAccessMiddleware:
    """Block all web access to Django /admin/ — staff use /desk/ only."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path.startswith("/admin/"):
            if request.user.is_authenticated:
                return redirect(reverse("desk:dashboard"))
            return redirect(reverse("desk:login"))
        return self.get_response(request)
