from rest_framework import parsers
import json


class MultipartJsonParser(parsers.MultiPartParser):

    @staticmethod
    def get_values(items):
        obj = {}
        for key, value in items:
            if type(value) != str:
                obj[key] = value
                continue
            if '{' in value or "[" in value:
                try:
                    obj[key] = json.loads(value)
                except ValueError:
                    obj[key] = value
            else:
                obj[key] = value
        return obj

    def parse(self, stream, media_type=None, parser_context=None):
        result = super().parse(
            stream,
            media_type=media_type,
            parser_context=parser_context
        )
        data = self.get_values(result.data.items())
        files = self.get_values(result.files.items())

        return parsers.DataAndFiles(data, files)
