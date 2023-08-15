<template>
    <div :style="style_border">
        <div class="codename" :id="('ttn_'+target+'_'+mapping)" v-show="show_name"> {{code_name}} </div>
        <canvas :id="('tt_'+target+'_'+mapping)" :style="style_var" :width="canvas_x" :height="canvas_y"></canvas>
        <div :style="style_right"></div>
    </div>
</template>

<style scoped>
.codename{
    font-weight:bold; 
    padding-left: 30px; 
    height: 25px;
    color:#809FB8;
}

canvas{
    background-color: white;
}
</style>

<script>
import { SHOW_WIDTH, SHOW_HEIGHT, CODE_HEIGHT, CODE_WIDTH, CODE_PADDING } from '../util/parameters' 
import { DEPTH_COLOR } from '../util/colorMapping'

export default{
    name: 'TwoTone',
    props:{
        target:{
            type: [String, Number],
            default: 0
        }, 
        mapping:{
            type: Number,
            default: 0
        },
        lines:{
            type: Array,
            default: [[[0,0],[100, 30], [210, 90], [330, 50]]]
        },
        show:{type:Boolean, default: true},
        show_name:{type:Boolean, default: false},
        code_name:{type:[String, Number], default: 0},
        is_fill: {type: Boolean, default: true }
    },

    data(){
        return{ 
            style_border:{
                "position": "relative",
                "border": "2px solid white",
                "height": "55px",
                "width": "100%",
                "margin": "2px"
            },
            style_var:{
                "width":SHOW_WIDTH +"px",
                "height": SHOW_HEIGHT+"px"
            },
            style_right:{
                "width": "3px",
                "borderRadius":"2px",
                "position": "absolute",
                "height": "80%",
                "right":"3px",
                "bottom": "6px",
                "backgroundColor": "white"
            },

            canvas_x: CODE_WIDTH + 2*CODE_PADDING,
            canvas_y: CODE_HEIGHT + 2*CODE_PADDING,
        }
    },

    methods:{
        initCanvas(){
            this.canvas = document.querySelector("#tt_"+this.target+"_"+this.mapping)
            this.context = this.canvas.getContext('2d')
        },

        drawLines(){
            // console.log(this.lines)
            if(this.show){
                this.context.fillStyle = '#ffffff'
                this.context.fillRect(0, 0, this.canvas_x, this.canvas_y);

                let le = this.canvas_x, ri = 0;
                for(let i=0; i<this.lines.length; i++){
                    for(let j=0; j<this.lines[i].length; j++){
                        if(this.lines[i][j][0]>ri) ri = this.lines[i][j][0];
                        if(this.lines[i][j][0]<le) le = this.lines[i][j][0];
                    }
                }
                for(let i=0; i<this.lines.length; i++){
                    let len = this.lines[i].length;
                    if(len <= 1) continue;
                    this.context.beginPath();
                    this.context.moveTo(this.lines[i][0][0], this.canvas_y - this.lines[i][0][1]);
                    for(let j=1;j<len; j++){
                        // 连线
                        this.context.lineTo(this.lines[i][j][0], this.canvas_y - this.lines[i][j][1]);
                    }
                    
                    if(this.is_fill){
                        if(this.lines[i][len-1][1] === this.canvas_y){
                            this.context.lineTo(ri, 0);
                            this.context.lineTo(ri, this.canvas_y);
                        }
                        else{
                            this.context.lineTo(this.lines[i][len-1][0], this.canvas_y);
                        }
                        if(this.lines[i][0][1] === this.canvas_y){
                            this.context.lineTo(le, this.canvas_y);
                            this.context.lineTo(le, 0);
                        }
                        else{
                            this.context.lineTo(this.lines[i][0][0], this.canvas_y);
                        }
                        this.context.closePath();
                        // 换色
                        this.context.fillStyle = DEPTH_COLOR[i];
                        this.context.strokeStyle = DEPTH_COLOR[i];
                        this.context.fill();
                    }
                    
                    this.context.stroke();
                }
            }
        }
    },

    watch:{
        lines(new_value, old_value){  
            this.drawLines()
        },
        show(new_value, old_value){
            this.drawLines()
        },
        show_name(new_value, old_value){
            if(new_value){
                this.style_border["height"] = "80px";
            } 
            else{
                this.style_border["height"] = "55px";
            }
        }
    },

    mounted(){
        if(this.show_name) this.style_border["height"] = "80px";
        
        this.initCanvas()
        this.drawLines()
    }
}
</script>