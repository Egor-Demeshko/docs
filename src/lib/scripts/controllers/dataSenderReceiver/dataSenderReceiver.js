export default class dataSenderReceiver{
    #senderClient;
    #type;
    #callerId;

    constructor({type, callerId}){

        try {
            if(!type || !callerId) throw new Error("Клиенту связи не заданы реквизиты!")            
        } catch (error) {
            console.log(error.message);
            return null;
        }


        this.#callerId = callerId;
        this.#type = type.toUpperCase();
        this.#addClient();
    }

    saveData(data){
        this.#senderClient.post(data);
    }

    #addClient(){
        if(type === "HTTP"){
            switch(callerId){
                case "template":
                    this.#senderClient = new HTTPTemplate();
            }
        }
    }
}