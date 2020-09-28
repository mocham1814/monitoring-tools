<template>


<v-card>

<confirmation ref="confirmation" @deleteItem='deleteItem'/>
<detail ref="detail"/>



    <v-card-title>
     Peminjaman Tools <v-card-title>

           <v-btn class="mx-2" fab dark x-small color="success" @click="addItem()" >
             <v-icon dark>add</v-icon>
           </v-btn>
  
           <v-btn class="mx-2" fab dark x-small color="warning" @click="caridata()"><v-icon dark>refresh</v-icon></v-btn>
           
          </v-card-title>
      <v-spacer></v-spacer>

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
            @blur="caridata()"
            v-on="on"
           
          ></v-text-field>
        </template>
        <v-date-picker v-model="peminjaman.tanggal"></v-date-picker>
      </v-menu>
 <v-spacer></v-spacer>
      <v-menu
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >

       <v-spacer></v-spacer>

       
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="peminjaman.tanggal2"
            label="Tanggal Peminjaman Akhir"
            readonly
            v-on="on"
            @blur="caridata()"

          ></v-text-field>
        </template>
        <v-date-picker v-model="peminjaman.tanggal2"></v-date-picker>
      </v-menu>

      
       <v-spacer></v-spacer>

      <v-text-field
            v-model="search"
            :counter="50"
            label="Search"
            required
            ></v-text-field>


    </v-card-title>



 <v-skeleton-loader
       :loading="loading"
      class="mx-auto"
      type="table"
    >
  <v-data-table
    :headers="headers"
    :items="tools"
    :search="search"
    sort-by="calories"
    class="elevation-1" 

  >

  <template v-slot:item.status="{ item }">

     <v-btn v-if="item.sts =='FINISH'"
      class="ma-2"
       x-small
       color="success"

    >DONE</v-btn>

         <v-btn v-else
      class="ma-2"
       x-small
       color="warning"

    >ON PROCESS</v-btn>

    </template>

    <template v-slot:item.action="{ item }">

        <v-btn
      class="ma-2"
       x-small
       color="primary"
       @click="detail(item)"
    >Detail transaksi</v-btn>
   
      <v-icon
        v-if="item.sts!='FINISH'"
        style="color:blue"
        class="mr-2"
        @click="editItem(item.id)"
      >
        receipt
      </v-icon>
 
      <v-icon v-if="item.jml2<1"
        style="color:red"
        class="mr-2"
        @click="confirm(item.id)"
      >
        delete
      </v-icon>

      



    </template>
    <template v-slot:no-data>
       <v-chip
      class="ma-2"
      color="red"
      text-color="white"
    >
      Empty Data
    </v-chip>
    </template>



  </v-data-table>
   </v-skeleton-loader>
  
   </v-card>

     
  
</template>

<script>

import { mapState } from 'vuex';
import axios from "axios";
import qs from "qs";
import confirmation from "../../components/confirmation";
import detail from "../../components/detail";


  export default {
    
    components: {
      'confirmation' : confirmation,
      'detail' : detail,
    },
    data () {
      return {
        loading: false,
        search: '',
        peminjaman:{
        tanggal: '',
        tanggal2: '',
        },
        headers: [
          { text: 'Id Peminjaman', value: 'id', align: 'left' },
          { text: 'Nama Teknisi', value: 'nama', align: 'left' },
          { text: 'Tanggal/Jam', value: 'tgl_jam', align: 'left' },
          { text: 'Keterangan', value: 'note', align: 'left' },
          { text: 'Status', value: 'status', sortable: false, align: 'left' },
          { text: '', value: 'action', sortable: false, align: 'left' },
           
        ],

 
        tools: [],
      }
    },

    created () {
      this.load_data();

var today = new Date();
var dd = today.getDate();

var mm = today.getMonth()+1; 
var yyyy = today.getFullYear();
today = yyyy+'-'+mm+'-'+dd;


      this.peminjaman.tanggal = today;
      this.peminjaman.tanggal2 = today;

    },

    methods: {

      load_data: function(id_jabatan) {

        if(id_jabatan==undefined){
          var params_jbt = 'empty';
        }else{
          var params_jbt = id_jabatan;
        }


        if (process.client) {
            var auth = localStorage.getItem('auth')    
        }

         let self = this;
            axios
            .get(`${this.$axios.defaults.baseURL}/transaksi/peminjaman/get_peminjaman`,
             {
              headers: {
                Authorization:  auth
              }
          })
          .then(response => (this.tools = response.data), setTimeout(() => (self.loading = false), 2))
          .catch(error => console.log(error),  self.loading = true);
        
      },


      addItem () {
          this.$router.push('/peminjaman/peminjaman_add');
      },

      editItem (item) {
        this.$router.push({path: '/peminjaman/peminjaman_edit', query: {id:item}})
      },

      detail(item) {
             this.$refs.detail.TrueDetail(item);
      },

      caridata(){

          if (process.client) {
            var auth = localStorage.getItem('auth')    
        }
        

        let self = this;
        self.loading = true;
         axios
            .post(`${this.$axios.defaults.baseURL}/transaksi/peminjaman/get_peminjaman_search`, qs.stringify(self.peminjaman)
             ,{
                headers: {
                  Authorization:  auth
                }
              }
            )
          .then(response => (this.tools = response.data), setTimeout(() => (self.loading = false), 2))
          .catch(error => console.log(error),  self.loading = true);

      },  

      
      confirm (item){
        this.$store.commit('alert/status_alert', false);
        this.$refs.confirmation.dialog_params('Are you sure delete this data?', item); 
      },

      deleteItem (item) {

        if (process.client) {
            var auth = localStorage.getItem('auth')    
        }

        let self = this;
        axios
        .get(`${this.$axios.defaults.baseURL}/transaksi/peminjaman/delete_peminjaman/` + item,{
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

    },
  }
</script>