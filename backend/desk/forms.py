from django import forms
from django.forms import inlineformset_factory
from django.utils.text import slugify

from catalog.models import ExportCountry, MarketRegion, Office, Product
from documents.models import ExportReport, Invoice, InvoiceLine
from customers.models import Customer
from inquiries.models import Inquiry
from master.models import Category, Currency


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
    origins = ListTextarea(widget=forms.Textarea(attrs={"rows": 3}), required=False)
    markets = ListTextarea(widget=forms.Textarea(attrs={"rows": 3}), required=False)
    specifications = ListTextarea(widget=forms.Textarea(attrs={"rows": 4}), required=False)
    packaging = ListTextarea(widget=forms.Textarea(attrs={"rows": 3}), required=False)

    class Meta:
        model = Product
        fields = [
            "title", "slug", "short_description", "description", "category",
            "hs_code", "origins", "markets", "specifications", "packaging",
            "is_published", "sort_order",
        ]
        widgets = {
            "description": forms.Textarea(attrs={"rows": 5}),
            "short_description": forms.Textarea(attrs={"rows": 2}),
        }

    def clean_slug(self):
        slug = self.cleaned_data.get("slug") or ""
        if not slug and self.cleaned_data.get("title"):
            slug = slugify(self.cleaned_data["title"])
        return slug


class ExportCountryForm(forms.ModelForm):
    key_ports = ListTextarea(widget=forms.Textarea(attrs={"rows": 3}), required=False)
    specialties = ListTextarea(widget=forms.Textarea(attrs={"rows": 3}), required=False)

    class Meta:
        model = ExportCountry
        fields = [
            "name", "slug", "subtitle", "region", "description",
            "key_ports", "specialties", "is_published", "sort_order",
        ]
        widgets = {
            "description": forms.Textarea(attrs={"rows": 4}),
            "subtitle": forms.TextInput(attrs={"placeholder": "e.g. UAE, South Asia"}),
        }

    def clean_slug(self):
        slug = self.cleaned_data.get("slug") or ""
        if not slug and self.cleaned_data.get("name"):
            slug = slugify(self.cleaned_data["name"])
        return slug


class MarketRegionForm(forms.ModelForm):
    key_ports = ListTextarea(widget=forms.Textarea(attrs={"rows": 3}), required=False)
    specialties = ListTextarea(widget=forms.Textarea(attrs={"rows": 3}), required=False)

    class Meta:
        model = MarketRegion
        fields = [
            "name", "slug", "description", "key_ports",
            "specialties", "is_published", "sort_order",
        ]
        widgets = {"description": forms.Textarea(attrs={"rows": 4})}

    def clean_slug(self):
        slug = self.cleaned_data.get("slug") or ""
        if not slug and self.cleaned_data.get("name"):
            slug = slugify(self.cleaned_data["name"])
        return slug


class OfficeForm(forms.ModelForm):
    class Meta:
        model = Office
        fields = ["region", "address", "phone", "email", "is_published", "sort_order"]
        widgets = {"address": forms.Textarea(attrs={"rows": 3})}


class CustomerForm(forms.ModelForm):
    class Meta:
        model = Customer
        fields = [
            "company_name", "contact_name", "email", "phone",
            "export_country", "country_other", "address",
            "customer_type", "status", "notes",
        ]
        widgets = {
            "address": forms.Textarea(attrs={"rows": 3}),
            "notes": forms.Textarea(attrs={"rows": 4}),
        }


class InquiryStatusForm(forms.ModelForm):
    class Meta:
        model = Inquiry
        fields = ["status", "customer"]
        widgets = {"customer": forms.Select()}


class InvoiceForm(forms.ModelForm):
    currency = forms.ModelChoiceField(
        queryset=Currency.objects.filter(is_active=True).order_by("sort_order", "code"),
        empty_label="Select currency",
    )

    class Meta:
        model = Invoice
        fields = [
            "inquiry", "client_name", "client_company", "client_email", "client_address",
            "issue_date", "due_date", "currency", "status", "tax_rate", "notes",
        ]
        widgets = {
            "client_address": forms.Textarea(attrs={"rows": 3}),
            "notes": forms.Textarea(attrs={"rows": 3}),
            "issue_date": forms.DateInput(attrs={"type": "date"}),
            "due_date": forms.DateInput(attrs={"type": "date"}),
        }


class InvoiceLineForm(forms.ModelForm):
    class Meta:
        model = InvoiceLine
        fields = ["description", "quantity", "unit_price"]


InvoiceLineFormSet = inlineformset_factory(
    Invoice,
    InvoiceLine,
    form=InvoiceLineForm,
    extra=3,
    can_delete=True,
)


class CategoryForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = ["name", "slug", "description", "is_active", "sort_order"]
        widgets = {
            "description": forms.Textarea(attrs={"rows": 3}),
        }


class CurrencyForm(forms.ModelForm):
    class Meta:
        model = Currency
        fields = ["code", "name", "symbol", "is_active", "sort_order"]


class ExportReportForm(forms.ModelForm):
    class Meta:
        model = ExportReport
        fields = ["title", "report_type", "date_from", "date_to", "notes"]
        widgets = {
            "date_from": forms.DateInput(attrs={"type": "date"}),
            "date_to": forms.DateInput(attrs={"type": "date"}),
            "notes": forms.Textarea(attrs={"rows": 2}),
        }