<template>


  <v-row justify="center">
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      
      <v-card>
        <v-toolbar dark color="primary" style="height:100px;padding-top:20px">
        
          <v-toolbar-title>ID Peminjaman : {{id}}<br> Teknisi : {{teknisi}}<br> Tanggal : {{tgl_jam}}</v-toolbar-title>
          <div class="flex-grow-1"></div>
    
           <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
   
        <v-divider></v-divider>
        <v-list three-line subheader>

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


        <template v-slot:item.delete="{ item }">

           <v-icon
           v-if="item.jml==0"
        style="color:red"
        class="mr-2"
        @click="confirm(item.idx)"
      >
        delete
      </v-icon>

                <confirmation ref="confirmation" @deleteItem='deleteItem'/>
        </template>

    </v-data-table>

  </v-card>
          <!-- {{previewEditor}} -->
          <!-- <v-html="previewEditor"></v-html> -->
          
        </v-list>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>

import axios from "axios";
import confirmation from "../components/confirmation";

  export default {

      components: {
      'confirmation' : confirmation,
    },

    props: ['previewEditor'],
    data () {
      return {
          search: '',
        dialog: false,
        id:'',
        teknisi:'',
        tgl_jam:'',

         headers: [
          { text: 'Nama Tools', value: 'nama', align: 'left' },
          { text: 'Posisi Rak', value: 'kode_rak', align: 'left' },
          { text: 'Pengembalian', value: 'action', align: 'left' },
          { text: '', value: 'delete', align: 'left' },
           
        ],

        peminjaman_detail:[],


      }
    },

    methods:{

      confirm (item){
        this.$store.commit('alert/status_alert', false);
        this.$refs.confirmation.dialog_params('Are you sure delete this data?', item); 
      },

        TrueDetail(item){

            this.dialog = true;
            this.id = item.id;
            this.teknisi = item.nama;
            this.tgl_jam = item.tgl_jam;

            this.load_data(item.id);

        },

        load_data : function(id) {
            let self = this;
            axios
            .get(`${this.$axios.defaults.baseURL}/transaksi/peminjaman/get_peminjaman_detail/`+this.id)
            .then(response => (this.peminjaman_detail = response.data))
            .catch(error => console.log(error));
        },

        deleteItem (item) {

        if (process.client) {
            var auth = localStorage.getItem('auth')    
        }

        let self = this;
        axios
        .get(`${this.$axios.defaults.baseURL}/transaksi/peminjaman/delete_peminjaman_detail/` + item,{
            headers: {
              Authorization:  auth
            }
        })
        .then(function(response) {
        response => console.log(response);
        self.load_data();
        
        let sts = true;
        let pesan = 'Data has been deleted';
        let warna = 'success';
        self.$store.commit('alert/status_alert', { sts, pesan, warna })
        
        })


      },
    }
  }
</script>