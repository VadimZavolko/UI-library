Vue.component('my-input', {
    props: {
        type: {
            type: String,
            required: true,
            default: 'text',
        },
        placeholder: {
            type: String,
            required: true,
        },
        required: {
            type: Boolean,
            required: false,
        },
        title: {
            type: String,
            required: true,
        },
        value: {
            type: String,
            default: '',
        },
        pattern: {
            type: RegExp,
            default: false,
        },
        errormessage: {
            type: String,
            default: '',
        }
    },
    data: function () {
        return { 
            isInvalid: false,
        }
    },
    methods: {
        checkInput:  function (value) {
            this.isInvalid = (this.required && !value.match(this.pattern)) || value === '';
        },
        updateInput: function (value) {
            this.$emit('input', value)
        },
    },
    template: `
    <label>
        <span>{{title}}<span v-if="required">*</span></span> 
      <input
        :type="type"
        :placeholder="placeholder"
        :required="required" 
        v-on:blur="checkInput($event.target.value)"
        v-on:input="updateInput($event.target.value), checkInput($event.target.value)" 
        :class="{error: isInvalid, invalid: !isInvalid}"
        >
        <span v-if="isInvalid" class="error-text">{{errormessage}}</span> 
    </label>
    `,
  })        