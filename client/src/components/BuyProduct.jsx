
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


    const onApprove = paymentData => {
        if (!props.product || !props.product.products) {
            console.error("Cart products data is missing")
            setPayPalMessageType("ERROR")
            setRedirectToPayPalMessage(true)
            return
        }

        const productIds = props.product.products.map(product => product._id);

        axios.post(`${SERVER_HOST}/orders/paypal/${paymentData.orderID}/cart/${props.product.price}`, {
            customerName: paymentData.payer?.name?.given_name || "PayPal Customer",
            customerEmail: paymentData.payer?.email_address || "",
            userID: localStorage.userID || null,
            productIds: productIds
        }, {headers: {"authorization": localStorage.token, "Content-type": "application/json"}})
            .then(res => {
                setPayPalMessageType("SUCCESS")
                setPayPalOrderID(paymentData.orderID)
                setRedirectToPayPalMessage(true)
            })
            .catch(err => {
                console.error("PayPal order creation error:", err)
                setPayPalMessageType("ERROR")
                setRedirectToPayPalMessage(true)
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
