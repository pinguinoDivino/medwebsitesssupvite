import locale
from django.contrib.auth import get_user_model
from rest_framework import serializers
from ..models import StudentAccount, TutorAccount

locale.setlocale(locale.LC_ALL, 'en_US.utf8')
User = get_user_model()


class UserDisplaySerializer(serializers.ModelSerializer):
    date_joined = serializers.SerializerMethodField(read_only=True)
    last_login = serializers.SerializerMethodField(read_only=True)
    full_name = serializers.SerializerMethodField(read_only=True)
    is_auth1 = serializers.SerializerMethodField(read_only=True)
    is_auth2 = serializers.SerializerMethodField(read_only=True)
    is_staff = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        exclude = ('is_active',)

    def get_date_joined(self, instance):
        return instance.date_joined.strftime('%d %B %Y')

    def get_last_login(self, instance):
        return instance.last_login.strftime('%d %B %Y')

    def get_full_name(self, instance):
        return instance.get_full_name()

    def get_is_auth1(self, instance):
        return instance.is_auth1

    def get_is_auth2(self, instance):
        return instance.is_auth2

    def get_is_staff(self, instance):
        return instance.is_staff


class StudentAccountDisplaySerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    full_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = StudentAccount
        fields = '__all__'

    def get_full_name(self, instance):
        return instance.user.get_full_name()


class TutorAccountDisplaySerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    full_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = TutorAccount
        fields = '__all__'

    def get_full_name(self, instance):
        return instance.user.get_full_name()