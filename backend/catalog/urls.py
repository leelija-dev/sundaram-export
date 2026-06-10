from django.urls import path

from .views import (
    ExportCountryDetailView,
    ExportCountryListView,
    HealthView,
    MarketDetailView,
    MarketListView,
    OfficeListView,
    ProductDetailView,
    ProductListView,
)

urlpatterns = [
    path("health/", HealthView.as_view(), name="health"),
    path("products/", ProductListView.as_view(), name="product-list"),
    path("products/<slug:slug>/", ProductDetailView.as_view(), name="product-detail"),
    path("countries/", ExportCountryListView.as_view(), name="country-list"),
    path("countries/<slug:slug>/", ExportCountryDetailView.as_view(), name="country-detail"),
    path("markets/", MarketListView.as_view(), name="market-list"),
    path("markets/<slug:slug>/", MarketDetailView.as_view(), name="market-detail"),
    path("offices/", OfficeListView.as_view(), name="office-list"),
]
