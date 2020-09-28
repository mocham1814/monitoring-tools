<template >
<v-expand-transition>
<v-card
 
    max-width="600"
    
  >
   <v-card-title>Tambah Kode Rak Tools

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


        <v-select
            v-model="rak.kode"
            :items="option_rak"
            :rules="[v => !!v || 'Kode Rak wajib isis']"
            item-text="nama"
            item-value="value"
            label="Kode Rak"
            required
            ></v-select>

            <v-text-field
            v-model="rak.nomor"
            :counter="50"
            label="Nomor Rak"
            :rules="[v => !!v || 'Nomor Rak wajib isi']"
            required
            ></v-text-field>


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
       rak:{
        kode: '',
        nomor:'',
      },
        option_rak: [
        { nama: 'A', value: 'A' },
        { nama: 'B', value: 'B' },
        { nama: 'C', value: 'C'},
        ],
      valid: true,    
    }),

    methods: {
      validate () {
        
        if (process.client) {
            var auth = localStorage.getItem('auth')    
        }
        
        if (this.$refs.form.validate()) {
            this.$store.commit('alert/status_alert', false);
            let self = this;
            axios
            .post(`${this.$axios.defaults.baseURL}/master/rak_tools/post_rak_tools`, qs.stringify(self.rak)
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
                    self.$router.push('/rak_tools/rak_tool_list')
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
        this.$router.push('/rak_tools/rak_tool_list');
      }
    },
  }
</script>