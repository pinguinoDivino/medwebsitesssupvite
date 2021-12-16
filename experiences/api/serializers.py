import locale
from rest_framework import serializers
from experiences.models import Tag, Rating, Experience,  \
    SfsLabErasmusAdditionalAttributes, CongressConferenceSummerSchoolAdditionalAttributes, \
    UnipiInternship, University, InternshipAdditionalAttributes, Opportunity, City
from django.utils import timezone
from django.db import IntegrityError
from core.utils import OPP_GROUP_TAGS, EXP_GROUP_TAGS, EXPERIENCE_TYPES


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
    created_by = serializers.StringRelatedField(read_only=True)
    using_count = serializers.SerializerMethodField(read_only=True)
    using_opp_count = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Tag
        fields = '__all__'
        extra_kwargs = {
            'name': {'validators': []},
        }

    def get_using_count(self, instance):
        return int(instance.get_exp_count())

    def get_using_opp_count(self, instance):
        return int(instance.get_opp_count())

    def create(self, validated_data):
        try:
            tag = Tag.objects.create(**validated_data)
        except IntegrityError:
            raise serializers.ValidationError('Il Tag esiste già')
        return tag


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = "__all__"


class RatingSerializer(serializers.ModelSerializer):
    average = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Rating
        fields = '__all__'

    def val_ratings(self, value):
        if 0 <= value <= 10:
            return value
        raise serializers.ValidationError("La valutazione deve essere un numero fra 1 e 10, 0 se non si vuole omettere")

    def validate_global_r(self, value):
        try:
            return self.val_ratings(value=value)
        except serializers.ValidationError:
            raise serializers.ValidationError(
                "La valutazione deve essere un numero fra 1 e 10, 0 se non si vuole omettere")

    def validate_stay_r(self, value):
        try:
            return self.val_ratings(value=value)
        except serializers.ValidationError:
            raise serializers.ValidationError(
                "La valutazione deve essere un numero fra 1 e 10, 0 se non si vuole omettere")

    def validate_aquired_knowledge_r(self, value):
        try:
            return self.val_ratings(value=value)
        except serializers.ValidationError:
            raise serializers.ValidationError(
                "La valutazione deve essere un numero fra 1 e 10, 0 se non si vuole omettere")

    def validate_involvement_r(self, value):
        try:
            return self.val_ratings(value=value)
        except serializers.ValidationError:
            raise serializers.ValidationError(
                "La valutazione deve essere un numero fra 1 e 10, 0 se non si vuole omettere")

    def get_average(self, instance):
        return instance.get_average()


class UniversitySerializer(serializers.ModelSerializer):
    class Meta:
        model = University
        fields = "__all__"


class ExperienceSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField(read_only=True)
    author_year = serializers.SerializerMethodField(read_only=True)
    author_email = serializers.SerializerMethodField(read_only=True)
    slug = serializers.SlugField(read_only=True)
    created_at = serializers.DateField(read_only=True)
    updated_at = serializers.DateField(read_only=True)
    started_at = serializers.DateField(label='Iniziata il')
    ended_at = serializers.DateField(label='Terminata il', required=False, allow_null=True)
    type = serializers.CharField(label='Tipo di esperienza', max_length=50)
    rating = RatingSerializer(label='Valutazione')
    tags = TagSerializer(many=True)
    img = serializers.ImageField(required=False, allow_null=True, allow_empty_file=True)
    city = CitySerializer(read_only=True)
    city_id = serializers.IntegerField(write_only=True, label='ID della città')
    universities = UniversitySerializer(read_only=True, many=True)
    univ_ids = serializers.CharField(write_only=True, label="IDs delle università",
                                     required=False, allow_null=True, allow_blank=True)
    status = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Experience
        fields = '__all__'

    def get_author_year(self, instance):
        return instance.author.actual_year

    def get_author_email(self, instance):
        return instance.author.user.email

    def get_created_at(self, instance):
        return instance.created_at.strftime('%d %B %Y')

    def get_updated_at(self, instance):
        return instance.updated_at.strftime('%d %B %Y')

    def get_status(self, instance):
        return instance.status

    def validate_ended_at(self, value):
        if value:
            if value > timezone.datetime.now().date():
                raise serializers.ValidationError("La data di fine dell'esperienza può "
                                                  "al massimo coincidere con quella di oggi")
        return value

    def validate_started_at(self, value):
        if value:
            if value > timezone.datetime.now().date():
                raise serializers.ValidationError("La data di fine dell'esperienza può "
                                                  "al massimo coincidere con quella di oggi")
        else:
            raise serializers.ValidationError("Campo obbligatorio")
        return value

    def validate_type(self, value):
        if value not in [x[0] for x in EXPERIENCE_TYPES]:
            raise serializers.ValidationError("Il tipo dell'esperienza non è stato riconosciuto")
        return value

    def validate(self, attrs):
        if self.validate_ended_at(value=attrs['ended_at']):
            if self.validate_started_at(value=attrs['started_at']) > self.validate_ended_at(value=attrs['ended_at']):
                raise serializers.ValidationError('La data di inizio non può essere più recente di quella di fine')
        return attrs

    def create(self, validated_data):
        rating_data = validated_data.pop('rating')
        tags_data = validated_data.pop('tags')
        created_by = validated_data.pop('created_by')
        univ_ids = validated_data.pop('univ_ids')
        city_id = validated_data.pop('city_id')
        univs = []
        for univ_id in univ_ids.split(','):
            if univ_id != '':
                try:
                    univs.append(University.objects.get(pk=univ_id))
                except University.DoesNotExist:
                    raise serializers.ValidationError("L'università selezionata non esiste")
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


class UpdateExperienceImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ['img', ]


class SfsLabErasmusAdditionalAttributesSerializer(serializers.ModelSerializer):
    experience = serializers.StringRelatedField(read_only=True)
    component = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = SfsLabErasmusAdditionalAttributes
        fields = '__all__'

    def get_component(self, instance):
        return 'sfs-lab-erasmus'

    def create(self, validated_data):
        try:
            exp = Experience.objects.get(slug=validated_data.pop('slug'))
        except Experience.DoesNotExist():
            raise serializers.ValidationError("Non è stato possibile trovare l'esperienza")
        attr = SfsLabErasmusAdditionalAttributes.objects.create(experience=exp, **validated_data)
        return attr


class CongressConferenceSummerSchoolAdditionalAttributesSerializer(serializers.ModelSerializer):
    experience = serializers.StringRelatedField(read_only=True)
    component = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = CongressConferenceSummerSchoolAdditionalAttributes
        fields = '__all__'

    def get_component(self, instance):
        return 'congress-conference-summer-school'

    def create(self, validated_data):
        try:
            exp = Experience.objects.get(slug=validated_data.pop('slug'))
        except Experience.DoesNotExist():
            raise serializers.ValidationError("Non è stato possibile trovare l'esperienza")
        attr = CongressConferenceSummerSchoolAdditionalAttributes.objects.create(experience=exp, **validated_data)
        return attr


class InternshipAdditionalAttributesSerializer(serializers.ModelSerializer):
    experience = serializers.StringRelatedField(read_only=True)
    component = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = InternshipAdditionalAttributes
        fields = '__all__'

    def get_component(self, instance):
        return 'internship'

    def create(self, validated_data):
        try:
            exp = Experience.objects.get(slug=validated_data.pop('slug'))
        except Experience.DoesNotExist():
            raise serializers.ValidationError("Non è stato possibile trovare l'esperienza")
        attr = InternshipAdditionalAttributes.objects.create(experience=exp, **validated_data)
        return attr


class UnipiInternshipSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField(read_only=True)
    author_year = serializers.SerializerMethodField(read_only=True)
    slug = serializers.SlugField(read_only=True)
    created_at = serializers.DateField(read_only=True)
    updated_at = serializers.DateField(read_only=True)

    class Meta:
        model = UnipiInternship
        fields = '__all__'

    def get_author_year(self, instance):
        return instance.author.actual_year

    def get_created_at(self, instance):
        return instance.created_at.strftime('%d %B %Y')

    def get_updated_at(self, instance):
        return instance.updated_at.strftime('%d %B %Y')


class OpportunitySerializer(serializers.ModelSerializer):
    university = UniversitySerializer(read_only=True)
    univ_id = serializers.IntegerField(write_only=True, label="ID dell' università")
    author = serializers.StringRelatedField(read_only=True)
    author_email = serializers.SerializerMethodField(read_only=True)
    author_full_name = serializers.SerializerMethodField(read_only=True)
    slug = serializers.SlugField(read_only=True)
    created_at = serializers.DateField(read_only=True)
    updated_at = serializers.DateField(read_only=True)
    tags = TagSerializer(many=True)

    class Meta:
        model = Opportunity
        fields = "__all__"

    def get_author_email(self, instance):
        return instance.author.email

    def get_author_full_name(self, instance):
        return instance.author.get_full_name()

    def get_created_at(self, instance):
        return instance.created_at.strftime('%d %B %Y')

    def get_updated_at(self, instance):
        return instance.updated_at.strftime('%d %B %Y')

    def create(self, validated_data):
        univ_id = validated_data.pop('univ_id')
        tags_data = validated_data.pop('tags')
        created_by = validated_data.pop('created_by')
        try:
            univ = University.objects.get(pk=univ_id)
        except University.DoesNotExists():
            raise serializers.ValidationError("L'università selezionata non esiste")

        opportunity = Opportunity.objects.create(university=univ, **validated_data)

        try:
            for t in list(set(create_new_tags(tags_data, created_by=created_by))):
                opportunity.tags.add(t)
        except serializers.ValidationError:
            raise serializers.ValidationError("Gruppo non valido del tag")

        return opportunity

    def update(self, instance, validated_data):
        univ_id = validated_data.pop('univ_id')
        tags_data = validated_data.pop('tags')
        created_by = validated_data.pop('created_by')
        instance.tags.clear()
        try:
            for t in list(set(create_new_tags(tags_data, created_by=created_by))):
                instance.tags.add(t)
        except serializers.ValidationError:
            raise serializers.ValidationError("Gruppo non valido del tag")

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        try:
            univ = University.objects.get(pk=univ_id)
        except University.DoesNotExists():
            raise serializers.ValidationError("L'università selezionata non esiste")

        if instance.university != univ:
            instance.university = univ
        instance.save()

        return instance


class OpportunityStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Opportunity
        fields = ['active']