const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// 🔹 CREATE TRANSPORT (EDIT THIS)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "ibrahim.alyazeedi1@gmail.com",
        pass: "irzn eogp lcnj vfjm"
    }
});

app.post("/order", async (req, res) => {
    const { name, phone, address, paymentType, cart } = req.body;

    // ✅ CALCULATE TOTAL
    let subtotal = 0;

    Object.entries(cart).forEach(([id, item]) => {
        if (item && item.qty && item.price) {
            subtotal += item.qty * item.price;
        }
    });

    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    // ✅ FORMAT ITEMS
    let itemsText = "";

    Object.entries(cart).forEach(([id, item]) => {
        if (item && item.qty && item.price) {
            itemsText += `${id.replace(/_/g, " ")} x${item.qty} = ${(item.qty * item.price).toFixed(2)} OMR\n`;
        }
    });

    // ✅ EMAIL CONTENT
    const mailOptions = {
        from: "ibrahim.alyazeedi1@gmail.com",
        to: "ibrahim.alyazeedi1@gmail.com",
        subject: "New Order",
        text: `
New Order Received:

Name: ${name}
Phone: ${phone}
Address: ${address}

Payment Type: ${paymentType}

Items:
${itemsText}

Subtotal: ${subtotal.toFixed(2)} OMR
Tax (5%): ${tax.toFixed(2)} OMR
Total: ${total.toFixed(2)} OMR
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.send("Order received");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error sending email");
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
