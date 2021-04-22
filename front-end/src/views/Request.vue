<template>
  <div class="Request">
    <div v-if="!isLoggedIn()" class="error-msg">
      <p>You are not logged in, to make a request please <a href="/Login">login.</a></p>
    </div>
    <div v-else class="request-list">
        <div class="hero">
      <div class="heroBox">
        <form class="pure-form">
          <fieldset>
            <legend>Submit a new ticket</legend>
            <p>Provide a short description of what needs fixed:</p>
            <input placeholder="i.e. light-out" v-model="shortDescription" />
          </fieldset>
          <fieldset>
            <p>Provide the room number (or nearest room number)</p>
            <input placeholder="i.e. c380" v-model="roomNum" />
          </fieldset>
          <p>Provide more detail (optional)</p>
          <textarea name="longDescription" placeholder="i.e. glass everywhere" v-model="longDescription" rows="10"></textarea>
          
          <fieldset>
            <button
              type="submit"
              class="pure-button pure-button-primary"
              @click.prevent="addRequest"
            >
              Submit
            </button>
          </fieldset>
        </form>
        <p v-if="error" class="error">{{ error }}</p>
      </div>
    </div>
    </div>
    
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      longDescription: "",
      roomNum: "",
      shortDescription: ""
    }
  },
  methods: {
    isLoggedIn() {
      if (this.$root.$data.user) {
        return true;
      } else {
        return false;
      }
    },
    async addRequest() {
      if(!this.shortDescription || !this.roomNum) {
        alert("The short description and room number are required fields")
        return;
      }
    try {
      await axios.post("/api/requests", {
        longDescription: this.longDescription,
        shortDescription: this.shortDescription,
        room: this.roomNum,
      });
      this.$router.push({ name: "Home" });
    }
    catch(error) {
      alert("Failed to add, make sure you are logged in.")
    }
    }
  },
};
</script>

<style>
.Request a, .Request a:visited {
    text-decoration: underline !important;
    color: black;
}
input, textarea {
  width: 80%;
}
</style>