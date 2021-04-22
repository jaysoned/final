<template>
  <div class="Login-Screen">
    <div class="hero">
      <div class="heroBox">
        <form class="pure-form space-above">
          <fieldset>
            <legend>Login</legend>
            <input placeholder="username" v-model="username" />
            <input
              type="password"
              placeholder="password"
              v-model="password"
            />
          </fieldset>
          <fieldset>
            <button
              type="submit"
              class="pure-button pure-button-primary"
              @click.prevent="login"
            >
              Login
            </button>
          </fieldset>
        </form>
        <p v-if="error" class="error">{{ errorLogin }}</p>
      </div>
    </div>
    <p class="switch-msg">
      Don't have an account?
      <span class="switch-link" @click="switchToSignUp">Sign Up.</span>
    </p>
  </div>
</template>

<script>
import axios from "axios"
export default {
  name: "LoginScreen",
  data() {
    return {
      username: "",
      password: "",
      error: "",
    };
  },
  methods: {
    switchToSignUp() {
      this.$emit("switch-component", false);
    },
    async login() {
        this.error = "";
        if (!this.username || !this.password) {
            return;
        }
        try {
            let loginResponse = await axios.post('/api/users/login', {
                username: this.username,
                password: this.password
            });
            this.$root.$data.user = loginResponse.data.user;
            this.$router.push({name: 'Home'});
        }
        catch(error) {
            this.error = "Error: " + error.response.data.message;
            this.$root.$data.user = null;
        }
    }
  },
};
</script>

<style scoped>
.switch-link {
  color: blue;
  cursor: pointer;
}

input {
  margin: 12px;
}
</style>