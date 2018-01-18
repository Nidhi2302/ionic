export class ValidationService {
    static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
        let config = {
            'required': 'Required',
            'invalidEmailAddress': 'Invalid email address',
            'invalidPassword': 'Invalid password. Password must be at least 6 characters long, and contain a number.',
            'minlength': `Minimum length ${validatorValue.requiredLength}`,
            'onlyName' : 'Only characters are allowed.',
            'invalidMobileNumber' : "Invalid mobile number."
        };

        return config[validatorName];
    }

    static emailValidator(control) {
        // RFC 2822 compliant regex
        if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
            return null;
        } else {
            return { 'invalidEmailAddress': true };
        }
    }

    static passwordValidator(control) {
        // {6,100}           - Assert password is between 6 and 100 characters
        // (?=.*[0-9])       - Assert a string has at least one number
        if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
            return null;
        } else {
            return { 'invalidPassword': true };
        }
    }

    static onlyTextValidator(control){
        // {Firstname, Lastname} - Assert textbox only have text no special char and numbers.

        if(control.value.match(/^[a-zA-Z]*$/)){
            return null;
        } else {
            return { 'onlyName': true };
        }
    }

    static mobileNumberValidator(control){
        // Valid mobile number entry.
        // {+1 8087339090}, {+91 8087339090}, {+912 8087339090}, {8087339090}, {0808733909}, {+1-8087339090}, {+91-8087339090}, {+912-8087339090}, {+918087677876}, {+9108087735454}

        if (control.value.match(/^(\+\d{1,3}[- ]?)?\d{10}$/)) {
            return null;
        } else {
            return { 'invalidMobileNumber': true };
        }
    }
}
