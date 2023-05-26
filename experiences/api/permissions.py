from django.contrib.auth import get_user_model
from rest_framework import permissions
from experiences.models import SfsLabErasmusAdditionalAttributes, \
    CongressConferenceSummerSchoolAdditionalAttributes, InternshipAdditionalAttributes

User = get_user_model()


class IsAuthorOrReadOnly(permissions.BasePermission):
    message = "Solo l'autore può modificare o cancellare il proprio post"

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.experience.author == request.user.student \
            if isinstance(obj, SfsLabErasmusAdditionalAttributes) or \
               isinstance(obj, InternshipAdditionalAttributes) or \
               isinstance(obj, CongressConferenceSummerSchoolAdditionalAttributes) \
            else obj.author == request.user.student


class IsAuth1OrReadOnly(permissions.BasePermission):
    message = 'Per effetuare una qualunque azione devi completare la registrazione e devi essere un medico'

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_auth1

