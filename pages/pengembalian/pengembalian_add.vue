<template>

      <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
<div>
 <v-card>   
     <v-card-title>Pengembalian Tools

      <div class="flex-grow-1"></div>
    <v-btn color="error" fab x-small dark  @click="back">
              <v-icon>clear</v-icon>
    </v-btn>
    </v-card-title>
        <v-card-text>

    <v-row>

        

    <v-col cols="12" sm="4">
 <v-autocomplete
            label="Teknisi"
             v-model="pengembalian.id_teknisi"
            :items="teknisi"
            item-text="nama"
            item-value="id"
            :rules="[v => !!v || 'Teknisi wajib isi']"
            @change="load_data(pengembalian.id_teknisi), load_data_pengembalian(pengembalian.id_teknisi)"
            required
        ></v-autocomplete>
</v-col>


  <v-col cols="12" sm="4">
<v-menu
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="pengembalian.tanggal"
            label="Tanggal Pengembalian"
            readonly
            v-on="on"
            :rules="[v => !!v || 'Tanggal pengembalian wajib isi']"
            required
          ></v-text-field>
        </template>
        <v-date-picker v-model="pengembalian.tanggal"></v-date-picker>
      </v-menu>
</v-col>

<v-col cols="12" sm="4">
   <v-dialog
        ref="dialog"
        v-model="modal2"
        :return-value.sync="pengembalian.jam"
        persistent
        width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="pengembalian.jam"
            label="Jam Pengembalian"
            prepend-icon="access_time"
            readonly
            :rules="[v => !!v || 'Jam pengembalian wajib isi']"
            required
            v-on="on"
          ></v-text-field>
        </template>
        <v-time-picker
          v-if="modal2"
          v-model="pengembalian.jam"
          full-width
        >
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="modal2 = false">Cancel</v-btn>
          <v-btn text color="primary" @click="$refs.dialog.save(pengembalian.jam)">OK</v-btn>
        </v-time-picker>
      </v-dialog>

      </v-col>
</v-row>
   </v-card-text>
</v-card>
             <v-row>   
    <v-col cols="12" sm="6">

        <v-toolbar color="primary" dark style="border-radius:5px 5px 0px 0px">
          <v-toolbar-title>Tools yang akan dikembalikan</v-toolbar-title>
        </v-toolbar>

        <v-card
        class="mx-auto"
        outlined
        style="min-height:400px"
        >

    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="peminjaman_detail"
      :search="search"
    >

 
    
        
    <template v-slot:item.action="{ item }">



      <v-icon
        style="color:green"
        class="mr-2"
        @click="dikembalikan(item.id_detail)"
      >
        send
      </v-icon>


    </template>
    
    </v-data-table>

<div class="my-2" align="center" v-if="show">
        <v-btn small color="primary" dark  @click="dikembalikan_all()">Kembalikan Semua</v-btn>
</div>
        </v-card>
    </v-col>

    <v-col cols="12" sm="6">

             <v-toolbar color="success" dark style="border-radius:5px 5px 0px 0px">
          <v-toolbar-title>Tools yang sudah dikembalikan</v-toolbar-title>
        </v-toolbar>

        <v-card
        class="mx-auto"
        outlined
        style="min-height:400px"
        >

    <v-card-title>
      <v-text-field
        v-model="search2"
        append-icon="search"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers2"
      :items="pengembalian_detail"
      :search="search2"
    >
    
        
    <template v-slot:item.action="{ item }">

      <v-icon
        style="color:red"
        class="mr-2"
        @click="batal_dikembalikan(item.id_pengembalian)"
      >
        delete
      </v-icon>


    </template>
    
    </v-data-table>

        </v-card>

    </v-col>
    </v-row>

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
        show: false,
        search: '',
        search2: '',
        modal2: false,
        pengembalian:{
            tanggal: '',
            jam: null,
            id_teknisi: '',
            user_input:'',
            id_peminjaman_detail:'',
      },

         headers: [
          { text: 'ID Peminjaman', value: 'id', align: 'left' },
          { text: 'Tgl/Jam Pinjam', value: 'tgl_jam', align: 'left' },
          { text: 'Nama Tools', value: 'nama_tools', align: 'left' },
          { text: 'Posisi Rak', value: 'kode_rak', align: 'left' },
          { text: '', value: 'action', align: 'left' },
        ],

        headers2: [
          { text: 'ID Peminjaman', value: 'id', align: 'left' },
          { text: 'Tgl/Jam Pinjam', value: 'tgl_jam_pinjam', align: 'left' },
          { text: 'Tgl/Jam Kembali', value: 'tgl_jam_kembali', align: 'left' },
          { text: 'Nama Tools', value: 'nama_tools', align: 'left' },
          { text: 'Posisi Rak', value: 'kode_rak', align: 'left' },
          { text: '', value: 'action', align: 'left' },
        ],

        peminjaman_detail:[],
        pengembalian_detail:[],
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

        load_data : function(id) {

            let self = this;
            axios
            .get(`${this.$axios.defaults.baseURL}/transaksi/peminjaman/get_peminjaman_by_teknisi/`+id)
            .then(response => (this.peminjaman_detail = response.data, this.show = response.data.length ))
            .catch(error => console.log(error));
        },

        load_data_pengembalian : function(id) {

            let self = this;
            axios
            .get(`${this.$axios.defaults.baseURL}/transaksi/peminjaman/get_pengembalian_by_teknisi/`+id)
            .then(response => (this.pengembalian_detail = response.data))
            .catch(error => console.log(error));
        },


        batal_dikembalikan(id){

            if (process.client) {
            var auth = localStorage.getItem('auth')    
            }

            let self = this;
            axios
            .get(`${this.$axios.defaults.baseURL}/transaksi/pengembalian/delete_pengembalian/` + id,{
            headers: {
            Authorization:  auth
            }
            })
            .then(function(response) {
            response => console.log(response);

            self.load_data_pengembalian(self.pengembalian.id_teknisi);
            self.load_data(self.pengembalian.id_teknisi);

            let sts = true;
            let pesan = 'Data has been deleted';
            let warna = 'success';
            self.$store.commit('alert/status_alert', { sts, pesan, warna })

            })

        },

        dikembalikan(id){

        if (process.client) {
            var auth = localStorage.getItem('auth');
            this.pengembalian.user_input = localStorage.getItem('userid');   
        }

        this.pengembalian.id_peminjaman_detail = id;
        
        if (this.$refs.form.validate()) {
            this.$store.commit('alert/status_alert', false);
            let self = this;
            axios
            .post(`${this.$axios.defaults.baseURL}/transaksi/pengembalian/post_pengembalian`, qs.stringify(self.pengembalian)
             ,{
                headers: {
                  Authorization:  auth
                }
              }
            )
            .then(    
                function (response) {            
  
                    let sts = true;
                    let pesan = 'Data has been saved';
                    let warna = 'success';
                    self.$store.commit('alert/status_alert', { sts, pesan, warna })
                    self.load_data_pengembalian(self.pengembalian.id_teknisi);
                    self.load_data(self.pengembalian.id_teknisi);
               
                }    
            )
            .catch(error => console.log(error));
        }

     },

     dikembalikan_all(){

        if (process.client) {
            var auth = localStorage.getItem('auth');
            this.pengembalian.user_input = localStorage.getItem('userid');   
        }

        if (this.$refs.form.validate()) {
            this.$store.commit('alert/status_alert', false);
            let self = this;
            axios
            .post(`${this.$axios.defaults.baseURL}/transaksi/pengembalian/post_pengembalian_all`, qs.stringify(self.pengembalian)
             ,{
                headers: {
                  Authorization:  auth
                }
              }
            )
            .then(    
                function (response) {            
  
                    let sts = true;
                    let pesan = 'Data has been saved';
                    let warna = 'success';
                    self.$store.commit('alert/status_alert', { sts, pesan, warna })
                    self.load_data_pengembalian(self.pengembalian.id_teknisi);
                    self.load_data(self.pengembalian.id_teknisi);
               
                }    
            )
            .catch(error => console.log(error));
        }

     },

     back () {
        this.$router.push('/pengembalian/pengembalian_list');
      },

    }//end method
  }//end export default
</script>