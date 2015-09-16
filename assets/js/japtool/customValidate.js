//USER
//validate form register user
$(document).ready(function () {
    $('.form-register').validate({
        rules: {
            username: {
                required: true
            },
            email: {
                required: true,
                email: true
            },
            password: {
                minlength: 6,
                required: true
            },
            confirmation: {
                minlength: 6,
                equalTo: "#input-password"
            }
        }
    });
//Validate change password user
    $('#change-pass').validate({
        rules: {
            oldPasswordUser: {
                minlength: 6,
                required: true
            },
            newPasswordUser: {
                minlength: 6,
                required: true
            },
            newPasswordUserCf: {
                minlength: 6,
                required: true,
                equalTo: "#input-NewPassword"
            }
        }
    });
//END USER
    $('#createArticleForm').validate({
        rules: {
            subject: {
                required: true
            },
            content: {
                required: true
            },
            explaination: {
                required: true
            },
            translation: {
                required: true
            },
            level: {
                required: true
            },
            tag: {
                required: true
            }
        },
        success: function (element) {
            element.text('OK!').addClass('valid')
        }
    });
    $('#editArticleForm').validate({
        rules: {
            subject: {
                required: true
            },
            content: {
                required: true
            },
            explaination: {
                required: true
            },
            translation: {
                required: true
            },
            level: {
                required: true
            },
            tag: {
                required: true
            }
        },
        success: function (element) {
            element.text('OK!').addClass('valid')
        }
    });
    $('#createQueForm').validate({
        rules: {
            question: {
                required: true
            },
            option1: {
                required: true
            },
            option2: {
                required: true
            },
            option3: {
                required: true
            },
            option4: {
                required: true
            }
        },
        success: function (element) {
            element.text('OK!').addClass('valid')
        }
    });
    $('#editQueForm').validate({
        rules: {
            question: {
                required: true
            },
            option1: {
                required: true
            },
            option2: {
                required: true
            },
            option3: {
                required: true
            },
            option4: {
                required: true
            }
        },
        success: function (element) {
            element.text('OK!').addClass('Unsuccessful !!!')
        }
    });

    /**
     * validate create-learning
     */
    $('#edit-learning-japtool').validate({
        rules: {
            notes: {
                required: true
            },
            startDate: {
                required: true
            },
            finishDate: {
                required: true,
                greaterThan: "#startDate"
            }
        },

        messages: {

            notes: {
                required: "Please input description."
            },
            startDate: {
                required: "Please input start date."
            },
            finishDate: {
                required: "Please input end date.",
                greaterStart: "Start date less than end date."
            }
        },

        success: {},
        error: function (element) {

        }
    });
});
