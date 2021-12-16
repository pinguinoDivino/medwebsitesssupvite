from rest_framework import filters as rest_filters
from django.db.models import Q


class DynamicSearchFilter(rest_filters.SearchFilter):
    def get_search_fields(self, view, request):
        fields = request.GET.getlist('search_fields', [])
        if "__all__" in fields:
            return ["author__user__first_name", "author__user__last_name", "description", "review", "indications",
                    "tags__name"]
        return fields


class DynamicSearchOpportunityFilter(rest_filters.SearchFilter):
    def get_search_fields(self, view, request):
        fields = request.GET.getlist('search_fields', [])
        if "__all__" in fields:
            return [
                "author__first_name", "author__last_name", "description", "university__name", "istitution",
                "tags__name"
            ]
        return fields


class DynamicSearchInternshipFilter(rest_filters.SearchFilter):
    def get_search_fields(self, view, request):
        fields = request.GET.getlist('search_fields', [])
        if "__all__" in fields:
            return [
                "author__user__first_name", "author__user__last_name", "review"
            ]
        return fields


def is_valid_queryparam(param):
    return param != '' and param is not None and param != []


def experience_filter(params, qs):
    start_date_min = params.get('start_date_min')
    start_date_max = params.get('start_date_max')
    status = params.get('status')
    typologies = params.getlist('typologies[]')
    countries = params.getlist('countries[]')
    regions = params.getlist('regions[]')
    tags = params.getlist('tags[]')
    rating_min = params.getlist('rating_min[]')

    if is_valid_queryparam(start_date_max):
        qs = qs.filter(started_at__lt=start_date_max)

    if is_valid_queryparam(start_date_min):
        qs = qs.filter(started_at__gte=start_date_min)

    if is_valid_queryparam(start_date_max):
        qs = qs.filter(started_at__lt=start_date_max)

    if is_valid_queryparam(status):
        if status == "on":
            qs = qs.filter(ended_at__isnull=True)
        elif status == "off":
            qs = qs.filter(ended_at__isnull=False)
    if is_valid_queryparam(typologies):
        objects_id = [x.id for x in qs.all() if x.type in typologies]
        qs = qs.filter(pk__in=objects_id)
    if is_valid_queryparam(regions):
        qs = qs.filter(city__region__in=regions)
    elif is_valid_queryparam(countries):
        qs = qs.filter(city__country__in=countries)
    if is_valid_queryparam(tags):
        qs = qs.filter(tags__name__in=tags).distinct()
    if is_valid_queryparam(rating_min) and '' not in rating_min:
        qs = qs.filter(Q(rating__global_r__gte=int(rating_min[0])),
                       Q(rating__stay_r__gte=int(rating_min[1])),
                       Q(rating__aquired_knowledge_r__gte=int(rating_min[2])),
                       Q(rating__involvement_r__gte=int(rating_min[3])),
                       ).distinct()
    return qs


def internship_filter(params, qs):
    recommended_years = params.getlist('recommendedYears[]')
    attendances = params.getlist('attendances[]')
    places = params.getlist('places[]')
    rating_min = params.get('ratingMin')

    if is_valid_queryparam(recommended_years):
        qs = qs.filter(recommended_year__in=recommended_years).distinct()
    if is_valid_queryparam(attendances):
        qs = qs.filter(attendance__in=attendances).distinct()
    if is_valid_queryparam(places):
        qs = qs.filter(place__in=places)

    if is_valid_queryparam(rating_min):
        qs = qs.filter(rating__gte=rating_min)

    return qs


def opportunity_filter(params, qs):
    created_date_min = params.get('created_date_min')
    created_date_max = params.get('created_date_max')
    status = params.get('status')
    tags = params.getlist('tags[]')
    tutors = params.getlist('tutors[]')
    countries = params.getlist('countries[]')

    if is_valid_queryparam(created_date_max):
        qs = qs.filter(created_at__lt=created_date_max)

    if is_valid_queryparam(created_date_min):
        qs = qs.filter(created_at__gte=created_date_min)

    if is_valid_queryparam(created_date_max):
        qs = qs.filter(created_at__lt=created_date_max)

    if is_valid_queryparam(status):
        if status == "on":
            qs = qs.filter(active=True)
        elif status == "off":
            qs = qs.filter(active=False)
    if is_valid_queryparam(tags):
        qs = qs.filter(tags__name__in=tags).distinct()
    if is_valid_queryparam(tutors):
        qs = qs.filter(author__username__in=tutors).distinct()

    if is_valid_queryparam(countries):
        qs = qs.filter(university__country__in=countries)

    return qs

