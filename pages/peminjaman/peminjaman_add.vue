<template >


<v-expand-transition>
    


<v-card
 
    max-width="600"
    
  >
   <v-card-title>Tambah Peminjaman Tools

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


        <v-menu
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="peminjaman.tanggal"
            label="Tanggal Pinjam"
            readonly
            v-on="on"
            :rules="[v => !!v || 'Tanggal pinjam wajib isi']"
            required
          ></v-text-field>
        </template>
        <v-date-picker v-model="peminjaman.tanggal"></v-date-picker>
      </v-menu>


         <v-dialog
        ref="dialog"
        v-model="modal2"
        :return-value.sync="peminjaman.jam"
        persistent
        width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="peminjaman.jam"
            label="Jam Peminjaman"
            prepend-icon="access_time"
            readonly
            :rules="[v => !!v || 'Jam pinjam wajib isi']"
            required
            v-on="on"
          ></v-text-field>
        </template>
        <v-time-picker
          v-if="modal2"
          v-model="peminjaman.jam"
          full-width
        >
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="modal2 = false">Cancel</v-btn>
          <v-btn text color="primary" @click="$refs.dialog.save(peminjaman.jam)">OK</v-btn>
        </v-time-picker>
      </v-dialog>

               <v-autocomplete
            label="Teknisi"
             v-model="peminjaman.id_teknisi"
            :items="teknisi"
            item-text="nama"
            item-value="id"
            :rules="[v => !!v || 'Teknisi wajib isi']"
            required
        ></v-autocomplete>

         <v-row>
        <v-col
          cols="12"
          md="10"
        >
        <v-combobox
          v-model="peminjaman.tools"
          :items="tools"
           item-text="nama"
            item-value="id"
          label="Tools yang dipinjam"
          multiple
          chips
           :rules="[v => !!v || 'Tools wajib isi']"
            required
        >
          <template v-slot:selection="data">
            <v-chip
              :key="JSON.stringify(data.item.nama)"
              v-bind="data.attrs"
              :input-value="data.selected"
              :disabled="data.disabled"
              @click:close="data.parent.selectItem(data.item.nama)"
            >
              <v-avatar
                class="accent white--text"
                left
                v-text="data.item.nama.slice(0, 2).toUpperCase()"
              ></v-avatar>
              {{ data.item.nama.slice(3) }}
            </v-chip>
          </template>
        </v-combobox>

        </v-col>

        <v-col
          cols="12"
          md="2"
        >

         <v-btn class="ma-2" small fab color="teal" @click="detailpeminjamanonprocess">
            <v-icon>mdi-format-list-bulleted-square</v-icon>
            </v-btn>

        </v-col>
        </v-row>

       
            <v-text-field
            v-model="peminjaman.note"
            :counter="500"
            label="Catatan"
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

        <peminjamanonprocess ref="peminjamanonprocess"/>
         </v-card-text>


    </v-card>
    </v-expand-transition>
</template>

<script>

import axios from "axios";
import qs from "qs";
import peminjamanonprocess from "../peminjaman/peminjaman_on_process";


  export default {
       components: {
      'peminjamanonprocess' : peminjamanonprocess
    },

    data: () => ({
        modal2: false,
        peminjaman:{
        tanggal: '',
        jam: null,
        id_teknisi: '',
        tools:[],
        note:'',
        user_id:'',
      },
      teknisi:[],
      tools:[],
      valid: true,    
    }),

    created () {
      this.load_teknisi();
      this.load_tools();
    },

    methods: {

      load_teknisi(id_jabatan=2){

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
          .then(response => (this.teknisi = response.data), setTimeout(() => (self.loading = false), 2))
          .catch(error => console.log(error),  self.loading = true);

      },

      load_tools(){

        if (process.client) {
            var auth = localStorage.getItem('auth')    
        }
        
        let self = this;
        self.loading = true;
        axios
          .get(`${this.$axios.defaults.baseURL}/master/tools/get_tools_2`,
              {
              headers: {
                Authorization:  auth
              }
          })
          .then(response => (this.tools = response.data), setTimeout(() => (self.loading = false), 2))
          .catch(error => console.log(error),  self.loading = true);

      },

       detailpeminjamanonprocess(item) {
             this.$refs.peminjamanonprocess.TruePeminjamanOnProcess(item);
      },

      validate () {
        
        if (process.client) {
            var auth = localStorage.getItem('auth');
            this.peminjaman.user_input = localStorage.getItem('userid');   
        }
        
        if (this.$refs.form.validate()) {
            this.$store.commit('alert/status_alert', false);
            let self = this;
            axios
            .post(`${this.$axios.defaults.baseURL}/transaksi/peminjaman/post_peminjaman`, qs.stringify(self.peminjaman)
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
                    self.$router.push('/peminjaman/peminjaman_list')
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
        this.$router.push('/peminjaman/peminjaman_list');
      }
    },
  }
</script>