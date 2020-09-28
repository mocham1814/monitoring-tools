<template>


 <v-skeleton-loader
       :loading="loading"
      class="mx-auto"
      type="table"
    >

<v-card>

<confirmation ref="confirmation" @deleteItem='deleteItem'/>


    <v-card-title>
     Tools <v-card-title>

           <v-btn class="mx-2" fab dark x-small color="success" @click="addItem()" >
             <v-icon dark>add</v-icon>
           </v-btn>
  
           <v-btn class="mx-2" fab dark x-small color="warning" @click="load_data()"><v-icon dark>refresh</v-icon></v-btn>
           
          </v-card-title>
      <v-spacer></v-spacer>

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
    :items="tools"
    :search="search"
    sort-by="calories"
    class="elevation-1" 
  >

    <template v-slot:item.action="{ item }">
   
      <v-icon
        style="color:blue"
        class="mr-2"
        @click="editItem(item.id)"
      >
        receipt
      </v-icon>
 
      <v-icon
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
  
  
   </v-card>

      </v-skeleton-loader>
  
</template>

<script>

import { mapState } from 'vuex';
import axios from "axios";
import qs from "qs";
import confirmation from "../../components/confirmation";

  export default {
    
    components: {
      'confirmation' : confirmation,
    },
    data () {
      return {
        loading: false,
        search: '',
        headers: [
          { text: 'Nama', value: 'nama', align: 'left' },
          { text: 'Rak/Lokasi', value: 'kode_rak', align: 'left' },
          { text: 'Kondisi', value: 'kondisi', align: 'left' },
          { text: '', value: 'action', sortable: false, align: 'left' },
        ],
        tools: [],
      }
    },

    created () {
      this.load_data()

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
        self.loading = true;
        axios
          .get(`${this.$axios.defaults.baseURL}/master/tools/get_tools`,
              {
              headers: {
                Authorization:  auth
              }
          })
          .then(response => (this.tools = response.data), setTimeout(() => (self.loading = false), 2))
          .catch(error => console.log(error),  self.loading = true);
        
      },


      addItem () {
          this.$router.push('/tools/tool_add');
      },

      editItem (item) {
        this.$router.push({path: '/tools/tool_edit', query: {id:item}})
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
        .get(`${this.$axios.defaults.baseURL}/master/tools/delete_tools/` + item,{
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