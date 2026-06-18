from django.urls import path

from master.views import CategoryListView

from .views import (
    ExportCountryDetailView,
    ExportCountryListView,
    HealthView,
    IndustryListView,
    MarketDetailView,
    MarketListView,
    OfficeDetailView,
    OfficeListView,
    ProductDetailView,
    ProductListView,
)

urlpatterns = [
    path("health/", HealthView.as_view(), name="health"),
    path("categories/", CategoryListView.as_view(), name="category-list"),
    path("products/", ProductListView.as_view(), name="product-list"),
    path("products/<slug:slug>/", ProductDetailView.as_view(), name="product-detail"),
    path("countries/", ExportCountryListView.as_view(), name="country-list"),
    path("countries/<slug:slug>/", ExportCountryDetailView.as_view(), name="country-detail"),
    path("markets/", MarketListView.as_view(), name="market-list"),
    path("markets/<slug:slug>/", MarketDetailView.as_view(), name="market-detail"),
    path("offices/", OfficeListView.as_view(), name="office-list"),
    path("offices/<int:pk>/", OfficeDetailView.as_view(), name="office-detail"),
    path("industries/", IndustryListView.as_view(), name="industry-list"),
]
