import locale
from rest_framework import serializers
from django.contrib.auth import get_user_model
from ..models import Diary, Page

locale.setlocale(locale.LC_ALL, 'en_US.utf8')
User = get_user_model()


class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        exclude = ('diary', )

    def create(self, validated_data):
        diary_id = validated_data.pop('diary_id')
        diary = Diary.objects.get(pk=diary_id)
        page = Page.objects.create(diary=diary, **validated_data)
        page.save()
        return page


class DiarySerializer(serializers.ModelSerializer):
    authors = serializers.SerializerMethodField(read_only=True)
    pages_number = serializers.SerializerMethodField(read_only=True)
    pages = PageSerializer(many=True, read_only=True)

    class Meta:
        model = Diary
        fields = '__all__'

    def get_pages_number(self, instance):
        return instance.get_pages_number()

    def get_authors(self, instance):
        return " e ".join([a.__str__() for a in instance.authors.all()])