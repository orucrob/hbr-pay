<template>
  <div class="col-sm-12 col-md-6 col-lg-3 col-lg-2">
    <form-input label="Email" v-model="username"></form-input>
    <form-input
      label="Password"
      v-model="password"
      type="password"
    ></form-input>

    <div class="commands">
      <router-link to="/login">Login</router-link>
      <button @click.prevent="signUp">Sign me up!</button>
    </div>
  </div>
</template>

<script>
import FormInput from "@/components/FormInput";

export default {
  name: "Signup",
  data: () => {
    return {
      user: undefined,
      username: "",
      password: "",
      loading: false
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
        this.$snotify.success("Succesfully signed in!");
        this.$router.push("/");
      } catch (err) {
        this.$snotify.error("We can't seem to log you in", "Uh oh..");
        console.error(err);
      }
    },
    async signUp() {
      this.loading = true;

      try {
        // If the response is succesfull (and a valid invite code)
        this.user = await this.$Amplify.Auth.signUp({
          username: this.username,
          password: this.password
        });
        this.$snotify.success(
          "Sign up succesfull!",
          "Check your email for an confirmation!",
          { timeout: 10000 }
        );
        this.loading = false;

        this.signIn();
      } catch (err) {
        if (err.message) {
          const message = err.message;
          if (message.indexOf("Member must have length greater") !== -1) {
            this.$snotify.error(
              "The password is not long enough.",
              "Invalid password"
            );
          }
          if (message.indexOf("Password not long enough") !== -1) {
            this.$snotify.error(
              "The password is not long enough.",
              "Invalid password"
            );
          }
          if (
            message.indexOf("Password must have uppercase characters") !== -1
          ) {
            this.$snotify.error(
              "The password must have uppercase characters.",
              "Invalid password"
            );
          }
          if (
            message.indexOf(
              "An account with the given email already exists."
            ) !== -1
          ) {
            this.$snotify.warning(
              "You already have an account!",
              "Account exists"
            );
          }
          if (message.indexOf("Password must have numeric characters") !== -1) {
            this.$snotify.error(
              "The password must have numeric characters.",
              "Invalid password"
            );
          }
        } else {
          this.$snotify.error("Something went wrong!", "Uh oh..");
        }
        this.loading = false;
      }
    }
  }
};
</script>
<style scoped>
.commands > * {
  margin: 1em;
}
</style>
