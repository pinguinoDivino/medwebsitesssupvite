from django.apps import AppConfig


class ExperiencesConfig(AppConfig):
    name = 'experiences'

    def ready(self):
        import experiences.signals
