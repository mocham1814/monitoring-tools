<template>
<v-snackbar
      :value="snackbars"
      :bottom="'bottom'"
      :right="'right'"
      :color="colors"
      :timeout="timeout"

    >
      {{msgs}}
      <v-btn
        dark
        text
        @click="closed_alert"
      >
        x
      </v-btn>
    </v-snackbar>

</template>

<script>

import { mapState } from 'vuex';

  export default {
    data () {
      return {
        closed : false,
        timeout: 5000,
      }
    },
    computed: {
        snackbars: function () {
            return this.$store.state.alert.stsalert;
        },
        msgs: function () {
            return this.$store.state.alert.msg;
        },
        colors: function () {
            return this.$store.state.alert.color;
        },
    },
    methods:{
      closed_alert: function () {
           this.$store.commit('alert/closed_alert')
        
        },
    }

  }
</script>