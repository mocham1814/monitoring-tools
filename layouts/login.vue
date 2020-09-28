<template>
  <v-app id="inspire">
    <v-content>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <v-card class="elevation-12">
              <v-toolbar
                color="primary"
                dark
                flat
              >
                <v-toolbar-title>  Peminjaman Tools <v-avatar  size="155">
                <img src="~/assets/avatar/auto2000.png" alt="avatar"  >
                </v-avatar> </v-toolbar-title>
              
               
              </v-toolbar>
              <v-card-text>


                 <v-form
                  ref="form"
                  v-model="valid"
                  lazy-validation
                  >
                  <v-text-field
                    v-model="login.username"
                    label="Username"
                    name="username"
                    prepend-icon="person"
                    type="text"
                    :rules="[v => !!v || 'Username wajib isi']"
                    required
                  />

                  <v-text-field
                    v-model="login.password"
                    id="password"
                    label="Password"
                    name="password"
                    prepend-icon="lock"
                    type="password"
                     :rules="[v => !!v || 'Password wajib isi']"
                    required
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="primary"  @click="validate">Login</v-btn>
              </v-card-actions>
            </v-card>

            <v-card-text>
                <v-alert type="error" transition="scale-transition"
                v-model="alert">
                Username and Password tidak valid !
                </v-alert>
            </v-card-text>

          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>

import { mapState } from 'vuex';
import axios from "axios";
import qs from "qs";

import confirmation from "../components/confirmation";

export default {
    
    props: {
      source: String,
    },

    data: () => ({
        valid:true,
        alert:false,
        login:{
        username: '',
        password:'',    
        },
    }),


    methods: {

      validate () {
        if (this.$refs.form.validate()) {

          let self = this

           axios
          .post(
            `${this.$axios.defaults.baseURL}/Login/post_login`,
            qs.stringify(this.login)
          )
          .then(function(response) {

            // console.log(response.data.auth);
            if (response.data.id_user !='' || response.data.auth !='') {

                localStorage.setItem("username", self.login.username);
                localStorage.setItem("userid", response.data.id_user);
                localStorage.setItem("auth", response.data.auth);

                self.$store.commit('login/setAuth', response.data.auth);
                self.$store.commit('login/setUsername', self.login.username);
                self.$store.commit('login/setUserId', response.data.id_user);

                let sts = true;
                let pesan = 'Hi, Welcome '+ response.data.nama_user;
                let warna = 'success';
                self.$store.commit('alert/status_alert', { sts, pesan, warna });


                self.$router.push('/main');
           
            } else {

                self.alert = true;      
                setTimeout(() => (self.alert = false), 2000)      
            }
          })
          .catch(error => console.log(error));


        }
      },

      confirm (){
        this.$refs.confirmation.dialog_params('Are you sure logout system ?');
      },

     } //end method
}//end export default
</script>