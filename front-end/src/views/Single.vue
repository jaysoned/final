<template>
  <div class="Single">
    <h2>Request View</h2>
    <div class="wrapper">
      <div class="request-details">
        <p>Description: {{ request.shortDescription }}</p>
        <p>Details: {{ request.longDescription }}</p>
        <p>Room: {{ request.room }}</p>
        <p>Created: {{ getDate() }}</p>
        <p>Has been resolved?: {{ resolved() }}
            <span v-if="displayResolution()" class="date">  - {{ getResponseDate() }}</span>
          </p>
        <div v-if="isAdmin()" class="responder">
          <p>Response:</p>
          <textarea
            name="responseText"
            placeholder="Place Response here"
            v-model="response"
            rows="10"
          ></textarea>
          <p></p>
          <button
            type="submit"
            class="pure-button pure-button-primary respond-to"
            @click.prevent="completeTask"
          >
            Mark Closed
          </button>
        </div>
        <div v-else class="responded">
          <p v-if="displayResolution()">
            Response: {{ request.response }}</p>
        </div>
      </div>
      <div class="user-detail">
        <h2>User Info</h2>
        <div v-if="isDefault(request)">
          <i class="fas fa-user default"></i>
        </div>
        <img v-else :src="request.user.profilePic" alt="" />
        <p class="userName">Name: {{ request.user.firstName }} {{ request.user.lastName }}</p>
        <h1 v-if="request.user.role === 'admin'" class="shimmer">Admin</h1>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import axios from "axios";
export default {
  name: "Single",
  data() {
    return {
      request: null,
      response: "",
    };
  },
  created() {
    let id = this.$route.params.id;
    this.getRequest(id);
  },
  methods: {
    async getRequest(id) {
      let request = await axios.get("/api/requests/" + id);
      this.request = request.data;
      if (this.request) {
        this.response = this.request.response;
      }
    },
    getResponseDate() {
      let date = this.request.dateResolved;
      if (moment(date).diff(Date.now(), "days") < 15)
        return moment(date).fromNow();
      else return moment(date).format("d MMMM YYYY");
    },
    getDate() {
      let date = this.request.dateCreated;
      if (moment(date).diff(Date.now(), "days") < 15)
        return moment(date).fromNow();
      else return moment(date).format("d MMMM YYYY");
    },
    resolved() {
      if (this.request.resolved) {
        return "Yes";
      } else {
        return "No";
      }
    },
    displayResolution() {
      if (this.$root.$data.user.role === "admin") {
        return true;
      }
      return this.request.resolved;
    },
    isAdmin() {
      if (this.$root.$data.user.role === "admin") {
        return true;
      } else {
        return false;
      }
    },
    isDefault(request) {
      if (request.user.profilePic == "default") {
        return true;
      } else {
        return false;
      }
    },
    async completeTask() {
      try {
        let request = this.request;
        request.response = this.response;
        request.resolved = true;
        await axios.put("/api/requests/" + request._id, {
          resolved: request.resolved,
          response: request.response,
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style scoped>
p {
  width: 90%;
  text-align: left;
  margin-left: 20px;
}
textarea {
  width: 90%;
}
img {
  margin: 10px;
  width: 75%;
  max-width: 250px;
}
h2 {
  margin-top: 10px;
}

/*This code is from https://codepen.io/liuzenan/pen/nCJpo*/
@import url(https://fonts.googleapis.com/css?family=Lato);

.shimmer {
  display: inline-block;
  color: white;

  background: #7e7e7e -webkit-gradient(linear, 100% 0, 0 0, from(#acacac), color-stop(0.5, #ffffff), to(#acacac));

  background-position: -4rem top; /*50px*/
  background-repeat: no-repeat;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-animation-name: shimmer;
  -webkit-animation-duration: 2.2s;
  -webkit-animation-iteration-count: infinite;
  -webkit-background-size: 4rem 100%; /*50px*/
}

@-webkit-keyframes shimmer {
  0% {
    background-position: -4rem top; /*50px*/
  }

  70% {
    background-position: 12.5rem top; /*200px*/
  }

  100% {
    background-position: 12.5rem top; /*200px*/
  }
}

.fa-user {
  color: rgb(156, 156, 156);
  background-color: rgb(219, 219, 219);
  font-size: 200px;
  padding: 10px;
  margin-right: 5px;
}
.userName {
    text-align: center;
}

@media only screen and (min-width: 1000px) {
  .wrapper {
      display: flex;
      justify-content: space-evenly;
  }
}
</style>