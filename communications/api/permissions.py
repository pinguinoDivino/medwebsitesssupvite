from rest_framework import permissions
from django.contrib.auth import get_user_model
from ..models import Page

User = get_user_model()


class DiaryIsAuthOrReadOnly(permissions.BasePermission):
    message = "Solo i proprietari del diario possono modificare o cancellare le pagine"

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_auth5

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        if isinstance(obj, Page):
            return obj.diary.authors.filter(username=request.user.username).exists()
