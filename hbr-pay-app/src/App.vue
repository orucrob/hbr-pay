<template>
    <div id="app">
        <b-nav tabs>
            <b-nav-item>
                <router-link to="/">Home</router-link>
            </b-nav-item>
            <b-nav-item v-if="user">
                <router-link to="/about">About</router-link>
            </b-nav-item>
            <b-nav-item v-if="user">
                <router-link to="/signout">Signout</router-link>
            </b-nav-item>
            <b-nav-item v-else>
                <router-link to="/login">Login</router-link>
            </b-nav-item>
            <b-nav-item v-if="user">
                <router-link to="/pay">Payment</router-link>
            </b-nav-item>
        </b-nav>
        <router-view/>
        <vue-snotify/>
        <hr>
        <div v-if="user" class="dev-info">
            <div>LOGGED IN</div>
            <div>idToken: {{ idToken }}</div>
            <div>accessToken: {{ accessToken }}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: "app",
    data: () => {
        return {
            user: undefined,
            idToken: undefined,
            accessToken: undefined
        };
    },
    beforeMount: async function() {
        try {
            this.user = await this.$Amplify.Auth.currentAuthenticatedUser();
            this.session = await this.$Amplify.Auth.currentSession();
            if (this.session) {
                this.idToken = this.session.idToken.jwtToken;
                this.accessToken = this.session.accessToken.jwtToken;
            } else {
                this.idToken = undefined;
                this.accessToken = undefined;
            }
            console.log("app:gotuser", this.session);
        } catch (e) {
            console.log("app:gotuser/session err", e);
            this.user = undefined;
        }
    }
};
</script>
<style lang="scss">
@import "~vue-snotify/styles/simple";
#app {
    padding: 1em;
}
.dev-info {
    font-family: monospace;
}
</style>
