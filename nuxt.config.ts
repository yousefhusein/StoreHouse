// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/google-fonts', 'nuxt-icon', '@pinia/nuxt'],
  plugins: [],
  css: ['@/assets/css/main.css'],
  googleFonts: {
    families: {
      Poppins: ['300', '400', '500', '600', '900'],
      Tajawal: ['300', '400', '500', '600', '900'],
    },
  },
})
