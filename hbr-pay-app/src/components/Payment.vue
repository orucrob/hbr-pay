<template>
    <div class="container">
        <div v-for="pm in savedPaymentMethods" :key="pm.nonce">{{JSON.stringify(pm.details)}}</div>
        <!-- Bootstrap inspired Braintree Hosted Fields example -->
        <div class="panel panel-default bootstrap-basic">
            <div class="panel-heading">
                <h3 class="panel-title">Enter Card Details</h3>
            </div>
            <form class="panel-body">
                <div class="row">
                    <div class="form-group col-sm-8">
                        <label class="control-label">Card Number</label>
                        <!--  Hosted Fields div container -->
                        <div class="form-control" id="card-number"></div>
                        <span class="helper-text"></span>
                    </div>
                    <div class="form-group col-sm-4">
                        <div class="row">
                            <label class="control-label col-xs-12">Expiration Date</label>
                            <div class="col-xs-6">
                                <!--  Hosted Fields div container -->
                                <div class="form-control" id="expiration-month"></div>
                            </div>
                            <div class="col-xs-6">
                                <!--  Hosted Fields div container -->
                                <div class="form-control" id="expiration-year"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col-sm-6">
                        <label class="control-label">Security Code</label>
                        <!--  Hosted Fields div container -->
                        <div class="form-control" id="cvv"></div>
                    </div>
                </div>

                <button value="submit" @click="pay" class="btn btn-success btn-lg center-block">
                    Pay with
                    <span>{{cardType}}</span>
                </button>
            </form>
        </div>

        <div id="dropin-container"></div>
        <input type="number" v-model="amount">
        <button id="submit-button" @click="requestPaymentMethodAndPay">Pay</button>
        <div>{{ message }}</div>
    </div>
</template>

<script>
//import dropin from "braintree-web-drop-in";
import btClient from "braintree-web";
const BT_AUTHORIZATION = "";
const API = "";

export default {
    name: "Payment",
    data: () => {
        return {
            hostedFieldsInstance: undefined,
            vaultManager: undefined,
            message: undefined,
            amount: 20,
            cardType: "Card",
            savedPaymentMethods: []
        };
    },
    async mounted() {
        // this.dropinInstance = await dropin.create({
        //   authorization: BT_AUTHORIZATION,
        //   container: "#dropin-container",
        //   vaultManager: true
        // });
        try {
            let session = await this.$Amplify.Auth.currentSession();
            let idToken = session && session.idToken.jwtToken;

            let resp = await fetch(API + "/pay/clienttoken", {
                method: "GET",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: idToken,
                    Origin: "",
                    Host: API
                }
            });
            let ret = resp && (await resp.json());

            console.log(btClient);

            let authorization = ret.clientToken || BT_AUTHORIZATION;
            let clientInstance = await btClient.client.create({
                authorization
            });
            this.vaultManager = await btClient.vaultManager.create({
                client: clientInstance
            });
            this.savedPaymentMethods = await this.vaultManager.fetchPaymentMethods(
                {}
            );
            console.log("savedPaymentMethods", this.savedPaymentMethods);

            this.hostedFieldsInstance = await btClient.hostedFields.create({
                client: clientInstance,
                styles: {
                    input: {
                        "font-size": "14px",
                        "font-family": "helvetica, tahoma, calibri, sans-serif",
                        color: "#3a3a3a"
                    },
                    ":focus": {
                        color: "black"
                    }
                },
                fields: {
                    number: {
                        selector: "#card-number",
                        placeholder: "4111 1111 1111 1111"
                    },
                    cvv: {
                        selector: "#cvv",
                        placeholder: "123"
                    },
                    expirationMonth: {
                        selector: "#expiration-month",
                        placeholder: "MM"
                    },
                    expirationYear: {
                        selector: "#expiration-year",
                        placeholder: "YY"
                    }
                }
            });
            this.hostedFieldsInstance.on("validityChange", function(event) {
                var field = event.fields[event.emittedBy];
                console.log("validity changed", field);
                // if (field.isValid) {
                //     if (event.emittedBy === 'expirationMonth' || event.emittedBy === 'expirationYear') {
                //         if (!event.fields.expirationMonth.isValid || !event.fields.expirationYear.isValid) {
                //             return;
                //         }
                //     } else if (event.emittedBy === 'number') {
                //         $('#card-number').next('span').text('');
                //     }

                //     // Remove any previously applied error or warning classes
                //     $(field.container).parents('.form-group').removeClass('has-warning');
                //     $(field.container).parents('.form-group').removeClass('has-success');
                //     // Apply styling for a valid field
                //     $(field.container).parents('.form-group').addClass('has-success');
                // } else if (field.isPotentiallyValid) {
                //     // Remove styling  from potentially valid fields
                //     $(field.container).parents('.form-group').removeClass('has-warning');
                //     $(field.container).parents('.form-group').removeClass('has-success');
                //     if (event.emittedBy === 'number') {
                //     $('#card-number').next('span').text('');
                //     }
                // } else {
                //     // Add styling to invalid fields
                //     $(field.container).parents('.form-group').addClass('has-warning');
                //     // Add helper text for an invalid card number
                //     if (event.emittedBy === 'number') {
                //     $('#card-number').next('span').text('Looks like this card number has an error.');
                //     }
                // }
            });
            // hostedFieldsInstance.on('cardTypeChange', function (event) {
            //     console.log('card type change', event.cards)
            //     // Handle a field's change, such as a change in validity or credit card type
            //     // if (event.cards.length === 1) {
            //     //     $('#card-type').text(event.cards[0].niceType);
            //     // } else {
            //     //     $('#card-type').text('Card');
            //     // }
            // });
            this.hostedFieldsInstance.on(
                "cardTypeChange",
                this.cardTypeChange.bind(this)
            );

            console.log(clientInstance, this.hostedFieldsInstance);
        } catch (e) {
            console.log("Error", e);
        }
    },
    methods: {
        cardTypeChange(event) {
            console.log("card type change", event.cards);
            // Handle a field's change, such as a change in validity or credit card type
            if (event.cards.length === 1) {
                this.cardType = event.cards[0].niceType;
            } else {
                this.cardType = "Card";
            }
        },
        async pay() {
            try {
                let payload = await this.hostedFieldsInstance.tokenize();
                console.log(
                    "Payload: ",
                    JSON.stringify({
                        amount: "30",
                        nonce: payload.nonce,
                        storeInVault: "true"
                    })
                );
                let session = await this.$Amplify.Auth.currentSession();
                let idToken = session && session.idToken.jwtToken;
                console.log("Token: ", idToken);
                // if(idToken){
                //     let resp = await fetch(API + "/pay/sale", {
                //         method: "POST",
                //         body: JSON.stringify({
                //         amount: "30", nonce: payload.nonce, storeInVault:'true' }), // data can be `string` or {object}!
                //         headers: {
                //             "Content-Type": "application/json",
                //             "Authorization": idToken
                //         }
                //     })
                //     let ret = resp && (await resp.json());
                //     console.log("ret", ret);
                //     if (ret && ret.success) {
                //         this.message = "Success! - " + ret.status;
                //     } else if (ret) {
                //         this.message =
                //             "Failed! - " + ret.status + " - " + ret.message;
                //     } else {
                //         this.message = "Error!!!";
                //     }
                // }
            } catch (err) {
                console.log("err", err);
            }
        },
        async requestPaymentMethodAndPay() {
            try {
                let payload = await this.dropinInstance.requestPaymentMethod();
                console.log("request maument method", payload);
                let nonce = payload.nonce;
                let resp = await fetch(API + "/pay", {
                    method: "POST",
                    body: JSON.stringify({ amount: this.amount, nonce }), // data can be `string` or {object}!
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

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
// methods: { // signOut () { // this.$Amplify.Auth.signOut() // .then(() => {
// this.$snotify.success('Logged out!'); // this.$router.push('/login') //
//}).catch((err) => { // console.log(err) // }) // } // }, // mounted () { //
//this.signOut() // }
</script>

<style>
.panel {
    width: 80%;
    margin: 2em auto;
}

.bootstrap-basic {
    background: white;
}

.panel-body {
    width: 90%;
    margin: 2em auto;
}

.helper-text {
    color: #8a6d3b;
    font-size: 12px;
    margin-top: 5px;
    height: 12px;
    display: block;
}

/* Braintree Hosted Fields styling classes*/
.braintree-hosted-fields-focused {
    border: 1px solid #0275d8;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
        0 0 8px rgba(102, 175, 233, 0.6);
}

.braintree-hosted-fields-focused.focused-invalid {
    border: 1px solid #ebcccc;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
        0 0 8px rgba(100, 100, 0, 0.6);
}

@media (max-width: 670px) {
    .btn {
        white-space: normal;
    }
}
</style>
