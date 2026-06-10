from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.urls import reverse_lazy


class DeskLoginMixin(LoginRequiredMixin):
    login_url = "/desk/login/"


class StaffRequiredMixin(UserPassesTestMixin):
    def test_func(self):
        return self.request.user.is_active and (
            self.request.user.is_staff or self.request.user.is_superuser
        )


class DeskMixin(DeskLoginMixin, StaffRequiredMixin):
    pass


class DeskSuccessMessageMixin:
    success_message = "Saved successfully."

    def form_valid(self, form):
        messages.success(self.request, self.success_message)
        return super().form_valid(form)

    def delete(self, request, *args, **kwargs):
        messages.success(request, "Deleted successfully.")
        return super().delete(request, *args, **kwargs)
