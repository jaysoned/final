<template>
  <div class="RequestList">
    <div
      class="one-request"
      @click="goSingle(request)"
      v-for="(request, index) in requests"
      :key="request._id"
    >
      <div class="request-wrapper">
        <div v-if="isDefault(request)">
          <i class="fas fa-user default"></i>
        </div>
        <img v-else :src="request.user.profilePic" alt="profile-pic" />
        <div class="description">
          <p :class="{'completed' : request.resolved}">
            {{ request.shortDescription }} -
            <span class="name"
              >{{ request.user.firstName }} {{ request.user.lastName }}</span
            >
          </p>
        </div>
        <p class="date">{{getDate(request.dateCreated)}}</p>
      </div>
      <div class="extra-wrapper" v-if="isPersonal">
      <button @click.prevent="deleteThis(request, index)">x</button>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import axios from 'axios';
export default {
  name: "RequestList",
  data() {
    return {
      requestsArray: [],
      skipNext: false,
    };
  },
  props: {
    requests: Array,
    title: String,
    isPersonal: Boolean,
  },
  methods: {
    isDefault(request) {
      if (request.user.profilePic === "default") {
        return true;
      }
    },
    goSingle(request) {
      if (!this.skipNext) {
        this.$router.push({ name: "Single", params: {id: request._id} });
        return request;
      } else {
        this.skipNext = false;
      }
    },
    async deleteThis(request, index) {
      this.skipNext = true;
      axios.delete("/api/requests/" + request._id);
      this.requests.splice(index, 1);
      return index;
    },
    getDate(date) {
      if (moment(date).diff(Date.now(), "days") < 15)
        return moment(date).fromNow();
      else return moment(date).format("d MMMM YYYY");
    }
  },
};
</script>

<style scoped>
img {
  padding-top: auto;
  max-width: 50px;
  max-height: 50px;
  align-self: center;
}
.one-request {
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 15px;
  margin-left: 10px;
  margin-right: 10px;
  background-color: rgb(243, 243, 243);
  border-radius: 5px;
  padding-left: 2px;
  padding-right: 2px;
}

.request-wrapper {
  display: flex;
  justify-content: space-evenly;
}

img, .description, .date {
  padding-right: 5px;
}

.fa-user {
  color: rgb(156, 156, 156);
  background-color: rgb(219, 219, 219);
  font-size: 50px;
  margin-right: 5px;
}

.name {
  color: gray;
}

.completed {
  text-decoration: line-through;
}
.date{
  font-size: .75em;
  color: gray;
}

.extra-wrapper button {
  visibility: hidden;
  color: aliceblue;
  background-color: darkgrey;
}

.one-request:hover .extra-wrapper button {
  visibility: visible;
}

@media only screen and (min-width: 1000px) {
  .RequestList {
    column-count: 2;
  }
}
</style>
