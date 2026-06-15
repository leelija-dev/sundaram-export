from decimal import Decimal

from django.contrib import messages
from django.db import transaction
from django.db.models import Q
from django.shortcuts import get_object_or_404, redirect
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

from catalog.models import ExportCountry, MarketRegion, Office, Product
from customers.models import Customer
from documents.models import ExportReport, Invoice
from documents.services import generate_report_data
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
    InvoiceLineFormSet,
    MarketRegionForm,
    OfficeForm,
    ProductForm,
)
from .mixins import DeskMixin, DeskSuccessMessageMixin
from .stats import get_dashboard_stats


# ——— Dashboard ———

class DashboardView(DeskMixin, TemplateView):
    template_name = "desk/dashboard.html"

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["dashboard"] = get_dashboard_stats()
        ctx["nav_section"] = "dashboard"
        ctx["page_title"] = "Analytics"
        return ctx


# ——— Products ———

class ProductListView(DeskMixin, ListView):
    model = Product
    template_name = "desk/product_list.html"
    context_object_name = "items"
    paginate_by = 20

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["nav_section"] = "products"
        ctx["page_title"] = "Products"
        return ctx


class ProductCreateView(DeskMixin, DeskSuccessMessageMixin, CreateView):
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

class CountryListView(DeskMixin, ListView):
    model = ExportCountry
    template_name = "desk/country_list.html"
    context_object_name = "items"
    paginate_by = 25

    def get_queryset(self):
        return ExportCountry.objects.select_related("region")

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["nav_section"] = "countries"
        ctx["page_title"] = "Export countries"
        return ctx


class CountryCreateView(DeskMixin, DeskSuccessMessageMixin, CreateView):
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

class MarketListView(DeskMixin, ListView):
    model = MarketRegion
    template_name = "desk/market_list.html"
    context_object_name = "items"
    paginate_by = 20

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


class MarketCreateView(DeskMixin, DeskSuccessMessageMixin, CreateView):
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


class InvoiceDetailView(DeskMixin, DetailView):
    model = Invoice
    template_name = "desk/invoice_detail.html"
    context_object_name = "invoice"

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["nav_section"] = "invoices"
        ctx["page_title"] = self.object.invoice_number
        ctx["lines"] = self.object.lines.all()
        return ctx


class InvoicePrintView(DeskMixin, DetailView):
    model = Invoice
    template_name = "desk/invoice_print.html"
    context_object_name = "invoice"

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["lines"] = self.object.lines.all()
        return ctx


class InvoiceCreateView(DeskMixin, View):
    template_name = "desk/invoice_form.html"

    def get(self, request):
        inquiry = None
        inquiry_id = request.GET.get("inquiry")
        if inquiry_id:
            inquiry = Inquiry.objects.filter(pk=inquiry_id).first()

        form = InvoiceForm(instance=None)
        if inquiry:
            form.initial = {
                "inquiry": inquiry,
                "client_name": inquiry.name,
                "client_company": inquiry.company,
                "client_email": inquiry.email,
            }
        formset = InvoiceLineFormSet(instance=None)
        return self._render(request, form, formset, "Create invoice")

    def post(self, request):
        form = InvoiceForm(request.POST)
        formset = InvoiceLineFormSet(request.POST)
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
            {"form": form, "formset": formset, "page_title": title, "nav_section": "invoices"},
        )


class InvoiceUpdateView(DeskMixin, View):
    template_name = "desk/invoice_form.html"

    def get_object(self, pk):
        return get_object_or_404(Invoice, pk=pk)

    def get(self, request, pk):
        invoice = self.get_object(pk)
        form = InvoiceForm(instance=invoice)
        formset = InvoiceLineFormSet(instance=invoice)
        return self._render(request, invoice, form, formset, f"Edit {invoice.invoice_number}")

    def post(self, request, pk):
        invoice = self.get_object(pk)
        form = InvoiceForm(request.POST, instance=invoice)
        formset = InvoiceLineFormSet(request.POST, instance=invoice)
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
        ctx["page_title"] = "Reports"
        return ctx


class ReportCreateView(DeskMixin, CreateView):
    model = ExportReport
    form_class = ExportReportForm
    template_name = "desk/report_form.html"
    success_url = reverse_lazy("desk:report_list")

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["nav_section"] = "reports"
        ctx["page_title"] = "Generate report"
        return ctx

    def form_valid(self, form):
        report = form.save(commit=False)
        report.generated_by = self.request.user
        report.data = generate_report_data(
            report.report_type, report.date_from, report.date_to
        )
        if not report.title:
            report.title = report.get_report_type_display()
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
