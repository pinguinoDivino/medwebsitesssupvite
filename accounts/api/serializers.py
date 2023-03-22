import locale
from django.contrib.auth import get_user_model
from rest_framework import serializers
from ..models import StudentAccount, FacultyMember

locale.setlocale(locale.LC_ALL, 'en_US.utf8')
User = get_user_model()


class UserDisplaySerializer(serializers.ModelSerializer):
    date_joined = serializers.SerializerMethodField(read_only=True)
    last_login = serializers.SerializerMethodField(read_only=True)
    full_name = serializers.SerializerMethodField(read_only=True)
    is_auth1 = serializers.SerializerMethodField(read_only=True)
    is_auth2 = serializers.SerializerMethodField(read_only=True)
    is_auth3 = serializers.SerializerMethodField(read_only=True)
    is_auth4 = serializers.SerializerMethodField(read_only=True)
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

    def get_is_auth3(self, instance):
        return instance.is_auth3

    def get_is_auth4(self, instance):
        return instance.is_auth4

    def get_is_staff(self, instance):
        return instance.is_staff


class UserUpdateDpcSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('dpc', )


class StudentAccountDisplaySerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    full_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = StudentAccount
        fields = '__all__'

    def get_full_name(self, instance):
        return instance.user.get_full_name()


class FacultyMemberDisplaySerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField(read_only=True)
    tutee_list = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = FacultyMember
        fields = '__all__'

    def get_full_name(self, instance):
        return instance.__str__()

    def get_tutee_list(self, instance):
        return [{x.user.get_full_name(): x.user.email} for x in instance.tutees]
