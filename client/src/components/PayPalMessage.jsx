import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

export const PayPalMessage = () => {
    const { messageType, payPalOrderID } = useParams();

    const [heading, setHeading] = useState("");
    const [message, setMessage] = useState("");
    const [buttonColour, setButtonColour] = useState("red-button");

    useEffect(() => {
        if (messageType === "SUCCESS") {
            setHeading("PayPal Transaction Confirmation");
            setMessage("Your PayPal transaction was successful.");
            setButtonColour("green-button");
        } else if (messageType === "CANCEL") {
            setHeading("PayPal Transaction Cancelled");
            setMessage("You cancelled your PayPal transaction. Therefore, the transaction was not completed.");
            setButtonColour("red-button");
        } else if (messageType === "ERROR") {
            setHeading("PayPal Transaction Error");
            setMessage("An error occurred when trying to perform your PayPal transaction.");
            setButtonColour("red-button");
        }
    }, [messageType]);

    return (
        <div className="payPalMessage">
            <h3>{heading}</h3>
            <p>{message}</p>

            {messageType === "SUCCESS" && (
                <p>
                    Your PayPal payment confirmation ID is:{" "}
                    <span id="payPalPaymentID">{payPalOrderID}</span>
                </p>
            )}

            <p id="payPalPaymentIDButton">
                <Link className={buttonColour} to={"/Products"}>
                    Continue Shopping
                </Link>
            </p>
        </div>
    );
};