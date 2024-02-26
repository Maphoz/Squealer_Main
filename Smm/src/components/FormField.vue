<script>
export default {
  props: {
    width: String,
    name: String,
    inputName: String,
    value: [String, Number],
    handler: Function,
    type: String,
    icon: String,
    error: Boolean,
    errorMessage: String,
  },
  data() {
    return {
      isFocused: false,
    };
  },
  computed: {
    fieldWidth() {
      return this.width || "300px";
    },
  },
  methods: {
    handleFocus() {
      this.isFocused = true;
    },
    handleBlur() {
      this.isFocused = false;
    },
  },
};
</script>

<template>
  <div :style="{ width: fieldWidth }" :class="{ 'is-focused': isFocused, 'has-error': error }" class="field">
    <input
      v-model="value"
      :type="type || 'text'"
      :placeholder="name"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <label>{{ name }}</label>
    <div v-if="error" class="error-text">{{ errorMessage }}</div>
  </div>
</template>

<style scoped>
.field {
  position: relative;
  height: 40px;
  line-height: 80px;
  margin-bottom: 35px;
}

.field input {
  position: absolute;
  width: 100%;
  outline: none;
  font-size: 18px;
  padding: 0 15px;
  line-height: 40px;
  border-radius: 10px;
  transition: 0.2s ease;
  z-index: 5;
  border: 2px solid black;

  &::placeholder {
    color: transparent;
  }

  &:not(:placeholder-shown) + label,
  &:focus + label {
    color: green;
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    transform: translate(-15px, -15px) scale(0.88);
    z-index: 6;
    background: white;
  }

  &:not(:placeholder-shown) {
    &::placeholder {
      color: transparent;
    }
    border: 2px solid black;
  }

  &:focus {
    border: 2px solid black;
  }
}

.field label {
  position: absolute;
  font-size: 20px;
  color: white;
  padding: 0 15px;
  margin: 0 20px;
  transition: 0.2s ease;
}

.field.is-focused input {
  border: 2px solid black;
}

.field.has-error input,
.field.has-error input:focus {
  border: 2px solid red;
}

.error-text {
  font-size: 0.9em;
  color: red;
  padding-top: 12px;
}
</style>
