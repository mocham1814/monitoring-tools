<template>
  <div>
<v-card>
    <v-card-title>
      Nutrition {{this.search}}
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="desserts"
      :options.sync="options"
      :server-items-length="totalDesserts"
      :loading="loading"
      :search="search"
      class="elevation-1"
    ></v-data-table>

    <!-- <pre>{{ options }}</pre> -->
    </v-card>
  </div>
</template>

<script>

import axios from "axios";
  export default {
    data () {
      return {
        search:'',
        totalDesserts: 0,
        desserts: [],
        loading: true,
        options: {},
        pagination: {},
    headers: [

          { text: 'id', value: 'id', align: 'left' },
          { text: 'id_tools', value: 'id_tools', align: 'left' },

        ],
      }
    },
    watch: {
      options: {
        handler () {
          this.getDataFromApi()
            .then(data => {
              this.desserts = data.items
              this.totalDesserts = data.total
            })
        },
        deep: true,
      },

       search() {
            this.getDataFromApi()
            .then(data => {
              this.desserts = data.items
              this.totalDesserts = data.total
            })
        }
    },
     mounted () {
      this.getDataFromApi()
        .then(data => {
          this.desserts = data.items
          this.totalDesserts = data.total
        })
    },


    methods: {
      getDataFromApi () {
        this.loading = true
        return  new Promise  (async (resolve, reject) => {
          const { sortBy, sortDesc, page, itemsPerPage } = this.options

          const start = (page * itemsPerPage) - (itemsPerPage)
          const end = (itemsPerPage)

          let search = await this.search.trim().toLowerCase();


          
          let items;

          if (search) {
            items =  await this.getDesserts_filter(search, start, end)

          }else{
            items =  await this.getDesserts(start, end)
          }

  

          
          const total =  await this.getTotalDesserts(search)
         

    
          if (sortBy.length === 1 && sortDesc.length === 1) {
            items = items.sort((a, b) => {
              const sortA = a[sortBy[0]]
              const sortB = b[sortBy[0]]

              if (sortDesc[0]) {
                if (sortA < sortB) return 1
                if (sortA > sortB) return -1
                return 0
              } else {
                if (sortA < sortB) return -1
                if (sortA > sortB) return 1
                return 0
              }
            })
          }

          // if (itemsPerPage > 0) {
          //   items = items.slice((page - 1) * itemsPerPage, page * itemsPerPage)
          // }

          setTimeout(() => {
            this.loading = false
            resolve({
              items,
              total,
            })
          }, 200)
        })
      },
      async getDesserts (start, end) {

        var request = await axios
            .get(`${this.$axios.defaults.baseURL}/transaksi/peminjaman/get_peminjaman_all/`+start+'/'+end)
            .then(response => ( response.data))


            return request;

      },


      async getDesserts_filter(search, start, end) {
         var request = await axios
            .get(`${this.$axios.defaults.baseURL}/transaksi/peminjaman/get_peminjaman_filter`, {
            params: {
                        search: search,
                         start: start,
                          end: end
                    }
                    })
            .then(response => ( response.data))


            return request;
     },
      

     async getTotalDesserts(search) {
         var request = await axios
            .get(`${this.$axios.defaults.baseURL}/transaksi/peminjaman/get_peminjaman_total`, {
            params: {
                        search: search
                    }
                    })
            .then(response => ( response.data))


            return request;
     }
      
    },
  }
</script>