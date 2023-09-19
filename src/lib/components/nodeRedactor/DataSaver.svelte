
<script>
    //НЕРАБОЧИЙ КЛАСС



	import { getContext } from "svelte";

    export let id;

    /**@description отдельно обьект node*/
    export let data;

    /**@description показывает открытие редактора блока 
     * true, значит открыт
     * @type {boolean}*/
    export let isRedactorOpen;

    const nonCriticalFields = ["name", "description", "view_type"];
    const controller = getContext("controller");
    let savedData = null;
    let nonUrgentData = {};
    let urgentData = {};

    let firstOpen = false;

    /**
     * 1. запросить из контроллера сохраненные данные
     * 2. начать сопостовление полей с данными из контроллера
     * 3. поля несрочные ставим в очередь.  метод контроллера saveNourgentAsObj(id, obj)
     * 4. затем срочные поля отправляем. sendDataInQueue()
     * получается если изменение срочных полей нет, то отправка останется в очереди.
     * если есть срочные то уже отправится все разом
    */

    $: if( id && isRedactorOpen) {
        if(data.validity.status === "valid" && savedData){
            collectData();

            processData();
        } 

        savedData = data;
    }


    function collectData(){

        for(let [key, value] of Object.entries(data)){
            if(data[key] !== savedData[key]){
                if(nonCriticalFields.includes(key)){
                    nonUrgentData[key] = value;
                } else {
                    urgentData[key] = value;
                }   
            }
        }
    }


    async function processData(){
            controller.saveNourgentAsObj(id, {...nonUrgentData});

            for (const key of Object.keys(urgentData)) {
                if(!key) break;

                controller.saveNourgentAsObj(id, {...urgentData});
                controller.sendDataInQueue();
                break;
            }
    }

    
</script>