from rest_framework import serializers

from .models import Category


class CategorySerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="slug")

    class Meta:
        model = Category
        fields = ["id", "name", "description"]
