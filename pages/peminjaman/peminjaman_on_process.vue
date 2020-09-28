<template>
  
  <v-dialog
      v-model="dialog"
      max-width="900"
    >
      <v-card>
        <v-card-title class="headline">Daftar Tools Yang dipinjam</v-card-title>

        
        <v-card>
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
    ></v-data-table>
  </v-card>

        <v-card-actions>
          <v-spacer></v-spacer>

         

          <v-btn
            color="green darken-1"
            text
            @click="dialog = false"
          >
            Tutup
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
</template>

<script>

import axios from "axios";

  export default {
    props: ['previewEditor'],
    data () {
      return {
          search: '',
        dialog: false,
        id:'',
        teknisi:'',
        tgl_jam:'',

         headers: [
          { text: 'ID Peminjaman', value: 'id', align: 'left' },
          { text: 'Tanggal/Jam', value: 'tgl_jam', align: 'left' },
          { text: 'Nama Teknisi', value: 'nama_karyawan', align: 'left' },
          { text: 'Nama Tools', value: 'nama_tools', align: 'left' },
          { text: 'Posisi Rak', value: 'kode_rak', align: 'left' },
        ],

        peminjaman_detail:[],


      }
    },

    methods:{
        TruePeminjamanOnProcess(item){

            this.dialog = true;
            this.load_data();
         
        },

        load_data : function(id) {
            let self = this;
            axios
            .get(`${this.$axios.defaults.baseURL}/transaksi/peminjaman/get_peminjaman_all`)
            .then(response => (this.peminjaman_detail = response.data))
            .catch(error => console.log(error));
        },
    }
  }
</script>
