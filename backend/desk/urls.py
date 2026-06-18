from django.contrib.auth import views as auth_views
from django.urls import path

from .auth import DeskLoginView
from . import views

app_name = "desk"

urlpatterns = [
    # Categories
    path("categories/", views.CategoryListView.as_view(), name="category_list"),
    path("categories/add/", views.CategoryCreateView.as_view(), name="category_add"),
    path("categories/<int:pk>/edit/", views.CategoryUpdateView.as_view(), name="category_edit"),
    path("categories/<int:pk>/delete/", views.CategoryDeleteView.as_view(), name="category_delete"),
    # Currencies
    path("currencies/", views.CurrencyListView.as_view(), name="currency_list"),
    path("currencies/add/", views.CurrencyCreateView.as_view(), name="currency_add"),
    path("currencies/<int:pk>/edit/", views.CurrencyUpdateView.as_view(), name="currency_edit"),
    path("currencies/<int:pk>/delete/", views.CurrencyDeleteView.as_view(), name="currency_delete"),
    path("reorder/<str:kind>/", views.ReorderView.as_view(), name="reorder"),
    path("", views.DashboardView.as_view(), name="dashboard"),
    path("login/", DeskLoginView.as_view(), name="login"),
    path("logout/", auth_views.LogoutView.as_view(next_page="desk:login"), name="logout"),
    path("profile/", views.ProfileView.as_view(), name="profile"),
    # Products
    path("products/", views.ProductListView.as_view(), name="product_list"),
    path("products/add/", views.ProductCreateView.as_view(), name="product_add"),
    path("products/<int:pk>/edit/", views.ProductUpdateView.as_view(), name="product_edit"),
    path("products/<int:pk>/delete/", views.ProductDeleteView.as_view(), name="product_delete"),
    # Export countries
    path("countries/", views.CountryListView.as_view(), name="country_list"),
    path("countries/add/", views.CountryCreateView.as_view(), name="country_add"),
    path("countries/<int:pk>/edit/", views.CountryUpdateView.as_view(), name="country_edit"),
    path("countries/<int:pk>/delete/", views.CountryDeleteView.as_view(), name="country_delete"),
    # Market regions (grouping)
    path("regions/", views.MarketListView.as_view(), name="market_list"),
    path("regions/add/", views.MarketCreateView.as_view(), name="market_add"),
    path("regions/<int:pk>/edit/", views.MarketUpdateView.as_view(), name="market_edit"),
    path("regions/<int:pk>/delete/", views.MarketDeleteView.as_view(), name="market_delete"),
    # Offices
    path("offices/", views.OfficeListView.as_view(), name="office_list"),
    path("offices/add/", views.OfficeCreateView.as_view(), name="office_add"),
    path("offices/<int:pk>/edit/", views.OfficeUpdateView.as_view(), name="office_edit"),
    path("offices/<int:pk>/delete/", views.OfficeDeleteView.as_view(), name="office_delete"),
    # Industries
    path("industries/", views.IndustryListView.as_view(), name="industry_list"),
    path("industries/add/", views.IndustryCreateView.as_view(), name="industry_add"),
    path("industries/<int:pk>/edit/", views.IndustryUpdateView.as_view(), name="industry_edit"),
    path("industries/<int:pk>/delete/", views.IndustryDeleteView.as_view(), name="industry_delete"),
    # Customers
    path("customers/", views.CustomerListView.as_view(), name="customer_list"),
    path("customers/add/", views.CustomerCreateView.as_view(), name="customer_add"),
    path("customers/<int:pk>/", views.CustomerDetailView.as_view(), name="customer_detail"),
    path("customers/<int:pk>/edit/", views.CustomerUpdateView.as_view(), name="customer_edit"),
    path("customers/<int:pk>/delete/", views.CustomerDeleteView.as_view(), name="customer_delete"),
    # Inquiries
    path("inquiries/", views.InquiryListView.as_view(), name="inquiry_list"),
    path("inquiries/<uuid:pk>/", views.InquiryDetailView.as_view(), name="inquiry_detail"),
    path("inquiries/<uuid:pk>/invoice/", views.InquiryCreateInvoiceView.as_view(), name="inquiry_invoice"),
    path(
        "inquiries/<uuid:pk>/create-customer/",
        views.CustomerCreateFromInquiryView.as_view(),
        name="inquiry_create_customer",
    ),
    # Invoices
    path("invoices/", views.InvoiceListView.as_view(), name="invoice_list"),
    path("invoices/add/", views.InvoiceCreateView.as_view(), name="invoice_add"),
    path("invoices/<int:pk>/", views.InvoiceDetailView.as_view(), name="invoice_detail"),
    path("invoices/<int:pk>/edit/", views.InvoiceUpdateView.as_view(), name="invoice_edit"),
    path("invoices/<int:pk>/print/", views.InvoicePrintView.as_view(), name="invoice_print"),
    path("invoices/<int:pk>/qr.png", views.InvoiceQrImageView.as_view(), name="invoice_qr"),
    path("invoices/v/<str:token>/", views.InvoiceVerifyView.as_view(), name="invoice_verify"),
    path("invoices/v/<str:token>/qr.png", views.InvoiceVerifyQrImageView.as_view(), name="invoice_verify_qr"),
    path("invoices/<int:pk>/delete/", views.InvoiceDeleteView.as_view(), name="invoice_delete"),
    # Reports
    path("reports/", views.ReportListView.as_view(), name="report_list"),
    path("reports/add/", views.ReportCreateView.as_view(), name="report_add"),
    path("reports/<int:pk>/", views.ReportDetailView.as_view(), name="report_detail"),
    path("reports/<int:pk>/print/", views.ReportPrintView.as_view(), name="report_print"),
    path("reports/<int:pk>/delete/", views.ReportDeleteView.as_view(), name="report_delete"),
]
