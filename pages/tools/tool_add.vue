<template >
<v-expand-transition>
<v-card
 
    max-width="600"
    
  >
   <v-card-title>Tambah Tools

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
            label="Lokasi Rak"
             v-model="tools.id_rak"
            :items="rak"
            item-text="kode_rak"
            item-value="id"
            :rules="[v => !!v || 'Lokasi Rak wajib isi']"
            required
        ></v-autocomplete>

            <v-text-field
            v-model="tools.nama"
            :counter="100"
            label="Nama Tools"
            :rules="[v => !!v || 'Nama Tools wajib isi']"
            required
            ></v-text-field>


            <v-select
            v-model="tools.id_kondisi"
            :items="option_kondisi"
            :rules="[v => !!v || 'Kondisi wajib isi']"
            item-text="nama"
            item-value="value"
            label="Kondisi"
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
       tools:{
        id_rak: '',
        nama:'',
        id_kondisi:'',
      },
      rak:[],
        option_kondisi: [
        { nama: 'Good', value: 1 },
        { nama: 'Not Good', value: 2},
        ],
      valid: true,    
    }),

    created () {
      this.load_rak();
    },

    methods: {

      load_rak(){

        if (process.client) {
            var auth = localStorage.getItem('auth')    
        }
        
        let self = this;
        self.loading = true;
        axios
          .get(`${this.$axios.defaults.baseURL}/master/rak_tools/get_rak_tools`,
              {
              headers: {
                Authorization:  auth
              }
          })
          .then(response => (this.rak = response.data), setTimeout(() => (self.loading = false), 2))
          .catch(error => console.log(error),  self.loading = true);

      },

      validate () {
        
        if (process.client) {
            var auth = localStorage.getItem('auth')    
        }
        
        if (this.$refs.form.validate()) {
            this.$store.commit('alert/status_alert', false);
            let self = this;
            axios
            .post(`${this.$axios.defaults.baseURL}/master/tools/post_tools`, qs.stringify(self.tools)
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
                    self.$router.push('/tools/tool_list')
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
        this.$router.push('/tools/tool_list');
      }
    },
  }
</script>