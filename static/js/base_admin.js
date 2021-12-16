jQuery(document).ready(function ($) {
    (function($) {
        $(function() {
            let value;
            let selectField = $('#id_type');
            value = selectField.val();
            if (!selectField.length){
                selectField = $('#id_typology');
                value = selectField.text();
            }
            let attr1 = $('#sfs_lab_erasmus_attrs-group');
            let attr2 = $('#congress_conference_summerschool_attrs-group');
            let attr3 = $('#internship_attrs-group');
            function toggleVerified(value) {
                console.log(value, attr1, attr2, attr3)
                if (value === 'sfs' || value === 'lab' || value === 'erasmus') {
                    attr1.show();
                    attr2.hide();
                    attr3.hide();
                } else if(value === 'congress' || value === 'summerschool') {
                    attr1.hide();
                    attr2.show();
                    attr3.hide();
                } else if(value === 'internship'){
                    attr1.hide();
                    attr2.hide();
                    attr3.show();
                } else {
                    attr1.hide();
                    attr2.hide();
                    attr3.hide();
                }
            }

            // show/hide on load based on existing value of selectField
            toggleVerified(value);

            // show/hide on change
            selectField.change(function() {
                toggleVerified($(this).val());
            });
        });
    })(django.jQuery);
});
