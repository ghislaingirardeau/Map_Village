<template>
  <div>
    <!-- reset otions -->
    <div v-if="removeBtn">
      <p>
        All you coordinates added will be erase. The markers data will be remain
      </p>
      <v-btn @click="removeGeoJson" color="warning">
        Confirm remove data
      </v-btn>
      <p>Coordinates and Markers will be delete</p>
      <v-btn @click="resetApp" color="error"> Reset All </v-btn>
    </div>

    <!-- External options -->
    <export-file v-if="modalExport" />

    <!-- External options -->
    <import-files v-if="modalImport" />

    <!-- Menu -->
    <v-list v-if="showMenu">
      <h3>Settings</h3>
      <v-list-item
        v-for="(item, i) in settings"
        :key="i"
        :to="item.to"
        router
        exact
      >
        <v-list-item-action>
          <v-icon color="secondary">{{ item.icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title v-text="item.title" />
        </v-list-item-content>
      </v-list-item>

      <h3>Actions</h3>
      <v-list-item
        v-for="item in actions"
        :key="item.title"
        @click="doThisFunction(item.id)"
      >
        <v-list-item-action>
          <v-icon color="secondary">{{ item.icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title v-text="item.title" />
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import importFiles from './external/importFiles.vue'

export default {
  components: { importFiles },
  data() {
    return {
      modalExport: false,
      modalImport: false,
      removeBtn: false,
      showMenu: true,
    }
  },
  computed: {
    ...mapState(['userAuth', 'markers']),
    settings() {
      let menu = [
        {
          icon: 'mdi-login',
          title: 'login / Sign-in',
          to: '/account',
        },
        {
          icon: 'mdi-database-eye',
          title: 'Manage folders & datas',
          to: '/datas',
        },
        {
          icon: 'mdi-database-marker',
          title: 'Markers table',
          to: '/configuration',
        },
      ]
      this.userAuth
        ? menu.splice(0, 1, {
            icon: 'mdi-account',
            title: 'My Profil',
            to: '/account',
          })
        : ''
      return menu
    },
    actions() {
      let menu = [
        {
          id: '1',
          icon: 'mdi-file-send-outline',
          title: 'Export Datas to CSV',
        },
        {
          id: '2',
          icon: 'mdi-file-table',
          title: 'Import CSV File',
        },
        {
          id: '3',
          icon: 'mdi-eraser',
          title: 'Reset Options',
        },
      ]
      this.userAuth
        ? menu.push({
            id: '4',
            icon: 'mdi-logout',
            title: 'Logout',
          })
        : ''
      return menu
    },
  },
  methods: {
    ...mapActions(['appReset', 'geoJsonReset']),

    resetApp() {
      let confirm = window.confirm('This action will reset the app')
      if (confirm) {
        this.appReset()
        this.refreshMap()
      } else {
        console.log('Cancel')
      }
    },
    removeGeoJson() {
      let confirm = window.confirm('This action will delete only your datas')
      if (confirm) {
        this.geoJsonReset()
        this.showMenu = false
        this.removeBtn = false
        this.refreshMap()
      } else {
        console.log('Cancel')
      }
    },
    doThisFunction(e) {
      switch (e) {
        case '1':
          this.modalExport = true
          this.showMenu = false
          break
        case '2':
          this.modalImport = true
          this.showMenu = false
          break
        case '3':
          this.removeBtn = true
          this.showMenu = false
          break
        case '4':
          this.signOut()
          break
      }
    },
  },
}
</script>

<style lang="scss" scoped>
</style>