"""medwebsite URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include, re_path
from core.views import IndexTemplateView
from django.views.generic.base import TemplateView
from django.conf import settings
from django.contrib.sitemaps.views import sitemap
from accounts.sitemaps import StaticViewSitemap
sitemaps = {
    'static': StaticViewSitemap
}

urlpatterns = [
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
    path('amministrazione/pannello/', admin.site.urls),
    path('accounts/', include('accounts.urls')),
    path("robots.txt", TemplateView.as_view(template_name="robots.txt", content_type="text/plain")),
    path("api-auth/", include("rest_framework.urls")),
    path('api/', include('accounts.api.urls')),
    path('api/', include('experiences.api.urls')),
    path('api/', include('courses.api.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + \
              static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns.append(
    re_path(r"^.*$", IndexTemplateView.as_view(), name="entry-point")
)
