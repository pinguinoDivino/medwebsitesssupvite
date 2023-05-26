import locale
from rest_framework import serializers
from experiences.models import Tag, Rating, Experience, \
    SfsLabErasmusAdditionalAttributes, CongressConferenceSummerSchoolAdditionalAttributes, \
    UnipiInternship, University, InternshipAdditionalAttributes, City
from django.utils import timezone
from django.db import IntegrityError
from core.utils import OPP_GROUP_TAGS, EXP_GROUP_TAGS
from .utils import InMemoryUploadedImageField
from django.utils.translation import gettext_lazy as _

locale.setlocale(locale.LC_ALL, 'en_US.utf8')


def create_new_tags(data, created_by):
    exp_tags = []
    for tag_data in data:
        if tag_data['group'] not in [x[0] for x in EXP_GROUP_TAGS + OPP_GROUP_TAGS]:
            raise serializers.ValidationError("Il gruppo del tag non è valido")
        try:
            t = Tag.objects.create(created_by=created_by, group=tag_data['group'], name=tag_data['name'].lower())
            exp_tags.append(t)
        except IntegrityError:
            try:
                t = Tag.objects.get(name=tag_data['name'].lower(), group=tag_data['group'])
                exp_tags.append(t)
            except Tag.DoesNotExist:
                pass
    return exp_tags


class TagSerializer(serializers.ModelSerializer):
    # using_opp_count = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Tag
        fields = '__all__'
        extra_kwargs = {
            'created_by': {'read_only': True},
            'name': {'validators': []}
        }

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['using_count'] = instance.get_exp_count()

        return representation

    def validate_name(self, value):
        check_query = Tag.objects.filter(name=value)
        if check_query.exists() and not (
                isinstance(self.parent.parent, ExperienceSerializer)
                and self.parent.field_name == "tags"
        ):
            raise serializers.ValidationError(
                "Tag with this name already exists."
            )

        if not check_query.exists() and self.parent and isinstance(self.parent.parent, ExperienceSerializer):
            raise serializers.ValidationError(
                "Tag with this name was not found."
            )
        return value

    # def get_using_opp_count(self, instance):
    #    return int(instance.get_opp_count())


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = "__all__"
        validators = [
            serializers.UniqueTogetherValidator(
                queryset=model.objects.all(),
                fields=('region', 'country', 'city'),
                message=_("This city just exists!")
            )
        ]


class UniversitySerializer(serializers.ModelSerializer):
    class Meta:
        model = University
        fields = "__all__"


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['average'] = instance.get_average()

        return representation

    @staticmethod
    def val_ratings(value):
        if 0 <= value <= 10:
            return value
        raise serializers.ValidationError("La valutazione deve essere un numero fra 1 e 10, 0 se non si vuole omettere")

    def validate_global_r(self, value):
        return self.val_ratings(value=value)

    def validate_stay_r(self, value):
        return self.val_ratings(value=value)

    def validate_acquired_knowledge_r(self, value):
        return self.val_ratings(value=value)

    def validate_involvement_r(self, value):
        return self.val_ratings(value=value)


class ExperienceSerializer(serializers.ModelSerializer):
    img = InMemoryUploadedImageField(required=False, allow_null=True, allow_empty_file=True)
    rating = RatingSerializer(label='Valutazione')
    tags = TagSerializer(many=True)
    city = CitySerializer(read_only=True)
    universities = UniversitySerializer(read_only=True, many=True)

    city_id = serializers.IntegerField(write_only=True, label='ID della città')
    univ_ids = serializers.CharField(write_only=True, label="IDs delle università",
                                     required=False, allow_null=True, allow_blank=True)

    class Meta:
        model = Experience
        fields = '__all__'
        extra_kwargs = {
            'author': {'read_only': True},
            'slug': {'read_only': True},
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
            'started_at': {'label': "Iniziata il"},
            'ended_at': {'label': 'Terminata il', 'required': False, 'allow_null': True}
        }

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["author"] = instance.author.__str__()
        representation['author_year'] = instance.author.actual_year
        representation['started_at'] = instance.started_at.strftime("%d-%m-%Y")
        representation['ended_at'] = instance.ended_at.strftime("%d-%m-%Y")
        representation['author_email'] = instance.author.user.email
        representation['status'] = instance.status
        representation['type'] = \
            [x[1] for x in Experience.type.field.choices if x[0] == instance.type][0]

        return representation

    @staticmethod
    def validate_started_at(value):
        if value:
            if value > timezone.datetime.now().date():
                raise serializers.ValidationError("La data di fine dell'esperienza può "
                                                  "al massimo coincidere con quella di oggi")
        else:
            raise serializers.ValidationError("Campo obbligatorio")
        return value

    def validate(self, attrs):
        if attrs['ended_at']:
            if self.validate_started_at(value=attrs['started_at']) > attrs['ended_at']:
                raise serializers.ValidationError('La data di inizio non può essere più recente di quella di fine')
        return attrs

    def create(self, validated_data):
        rating_data = validated_data.pop('rating')
        tags_data = validated_data.pop('tags')
        created_by = validated_data.pop('created_by')
        univ_ids = validated_data.pop('univ_ids')
        city_id = validated_data.pop('city_id')
        exp = Experience.objects.create(**validated_data)

        Rating.objects.create(experience=exp, **rating_data)
        if city_id is not None:
            try:
                city = City.objects.get(pk=city_id)
            except City.DoesNotExist:
                raise serializers.ValidationError("La città selezionata non esiste")
            exp.city = city
        exp.save()
        tags_data.append({'name': exp.city.city.lower(), 'group': 'city'})
        try:
            for t in list(set(create_new_tags(tags_data, created_by=created_by))):
                exp.tags.add(t)
        except serializers.ValidationError:
            raise serializers.ValidationError("Gruppo non valido del tag")
        univs = []
        for univ_id in univ_ids.split(','):
            if univ_id != '':
                try:
                    univs.append(University.objects.get(pk=univ_id))
                except University.DoesNotExist:
                    raise serializers.ValidationError("L'università selezionata non esiste")
        for u in list(set(univs)):
            exp.universities.add(u)
        return exp

    def update(self, instance, validated_data):
        rating_data = validated_data.pop('rating')
        tags_data = validated_data.pop('tags')
        univ_ids = validated_data.pop('univ_ids')
        created_by = validated_data.pop('created_by')
        city_id = validated_data.pop('city_id')
        univs = []
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        for attr, value in rating_data.items():
            setattr(instance.rating, attr, value)
        instance.rating.save()
        for univ_id in univ_ids.split(','):
            if univ_id != '':
                try:
                    univs.append(University.objects.get(pk=univ_id))
                except University.DoesNotExist:
                    raise serializers.ValidationError("L'università selezionata non esiste")

        instance.tags.clear()
        try:
            for t in list(set(create_new_tags(tags_data, created_by=created_by))):
                instance.tags.add(t)
        except serializers.ValidationError:
            raise serializers.ValidationError("Gruppo non valido del tag")
        instance.universities.clear()
        for u in list(set(univs)):
            instance.universities.add(u)

        if city_id is not None:
            try:
                city = City.objects.get(pk=city_id)
            except City.DoesNotExist:
                raise serializers.ValidationError("La città selezionata non esiste")

            if instance.city != city:
                instance.city = city
            instance.save()

        return instance


class BaseAttributesSerializer(serializers.ModelSerializer):
    experience = serializers.StringRelatedField(read_only=True)

    class Meta:
        abstract = True
        model = None

    def create(self, validated_data):
        try:
            exp = Experience.objects.get(slug=validated_data.pop('slug'))
        except Experience.DoesNotExist():
            raise serializers.ValidationError("Non è stato possibile trovare l'esperienza")
        attr = self.Meta.model.objects.create(experience=exp, **validated_data)
        return attr


class SfsLabErasmusAdditionalAttributesSerializer(BaseAttributesSerializer):
    class Meta:
        model = SfsLabErasmusAdditionalAttributes
        fields = '__all__'


class CongressConferenceSummerSchoolAdditionalAttributesSerializer(BaseAttributesSerializer):
    class Meta:
        model = CongressConferenceSummerSchoolAdditionalAttributes
        fields = '__all__'


class InternshipAdditionalAttributesSerializer(BaseAttributesSerializer):
    class Meta:
        model = InternshipAdditionalAttributes
        fields = '__all__'


class UnipiInternshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnipiInternship
        fields = '__all__'
        extra_kwargs = {
            'author': {'read_only': True},
            'slug': {'read_only': True},
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
        }

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["author"] = instance.author.__str__()
        representation['author_year'] = instance.author.actual_year
        representation['ward'] = [x[1] for x in UnipiInternship.ward.field.choices if x[0] == instance.ward][0]
        representation['academic_year'] = \
            [x[1] for x in UnipiInternship.academic_year.field.choices if x[0] == instance.academic_year][0]
        representation['recommended_year'] = \
            [x[1] for x in UnipiInternship.recommended_year.field.choices if x[0] == instance.recommended_year][0]
        representation['attendance'] = \
            [x[1] for x in UnipiInternship.attendance.field.choices if x[0] == instance.attendance][0]
        representation['place'] = \
            [x[1] for x in UnipiInternship.place.field.choices if x[0] == instance.place][0]

        return representation

