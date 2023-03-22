import string
from django.utils import timezone
import random

ALPHANUMERIC_CHARS = string.ascii_lowercase + string.digits
STRING_LENGTH = 6


def generate_random_string(chars=ALPHANUMERIC_CHARS, length=STRING_LENGTH):
    return "".join(random.choice(chars) for _ in range(length))


starting_year = 2000

sector = 'med'
title_default = 'Allievo ciclo unico 6 anni'

titles_login = [
    title_default,
    'Professore Associato',
    'Professore Ordinario',
    # 'Ricercatore T.D.',
    # 'Ricercatore T.I.',
    'Amministratore'  # superuser
]

SECTOR_DICT = {
    'Cl. Sc. Sperimentali  Ingegneria': 'ing',
    'Cl. Sc. Sperimentali  Medicina': 'med',
    'Cl. Sc. Sperimentali  Agraria': 'agr',
    'Cl. Sc. Sociali  Scienze Politiche': 'sci',
    'Cl. Sc. Sociali  Scienze Economiche': 'eco',
    'Cl. Sc. Sociali  Giurisprudenza': 'giu',
    'Cl. Sc. Sperimentali - Ingegneria': 'ing',
    'Cl. Sc. Sperimentali - Medicina': 'med',
    'Cl. Sc. Sperimentali - Agraria': 'agr',
    'Cl. Sc. Sociali - Scienze Politiche': 'sci',
    'Cl. Sc. Sociali - Scienze Economiche': 'eco',
    'Cl. Sc. Sociali - Giurisprudenza': 'giu',
    'Amministratore sito': 'admin',
}

YEAR_DICT = {
    '1': 'I',
    '2': 'II',
    '3': 'III',
    '4': 'IV',
    '5': 'V',
    '6': 'VI',
    '7': 'VII',
    '8': 'Ex-Allievo'
}

EXPERIENCE_TYPES = (
    ('sfs', 'SFS'),
    ('lab', 'Laboratorio'),
    ('summerschool', 'Summer School'),
    ('congress', 'Congresso'),
    ('internship', 'Tirocinio'),
    ('erasmus', 'Erasmus')
)

EXP_GROUP_TAGS = (
    ('city', 'Città'),
    ('about', 'Ambito'),
    ('prof', 'Docente'),
    ('istitute', 'Istituto'),
    ('opportunity', 'Opportunità')
)
OPP_GROUP_TAGS = (
    ('about', 'Ambito'),
    ('opportunity', 'Opportunità')
)
WARDS = (
    ('A1', 'Chirurgia toracica mininvasiva e robotica'),
    ('B1', 'Endoscopia Toracica'),
    ('C1', 'Otorinolaringoiatria audiologia e foniatria'),
    ('D1', "Endocrinologia e Metabolismo dei Trapianti d'Organo e Cellulari"),
    ('E1', 'Malattie metaboliche e diabetologia'),
    ('F1', 'Dermatologia'),
    ('G1', 'Reumatologia'),
    ('H1', 'Immunoallergologia clinica'),
    ('I1', 'Epatologia'),
    ('J1', 'Cardioangiologia'),
    ('K1', 'Chirurgia vascolare'),
    ('L1', 'Ematologia'),
    ('M1', 'Urologia 1'),
    ('N1', 'Ortopedia e Traumatologia 1'),
    ('O1', 'Chirurgia Toracica'),
    ('P1', 'Chirurgia Generale 1'),
    ('Q1', 'Chirurgia Epatica e del Trapianto di Fegato'),
    ('R1', 'Cardiochirurgia'),
    ('S1', 'Senologia'),
    ('T1', 'Medicina Interna ad indirizzo Immuno-endocrino'),
    ('U1', 'Malattie Infettive'),
    ('V1', 'Medicina dello sport'),
    ('W1', 'Gastroenterologia'),
    ('X1', 'Pneumologia'),
    ('Y1', 'Endocrinologia 1'),
    ('Z1', 'Cardiologia 1'),
    ('A2', 'Endocrinologia 2'),
    ('B2', 'Chirurgia generale'),
    ('C2', 'Endoscopia digestiva interventistica'),
    ('D2', 'Otorinolaringoiatria 1'),
    ('E2', 'Otorinolaringoiatria audiologia e foniatria Universitaria'),
    ('F2', 'Ortopedia e Traumatologia 2'),
    ('G2', 'Medicina II'),
    ('H2', 'Nefrologia, Trapianti e Dialisi'),
)
UNIPI_INTERNSHIP_YEAR = (
    (3, 'III'),
    (4, 'IV'),
    (5, 'V'),
    (6, 'VI')
)
UNIPI_INTERNSHIP_PLACES = (
    ('A', 'Cisanello'),
    ('B', 'Santa Chiara'),
    ('C', 'Ospedale Cecina'),
    ('D', 'Ospedale Verisilia'),
    ('E', 'Ospedale Lucca'),
    ('F', 'Ospedale Livorno'),
)
ATTENDANCE_CHOICES = (
    (1, 'Basta portare il libretto alla fine'),
    (2, 'Può firmare un altro per te'),
    (3, 'Devi firmare ma puoi fare magheggi'),
    (4, 'Devi andarci te ogni giorno'),
)


def entry_year_generator(delay=0):
    entry_years = []
    ly = timezone.now().year - delay
    if 10 <= timezone.now().month <= 12:
        ly += 1
    for i in range(starting_year, ly):
        entry_years.append([i, f"{i} - {i + 1}"])
    return entry_years


def switcher(obj, attrs1, attrs2, attrs3):
    if obj == 'sfs' or obj == 'lab' or obj == 'erasmus':
        return attrs1
    elif obj == 'congress' or obj == 'summerschool':
        return attrs2
    elif obj == "internship":
        return attrs3
    else:
        raise ValueError("Errore sconosciuto")


def create_username(first_name, last_name):
    first_part = ""
    for name in first_name.split(" "):
        first_part = ''.join([first_part, str(name)[0]])
    return (first_part + "." + last_name.replace(" ", "")).lower()
