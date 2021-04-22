<template>
  <div class="home">
    <h2 class="title">
      My Repair Requests
    </h2>
    <p>Select one to see full details</p>
    <RequestList :isPersonal="true" :requests="this.listORequest"/>
  </div>
</template>

<script>
// @ is an alias to /src
import RequestList from "@/components/RequestList.vue";
import axios from "axios";
export default {
  name: 'Home',
  data() {
    return {
      listORequest: []
    }
  },
  components: {
    RequestList
  },
  created() {
    this.getRequests();
  },
  methods: {
    async getRequests() {
      let answer = await axios.get("/api/requests");
      this.listORequest = answer.data;
    }
  }
}
</script>

<style>

</style>
