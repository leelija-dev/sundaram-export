from decimal import Decimal
import json

from django.contrib import messages
from django.contrib.auth import update_session_auth_hash
from django.db import transaction
from django.db.models import Q
from django.http import Http404, HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse, reverse_lazy
from django.views.generic import (
    CreateView,
    DeleteView,
    DetailView,
    ListView,
    TemplateView,
    UpdateView,
    View,
)

from catalog.models import ExportCountry, Industry, MarketRegion, Office, Product
from customers.models import Customer
from documents.models import ExportReport, Invoice
from documents.services import REPORT_TYPE_HELP, generate_report_data
from inquiries.models import Inquiry

from master.models import Category, Currency

from .forms import (
    CategoryForm,
    CurrencyForm,
    CustomerForm,
    ExportCountryForm,
    ExportReportForm,
    InquiryStatusForm,
    InvoiceForm,
    INVOICE_CLIENT_FIELDS,
    INVOICE_SHIPPING_FIELDS,
    build_invoice_line_formset,
    MarketRegionForm,
    IndustryForm,
    OfficeForm,
    ProductForm,
    ProfileForm,
    DeskPasswordChangeForm,
)
from .mixins import (
    AppendSortOrderCreateMixin,
    DeskMixin,
    DeskSuccessMessageMixin,
    SortableListMixin,
)
from .analytics import get_dashboard_stats
from .company_details import get_exporter_office, resolve_exporter_company
from .invoice_qr import invoice_qr_for_display
from .invoice_shipping import resolve_invoice_shipping, suggest_invoice_shipping
from .report_present import normalize_report_display


class InvoiceDisplayMixin:
    def get_queryset(self):
        return (
            super()
            .get_queryset()
            .select_related(
                "currency",
                "inquiry",
                "inquiry__product",
                "inquiry__customer",
                "inquiry__customer__export_country",
            )
            .prefetch_related("lines")
        )

    def get_invoice_context(self):
        exporter_office = get_exporter_office()
        verify_token = self.kwargs.get("token")
        return {
            "lines": self.object.lines.all(),
            "exporter_office": exporter_office,
            "exporter_company": resolve_exporter_company(exporter_office),
            "shipping": resolve_invoice_shipping(self.object, exporter_office),
            "invoice_qr": invoice_qr_for_display(
                self.object,
                getattr(self, "request", None),
                verify_token=verify_token,
            ),
        }


# ——— Dashboard ———

class DashboardView(DeskMixin, TemplateView):
    template_name = "desk/dashboard.html"

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["dashboard"] = get_dashboard_stats(self.request)
        ctx["nav_section"] = "dashboard"
        ctx["page_title"] = "Analytics"
        return ctx


# ——— Profile ———

class ProfileView(DeskMixin, View):
    template_name = "desk/profile.html"

    def _context(self, request, profile_form=None, password_form=None):
        user = request.user
        return {
            "profile_form": profile_form or ProfileForm(instance=user),
            "password_form": password_form or DeskPasswordChangeForm(user=user),
            "nav_section": "profile",
            "page_title": "My profile",
            "profile_user": user,
        }

    def get(self, request):
        return render(request, self.template_name, self._context(request))

    def post(self, request):
        if request.POST.get("form_type") == "password":
            password_form = DeskPasswordChangeForm(request.user, request.POST)
            if password_form.is_valid():
                user = password_form.save()
                update_session_auth_hash(request, user)
                messages.success(request, "Password updated.")
                return redirect("desk:profile")
            return render(
                request,
                self.template_name,
                self._context(
                    request,
                    profile_form=ProfileForm(instance=request.user),
                    password_form=password_form,
                ),
            )

        profile_form = ProfileForm(request.POST, instance=request.user)
        if profile_form.is_valid():
            profile_form.save()
            messages.success(request, "Profile updated.")
            return redirect("desk:profile")
        return render(
            request,
            self.template_name,
            self._context(
                request,
                profile_form=profile_form,
                password_form=DeskPasswordChangeForm(user=request.user),
            ),
        )


# ——— Products ———

class ProductListView(DeskMixin, SortableListMixin, ListView):
    model = Product
    template_name = "desk/product_list.html"
    context_object_name = "items"
    reorder_kind = "products"

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["nav_section"] = "products"
        ctx["page_title"] = "Products"
        return ctx


class ProductCreateView(DeskMixin, AppendSortOrderCreateMixin, DeskSuccessMessageMixin, CreateView):
    model = Product
    form_class = ProductForm
    template_name = "desk/form.html"
    success_url = reverse_lazy("desk:product_list")
    success_message = "Product added."

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["nav_section"] = "products"
        ctx["page_title"] = "Add product"
        return ctx


class ProductUpdateView(DeskMixin, DeskSuccessMessageMixin, UpdateView):
    model = Product
    form_class = ProductForm
    template_name = "desk/form.html"
    success_url = reverse_lazy("desk:product_list")
    success_message = "Product updated."

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["nav_section"] = "products"
        ctx["page_title"] = f"Edit: {self.object.title}"
        return ctx


class ProductDeleteView(DeskMixin, DeskSuccessMessageMixin, DeleteView):
    model = Product
    template_name = "desk/confirm_delete.html"
    success_url = reverse_lazy("desk:product_list")

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["nav_section"] = "products"
        ctx["page_title"] = "Delete product"
        ctx["cancel_url"] = reverse("desk:product_list")
        return ctx


# ——— Export countries ———

class CountryListView(DeskMixin, SortableListMixin, ListView):
    model = ExportCountry
    template_name = "desk/country_list.html"
    context_object_name = "items"
    reorder_kind = "countries"

    def get_queryset(self):
        return ExportCountry.objects.select_related("region").order_by("sort_order", "name")

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["nav_section"] = "countries"
        ctx["page_title"] = "Export countries"
        return ctx


class CountryCreateView(DeskMixin, AppendSortOrderCreateMixin, DeskSuccessMessageMixin, CreateView):
    model = ExportCountry
    form_class = ExportCountryForm
    template_name = "desk/form.html"
    success_url = reverse_lazy("desk:country_list")
    success_message = "Export country added."

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["nav_section"] = "countries"
        ctx["page_title"] = "Add export country"
        return ctx


class CountryUpdateView(DeskMixin, DeskSuccessMessageMixin, UpdateView):
    model = ExportCountry
    form_class = ExportCountryForm
    template_name = "desk/form.html"
    success_url = reverse_lazy("desk:country_list")
    success_message = "Export country updated."

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["nav_section"] = "countries"
        ctx["page_title"] = f"Edit: {self.object.name}"
        return ctx


class CountryDeleteView(DeskMixin, DeskSuccessMessageMixin, DeleteView):
    model = ExportCountry
    template_name = "desk/confirm_delete.html"
    success_url = reverse_lazy("desk:country_list")

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["nav_section"] = "countries"
        ctx["page_title"] = "Delete export country"
        ctx["cancel_url"] = reverse("desk:country_list")
        return ctx


# ——— Market regions (optional grouping) ———

class MarketListView(DeskMixin, SortableListMixin, ListView):
    model = MarketRegion
    template_name = "desk/market_list.html"
    context_object_name = "items"
    reorder_kind = "regions"

    def get_queryset(self):
        from django.db.models import Count

        return MarketRegion.objects.annotate(country_count=Count("export_countries")).order_by(
            "sort_order", "name"
        )

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["nav_section"] = "regions"
        ctx["page_title"] = "Market regions"
        return ctx


class MarketCreateView(DeskMixin, AppendSortOrderCreateMixin, DeskSuccessMessageMixin, CreateView):
    model = MarketRegion
    form_class = MarketRegionForm
    template_name = "desk/form.html"
    success_url = reverse_lazy("desk:market_list")
    success_message = "Export region added."

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["nav_section"] = "regions"
        ctx["page_title"] = "Add market region"
        return ctx


class MarketUpdateView(DeskMixin, DeskSuccessMessageMixin, UpdateView):
    model = MarketRegion
    form_class = MarketRegionForm
    template_name = "desk/form.html"
    success_url = reverse_lazy("desk:market_list")
    success_message = "Export region updated."

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["nav_section"] = "regions"
        ctx["page_title"] = f"Edit: {self.object.name}"
        return ctx


class MarketDeleteView(DeskMixin, DeskSuccessMessageMixin, DeleteView):
    model = MarketRegion
    template_name = "desk/confirm_delete.html"
    success_url = reverse_lazy("desk:market_list")

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["nav_section"] = "regions"
        ctx["page_title"] = "Delete market region"
        ctx["cancel_url"] = reverse("desk:market_list")
        return ctx


# ——— Offices ———

class OfficeListView(DeskMixin, ListView):
    model = Office
    template_name = "desk/office_list.html"
    context_object_name = "items"
    paginate_by = 20

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["nav_section"] = "offices"
        ctx["page_title"] = "Offices"
        return ctx


class OfficeCreateView(DeskMixin, DeskSuccessMessageMixin, CreateView):
    model = Office
    form_class = OfficeForm
    template_name = "desk/form.html"
    success_url = reverse_lazy("desk:office_list")
    success_message = "Office added."

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["nav_section"] = "offices"
        ctx["page_title"] = "Add office"
        return ctx


class OfficeUpdateView(DeskMixin, DeskSuccessMessageMixin, UpdateView):
    model = Office
    form_class = OfficeForm
    template_name = "desk/form.html"
    success_url = reverse_lazy("desk:office_list")
    success_message = "Office updated."

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["nav_section"] = "offices"
        ctx["page_title"] = f"Edit: {self.object.region}"
        return ctx


class OfficeDeleteView(DeskMixin, DeskSuccessMessageMixin, DeleteView):
    model = Office
    template_name = "desk/confirm_delete.html"
    success_url = reverse_lazy("desk:office_list")

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["nav_section"] = "offices"
        ctx["page_title"] = "Delete office"
        ctx["cancel_url"] = reverse("desk:office_list")
        return ctx


# ——— Industries ———

class IndustryListView(DeskMixin, SortableListMixin, ListView):
    model = Industry
    template_name = "desk/industry_list.html"
    context_object_name = "items"
    reorder_kind = "industries"

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["nav_section"] = "industries"
        ctx["page_title"] = "Industries"
        return ctx


class IndustryCreateView(DeskMixin, AppendSortOrderCreateMixin, DeskSuccessMessageMixin, CreateView):
    model = Industry
    form_class = IndustryForm
    template_name = "desk/form.html"
    success_url = reverse_lazy("desk:industry_list")
    success_message = "Industry added."

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["nav_section"] = "industries"
        ctx["page_title"] = "Add industry"
        return ctx


class IndustryUpdateView(DeskMixin, DeskSuccessMessageMixin, UpdateView):
    model = Industry
    form_class = IndustryForm
    template_name = "desk/form.html"
    success_url = reverse_lazy("desk:industry_list")
    success_message = "Industry updated."

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["nav_section"] = "industries"
        ctx["page_title"] = f"Edit: {self.object.name}"
        return ctx


class IndustryDeleteView(DeskMixin, DeskSuccessMessageMixin, DeleteView):
    model = Industry
    template_name = "desk/confirm_delete.html"
    success_url = reverse_lazy("desk:industry_list")

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["nav_section"] = "industries"
        ctx["page_title"] = "Delete industry"
        ctx["cancel_url"] = reverse("desk:industry_list")
        return ctx


# ——— Customers ———

class CustomerListView(DeskMixin, ListView):
    model = Customer
    template_name = "desk/customer_list.html"
    context_object_name = "items"
    paginate_by = 25

    def get_queryset(self):
        from django.db.models import Count

        qs = Customer.objects.select_related("export_country")
        status = self.request.GET.get("status")
        if status:
            qs = qs.filter(status=status)
        return qs.annotate(inquiry_count=Count("inquiries")).order_by("company_name")

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["nav_section"] = "customers"
        ctx["page_title"] = "Customers"
        ctx["filter_status"] = self.request.GET.get("status", "")
        return ctx


class CustomerDetailView(DeskMixin, DetailView):
    model = Customer
    template_name = "desk/customer_detail.html"
    context_object_name = "customer"

    def get_queryset(self):
        return Customer.objects.select_related("export_country")

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["nav_section"] = "customers"
        ctx["page_title"] = self.object.company_name
        ctx["inquiries"] = self.object.inquiries.select_related("product")[:20]
        ctx["invoices"] = Invoice.objects.filter(inquiry__customer=self.object).distinct()[:10]
        return ctx


class CustomerCreateView(DeskMixin, DeskSuccessMessageMixin, CreateView):
    model = Customer
    form_class = CustomerForm
    template_name = "desk/form.html"
    success_url = reverse_lazy("desk:customer_list")
    success_message = "Customer added."

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["nav_section"] = "customers"
        ctx["page_title"] = "Add customer"
        return ctx


class CustomerUpdateView(DeskMixin, DeskSuccessMessageMixin, UpdateView):
    model = Customer
    form_class = CustomerForm
    template_name = "desk/form.html"

    def get_success_url(self):
        return reverse("desk:customer_detail", kwargs={"pk": self.object.pk})

    success_message = "Customer updated."

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["nav_section"] = "customers"
        ctx["page_title"] = f"Edit: {self.object.company_name}"
        return ctx


class CustomerDeleteView(DeskMixin, DeskSuccessMessageMixin, DeleteView):
    model = Customer
    template_name = "desk/confirm_delete.html"
    success_url = reverse_lazy("desk:customer_list")

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["nav_section"] = "customers"
        ctx["page_title"] = "Delete customer"
        ctx["cancel_url"] = reverse("desk:customer_list")
        return ctx


class CustomerCreateFromInquiryView(DeskMixin, View):
    def post(self, request, pk):
        inquiry = get_object_or_404(Inquiry, pk=pk)
        company = inquiry.company or inquiry.name
        customer = None
        if inquiry.email:
            customer = Customer.objects.filter(email__iexact=inquiry.email).first()
        if customer is None:
            export_country = None
            if inquiry.destination:
                dest = inquiry.destination.strip()
                export_country = ExportCountry.objects.filter(
                    Q(name__iexact=dest) | Q(slug__iexact=dest)
                ).first()
            customer = Customer.objects.create(
                company_name=company,
                contact_name=inquiry.name if inquiry.company else "",
                email=inquiry.email,
                phone=inquiry.phone,
                export_country=export_country,
                country_other=inquiry.destination if not export_country else "",
                status=Customer.Status.PROSPECT,
                notes="Created from website inquiry.",
            )
        inquiry.customer = customer
        inquiry.save(update_fields=["customer"])
        messages.success(request, f"Customer “{customer.company_name}” linked to this inquiry.")
        return redirect("desk:inquiry_detail", pk=inquiry.pk)


# ——— Inquiries ———

class InquiryListView(DeskMixin, ListView):
    model = Inquiry
    template_name = "desk/inquiry_list.html"
    context_object_name = "items"
    paginate_by = 25

    def get_queryset(self):
        qs = Inquiry.objects.select_related("product", "customer")
        status = self.request.GET.get("status")
        if status:
            qs = qs.filter(status=status)
        itype = self.request.GET.get("type")
        if itype:
            qs = qs.filter(inquiry_type=itype)
        return qs

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["nav_section"] = "inquiries"
        ctx["page_title"] = "Inquiries & leads"
        ctx["filter_status"] = self.request.GET.get("status", "")
        ctx["filter_type"] = self.request.GET.get("type", "")
        return ctx


class InquiryDetailView(DeskMixin, UpdateView):
    model = Inquiry
    form_class = InquiryStatusForm
    template_name = "desk/inquiry_detail.html"
    slug_field = "pk"
    slug_url_kwarg = "pk"
    success_message = "Inquiry updated."

    def get_queryset(self):
        return Inquiry.objects.select_related("product")

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["nav_section"] = "inquiries"
        ctx["page_title"] = f"Inquiry — {self.object.name}"
        return ctx

    def form_valid(self, form):
        messages.success(self.request, self.success_message)
        return super().form_valid(form)

    def get_success_url(self):
        return reverse("desk:inquiry_detail", kwargs={"pk": self.object.pk})


class InquiryCreateInvoiceView(DeskMixin, View):
    def get(self, request, pk):
        inquiry = get_object_or_404(Inquiry, pk=pk)
        return redirect(f"{reverse('desk:invoice_add')}?inquiry={inquiry.pk}")

    def post(self, request, pk):
        return self.get(request, pk)


# ——— Invoices ———

class InvoiceListView(DeskMixin, ListView):
    model = Invoice
    template_name = "desk/invoice_list.html"
    context_object_name = "items"
    paginate_by = 20

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["nav_section"] = "invoices"
        ctx["page_title"] = "Invoices"
        return ctx


class InvoiceDetailView(InvoiceDisplayMixin, DeskMixin, DetailView):
    model = Invoice
    template_name = "desk/invoice_detail.html"
    context_object_name = "invoice"

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["nav_section"] = "invoices"
        ctx["page_title"] = self.object.invoice_number
        ctx.update(self.get_invoice_context())
        return ctx


class InvoicePrintView(InvoiceDisplayMixin, DeskMixin, DetailView):
    model = Invoice
    template_name = "desk/invoice_print.html"
    context_object_name = "invoice"

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx.update(self.get_invoice_context())
        return ctx


class InvoiceVerifyView(InvoiceDisplayMixin, DetailView):
    """Public signed link from invoice QR — same print layout, no desk login."""

    model = Invoice
    template_name = "desk/invoice_print.html"
    context_object_name = "invoice"

    def get_object(self, queryset=None):
        from .invoice_qr import resolve_invoice_from_verify_token

        invoice = resolve_invoice_from_verify_token(self.kwargs["token"])
        if invoice is None:
            raise Http404("This invoice link is invalid or has expired.")
        return invoice

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx.update(self.get_invoice_context())
        ctx["public_verify"] = True
        return ctx


class InvoiceQrImageView(DeskMixin, View):
    def get(self, request, pk):
        from .invoice_qr import invoice_qr_needed, render_invoice_qr_png

        invoice = get_object_or_404(Invoice, pk=pk)
        if not invoice_qr_needed(invoice):
            raise Http404()
        return HttpResponse(
            render_invoice_qr_png(invoice, request),
            content_type="image/png",
        )


class InvoiceVerifyQrImageView(View):
    def get(self, request, token):
        from .invoice_qr import (
            invoice_qr_needed,
            render_invoice_qr_png,
            resolve_invoice_from_verify_token,
        )

        invoice = resolve_invoice_from_verify_token(token)
        if invoice is None or not invoice_qr_needed(invoice):
            raise Http404()
        return HttpResponse(
            render_invoice_qr_png(invoice, request),
            content_type="image/png",
        )


class InvoiceCreateView(DeskMixin, View):
    template_name = "desk/invoice_form.html"

    def get(self, request):
        inquiry = None
        inquiry_id = request.GET.get("inquiry")
        if inquiry_id:
            inquiry = Inquiry.objects.filter(pk=inquiry_id).first()

        form = InvoiceForm(instance=None)
        office = get_exporter_office()
        if inquiry:
            customer = inquiry.customer if inquiry.customer_id else None
            form.initial = {
                "inquiry": inquiry,
                "client_name": inquiry.name,
                "client_company": inquiry.company,
                "client_email": inquiry.email,
                "client_phone": inquiry.phone or (customer.phone if customer else ""),
                **suggest_invoice_shipping(
                    inquiry,
                    office,
                    customer,
                ),
            }
            if customer and customer.gstin:
                form.initial["client_gstin"] = customer.gstin
        else:
            form.initial.update(suggest_invoice_shipping(None, office))
        formset = build_invoice_line_formset(instance=None)
        return self._render(request, form, formset, "Create invoice")

    def post(self, request):
        form = InvoiceForm(request.POST)
        formset = build_invoice_line_formset(instance=None, data=request.POST)
        if form.is_valid() and formset.is_valid():
            return self._save(request, form, formset)
        return self._render(request, form, formset, "Create invoice")

    @transaction.atomic
    def _save(self, request, form, formset):
        invoice = form.save(commit=False)
        invoice.invoice_number = Invoice.generate_number()
        invoice.created_by = request.user
        invoice.save()
        formset.instance = invoice
        formset.save()
        invoice.recalculate_totals()
        invoice.save(update_fields=["subtotal", "tax_amount", "total"])
        messages.success(request, f"Invoice {invoice.invoice_number} created.")
        return redirect("desk:invoice_detail", pk=invoice.pk)

    def _render(self, request, form, formset, title):
        from django.shortcuts import render

        return render(
            request,
            self.template_name,
            {
                "form": form,
                "formset": formset,
                "page_title": title,
                "nav_section": "invoices",
                "invoice_client_fields": INVOICE_CLIENT_FIELDS,
                "invoice_shipping_fields": INVOICE_SHIPPING_FIELDS,
            },
        )


class InvoiceUpdateView(DeskMixin, View):
    template_name = "desk/invoice_form.html"

    def get_object(self, pk):
        return get_object_or_404(Invoice, pk=pk)

    def get(self, request, pk):
        invoice = self.get_object(pk)
        form = InvoiceForm(instance=invoice)
        formset = build_invoice_line_formset(instance=invoice)
        return self._render(request, invoice, form, formset, f"Edit {invoice.invoice_number}")

    def post(self, request, pk):
        invoice = self.get_object(pk)
        form = InvoiceForm(request.POST, instance=invoice)
        formset = build_invoice_line_formset(instance=invoice, data=request.POST)
        if form.is_valid() and formset.is_valid():
            return self._save(request, invoice, form, formset)
        return self._render(request, invoice, form, formset, f"Edit {invoice.invoice_number}")

    @transaction.atomic
    def _save(self, request, invoice, form, formset):
        form.save()
        formset.save()
        invoice.recalculate_totals()
        invoice.save(update_fields=["subtotal", "tax_amount", "total"])
        messages.success(request, "Invoice updated.")
        return redirect("desk:invoice_detail", pk=invoice.pk)

    def _render(self, request, invoice, form, formset, title):
        from django.shortcuts import render

        return render(
            request,
            self.template_name,
            {
                "form": form,
                "formset": formset,
                "invoice": invoice,
                "page_title": title,
                "nav_section": "invoices",
                "invoice_client_fields": INVOICE_CLIENT_FIELDS,
                "invoice_shipping_fields": INVOICE_SHIPPING_FIELDS,
            },
        )


class InvoiceDeleteView(DeskMixin, DeskSuccessMessageMixin, DeleteView):
    model = Invoice
    template_name = "desk/confirm_delete.html"
    success_url = reverse_lazy("desk:invoice_list")

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["nav_section"] = "invoices"
        ctx["page_title"] = "Delete invoice"
        ctx["cancel_url"] = reverse("desk:invoice_list")
        return ctx


# ——— Categories ———

class CategoryListView(DeskMixin, ListView):
    model = Category
    template_name = "desk/category_list.html"
    context_object_name = "items"
    paginate_by = 25

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["nav_section"] = "categories"
        ctx["page_title"] = "Categories"
        return ctx


class CategoryCreateView(DeskMixin, DeskSuccessMessageMixin, CreateView):
    model = Category
    form_class = CategoryForm
    template_name = "desk/form.html"
    success_url = reverse_lazy("desk:category_list")
    success_message = "Category added."

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["nav_section"] = "categories"
        ctx["page_title"] = "Add category"
        return ctx


class CategoryUpdateView(DeskMixin, DeskSuccessMessageMixin, UpdateView):
    model = Category
    form_class = CategoryForm
    template_name = "desk/form.html"
    success_url = reverse_lazy("desk:category_list")
    success_message = "Category updated."

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["nav_section"] = "categories"
        ctx["page_title"] = f"Edit: {self.object.name}"
        return ctx


class CategoryDeleteView(DeskMixin, DeskSuccessMessageMixin, DeleteView):
    model = Category
    template_name = "desk/confirm_delete.html"
    success_url = reverse_lazy("desk:category_list")

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["nav_section"] = "categories"
        ctx["page_title"] = "Delete category"
        ctx["cancel_url"] = reverse("desk:category_list")
        return ctx


# ——— Currencies ———

class CurrencyListView(DeskMixin, ListView):
    model = Currency
    template_name = "desk/currency_list.html"
    context_object_name = "items"
    paginate_by = 25

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["nav_section"] = "currencies"
        ctx["page_title"] = "Currencies"
        return ctx


class CurrencyCreateView(DeskMixin, DeskSuccessMessageMixin, CreateView):
    model = Currency
    form_class = CurrencyForm
    template_name = "desk/form.html"
    success_url = reverse_lazy("desk:currency_list")
    success_message = "Currency added."

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["nav_section"] = "currencies"
        ctx["page_title"] = "Add currency"
        return ctx


class CurrencyUpdateView(DeskMixin, DeskSuccessMessageMixin, UpdateView):
    model = Currency
    form_class = CurrencyForm
    template_name = "desk/form.html"
    success_url = reverse_lazy("desk:currency_list")
    success_message = "Currency updated."

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["nav_section"] = "currencies"
        ctx["page_title"] = f"Edit: {self.object.code}"
        return ctx


class CurrencyDeleteView(DeskMixin, DeskSuccessMessageMixin, DeleteView):
    model = Currency
    template_name = "desk/confirm_delete.html"
    success_url = reverse_lazy("desk:currency_list")

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["nav_section"] = "currencies"
        ctx["page_title"] = "Delete currency"
        ctx["cancel_url"] = reverse("desk:currency_list")
        return ctx


# ——— Reports ———

class ReportListView(DeskMixin, ListView):
    model = ExportReport
    template_name = "desk/report_list.html"
    context_object_name = "items"
    paginate_by = 20

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["nav_section"] = "reports"
        ctx["page_title"] = "Export reports"
        return ctx


class ReportCreateView(DeskMixin, CreateView):
    model = ExportReport
    form_class = ExportReportForm
    template_name = "desk/report_form.html"
    success_url = reverse_lazy("desk:report_list")

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["nav_section"] = "reports"
        ctx["page_title"] = "Generate export report"
        ctx["report_type_help"] = REPORT_TYPE_HELP
        ctx["report_types"] = [
            {"value": value, "label": label, "help": REPORT_TYPE_HELP.get(value, "")}
            for value, label in ExportReport.ReportType.choices
        ]
        return ctx

    def form_valid(self, form):
        report = form.save(commit=False)
        report.generated_by = self.request.user
        report.data = generate_report_data(
            report.report_type, report.date_from, report.date_to
        )
        if not report.title:
            period = report.data.get("period", {}).get("label", "")
            report.title = f"{report.get_report_type_display()} — {period}"
        report.save()
        messages.success(self.request, "Report generated.")
        return redirect("desk:report_detail", pk=report.pk)


class ReportDetailView(DeskMixin, DetailView):
    model = ExportReport
    template_name = "desk/report_detail.html"
    context_object_name = "report"

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["nav_section"] = "reports"
        ctx["page_title"] = self.object.title
        ctx["report_display"] = normalize_report_display(self.object.data)
        return ctx


class ReportPrintView(DeskMixin, DetailView):
    model = ExportReport
    template_name = "desk/report_print.html"
    context_object_name = "report"

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["report_display"] = normalize_report_display(self.object.data)
        return ctx


class ReportDeleteView(DeskMixin, DeskSuccessMessageMixin, DeleteView):
    model = ExportReport
    template_name = "desk/confirm_delete.html"
    success_url = reverse_lazy("desk:report_list")

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["nav_section"] = "reports"
        ctx["page_title"] = "Delete report"
        ctx["cancel_url"] = reverse("desk:report_list")
        return ctx


class ReorderView(DeskMixin, View):
    """Persist drag-and-drop order from sortable desk lists."""

    def post(self, request, kind):
        model = REORDER_MODELS.get(kind)
        if model is None:
            return JsonResponse({"ok": False, "error": "Unknown list."}, status=400)

        try:
            payload = json.loads(request.body.decode("utf-8"))
            ordered_ids = payload.get("order", [])
        except (json.JSONDecodeError, UnicodeDecodeError):
            return JsonResponse({"ok": False, "error": "Invalid request."}, status=400)

        if not isinstance(ordered_ids, list) or not ordered_ids:
            return JsonResponse({"ok": False, "error": "No order provided."}, status=400)

        try:
            ordered_ids = [int(pk) for pk in ordered_ids]
        except (TypeError, ValueError):
            return JsonResponse({"ok": False, "error": "Invalid item ids."}, status=400)

        if len(set(ordered_ids)) != len(ordered_ids):
            return JsonResponse({"ok": False, "error": "Duplicate ids."}, status=400)

        valid_ids = set(model.objects.filter(pk__in=ordered_ids).values_list("pk", flat=True))
        if len(valid_ids) != len(ordered_ids):
            return JsonResponse({"ok": False, "error": "Unknown item in list."}, status=400)

        apply_sort_order(model, ordered_ids)
        return JsonResponse({"ok": True})
