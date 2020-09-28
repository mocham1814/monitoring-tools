

<template>


<v-app id="inspire">


   

  <v-card>

       <v-row dense>
        <v-col cols="4">
          <v-card
            color="error"
            dark
          >
            <v-card-title class="headline">Tools Yang Dipinjam : <span class="display-3">{{jml_pinjam}}</span></v-card-title>


           
          </v-card>
        </v-col>

         <v-col cols="4">
          <v-card
            color="warning"
            dark
          >
                <v-card-title class="headline">Tools Yang Dikembalikan : <span class="display-3">{{jml_kembali}}</span></v-card-title>

            
          </v-card>
        </v-col>

         <v-col cols="4">
          <v-card
            color="success"
            dark
          >
            <v-card-title class="headline">Persentase : <span class="display-3">{{persen}} % </span></v-card-title>

           
          </v-card>
        </v-col>

     </v-row>
     
    <v-card-title>
        Peminjaman Tools 
      <!-- <v-text-field
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        hide-details
      ></v-text-field> -->
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
        v-if="item.jml>0"
      >
        check_circle
      </v-icon>

      <v-icon
        style="color:red"
        class="mr-2"
        v-else
      >
        error
      </v-icon>


    </template>


    </v-data-table>



      

  </v-card>

  

  </v-app>
</template>

<script>

import axios from "axios";


  export default {



    props: ['previewEditor'],
    data () {
      return {
          search: '',
          jml_pinjam:0,
           jml_kembali:0,
           persen:0,
        dialog: false,
        id:'',
        teknisi:'',
        tgl_jam:'',

         headers: [

          { text: 'Teknisi', value: 'nama_teknisi', align: 'left' },
          { text: 'Tanggal/Jam Pinjam', value: 'tgl_jam', align: 'left' },
          { text: 'Nama Tools', value: 'nama_tools', align: 'left' },
          { text: 'Posisi Rak', value: 'kode_rak', align: 'left' },
          { text: 'Pengembalian', value: 'action', align: 'left' },
          { text: 'Tanggal/Jam Kembali', value: 'tgl_jam_kembali', align: 'left' },

          
           
        ],

        peminjaman_detail:[],


      }
    },

    created(){
        this.load_data();
         this.load_sum();

    },

    methods:{


    //      notif:function(){


    //       this.jmlnotif = setInterval(function(){


    //         let self = this;
    //       axios
    //       .get(`${this.$axios.defaults.baseURL}/transaksi/peminjaman/get_summary_dash`)
    //       .then(response => (
    //           this.jmlnotif = response.data.jmlnotif
    //       ))
    //       .catch(error => console.log(error));

    //       }.bind(this), 9000);
    

    //   },

      confirm (item){
        this.$store.commit('alert/status_alert', false);
        this.$refs.confirmation.dialog_params('Are you sure delete this data?', item); 
      },

       

        load_data : function(id) {

            setInterval(function(){
            let self = this;
            axios
            .get(`${this.$axios.defaults.baseURL}/transaksi/peminjaman/get_peminjaman_detail_dash`)
            .then(response => (this.peminjaman_detail = response.data))
            .catch(error => console.log(error));

            }.bind(this), 9000);
        },

        load_sum : function(id) {

            setInterval(function(){
            let self = this;
            axios
            .get(`${this.$axios.defaults.baseURL}/transaksi/peminjaman/get_peminjaman_sum`)
            .then(response => (this.jml_pinjam = response.data.jml_pinjam, this.jml_kembali = response.data.jml_kembali, this.persen = response.data.persen))
            .catch(error => console.log(error));

            }.bind(this), 9000);
        },

       
    },

    mounted() {
         this.load_data();
         this.load_sum();
    }
  }
</script>