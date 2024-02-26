<template>
  <div class="main-page">
    <div class="centered-content">
      <h1>Registrati</h1>
      <RegistrationForm />
    </div>
  </div>
</template>

<script>
import RegistrationForm from "@/components/RegistrationForm"; // Update the path based on your project structure

export default {
  components: {
    RegistrationForm,
  },
};
</script>

<style scoped>
.main-page {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.centered-content {
  text-align: center;
}
</style>
