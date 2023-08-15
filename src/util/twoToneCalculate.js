import { getDataTime, getDataValue, data_field } from "./dataManager"; 
import {  visualcode_object } from "./codeList";
import { CODE_WIDTH, CODE_HEIGHT, CODE_PADDING } from "./parameters";

export let tt_level = 5;

export function getTTData(group = 0, idx = 2){
    let res = [];
    let canvasx= CODE_WIDTH + 2*CODE_PADDING, canvasy = CODE_HEIGHT + 2*CODE_PADDING;
    // console.log(visualcode_object, data_lists)
    let minx = data_field['mins'][1], miny = data_field['mins'][idx];
    let totalx = (data_field['maxs'][1] - minx)/canvasx, lvy = (data_field['maxs'][idx] - miny)/tt_level;
    
    for(let i=0, len=visualcode_object[idx].length; i<len; i++){
        let ttdata = [];
        for(let i=0; i<tt_level; i++) ttdata.push([]);
        let level = -1, y_past = -1, x_past = -1;
        
        for(let j=visualcode_object[idx][i].start_idx, len2=visualcode_object[idx][i].end_idx; j<len2; j++){

            let x=(getDataTime(j)-minx)/totalx;
            let y_update =(getDataValue(j, idx)-miny)/lvy;
            let lv = Math.floor(y_update);
            // console.log(x_past, y_past, x, y_update);
            if(lv === 5) lv--;
            
            // 跨域
            if(level !== -1 && level !== lv){
                if(lv>level){
                    for(1; level<lv; level++){
                        let x_bound = x_past+(x-x_past)/(y_update-y_past)*(level+1-y_past);
                        ttdata[level].push([x_bound, canvasy]);
                        ttdata[level+1].push([x_bound, 0]);     
                    }
                }
                else{
                    for(1; level>lv; level--){
                        let x_bound = x_past+(x-x_past)/(y_update-y_past)*(level-y_past);
                        ttdata[level].push([x_bound, 0]);
                        ttdata[level-1].push([x_bound, canvasy]);
                    }
                }
            }

            let y = (y_update-lv)*canvasy;
            ttdata[lv].push([x, y]);
            
            x_past = x;
            y_past = y_update;
            level = lv;
        }

        res.push(ttdata);
    }

    if(visual_line[group]){
        delete visual_line[group];
    }
    visual_line[group] = res;

    // console.log(visual_line);
}

export const visual_line = {};