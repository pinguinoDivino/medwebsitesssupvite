from django.core.files.uploadedfile import InMemoryUploadedFile
from rest_framework import serializers


class InMemoryUploadedImageField(serializers.ImageField):
    def to_internal_value(self, data):
        if isinstance(data, InMemoryUploadedFile):
            return data
        if isinstance(data, str):
            # If the incoming data is a string (link), return the existing value of the field
            return self.parent.instance.img
        return super().to_internal_value(data)


class NestedModelSerializer(serializers.ModelSerializer):
    class Meta:
        abstract = True
        model = None

    def create(self, validated_data):
        pass

    def update(self, instance, validated_data):
        pass
