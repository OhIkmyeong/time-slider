/** time-slider */
export class TimeSlider{
    /** time-slider */
    constructor(){
        this.DOM = new TimeSliderDomMaker(this)
        this.CURR = 0;
        this.LEN = null;
    }//constructor

    /** 
     * time-slider 생성 시작 
     * @param {DOM}$slider DOM
     * */
    init($slider){
        this.DOM.init($slider);
    }//init

    update(){
        this.DOM.hide_item(this.CURR);
        this.update_curr_idx();
        this.DOM.display_curr_idx();
    }//update

    update_curr_idx(){
        this.CURR++;
        if(this.CURR >= this.LEN){
            this.CURR = 0;
            this.DOM.show_all_item();
        }
    }//update_curr_idx
}//TimeSlider


class TimeSliderDomMaker{
    constructor(CTRL){
        this.CTRL = CTRL;
        this.$slider = null;
        this.$$item = null;
        this.$wrap = null;
        this.$timer = {
            wrap : null,
            curr : null,
            all : null,
            bar : null
        }
    }//constructor

    init($slider){
        this.$slider = $slider;
        this.make_wrap();
        this.order_reverse_item();
        this.make_time_bar();
        this.animate_time_bar();
    }//init

    /** .time-slider-wrap */
    make_wrap(){
        const $parent = this.$slider.parentElement;
        this.$wrap = document.createElement("DIV");
        this.$wrap.classList.add('time-slider-wrap');
        const $all = this.$slider.nextElementSibling;
        if(!$all){
            $parent.appendChild(this.$wrap);
        }else{
            $parent.appendChild(this.$wrap);
            $parent.insertBefore(this.$wrap,$all);
        }

        this.$wrap.appendChild(this.$slider);
    }//make_wrap

    order_reverse_item(){
        this.$$item = Array.from(this.$slider.children);
        this.CTRL.LEN = this.$$item.length;
        for(let i=this.CTRL.LEN - 1; i >=0; i--){
            this.$$item[i].classList.add('time-slider-item');
            this.$slider.appendChild(this.$$item[i]);
        }
    }//order_reverse_item

    make_time_bar(){
        this.$timer.wrap = document.createElement('DIV');
        this.$timer.curr = document.createElement('DIV');
        this.$timer.all = document.createElement('DIV');
        this.$timer.bar = document.createElement('DIV');
        const $barWrap = document.createElement('DIV');

        this.$timer.wrap.classList.add('time-slider-time-wrap');
        this.$timer.curr.classList.add('time-slider-time-curr');
        this.$timer.all.classList.add('time-slider-time-all');
        this.$timer.bar.classList.add('time-slider-time-bar');
        $barWrap.classList.add('time-slider-time-bar-wrap');
        $barWrap.appendChild(this.$timer.bar);

        this.display_curr_idx();
        this.$timer.all.textContent = String(this.CTRL.LEN).padStart(2,"0");
        
        this.$timer.wrap.appendChild(this.$timer.curr);
        this.$timer.wrap.appendChild($barWrap);
        this.$timer.wrap.appendChild(this.$timer.all);

        this.$wrap.appendChild(this.$timer.wrap);
    }//make_time_bar

    display_curr_idx(){
        const idx = String(this.CTRL.CURR + 1).padStart(2,"0");
        this.$timer.curr.textContent = idx;
    }//display_curr_idx

    hide_item(idx){
        this.$$item[idx].classList.add('off');
    }//hide_item

    show_all_item(){
        this.$$item.forEach($item=>$item.classList.remove('off'));
    }//show_item

    ing_time_bar(){
        this.$timer.bar.classList.remove('end');
        this.$timer.bar.classList.add('ing');
    }//ing_time_bar

    end_time_bar(){
        this.$timer.bar.classList.remove('ing');
        this.$timer.bar.classList.add('end');
    }//end_time_bar

    animate_time_bar(){
        this.ing_time_bar();
        this.$timer.bar.addEventListener('animationend',()=>{
            this.end_time_bar();
            this.$timer.bar.addEventListener('animationend',()=>{
                this.CTRL.update();                
                //재귀
                this.animate_time_bar();
            },{once:true});
        },{once:true});
    }//animate_time_bar
}//TimeSliderDomMaker