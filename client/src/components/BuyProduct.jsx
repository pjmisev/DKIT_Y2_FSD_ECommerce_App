
import React, {useState} from "react"
import axios from "axios"
import {Navigate} from "react-router-dom"
import {PayPalButtons} from "@paypal/react-paypal-js"
import {SERVER_HOST} from "../config/global_constants.js";


export const BuyProduct = props =>
{
    const [redirectToPayPalMessage, setRedirectToPayPalMessage] = useState(false)
    const [payPalMessageType, setPayPalMessageType] = useState(null)
    const [payPalOrderID, setPayPalOrderID] = useState(null)


    const createOrder = (data, actions) =>
    {
        return actions.order.create({purchase_units: [{amount: {value: props.price}}]})
    }


    const onApprove = (data, actions) => {
        if (!props.product || !props.product.products) {
            console.error("Cart products data is missing")
            setPayPalMessageType("ERROR")
            setRedirectToPayPalMessage(true)
            return
        }

        const productIds = props.product.products.map(product => product._id);

        // Fetch detailed PayPal order information
        return actions.order.get(data.orderID).then(orderDetails => {
            const payer = orderDetails.payer;
            const purchaseUnit = orderDetails.purchase_units[0];
            const shipping = purchaseUnit.shipping;
            const billing = purchaseUnit.billing_address || shipping?.address;

            // Extract comprehensive customer information from PayPal
            const customerData = {
                // Name information
                firstName: payer.name.given_name || "",
                lastName: payer.name.surname || "",
                fullName: payer.name.given_name + " " + (payer.name.surname || ""),
                
                // Contact information
                email: payer.email_address || "",
                phone: payer.phone?.phone_number?.national_number || payer.phone?.phone_number?.full_number || "",
                
                // Address information (prefer shipping, fallback to billing)
                addressLine1: shipping?.address?.address_line_1 || billing?.address_line_1 || "",
                addressLine2: shipping?.address?.address_line_2 || billing?.address_line_2 || "",
                city: shipping?.address?.admin_area_2 || billing?.admin_area_2 || "",
                state: shipping?.address?.admin_area_1 || billing?.admin_area_1 || "",
                postcode: shipping?.address?.postal_code || billing?.postal_code || "",
                country: shipping?.address?.country_code || billing?.country_code || "",
                
                // PayPal specific data
                payerID: payer.payer_id,
                paymentID: data.orderID
            };

            axios.post(`${SERVER_HOST}/orders/paypal/${data.orderID}/cart/${props.price}`, {
                // Customer information from PayPal
                customerName: customerData.fullName,
                customerFirstName: customerData.firstName,
                customerLastName: customerData.lastName,
                customerEmail: customerData.email,
                customerPhone: customerData.phone,
                
                // Address information
                addressLine1: customerData.addressLine1,
                addressLine2: customerData.addressLine2,
                city: customerData.city,
                county: customerData.state,
                postcode: customerData.postcode,
                country: customerData.country,
                
                // Additional data
                userID: localStorage.userID || null,
                productIds: productIds,
                paypalPayerID: customerData.payerID,
                
                // Pricing breakdown from cart calculation
                pricing: props.pricing || null
            }, {headers: {"authorization": localStorage.token, "Content-type": "application/json"}})
                .then(res => {
                    // Clear the cart after successful order
                    localStorage.removeItem('cart');
                    setPayPalMessageType("SUCCESS")
                    setPayPalOrderID(data.orderID)
                    setRedirectToPayPalMessage(true)
                })
                .catch(err => {
                    console.error("PayPal order creation error:", err)
                    setPayPalMessageType("ERROR")
                    setRedirectToPayPalMessage(true)
                })
        }).catch(err => {
            console.error("Error fetching PayPal order details:", err)
            // Fallback to current behavior if detailed fetch fails
            axios.post(`${SERVER_HOST}/orders/paypal/${data.orderID}/cart/${props.price}`, {
                customerName: data.payer?.name?.given_name || "PayPal Customer",
                customerEmail: data.payer?.email_address || "",
                userID: localStorage.userID || null,
                productIds: productIds
            }, {headers: {"authorization": localStorage.token, "Content-type": "application/json"}})
                .then(res => {
                    localStorage.removeItem('cart');
                    setPayPalMessageType("SUCCESS")
                    setPayPalOrderID(data.orderID)
                    setRedirectToPayPalMessage(true)
                })
                .catch(err => {
                    console.error("PayPal order creation error:", err)
                    setPayPalMessageType("ERROR")
                    setRedirectToPayPalMessage(true)
                })
        })
    }


    const onError = err =>
    {
        setPayPalMessageType("ERROR")
        setRedirectToPayPalMessage(true)
    }


    const onCancel = cancelData =>
    {
        setPayPalMessageType("CANCEL")
        setRedirectToPayPalMessage(true)
    }


    return (
        <div>
            {redirectToPayPalMessage ? <Navigate to={`/PayPalMessage/${payPalMessageType}/${payPalOrderID}`}/> : null}
            <PayPalButtons style={{layout: "horizontal"}} createOrder={createOrder} onApprove={onApprove} onError={onError} onCancel={onCancel}/>

        </div>
    )
}
