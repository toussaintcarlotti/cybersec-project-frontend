<template>
  <div class="pt-16 px-2 flex justify-center">

    <form @submit.prevent="login" class="card-simple w-full sm:w-1/2 md:w-2/5 lg:w-[400px]">
      <h1 class="bold text-center text-2xl">Se Connecter</h1>
      <div class="border w-3/4 mx-auto my-4 border-fuchsia-800"></div>
      <ErrorComponent v-if="state.error" :error="state.error"/>
      <InfoComponent @click="state.info = false" v-if="state.info" message="Un email de confirmation vous a été envoyé"/>
      <div v-else>
        <div class="mb-4">
          <label class="block text-sm font-bold mb-2" for="email">
            Email
          </label>
          <input v-model="form.email" class="input-card" id="email" type="email">
        </div>
        <div class="mb-6">
          <label class="block text-sm font-bold mb-2" for="password">
            Mot de Passe
          </label>
          <input v-model="form.password" class="input-card" id="password" type="password"
                 placeholder="**************">
        </div>
        <div class="">
          <ButtonLoading class="mx-auto" :loading="state.loading"
                         value="Connexion"/>
        </div>
        <div class="flex justify-end mt-4">
          <router-link class="text-purple-500 font-bold hover:text-purple-700" to="/reset-password/email/send">Mot de passe oublié ?</router-link>
        </div>
      </div>

      <div class="border my-3"></div>
      <div class="text-center">
        <router-link to="/profile/create" class="bt-simple bg-gray-100 hover:bg-gray-400 text-black " type="button">
          Créer un compte
        </router-link>
      </div>
    </form>
  </div>

</template>
<script>
import axios from "@/api/axios";
import router from "@/router";
import ErrorComponent from "@/components/alert/ErrorComponent";
import InfoComponent from "@/components/alert/InfoComponent";
import ButtonLoading from "@/components/form/ButtonLoading";


export default {
  components: {ErrorComponent, InfoComponent, ButtonLoading},
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
      confirmEmailForm: {
        email: '',
        confirm_email_token: '',
      },
      state: {
        error: null,
        success: false,
        loading: false,
        info: false
      },
    }
  },
  async mounted() {
    if (this.$route.query.newUser){
      this.state.info = true
    }
    if (this.$route.query.confirmation_token){
      this.confirmEmailForm.email = this.$route.query.email;
      this.confirmEmailForm.confirm_email_token = this.$route.query.confirmation_token
      await axios.post('api/confirm-email', this.confirmEmailForm).then((res) => {
        console.log(res)
      }).catch((err) => {
        this.state.error = err.response.data
      }).finally(() => {
        this.state.loading = false;
      });
    }
  },
  methods: {
    async login() {
      this.state.loading = true;
      await axios.post('api/login', this.form).then((res) => {
        if (res.data && res.data.message == 'Connexion réussie') {
          this.$store.commit('authenticateUser', res.data);
        } else {
          console.error(res.data)
          this.state.error = "Une erreur est survenu"
        }
      }).catch((err) => {
        this.state.error = err.response.data
      }).finally(() => {
        this.state.loading = false;
      });
      router.push('/');
    }
  }
}
</script>