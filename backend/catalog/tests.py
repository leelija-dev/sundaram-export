from django.test import TestCase
from rest_framework.test import APIClient

from master.models import Category
from catalog.models import Product


class CatalogApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.category = Category.objects.create(
            name="Spices", slug="spices", is_active=True
        )
        Product.objects.create(
            slug="turmeric",
            title="Turmeric",
            short_description="Premium turmeric",
            description="Full description",
            category=self.category,
            is_published=True,
        )

    def test_health(self):
        res = self.client.get("/api/v1/health/")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["status"], "ok")

    def test_categories(self):
        res = self.client.get("/api/v1/categories/")
        self.assertEqual(res.status_code, 200)
        slugs = [item["id"] for item in res.json()["results"]]
        self.assertIn("spices", slugs)

    def test_product_list_excludes_description(self):
        res = self.client.get("/api/v1/products/")
        self.assertEqual(res.status_code, 200)
        item = res.json()["results"][0]
        self.assertNotIn("description", item)
        self.assertEqual(item["category"], "spices")

    def test_product_detail_includes_description(self):
        res = self.client.get("/api/v1/products/turmeric/")
        self.assertEqual(res.status_code, 200)
        self.assertIn("description", res.json())
