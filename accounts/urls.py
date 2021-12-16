from django.urls import path
from . import views
from django.contrib.auth.views import LogoutView
from django.contrib.sitemaps.views import sitemap
from .sitemaps import StaticViewSitemap

app_name = "accounts"

sitemaps = {
    'static': StaticViewSitemap
}

urlpatterns = [
    path("sitemap.xml", sitemap, {'sitemaps': sitemaps}),
    path("login/", views.LoginCustomView.as_view(), name="login"),
    path("registrazione/", views.SetUpAccountView.as_view(), name="setup"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("ex-alliev-registrazione/", views.ExStudentRegistrationView.as_view(), name="ex-student-registration"),
    path("ex-alliev-in-attesa/", views.ExStudentWaitingView.as_view(), name="ex-student-waiting"),
    path("trattamento-dati/", views.DataTreatmentView.as_view(), name="data-treatment")
]