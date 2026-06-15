from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import views as auth_views


class DeskAuthenticationForm(AuthenticationForm):
    username = forms.CharField(
        label="Username or email",
        widget=forms.TextInput(
            attrs={
                "autofocus": True,
                "autocomplete": "username",
                "placeholder": "Username or email",
            }
        ),
    )
    password = forms.CharField(
        label="Password",
        strip=False,
        widget=forms.PasswordInput(attrs={"autocomplete": "current-password"}),
    )

    error_messages = {
        **AuthenticationForm.error_messages,
        "invalid_login": "Invalid username/email or password. Please try again.",
        "inactive": "This account is inactive.",
    }

    def clean(self):
        username = self.cleaned_data.get("username")
        password = self.cleaned_data.get("password")

        if username and "@" in username:
            user = get_user_model().objects.filter(email__iexact=username).first()
            if user:
                self.cleaned_data["username"] = user.get_username()

        return super().clean()

    def confirm_login_allowed(self, user):
        super().confirm_login_allowed(user)
        if not (user.is_staff or user.is_superuser):
            raise forms.ValidationError(
                "This account cannot access the export desk. "
                "Enable “Staff status” in Django admin for this user.",
                code="no_desk_access",
            )


class DeskLoginView(auth_views.LoginView):
    template_name = "desk/login.html"
    authentication_form = DeskAuthenticationForm
    redirect_authenticated_user = True
