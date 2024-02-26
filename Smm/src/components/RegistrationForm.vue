<script>
import FormField from "@/components/FormField"; // Update the path based on your project structure

export default {
  components: {
    FormField,
  },
  data() {
    return {
      name: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
  },
  methods: {
    submitForm() {
      // Implement your form submission logic here
      console.log("Form submitted:", {
        name: this.name,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
        confirmPassword: this.confirmPassword,
      });
    },
  },
};
</script>

<template>
  <div class="registration-form">
    <form>
      <FormField v-model="name" name="Name" inputName="name" />
      <FormField v-model="lastName" name="Last Name" inputName="lastName" />
      <FormField v-model="email" name="Email" inputName="email" type="email" />
      <FormField v-model="password" name="Password" inputName="password" type="password" />
      <FormField v-model="confirmPassword" name="Confirm Password" inputName="confirmPassword" type="password" />

      <button type="submit" @click.prevent="submitForm">Register</button>
    </form>
  </div>
</template>

<style scoped>
.registration-form {
  max-width: 60%;
  margin: auto;
  padding: 20px;
}

@media only screen and (max-width: 768px) {
  .registration-form {
    max-width: 90%;
  }
}
</style>
