import { activeBlocks, connections, linesStore, blockClickedId } from "../stores";

export default function boxClickHandler(endforLineId){
    console.log(`[boxClickHandler]`);
    if(!endforLineId) return;
    if(!isBlockInstore()) return;
    
    /** сохранить айди элементов которые надо подсветить */
    let idsToHighlight = [];
    connections.update( (allBlocks) => {
        allBlocks.forEach( (obj) => {
            if(!obj.parent && obj.id != endforLineId){
                idsToHighlight.push(obj.id);
            }
        });

        return allBlocks;
    });

    
    activeBlocks.update( (set) => {
        idsToHighlight.forEach( (id) => {
            set.add(id);
        });

        return set;
    });


    document.addEventListener("click", (e) => {
        //определить цель клика
        //если это rect. то 
        //определить второй блок куда идет связь. тоесть его айди, пока что.
        //добавить в стор, старт айди, енд айди
        try{
            
            if(e.target.tagName !== 'rect') throw Error;
            
                let startBlockForLineID;


                blockClickedId.update( (id) => {
                    startBlockForLineID = id;
                    return id;
                });

                
                connections.update( (blocks) => {
                    
                    /**сохранить айди парента, куда идет линия. это endId */
                    blocks.forEach( (obj) => {
                        if(obj.id === startBlockForLineID){
                            obj.parent = endforLineId;
                        }
                        
                        return obj;
                    });
                    
                    return blocks;
                } );
                

                /**when store updated, new lines will be drawn reactivly */
                linesStore.update( (lines) => {
                    
                    return [ ...lines, {
                    startId: startBlockForLineID,
                    endId: endforLineId
                }]});


                activeBlocks.update( (set) => {
                    idsToHighlight.forEach( (id) => {
                        set.add(id);
                    });
                
                    return set;
                });

            } catch {

            activeBlocks.update( (set) => {
                idsToHighlight.forEach( (set) => {
                    set.delete(id);
                });
            
                return set;
            });

            return;
        }
    }, {once: true});



    function isBlockInstore(){
        let status = false;

        connections.update( (blocks) => {
            for(let i = 0; i < blocks.length; i++) {
                if(blocks[i].id === endforLineId) {
                    status = true;
                    break;
                }
            }
            return blocks;
        });

        return status;
    }
}