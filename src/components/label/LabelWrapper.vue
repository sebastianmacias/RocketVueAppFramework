<script>
    export default{
        props : {
            label : {required:true},
            placeholder : String,
            separator : {default:'bullet'},
            date : String,
            url : String,
            currency : String,
            decimals : Number,
            value : {},
            file : String,
            fileNameCol : {default:'originalfilename'},
            fileUrlCol : {default:'url'},
            valueProp : String
        },
        functional : true,
        render(h,c){

          const data=c.data || {};
          if(!data.class)
              data['class']={};

          data.class['input-group']=true;
          data.class['input-group--dirty']=true;
          data.class['input-group--dark']=true;
          data.class['input-group--text-field']=true;

          function renderValue(value){
              let children=null;
              if(c.props.date!==undefined){
                  if(c.props.date==='time'){
                      children=Vue.filter('rwtime')(value);
                      children=Vue.filter('rdate')(children,'time');
                  }else{
                      children=Vue.filter('rdate')(value,c.props.date);
                  }

              }else if(c.props.currency!==undefined){
                  children=c.props.currency+' '+Number(value).toFixed(2);
              }else if(c.props.decimals!==undefined){
                  children=Number(value).toFixed(c.props.decimals);
              }else if(c.props.file!==undefined){

                  if(c.props.file==='file'&&value&&value.hasOwnProperty(c.props.fileUrlCol)){
                      children=[h('a',{
                          attrs : {
                              href : value[c.props.fileUrlCol]
                          }
                      },value[c.props.fileNameCol])];
                  }else if(c.props.file==='image'&&value&&value.hasOwnProperty(c.props.fileUrlCol)){
                      children=[h('v-carousel-item',{
                          props : {
                              src : value[c.props.fileUrlCol]
                          }
                      },'')];
                      children=h('v-carousel',{},children);

                  }
              }else{
                  children=value;
              }

              return children;
          }

          let children=null;//

          if(c.props.value!==undefined){
              if(Array.isArray(c.props.value)){
                  if(c.props.value.length>0){
                      if(c.props.file==='image' && c.props.value){
                          const images=[];
                          for(let val of c.props.value){
                              if(val){
                                  images.push(h('v-carousel-item',{
                                      props:{
                                          src:val[c.props.fileUrlCol]
                                      }
                                  },''));
                              }
                          }
                          if(images.length>0){
                              children=h('v-carousel',{},images);
                          }

                      }else if(c.props.separator==='bullet'){
                          const bullets=[];
                          for(let val of c.props.value){
                              if(c.props.valueProp){
                                  bullets.push(h('li',{},renderValue(val[c.props.valueProp])));
                              }else{
                                  bullets.push(h('li',{},renderValue(val)));
                              }

                          }
                          children=h('ul',{},bullets);
                      }else{
                          children=c.props.value.join(c.props.separator);
                      }
                  }
              }else{
                  if(c.props.valueProp){

                      if(typeof c.props.value==='object' && c.props.value!=null && c.props.value.hasOwnProperty(c.props.valueProp)){
                          children=renderValue(c.props.value[c.props.valueProp]);
                      }else{
                          children=renderValue(c.props.value);
                      }
                  }else{
                      children=renderValue(c.props.value);
                  }

              }
              if(children!==null)
                children=[children];
              else
                children=[];
          }else{
              children=c.children;
          }
          let isPlaceholder=false;

          if(children.length===0){
            children=[c.props.placeholder];

            isPlaceholder=true;
          }

          return h('div',data,[h('label',{},c.props.label),h('div',{'class':'input-group__input'},[h('span',{
              'class':{
                  'rw-label' : true,
                  'grey--text' : isPlaceholder,
                  'text--lighten-2' : isPlaceholder,
              }
          },children)])]);
        }
    }
</script>
<style>
    span.rw-label{
        font-size: 16px;
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        margin: 0;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        min-width: 0;
        min-height: 30px;
    }
    img.label-img-thumb{
        max-width:150px;
        max-height:100px;
    }
</style>
