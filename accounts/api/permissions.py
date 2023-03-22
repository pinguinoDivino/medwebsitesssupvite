from rest_framework import permissions


class IsFacultyMember(permissions.BasePermission):
    message = "Autorizzazione non concessa"

    def has_permission(self, request, view):
        return request.user.is_auth4
