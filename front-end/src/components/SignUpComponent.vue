<template>
  <div class="Login-Screen">
    <div class="hero">
      <div class="heroBox">
        <form class="pure-form">
          <fieldset>
            <legend>Register for an account</legend>
            <input placeholder="first name" v-model="firstName" />
            <input placeholder="last name" v-model="lastName" />
          </fieldset>
          <fieldset>
            <input placeholder="username" v-model="username" />
            <input type="password" placeholder="password" v-model="password" />
          </fieldset>
          <fieldset>
            <button
              type="submit"
              class="pure-button pure-button-primary"
              @click.prevent="register"
            >
              Register
            </button>
          </fieldset>
        </form>
        <p v-if="error" class="error">{{ error }}</p>

        <p class="switch-msg">
          Already have an account?
          <span class="switch-link" @click="switchToLogin">Log in.</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: "SignUp",
  data() {
    return {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      error: "",
    };
  },
  methods: {
    switchToLogin() {
      this.$emit("switch-component", true);
    },
    async register() {
      this.error = "";
      if (!this.firstName || !this.lastName || !this.username || !this.password) {
        alert("All fields are required!");
        return;
      }
      try {
        let response = await axios.post("/api/users", {
          firstName: this.firstName,
          lastName: this.lastName,
          username: this.username,
          password: this.password,
        });
        this.$root.$data.user = response.data.user;
        this.$router.push({name: 'Home'});
      } catch (error) {
        this.error = error.response.data.message;
        this.$root.$data.user = null;
      }
    },
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