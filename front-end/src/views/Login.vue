<template>
  <div class="Login">
    <div class="login-stuff" v-if="!user">
      <LoginScreen @switch-component="switchComponent" v-if="isExistingUser" />
      <SignUp @switch-component="switchComponent" v-else />
    </div>
    <div v-else class="logged-in">
      <p>You are logged in. Try using one of the Links above to view tickets, profile, etc.</p>
    </div>
  </div>
</template>

<script>
import LoginScreen from "@/components/LoginComponent.vue";
import SignUp from "@/components/SignUpComponent.vue";
export default {
  name: "Login",
  data() {
    return {
      isExistingUser: true,
    };
  },
  components: {
    LoginScreen,
    SignUp,
  },
  methods: {
    isLoggedIn() {
      if (this.$root.$data.user) {
        return true;
      } else {
        return false;
      }
    },
    switchComponent(boolVal) {
      this.isExistingUser = boolVal;
    },
  },
  computed: {
    user() {
      return this.isLoggedIn();
    },
  },
};
</script>