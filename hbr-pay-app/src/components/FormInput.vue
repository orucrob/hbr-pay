<template>
  <div class="form-input">
    <label :for="name" v-if="label" :class="{ isFile: isFile }">{{
      label
    }}</label>
    <input
      :name="name"
      :id="name"
      :type="type"
      :accept="accept"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="$emit('input', $event.target.value)"
      @change="$emit('change', $event)"
    />
  </div>
</template>

<script>
export default {
  name: "FormInput",
  props: {
    value: String,
    placeholder: String,
    name: String,
    label: String,
    accept: String,
    type: {
      type: String,
      default: "text"
    },
    disabled: Boolean
  },
  computed: {
    isFile: function() {
      return this.type === "file";
    }
  }
};
</script>

<style scoped>
.form-input {
  margin-top: 10px;
  margin-bottom: 20px;
  width: 300px;
}
label {
  display: block;
  padding-left: 15px;
}
input {
  display: block;
  padding: 8px;
  padding-left: 15px;
  width: 100%;
}
input[type="file"] {
  width: 0px;
  height: 0px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}
.isFile {
  display: block;
  padding: 8px;
  padding-left: 15px;
  background-color: transparent;
  width: 100%;
}
label.isFile {
  width: 150px;
}

input::placeholder {
}
input:focus {
  /* border-radius: 15px; */
  outline: none;
}

input {
  border: 1px solid black;
  color: black;
}
input:focus {
  box-shadow: 0px 0px 3px 0px black;
}
</style>
