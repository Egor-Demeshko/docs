import sendEmail from "$lib/scripts/utils/mail/sendEmail";


export const actions = {
    default: async ({request}) => {
        const data = await request.formData();

        try{
            await sendEmail(data);
        } catch(e) {
            return {status: 400, message: e.message}
        }
        return {status: 200}
    }
}