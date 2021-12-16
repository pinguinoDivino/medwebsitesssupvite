from django.contrib.sitemaps import Sitemap
from django.shortcuts import reverse


class StaticViewSitemap(Sitemap):
    def items(self):
        return [
            'accounts:login', 'accounts:setup', 'accounts:logout',
            'accounts:ex-student-registration', 'accounts:ex-student-waiting'
        ]

    def location(self, item):
        return reverse(item)
