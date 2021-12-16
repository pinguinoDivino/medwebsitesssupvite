from django.contrib.auth.decorators import user_passes_test
from .models import StudentAccount, TutorAccount


def setting_up_account(user):
    if user:
        if user.is_authenticated:
            if TutorAccount.objects.filter(user=user).exists():
                return False
            if StudentAccount.objects.filter(user=user).exists():
                return not StudentAccount.objects.get(user=user).is_set_up
    return False


def complete_decorator(function=None, login_url=None):
    actual_decorator = user_passes_test(setting_up_account, login_url='entry-point')
    if function:
        return actual_decorator(function)
    return actual_decorator


