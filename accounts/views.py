from django.shortcuts import reverse, redirect
from django.utils.decorators import method_decorator
from django.contrib.auth.views import LoginView
from django.views.generic import UpdateView
from .decorators import complete_decorator
from .forms import AccountActivationForm, ExStudentRegistrationForm, AuthenticationCustomForm
from .models import StudentAccount
from django_registration.views import RegistrationView
from django.views.generic.base import TemplateView


class ExStudentRegistrationView(RegistrationView):
    template_name = 'accounts/ex_student_registration.html'
    form_class = ExStudentRegistrationForm
    success_url = 'accounts:ex-student-waiting'

    def register(self, form):
        new_user = form.save()
        return new_user

    def form_valid(self, form):
        return redirect(self.get_success_url(self.register(form)))

    def get_form_kwargs(self, **kwargs):
        kwargs = super(ExStudentRegistrationView, self).get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs


class LoginCustomView(LoginView):
    template_name = 'accounts/login.html'
    redirect_field_name = 'accounts:setup'
    authentication_form = AuthenticationCustomForm


@method_decorator(complete_decorator, 'dispatch')
class SetUpAccountView(UpdateView):
    queryset = StudentAccount.objects.filter(is_set_up=False)
    template_name = 'accounts/setup.html'
    form_class = AccountActivationForm

    def get_object(self, queryset=None):
        return self.request.user.student

    def form_valid(self, form):
        """If the form is valid, save the associated model."""
        self.object = form.save()
        user = self.object.user
        user.dpc = True
        user.save()
        self.object.is_set_up = True
        self.object.save()
        return super().form_valid(form)

    def get_success_url(self):
        return reverse('entry-point')


class ExStudentWaitingView(TemplateView):
    def get_template_names(self):
        template_name = 'accounts/ex_student_waiting.html'
        return template_name


class DataTreatmentView(TemplateView):
    def get_template_names(self):
        template_name = 'accounts/data_treatment.html'
        return template_name
