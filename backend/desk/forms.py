from django import forms
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth import get_user_model
from django.forms import inlineformset_factory
from django.utils.text import slugify

from catalog.models import ExportCountry, Industry, MarketRegion, Office, Product
from documents.models import ExportReport, Invoice, InvoiceLine
from documents.services import REPORT_TYPE_HELP
from customers.models import Customer
from inquiries.models import Inquiry
from master.models import Category, Currency


def _ph(placeholder: str, **extra) -> dict:
    """Widget attrs with a user-facing placeholder."""
    return {"placeholder": placeholder, **extra}


def _textarea(placeholder: str, rows: int = 3) -> forms.Textarea:
    return forms.Textarea(attrs=_ph(placeholder, rows=rows))


def lines_to_list(text: str) -> list:
    return [line.strip() for line in (text or "").splitlines() if line.strip()]


def list_to_lines(items) -> str:
    if not items:
        return ""
    return "\n".join(str(x) for x in items)


class ListTextarea(forms.CharField):
    def prepare_value(self, value):
        return list_to_lines(value)

    def to_python(self, value):
        return lines_to_list(super().to_python(value))


class ProductForm(forms.ModelForm):
    category = forms.ModelChoiceField(
        queryset=Category.objects.filter(is_active=True).order_by("sort_order", "name"),
        empty_label="Select category",
    )
    origins = ListTextarea(
        widget=_textarea("One origin per line, e.g.\nKolkata, West Bengal\nIndia", rows=3),
        required=False,
    )
    markets = ListTextarea(
        widget=_textarea("One market per line, e.g.\nBangladesh\nNepal", rows=3),
        required=False,
    )
    specifications = ListTextarea(
        widget=_textarea("One specification per line, e.g.\nMoisture: max 12%\nGrade: A", rows=4),
        required=False,
    )
    packaging = ListTextarea(
        widget=_textarea("One packaging option per line, e.g.\n25 kg PP bags\n1 MT jumbo bags", rows=3),
        required=False,
    )

    class Meta:
        model = Product
        fields = [
            "title", "slug", "image", "short_description", "description", "category",
            "hs_code", "origins", "markets", "specifications", "packaging",
            "is_published",
        ]
        widgets = {
            "title": forms.TextInput(attrs=_ph("Product name, e.g. Basmati Rice — West Bengal")),
            "slug": forms.TextInput(attrs=_ph("URL slug — leave blank to auto-generate")),
            "short_description": _textarea("Brief summary for listings (max 300 characters)", rows=2),
            "description": _textarea("Full product description shown on the product page", rows=5),
            "hs_code": forms.TextInput(attrs=_ph("Harmonized System code, e.g. 1006.30")),
            "image": forms.ClearableFileInput(attrs={"accept": "image/jpeg,image/png,image/webp,image/gif"}),
        }

    def clean_slug(self):
        slug = self.cleaned_data.get("slug") or ""
        if not slug and self.cleaned_data.get("title"):
            slug = slugify(self.cleaned_data["title"])
        return slug

    def clean_image(self):
        image = self.cleaned_data.get("image")
        if not image or getattr(image, "_committed", True):
            return image
        if image.size > 5 * 1024 * 1024:
            raise forms.ValidationError("Image must be 5 MB or smaller.")
        content_type = getattr(image, "content_type", "") or ""
        if content_type and not content_type.startswith("image/"):
            raise forms.ValidationError("Upload a valid image file (JPEG, PNG, or WebP).")
        return image


class ExportCountryForm(forms.ModelForm):
    key_ports = ListTextarea(
        widget=_textarea("One port per line, e.g.\nChittagong\nMongla", rows=3),
        required=False,
    )
    specialties = ListTextarea(
        widget=_textarea("One specialty per line, e.g.\nRice\nJute goods", rows=3),
        required=False,
    )

    class Meta:
        model = ExportCountry
        fields = [
            "name", "slug", "subtitle", "region", "description",
            "key_ports", "specialties", "is_published",
        ]
        widgets = {
            "name": forms.TextInput(attrs=_ph("Country or destination, e.g. Bangladesh")),
            "slug": forms.TextInput(attrs=_ph("URL slug — leave blank to auto-generate")),
            "subtitle": forms.TextInput(attrs=_ph("Optional context, e.g. South Asia · SAARC")),
            "description": _textarea("Overview of this export destination — e.g. key Bangladesh corridors from Kolkata", rows=4),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["region"].empty_label = "Select region, e.g. South Asia (optional)"

    def clean_slug(self):
        slug = self.cleaned_data.get("slug") or ""
        if not slug and self.cleaned_data.get("name"):
            slug = slugify(self.cleaned_data["name"])
        return slug


class MarketRegionForm(forms.ModelForm):
    countries = ListTextarea(
        widget=_textarea("One country per line, e.g.\nBangladesh\nNepal\nBhutan", rows=3),
        required=False,
    )
    key_ports = ListTextarea(
        widget=_textarea("One port per line, e.g.\nKolkata\nHaldia", rows=3),
        required=False,
    )
    specialties = ListTextarea(
        widget=_textarea("One specialty per line, e.g.\nRice\nSpices\nJute", rows=3),
        required=False,
    )

    class Meta:
        model = MarketRegion
        fields = [
            "name", "slug", "description", "countries", "key_ports",
            "specialties", "is_published",
        ]
        widgets = {
            "name": forms.TextInput(attrs=_ph("Region name, e.g. South Asia")),
            "slug": forms.TextInput(attrs=_ph("URL slug — leave blank to auto-generate")),
            "description": _textarea("Describe this corridor — e.g. exports from Kolkata & West Bengal across South Asia", rows=4),
        }

    def clean_slug(self):
        slug = self.cleaned_data.get("slug") or ""
        if not slug and self.cleaned_data.get("name"):
            slug = slugify(self.cleaned_data["name"])
        return slug


class OfficeForm(forms.ModelForm):
    class Meta:
        model = Office
        fields = ["region", "address", "phone", "email", "is_published"]
        widgets = {
            "region": forms.TextInput(attrs=_ph("Office region or city, e.g. Kolkata, West Bengal")),
            "address": _textarea("Full address, e.g.\n12 Export House, Park Street\nKolkata 700016, West Bengal, India", rows=3),
            "phone": forms.TextInput(attrs=_ph("Contact phone, e.g. +91 33 2288 4400")),
            "email": forms.EmailInput(attrs=_ph("Office email, e.g. kolkata@company.com")),
        }


class IndustryForm(forms.ModelForm):
    class Meta:
        model = Industry
        fields = ["name", "slug", "description", "compliance_tag", "is_published"]
        widgets = {
            "name": forms.TextInput(attrs=_ph("Industry name, e.g. Agro Commodities — Eastern India")),
            "slug": forms.TextInput(attrs=_ph("URL slug — leave blank to auto-generate")),
            "description": _textarea("Short description — e.g. rice and pulses exported from West Bengal", rows=3),
            "compliance_tag": forms.TextInput(attrs=_ph("Compliance label, e.g. APEDA · FSSAI")),
        }

    def clean_slug(self):
        slug = self.cleaned_data.get("slug") or ""
        if not slug and self.cleaned_data.get("name"):
            slug = slugify(self.cleaned_data["name"])
        return slug


class CustomerForm(forms.ModelForm):
    class Meta:
        model = Customer
        fields = [
            "company_name", "contact_name", "email", "phone", "gstin",
            "export_country", "country_other", "address",
            "customer_type", "status", "notes",
        ]
        widgets = {
            "company_name": forms.TextInput(attrs=_ph("Buyer company, e.g. Dhaka Trading Co.")),
            "contact_name": forms.TextInput(attrs=_ph("Primary contact, e.g. Md. Rahman")),
            "email": forms.EmailInput(attrs=_ph("Contact email, e.g. buyer@dhakatrading.bd")),
            "phone": forms.TextInput(attrs=_ph("Phone with country code, e.g. +880 1712 345678")),
            "gstin": forms.TextInput(attrs=_ph("Leave blank for overseas buyers")),
            "country_other": forms.TextInput(attrs=_ph("Destination if not listed, e.g. Nepal")),
            "address": _textarea("Billing or shipping address, e.g.\nGulshan, Dhaka\nBangladesh", rows=3),
            "notes": _textarea("Internal notes — e.g. prefers Kolkata port shipments", rows=4),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["export_country"].empty_label = "Select destination, e.g. Bangladesh (optional)"
        self.fields["gstin"].required = False


class InquiryStatusForm(forms.ModelForm):
    class Meta:
        model = Inquiry
        fields = ["status", "customer"]
        widgets = {"customer": forms.Select()}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["customer"].empty_label = "Link to customer (optional)"


class InvoiceForm(forms.ModelForm):
    currency = forms.ModelChoiceField(
        queryset=Currency.objects.filter(is_active=True).order_by("sort_order", "code"),
        empty_label="Select currency",
    )

    class Meta:
        model = Invoice
        fields = [
            "inquiry", "client_name", "client_company", "client_phone", "client_email", "client_address",
            "client_gstin", "issue_date", "due_date", "currency", "status", "tax_rate", "notes",
            "pre_carriage_by", "place_of_pre_carriage", "port_of_loading", "vessel_flight_no",
            "port_of_discharge", "final_destination", "country_of_origin",
            "country_of_final_destination", "volume_shipment", "incoterms",
        ]
        widgets = {
            "client_name": forms.TextInput(attrs=_ph("Client name, e.g. Md. Karim")),
            "client_company": forms.TextInput(attrs=_ph("Client company, e.g. Bengal Agro Imports")),
            "client_phone": forms.TextInput(attrs=_ph("Client phone, e.g. +880 1712 345678")),
            "client_email": forms.EmailInput(attrs=_ph("Client email, e.g. karim@bengalagro.bd")),
            "client_address": _textarea("Client address, e.g.\nMotijheel, Dhaka\nBangladesh", rows=3),
            "client_gstin": forms.TextInput(attrs=_ph("Leave blank for overseas buyers")),
            "notes": _textarea("Payment terms — e.g. FOB Kolkata, 30 days LC", rows=3),
            "issue_date": forms.DateInput(attrs={"type": "date"}),
            "due_date": forms.DateInput(attrs={"type": "date"}),
            "tax_rate": forms.NumberInput(attrs=_ph("Tax percentage, e.g. 18")),
            "pre_carriage_by": forms.TextInput(attrs=_ph("e.g. Road / Rail")),
            "place_of_pre_carriage": forms.TextInput(attrs=_ph("e.g. Kolkata, West Bengal, India")),
            "port_of_loading": forms.TextInput(attrs=_ph("e.g. Kolkata / Haldia")),
            "vessel_flight_no": forms.TextInput(attrs=_ph("Vessel or flight number")),
            "port_of_discharge": forms.TextInput(attrs=_ph("e.g. Chittagong / Mongla")),
            "final_destination": forms.TextInput(attrs=_ph("e.g. Dhaka, Bangladesh")),
            "country_of_origin": forms.TextInput(attrs=_ph("e.g. India")),
            "country_of_final_destination": forms.TextInput(attrs=_ph("e.g. Bangladesh")),
            "volume_shipment": forms.TextInput(attrs=_ph("e.g. 1×20 ft container")),
            "incoterms": forms.TextInput(attrs=_ph("e.g. FOB Kolkata")),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["inquiry"].empty_label = "Link to inquiry (optional)"
        self.fields["client_gstin"].required = False


INVOICE_CLIENT_FIELDS = [
    "inquiry", "client_name", "client_company", "client_phone", "client_email", "client_address",
    "client_gstin", "issue_date", "due_date", "currency", "status", "tax_rate", "notes",
]

INVOICE_SHIPPING_FIELDS = [
    "pre_carriage_by", "place_of_pre_carriage", "port_of_loading", "vessel_flight_no",
    "port_of_discharge", "final_destination", "country_of_origin",
    "country_of_final_destination", "volume_shipment", "incoterms",
]


class InvoiceLineForm(forms.ModelForm):
    class Meta:
        model = InvoiceLine
        fields = ["description", "quantity", "unit_price"]
        widgets = {
            "description": forms.TextInput(attrs=_ph("Item description, e.g. Basmati Rice — 25 kg bags, West Bengal origin")),
            "quantity": forms.NumberInput(attrs=_ph("Qty")),
            "unit_price": forms.NumberInput(attrs=_ph("Unit price")),
        }


def build_invoice_line_formset(instance=None, data=None):
    """Create/edit formset — one blank row on new invoices only."""
    extra = 0 if instance and instance.pk else 1
    FormSet = inlineformset_factory(
        Invoice,
        InvoiceLine,
        form=InvoiceLineForm,
        extra=extra,
        can_delete=True,
        min_num=1,
        validate_min=True,
    )
    if data is not None:
        return FormSet(data, instance=instance)
    return FormSet(instance=instance)


class CategoryForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = ["name", "slug", "description", "is_active"]
        widgets = {
            "name": forms.TextInput(attrs=_ph("Category name, e.g. Rice & Grains")),
            "slug": forms.TextInput(attrs=_ph("URL slug — leave blank to auto-generate")),
            "description": _textarea("Optional category description", rows=3),
        }

    def clean_slug(self):
        slug = self.cleaned_data.get("slug") or ""
        if not slug and self.cleaned_data.get("name"):
            slug = slugify(self.cleaned_data["name"])
        return slug


class CurrencyForm(forms.ModelForm):
    class Meta:
        model = Currency
        fields = ["code", "name", "symbol", "is_active"]
        widgets = {
            "code": forms.TextInput(attrs=_ph("ISO code, e.g. INR, BDT, USD")),
            "name": forms.TextInput(attrs=_ph("Currency name, e.g. Indian Rupee")),
            "symbol": forms.TextInput(attrs=_ph("Symbol, e.g. ₹, ৳, $")),
        }


class ExportReportForm(forms.ModelForm):
    class Meta:
        model = ExportReport
        fields = ["title", "report_type", "date_from", "date_to", "notes"]
        widgets = {
            "title": forms.TextInput(attrs=_ph("e.g. March 2026 export sales review")),
            "date_from": forms.DateInput(attrs={"type": "date"}),
            "date_to": forms.DateInput(attrs={"type": "date"}),
            "notes": _textarea("Executive notes or context for this report", rows=3),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["title"].required = False
        self.fields["report_type"].help_text = (
            "Choose the export business report you need. Date range applies to "
            "invoices, inquiries, and customers where relevant."
        )
        choices = self.fields["report_type"].choices
        if choices:
            hints = []
            for value, label in choices:
                if value:
                    hint = REPORT_TYPE_HELP.get(value, "")
                    hints.append(f"{label} — {hint}" if hint else str(label))
            self.fields["report_type"].widget.attrs["title"] = " ".join(hints[:2])


class ProfileForm(forms.ModelForm):
    class Meta:
        model = get_user_model()
        fields = ["first_name", "last_name", "email"]
        widgets = {
            "first_name": forms.TextInput(attrs=_ph("First name")),
            "last_name": forms.TextInput(attrs=_ph("Last name")),
            "email": forms.EmailInput(attrs=_ph("Email address")),
        }


class DeskPasswordChangeForm(PasswordChangeForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["old_password"].widget.attrs.update(_ph("Current password"))
        self.fields["new_password1"].widget.attrs.update(_ph("New password"))
        self.fields["new_password2"].widget.attrs.update(_ph("Confirm new password"))
