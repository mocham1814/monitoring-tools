<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
    >
      <v-list dense>
        <template v-for="item in items">
          <v-row
            v-if="item.heading"
            :key="item.heading"
            align="center"
          >
            <v-col cols="6">
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-col>
            <v-col
              cols="6"
              class="text-center"
            >
              <a
                href="#!"
                class="body-2 black--text"
              >EDIT</a>
            </v-col>
          </v-row>
          <v-list-group
            v-else-if="item.children"
            :key="item.text"
            v-model="item.model"
            :prepend-icon="item.model ? item.icon : item['icon-alt']"
            append-icon=""
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.text }}
                </v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              v-for="(child, i) in item.children"
              :key="i"
              link
               @click="Pathmenu(child)"
            >
              <v-list-item-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ child.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>

          <v-list-item
            v-else
            :key="item.text"
            link
           
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
               <a :href="item.path" target="_blank" style="text-decoration:none"> {{ item.text }}</a>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      color="blue darken-3"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title
        style="width: 300px"
        class="ml-0 pl-4"
      >
        <span class="hidden-sm-and-down"> <v-toolbar-title><v-avatar  size="115">
                <img src="~/assets/avatar/auto2000.png" alt="avatar"  >
                </v-avatar> </v-toolbar-title></span>
      </v-toolbar-title>
      
      <v-spacer />
     
        <v-btn icon @click="confirm">
        <v-icon>exit_to_app</v-icon>
      </v-btn>

    </v-app-bar>
      <v-content>
      <v-container grid-list-md text-xs-center fluid fill-height justify-start>
       
        <v-layout row wrap>
          <v-flex xs12>
         
            <nuxt/>
           

          </v-flex>
        </v-layout>

      </v-container>
    </v-content>

    <alert ref="alert"/>
 <confirmation ref="confirmation"  @deleteItem='Logout'/>

  
  </v-app>
  
</template>

<script>


import axios from "axios";
import alert from "../components/alert";
import confirmation from "../components/confirmation";
import { mapState } from 'vuex';

const Cookie = process.client ? require('js-cookie') : undefined

  export default {

    components: {
      'alert' : alert,
      'confirmation' : confirmation,
    },

    props: {
      source: String,
    },
    data: () => ({
      dialog: false,
      drawer: null,
     items: [
        { icon: 'mdi-contacts', path: '/auto2000/dashboard', text: 'Dashboard', target: "_blank"  },
        {
          icon: 'mdi-chevron-up',
          'icon-alt': 'mdi-chevron-down',
          text: 'Master Data',
          model: false,
          children: [
            { path: '/karyawan/karyawan_list', text: 'Karyawan' },
            { path: '/users/user_list', text: 'Users' },
            { path: '/rak_tools/rak_tool_list', text: 'Rak Tools' },
            { path: '/tools/tool_list', text: 'Tools' },
          ],
        },

        {
          icon: 'mdi-chevron-up',
          'icon-alt': 'mdi-chevron-down',
          text: 'Transaksi',
          model: false,
          children: [
            { path: '/peminjaman/peminjaman_list', text: 'Peminjaman' },
            { path: '/peminjaman/peminjaman_on_process_list', text: 'Tools Yang Belum Dikembalikan' },
            { path: '/pengembalian/pengembalian_list', text: 'Pengembalian' },
          ],
        },
      
       {
          icon: 'mdi-chevron-up',
          'icon-alt': 'mdi-chevron-down',
          text: 'Laporan',
          model: false,
          children: [
            { path: '/laporan/peminjaman', text: 'Peminjaman' },
          ],
        },
      
      ],
    }),

    created () {
          if (process.client) {
            var auth = localStorage.getItem('auth')    
        }

        if(!auth){
          this.$router.push('/');
        }
    },

    methods:{


      Pathmenu:function(page){

    
          this.$router.push(page.path,);
 
        
      },


      confirm (){
        this.$refs.confirmation.dialog_params('Are you sure logout system ?');
      },
      
      
      Logout (){
        
        Cookie.remove('auth');
        this.$store.commit('login/setAuth', null);
        this.$store.commit('login/setUsername', null);
        this.$store.commit('login/setUserId', null);


        if (process.client) {
            var userid_log = localStorage.getItem('userid')
            var auth = localStorage.getItem('auth')    
        }


        this.$router.push('/');
 

        localStorage.clear();

      },


    }
  }
</script>