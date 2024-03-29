<template>
  <v-col cols="11" sm="6">
    <v-overlay :value="overlay">
      <loader-map />
    </v-overlay>
    <transition name="fade-slideX" mode="out-in">
      <div :key="signType">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-if="!signType"
            v-model="formData.displayName"
            label="name"
            required
          ></v-text-field>
          <v-text-field
            v-model="formData.email"
            :rules="emailRules"
            label="Email"
            required
          ></v-text-field>
          <v-text-field
            v-model="formData.password"
            :rules="passwordRules"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            @click:append="showPassword = !showPassword"
            label="Password"
            required
          ></v-text-field>

          <v-btn color="primary" @click="sendDataForm">
            {{ signType ? 'Login' : 'Register' }}
          </v-btn>
        </v-form>
        <div v-if="signType">
          <span class="info__message">You forgot your password ? </span>
          <v-btn small text color="secondary" @click="forgotPassword"
            >reset here</v-btn
          >
        </div>
        <p v-if="resetMessage" class="info__message--success">
          {{ resetMessage }}
        </p>
        <p>
          {{
            signType
              ? "If you don't have connection ID ? Please click 'Sign Up'"
              : 'Back to the login'
          }}
        </p>
        <v-btn
          class="mb-3"
          color="secondary"
          outlined
          :key="signType"
          @click="signType = !signType"
          >{{ signType ? 'Sign Up' : 'Login' }}</v-btn
        >
      </div>
    </transition>
  </v-col>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      signType: true,
      overlay: false,
      resetMessage: undefined,
      valid: true,
      emailRules: [
        (v) => !!v || 'E-mail est obligatoire',
        (v) => /.+@.+\..+/.test(v) || 'E-mail doit etre valide',
      ],
      showPassword: false,
      passwordRules: [
        (v) => !!v || 'Mot de passe obligatoire',
        (v) =>
          /^.*(?=.{6,})(?=.*\d)(?=.*[a-zA-Z]).*$/.test(v) ||
          'Minimum 6 caracteres dont 1 lettre et une chiffre',
      ],
      formData: {
        email: 'testmymap@mail.com',
        password: 'qwerty123',
        displayName: 'Ghislain',
      },
    }
  },
  methods: {
    ...mapActions(['login', 'signUp']),

    async sendDataForm() {
      const redirectTo = (result) => {
        if (result) {
          this.$router.push('/datas')
        } else {
          this.overlay = false
        }
      }
      if (this.$refs.form.validate()) {
        if (this.signType) {
          // if want to log
          this.overlay = true
          let result = await this.login(this.formData)
          redirectTo(result)
        } else {
          // if want to signup
          this.overlay = true
          let result = await this.signUp(this.formData)
          redirectTo(result)
        }
      }
    },

    // NUXT FIREBASE AUTH
    async forgotPassword() {
      await this.$fire.auth
        .sendPasswordResetEmail(this.formData.email)
        .then(() => {
          console.log('Email to reset the password send')
          this.resetMessage =
            'An email sent, follow the link to reset your password !'
        })
        .catch((error) => {
          console.log(error, 'fail to send the email')
          this.resetMessage = "Fail to reset ! This email doesn't exist"
        })
    },
  },
  mounted() {
    this.resetMessage = undefined
  },
}
</script>

<style lang="scss" scoped>
.fade-slideX-enter-active,
.fade-slideX-leave-active {
  transition: all 0.5s ease;
}

.fade-slideX-enter,
.fade-slideX-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>