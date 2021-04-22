<template>
  <div id="app">
    <b-navbar toggleable="lg" type="dark" variant="dark">
      
      <b-container>
        <b-navbar-brand @click="goHome()"><i class="fas fa-home default"></i></b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <!-- Left aligned nav items -->
          <b-navbar-nav class="me-auto">
            <b-nav-item @click="goHome()">Home</b-nav-item>
            <b-nav-item @click="goRequest()">New Request</b-nav-item>
            <b-nav-item v-if="isLoggedInBool()" @click="goMyRequest()"
              >My Requests</b-nav-item
            >
            <b-nav-item v-if="isLoggedInBool()" @click="goEdit()"
              >My Profile</b-nav-item
            >
            <b-nav-item v-if="isLoggedInBool()" @click="logOut()"
              >Logout</b-nav-item
            >
            <b-nav-item v-else @click="goLogin()">Login</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-container>
    </b-navbar>
    <div class="page">
      <router-view />
    </div>
    <table class="footer">
      <tr>
        <td class="footer-item git-link">
          <a
            href="https://github.com/jaysoned/final" target="_blank"
            >GitHub Code</a
          >
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "App",
  async created() {
    try {
      let response = await axios.get("/api/users");
      this.$root.$data.user = response.data.user;
    } catch (error) {
      this.$root.$data.user = null;
    }
  },
  methods: {
    goHome() {
      this.$router.push({ name: "Home" });
    },
    goEdit() {
      this.$router.push({ name: "Edit" });
    },
    goRequest() {
      this.$router.push({ name: "Requests" });
    },
    goMyRequest() {
      this.$router.push({ name: "MyRequests" });
    },
    goLogin() {
      this.$router.push({ name: "Login" });
    },
    isLoggedInBool() {
      if (this.$root.$data.user) {
        return true;
      } else {
        return false;
      }
    },
    isAdmin() {
      if (this.$root.$data.user) {
        if (this.$root.$data.user.role === "admin") {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    async logOut() {
      try {
        await axios.delete("/api/users");
        this.$root.$data.user = null;
      } catch (error) {
        this.$root.$data.user = null;
      }
      this.goHome();
    },
  },
  computed: {},
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding-bottom: 0;
  margin-bottom: 0;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.footer {
  display: table;
  justify-content: center;
  position: fixed;
  bottom: 0;
  text-align: center;
  align-items: center;
  width: 100%;
  background-color: #292929;
  margin-top: 5px;
  height: 50px;
}

.footer-item {
  width: 100%;
}

.footer-item a {
  text-decoration: none;
  color: azure;
}

.footer-item a:hover {
  text-decoration: none;
  color: rgb(174, 175, 175);
}

body {
  background-color: #e9e9e9 !important;
  margin-bottom: 0;
  padding-bottom: 0;
  
}

.page {
  margin-left: 50px;
  margin-right: 50px;
  background-color: white;
  padding-bottom: 100px;
  margin-bottom: 0;
  height: 150vh;
}

/* large screens */
@media only screen and (min-width: 1110px) {
  .page {
    margin-left: 150px;
  margin-right: 150px;
  }
}
</style>



