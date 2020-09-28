<template>

      <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
<div>
 <v-card>   
    
        <v-card-text>

    <v-row>

        

  


  <v-col cols="12" sm="3">
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
            label="Tanggal Peminjaman Awal"
            readonly
            v-on="on"
            :rules="[v => !!v || 'Tanggal peminjaman wajib isi']"
            required
          ></v-text-field>
        </template>
        <v-date-picker v-model="peminjaman.tanggal"></v-date-picker>
      </v-menu>
</v-col>

<v-col cols="12" sm="3">
     
     <v-menu
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="peminjaman.tanggal2"
            label="Tanggal Peminjaman Akhir"
            readonly
            v-on="on"
            :rules="[v => !!v || 'Tanggal peminjaman wajib isi']"
            required

          ></v-text-field>
        </template>
        <v-date-picker v-model="peminjaman.tanggal2"></v-date-picker>
      </v-menu>

      </v-col>


        <v-col cols="12" sm="3">
            <v-autocomplete
            label="Teknisi"
             v-model="peminjaman.id_teknisi"
            :items="teknisi"
            item-text="nama"
            item-value="id"

        ></v-autocomplete>
</v-col>

<v-col cols="12" sm="3">
<v-btn color="primary" dark small  @click="get_lap_peminjaman()">Lihat</v-btn>
    </v-col>
</v-row>
   </v-card-text>
</v-card>

<br>
<div id="printMe">
<v-card v-if="show>0">

     <v-card-title class="headline">Laporan Peminjaman-Pengembalian Tools </v-card-title>

     <v-card-subtitle>Periode {{peminjaman.tanggal}} s/d {{peminjaman.tanggal2}} </v-card-subtitle>


<template>
    
  <v-simple-table>
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">ID Peminjaman</th>
          <th class="text-left">Teknisi Pinjam</th>
          <th class="text-left">Nama Tools</th>
          <th class="text-left">Tgl Jam Pinjam</th>
          <th class="text-left">Tgl Jam Kembali</th>
          
          <th class="text-left">Posisi Rak</th>
          
          

        </tr>
      </thead>
      <tbody>
        <tr v-for="item in desserts" :key="item.id">
          <td>{{ item.id_peminjaman }}</td>
          <td>{{ item.nama_teknisi}}</td>
          <td>{{ item.nama_tools}}</td>
          <td>{{ item.tgl_jam_pinjam}}</td>
          <td>{{ item.tgl_jam}}</td>
          
          <td>{{ item.kode_rak}}</td>
          
          
        </tr>
      </tbody>
    </template>
  </v-simple-table>

  
</template>

</v-card>
      </div>  
<br>
      <v-btn @click="print" color="warning" dark small  v-if="show>0">Cetak</v-btn>

    </div>

    
        </v-form>
</template>

<script>

import axios from "axios";
import qs from "qs";



  export default {
    props: ['previewEditor'],
    data () {
      return {
        valid: true,   
        show:'',
        search: '',
        search2: '',
        modal2: false,
        peminjaman:{
            tanggal: '',
            tanggal2: '',
            id_teknisi: '',
      },

       desserts: [],
       teknisi:[],

      }
    },

    created () {
      this.load_teknisi();
    },
    

    methods:{

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
        

    

     get_lap_peminjaman(){


        if (process.client) {
            var auth = localStorage.getItem('auth');
            this.peminjaman.user_input = localStorage.getItem('userid');   
        }

        if (this.$refs.form.validate()) {
            this.$store.commit('alert/status_alert', false);
            let self = this;
            axios
            .post(`${this.$axios.defaults.baseURL}/laporan/peminjaman/get_lap_peminjaman`, qs.stringify(self.peminjaman)
             ,{
                headers: {
                  Authorization:  auth
                }
              }
            )
            .then(    
                function (response) {            
  

                    self.desserts = response.data;
                    self.show = response.data.length;

                }    
            )
            .catch(error => console.log(error));
        }

     },

      print () {
      this.$htmlToPaper('printMe');
    },

     back () {
        this.$router.push('/laporan/peminjaman');
      },

    }//end method
  }//end export default
</script>