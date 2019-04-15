<template>
    <div class="col-sm-12 col-md-6 col-lg-3 col-lg-2">
        <form-input :disabled="completeNewPwd" label="Email" v-model="username"></form-input>

        <form-input :disabled="completeNewPwd" label="Password" v-model="password" type="password"></form-input>

        <form-input
            v-if="completeNewPwd"
            label="New Password"
            v-model="newPassword"
            type="password"
        ></form-input>

        <div class="commands">
            <router-link to="/signup">SignUp</router-link>
            <button v-if="!completeNewPwd" @click.prevent="signIn">Login</button>
            <button v-if="completeNewPwd" @click.prevent="completeNewPassword">Complete New Password</button>
        </div>
    </div>
</template>

<script>
import FormInput from "@/components/FormInput";

export default {
    name: "Login",
    data: () => {
        return {
            user: undefined,
            username: "",
            password: "",
            newPassword: "",
            completeNewPwd: false
        };
    },
    components: {
        FormInput
    },
    methods: {
        async signIn() {
            try {
                this.user = await this.$Amplify.Auth.signIn(
                    this.username,
                    this.password
                );
                switch (this.user.challengeName) {
                    case "SMS_MFA":
                        this.$snotify.success(
                            "You need to input the code received from SMS message"
                        );
                        break;
                    case "SOFTWARE_TOKEN_MFA":
                        this.$snotify.success(
                            "You need to input the OTP(one time password)."
                        );
                        break;
                    case "NEW_PASSWORD_REQUIRED":
                        this.$snotify.success(
                            "You need to input the new password and required attributes",
                            { timeout: 10000 }
                        );
                        this.completeNewPwd = true;
                        break;
                    case "MFA_SETUP":
                        this.$snotify.success(
                            "MFA method is TOTP (the one time password) which requires the user to go through some steps to generate those passwords"
                        );
                        break;
                    default:
                        this.$snotify.success("Succesfully signed in!");
                        this.$router.push("/");
                }
            } catch (err) {
                this.$snotify.error("We can't seem to log you in", "Uh oh..");
                console.log(err);
            }
        },
        async completeNewPassword() {
            try {
                this.user = await this.$Amplify.Auth.completeNewPassword(
                    this.user,
                    this.newPassword
                );
                this.$snotify.success("Succesfully signed in!");
                this.$router.push("/");
            } catch (err) {
                this.$snotify.error("We can't seem to log you in", "Uh oh..");
                console.log(err);
            }
        },
        signOut() {
            this.user = undefined;
            this.$Amplify.Auth.signOut()
                .then(data => console.log(data))
                .catch(err => console.log(err));
        }
    }
};
</script>
<style scoped>
.commands > * {
    margin: 1em;
}
</style>
