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
        const buffer = await file.arrayBuffer().then( (buffer) => new Uint8Array(buffer));
        console.log("file", buffer);


    try{
      const info = await transporter.sendMail({
          from: 'cc.chain@yandex.by', // sender address
          to: "cc.chain@yandex.by", // list of receivers
          subject: "[Запрос помощи CHAIN CONSTRUCTOR]", // Subject line
          text: "Hello world?", // plain text body
          html: `
          <h2>Новый запрос</h2>
          <b>Телефон:</b>${phone}<br>
          <b>Почта:</b>${email}<br><br>
          <b>Сообщение:</b>${request}<br>`, // html body
          attachments: [
              {
                  filename: file.name,
                  content: buffer
              }
          ]
        });
    } catch (e){
      console.log("[MAIL SEND ERROR]: message", e.message);
      throw new Error("Message not send");
    }
}
