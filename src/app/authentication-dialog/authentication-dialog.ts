export class AuthenticationDialog {

    protected static firstNameMaxLength = 256;
    protected static lastNameMaxLength = 128;
    protected static passwordMinLength = 6;
    protected static passwordMaxLength = 32;

    // Password must contain at least one letter and one digit.
    protected static passwordPattern = /(?=.*[a-z])(?=.*\d)[a-z\d@#$%^&(){}\[\]\\\/|<>:;,.*?!~+\-=]+/i;

    protected static namePattern = /(?=.*\p{L})[\p{L} ,.'-]+/u;

    protected static generalError = "Something went wrong.";


    onSubmit(): void {
        // To be implemented by subclasses.
    }
}
