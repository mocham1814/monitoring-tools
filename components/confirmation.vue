<template>
  <v-layout justify-center>
  
    <v-dialog
      v-model="dialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">Confirmation !</v-card-title>

        <v-card-text>
          {{msg}}
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            text
            @click="dialog = false"
          >
            Disagree
          </v-btn>

          <v-btn
            color="green darken-1"
            text
            @click="deleted"
          >
            Agree
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  export default {
    data () {
      return {
        dialog: false,
        msg : 'Hi,everyone',
        id :null,
        id2 :null,
        id3 :null,
      }
    },
    methods:{
      dialog_params (msg, id, id2, id3){
        this.dialog= true,
        this.msg = msg,
        this.id = id
        this.id2 = id2
        this.id3 = id3

      },
      deleted ()
      {

        this.$emit('deleteItem', this.id, this.id2, this.id3);
        this.dialog = false;
      },
    }
  }
</script>