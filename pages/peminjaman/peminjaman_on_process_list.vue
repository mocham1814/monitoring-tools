<template>

  
        <v-card>

               <v-card-title>
     Tools Yang Belum Dikembalikan</v-card-title>

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
            { text: 'Nama Tools', value: 'nama_tools', align: 'left' },
            { text: 'Posisi Rak', value: 'kode_rak', align: 'left' },
          { text: 'Tanggal/Jam Peminjaman', value: 'tgl_jam', align: 'left' },
          { text: 'Teknisi yang Meminjam', value: 'nama_karyawan', align: 'left' },
        
          
        ],

        peminjaman_detail:[],


      }
    },

    created () {
      this.load_data()

    },

    methods:{

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
