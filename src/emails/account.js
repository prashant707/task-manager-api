const sgMail=require("@sendgrid/mail")
// const sendgridAPIKey="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"

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail=(email,name)=>{
    sgMail.send({
        to:email,
        from:'gehlotprashantk@gmail.com',
        subject:'Thanks for joining in!',
        text:`Welcome to the app,${name}.let me know how you get along with the app.`
    })
}

const sendCancellationEmail=(email,name)=>{
    sgMail.send({ to:email,
        from:'gehlotprashantk@gmail.com',
        subject:'Sorry to see you go',
        text:`Goodbye ${name} .I hope to see you sometime soon.`

    })
}

//sgMail.send(email)
    

module.exports={
    sendWelcomeEmail,
    sendCancellationEmail
}