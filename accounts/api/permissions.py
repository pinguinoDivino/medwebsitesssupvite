from rest_framework import permissions


class IsTutor(permissions.BasePermission):
    message = "Autorizzazione non concessa"

    def has_permission(self, request, view):
        return request.user.is_auth4
