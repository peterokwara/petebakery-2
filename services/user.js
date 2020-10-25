class User {
    constructor(psid) {
        this.psid = psid;
        this.firstName = "";
        this.lastName = "";
        this.timezone = "";
        this.gender = "neutral";
    }
    setProfile(profile) {
        this.firstName = profile.firstName;
        this.lastName = profile.lastName;
        this.timezone = profile.timezone;
        if (profile.gender) {
            this.gender = profile.gender;
        }
    }
}

module.exports = User