<template>
  <div class="Edit">
    <div class="horizontal-container">
      <div class="crop-container">
        <croppa
          v-model="myCroppa"
          :width="screenSize"
          :height="screenSize"
          v-bind:placeholder="placeHolderTxt"
          :placeholder-font-size="fontSizeUse"
          :disabled="false"
          :prevent-white-space="true"
          :show-remove-button="true"
          @file-choose="handleCroppaFileChoose"
          @file-size-exceed="handleCroppaFileSizeExceed"
          @file-type-mismatch="handleCroppaFileTypeMismatch"
          @image-remove="handleImageRemove"
          @move="handleCroppaMove"
          @zoom="handleCroppaZoom"
        >
        </croppa>
        <p>
          <button
            type="submit"
            class="pure-button pure-button-primary"
            @click.prevent="changePhoto"
          >
            Change Photo
          </button>
        </p>
      </div>
      <div class="user-data">
        <div class="wrapper">
          <p class="instruction">On desktop scroll to zoom, on mobile pinch</p>
          <p>First Name</p>
          <input
            v-model="firstName"
            type="text"
            placeholder="First Name Here"
          />
          <p>Last Name</p>
          <input v-model="lastName" type="text" placeholder="Last Name Here" />
          <p>
            <button
              type="submit"
              class="pure-button pure-button-primary"
              @click.prevent="changeName"
            >
              Change Name
            </button>
          </p>
        </div>
      </div>
    </div>
    <div class="previous">
      <p>Current Photo</p>
      <div v-if="isDefault()">
        <i class="fas fa-user default"></i>
      </div>
      <img v-else :src="oldImg" alt="profile-pic" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      myCroppa: {},
      placeHolderTxt: `Click/tap to choose an image`,
      firstName: "",
      lastName: "",
      oldImg: "",
      error: "",
      screenSize: 350,
      fontSizeUse: 25,
    };
  },
  created() {
    this.resizeThing();
    this.getProfilePic();
    this.firstName = this.$root.$data.user.firstName;
    this.lastName = this.$root.$data.user.lastName;
  },
  mounted() {
    window.addEventListener("resize", () => {
      this.resizeThing();
    });
  },
  methods: {
    resizeThing() {
      if (window.innerWidth < 900) {
        this.screenSize = 200;
        this.fontSizeUse = 14;
      } else {
        this.screenSize = 350;
        this.fontSizeUse = 25;
      }
      if (window.innerWidth > 1110 && window.innerWidth < 1210) {
        let elements = document.getElementsByClassName("user-data");
        for (let element of elements) {
          element.style.width = "50%";
        }
      } else if (window.innerWidth > 1210) {
        let elements = document.getElementsByClassName("user-data");
        for (let element of elements) {
          element.style.width = "30%";
        }
      } else {
        let elements = document.getElementsByClassName("user-data");
        for (let element of elements) {
          element.style.width = "100%";
        }
      }
    },
    async changeName() {
      try {
        await axios.put("/api/users", {
          firstName: this.firstName,
          lastName: this.lastName,
        });
        alert("Changed");
      } catch (error) {
        this.error = error.response.data.message;
      }
    },

    changePhoto() {
      try {
        this.myCroppa.generateBlob(async (blob) => {
          try {
            if (!blob) {
              alert("Must include file!");
              return;
            }
            var newFile = new File([blob], "foo.png", {
              type: "image/png",
            });
            const formData = new FormData();
            formData.append("photo", newFile, "blob");
            formData.append("title", "title");
            await axios.put("/api/users/photo", formData);
            this.getProfilePic();
          } catch (error) {
            this.error = "Error: " + error.response.data.message;
          }
        });
      } catch (error) {
        this.error = "Error: " + error.response.data.message;
      }
    },
    isDefault() {
      if (!this.$root.$data.user) {
        return true;
      } else if (this.$root.$data.user.profilePic === "default") {
        return true;
      } else {
        return false;
      }
    },
    async getProfilePic() {
      let response = await axios.get("/api/users/photo");
      this.oldImg = response.data.photo;
    },
  },
};
</script>

<style scoped>
img {
  max-width: 200px;
}
.default {
  font-size: 300px;
}
input {
  margin-bottom: 5px;
  width: 200px;
}

p {
  margin-bottom: 5px;
}
.Edit {
  padding-top: 10px;
}

/* large screens */
@media only screen and (min-width: 1110px) {
  .horizontal-container {
    display: flex;
    flex-direction: row;
    align-content: center;
    justify-content: center;
  }
  .crop-container {
    align-self: flex-end;
    width: 30%;
  }
  .user-data {
    align-self: flex-start;
    width: 30%;
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
  }

  img {
    max-width: 350px;
  }
  input {
    margin-bottom: 5px;
    width: 350px;
  }

  .wrapper {
    width: 100%;
  }

  input {
    margin-bottom: 5px;
    width: 80%;
  }
}
</style>