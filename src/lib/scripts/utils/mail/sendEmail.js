import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
    host: "smtp.yandex.ru",
    port: 465,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: "cc.chain@yandex.by",
      pass: "ybryujqkhvcrtyoo",
    },
});


export default async function sendEmail(data){
    const phone = data.get("phone");
    const email = data.get("email");
    const request = data.get("request");
    const file = data.get("file");
    let buffer ;


    const options = {
        from: 'cc.chain@yandex.by', // sender address
        to: "cc.chain@yandex.by", // list of receivers
        subject: "[Запрос помощи CHAIN CONSTRUCTOR]" + `${(phone)? ": " + phone : ""}`, // Subject line
        text: "Hello world?", // plain text body
        html: `
        <h2>Новый запрос</h2>
        <b>Телефон:</b>${phone}<br>
        <b>Почта:</b>${email}<br><br>
        <b>Сообщение:</b>${request}<br>`, // html body
    }
    

    if(file){
        buffer = await file.arrayBuffer().then( (buffer) => new Uint8Array(buffer));
        options.attachments = [{
          filename: file.name,
          content: buffer
        }]
    }


    try{
        const info = await transporter.sendMail(options);
    } catch (e){
        console.log("[MAIL SEND ERROR]: message", e.message);
        throw new Error("Message is not send");
    }
}
