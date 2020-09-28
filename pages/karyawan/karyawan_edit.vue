<template >
<v-expand-transition>
<v-card
 
    max-width="600"
    
  >
   <v-card-title>Tambah Karyawan

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
            <v-text-field
            v-model="karyawan.nama"
            :counter="50"
            label="Nama"
            :rules="[v => !!v || 'Nama wajib isi']"
            required
            ></v-text-field>


            <v-select
            v-model="karyawan.id_jabatan"
            :items="option_jabatan"
            :rules="[v => !!v || 'Jabatan wajib isis']"
            item-text="nama"
            item-value="value"
            label="Jabatan"
            required
            ></v-select>


             <v-textarea
                outlined
                clearable
                name="input-7-4"
                rows="2"
                label="Alamat"
                v-model="karyawan.alamat"
            ></v-textarea>


            <v-btn
            :disabled="!valid"
            color="success"
            class="mr-4"
            @click="validate"
            >
            Update
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
       karyawan:{
        id:'',
        nama: '',
        id_jabatan:'',
        alamat:'',
      },
        option_jabatan: [
        { nama: 'Admin', value: 1 },
        { nama: 'Teknisi', value: 2},
        ],
      valid: true,    
    }),

    methods: {


    load_data : function(id) {
        let self = this;
        axios
        .get(`${this.$axios.defaults.baseURL}/master/karyawan/get_karyawanById/`+id)
        .then(response => (this.karyawan = response.data))
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
            .post(`${this.$axios.defaults.baseURL}/master/karyawan/update_karyawan`, qs.stringify(self.karyawan)
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
                    self.$router.push('/karyawan/karyawan_list')
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
        this.$router.push('/karyawan/karyawan_list');
      }
    },

    mounted() {
       var item = this.$route.query.id;
       this.load_data(item);  
       
   },

  }
</script>