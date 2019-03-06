<template>
    <section class="container">
        <div id="dropin-container"></div>
        <input type="number" v-model="amount">
        <button id="submit-button" @click="requestPaymentMethodAndPay">Pay</button>
        <div>{{ message }}</div>
    </section>
</template>

<script>
import dropin from "braintree-web-drop-in";

const BT_AUTHORIZATION = process.env.BT_AUTHORIZATION
const API = process.env.API

export default {
    components: {},
    data() {
        return {
            dropinInstance: undefined,
            message: undefined,
            amount: 20
        };
    },
    async mounted() {
        this.dropinInstance = await dropin.create({
            authorization: BT_AUTHORIZATION,
            container: "#dropin-container",
            vaultManager: true
        });
    },
    methods: {
        async requestPaymentMethodAndPay() {
            try {
                let payload = await this.dropinInstance.requestPaymentMethod();
                console.log("request maument method", payload);
                let nonce = payload.nonce;
                let resp = await fetch(
                    API+"/pay",
                    {
                        method: "POST",
                        body: JSON.stringify({ amount: this.amount, nonce }), // data can be `string` or {object}!
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                );

                let ret = resp && (await resp.json());
                console.log("ret", ret);
                if (ret && ret.success) {
                    this.message = "Success! - " + ret.status;
                    this.dropinInstance.clearSelectedPaymentMethod();
                } else if (ret) {
                    this.message =
                        "Failed! - " + ret.status + " - " + ret.message;
                } else {
                    this.message = "Error!!!";
                }
            } catch (err) {
                console.log("Error requesting payment method", err);
                this.message = err.message || "Error";
            }
        }
    }
};
</script>

<style>
.container {
    max-width: 600px;
}
</style>
