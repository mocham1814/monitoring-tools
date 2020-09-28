<template >
<v-expand-transition>
<v-card
 
    max-width="600"
    
  >
   <v-card-title>Tambah User

     <div class="flex-grow-1"></div>
    <v-btn color="error" fab x-small dark  @click="back">
              <v-icon>clear</v-icon>
    </v-btn>

   </v-card-title>
   <v-card-text>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >

               <v-autocomplete
            label="Karyawan"
             v-model="users.id_karyawan"
            :items="karyawan"
            item-text="nama"
            item-value="id"
            :rules="[v => !!v || 'Karyawan wajib isi']"
            required
        ></v-autocomplete>

            <v-text-field
            v-model="users.username"
            :counter="50"
            label="Username"
            :rules="[v => !!v || 'Username wajib isi']"
            required
            ></v-text-field>


            <v-select
            v-model="users.role"
            :items="option_role"
            :rules="[v => !!v || 'Role wajib isi']"
            item-text="nama"
            item-value="value"
            label="Role"
            required
            ></v-select>


            <v-btn
            :disabled="!valid"
            color="success"
            class="mr-4"
            @click="validate"
            >
            Save
            </v-btn>

            <v-btn
            color="error"
            class="mr-4"
            @click="reset"
            >
            Reset Form
            </v-btn>

        

        </v-form>
         </v-card-text>


    </v-card>
    </v-expand-transition>
</template>

<script>

import axios from "axios";
import qs from "qs";

  export default {
    data: () => ({
       users:{
        username: '',
        role:'',
        id_karyawan:'',
      },
      karyawan:[],
        option_role: [
        { nama: 'Full Access', value: 1 },
        { nama: 'Not Full Access', value: 2},
        ],
      valid: true,    
    }),

    created () {
      this.load_karyawan();
    },

    methods: {

      load_karyawan(id_jabatan=1){

        if(id_jabatan==undefined){
          var params_jbt = 'empty';
        }else{
          var params_jbt = id_jabatan;
        }


        if (process.client) {
            var auth = localStorage.getItem('auth')    
        }
        
        let self = this;
        self.loading = true;
        axios
          .get(`${this.$axios.defaults.baseURL}/master/karyawan/get_karyawan/`+params_jbt,
              {
              headers: {
                Authorization:  auth
              }
          })
          .then(response => (this.karyawan = response.data), setTimeout(() => (self.loading = false), 2))
          .catch(error => console.log(error),  self.loading = true);

      },

    load_data : function(id) {
        let self = this;
        axios
        .get(`${this.$axios.defaults.baseURL}/master/users/get_userById/`+id)
        .then(response => (this.users = response.data))
        .catch(error => console.log(error));
    },

      validate () {
        
        if (process.client) {
            var auth = localStorage.getItem('auth')    
        }
        
        if (this.$refs.form.validate()) {
            this.$store.commit('alert/status_alert', false);
            let self = this;
            axios
            .post(`${this.$axios.defaults.baseURL}/master/users/update_user`, qs.stringify(self.users)
             ,{
                headers: {
                  Authorization:  auth
                }
              }
            )
            .then(    
                function (response) {            
  
                if(response.data.duplicated > 0)
                {   
                    
                    let sts = true;
                    let pesan = 'Duplicated data';
                    let warna = 'red';
                    self.$store.commit('alert/status_alert', { sts, pesan, warna })
                }
                else{
                    self.$router.push('/users/user_list')
                    let sts = true;
                    let pesan = 'Data has been saved';
                    let warna = 'success';
                    self.$store.commit('alert/status_alert', { sts, pesan, warna })
                }

               
                }    
            )
            .catch(error => console.log(error));
        }
      },
      reset () {
        this.$refs.form.reset()
      },
      back () {
        this.$router.push('/users/user_list');
      }
    },

      mounted() {
       var item = this.$route.query.id;
       this.load_data(item);  
       
   },
  }
</script>