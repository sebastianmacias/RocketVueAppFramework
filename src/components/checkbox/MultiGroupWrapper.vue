<script>
    import Contextualable from '../mixins/contextualable'
    import Themeable from '../mixins/themeabledark'
    import Validation from '../mixins/validation';
    export default{
        mixins : [Contextualable,Themeable,Validation],
        props : {
            value : {},
            label : String,
            name : String,
            error : Boolean,
            color:String,
            errorText : String,
            light : Boolean,
            dark : Boolean
        },
        data(){
            return {
                innerValue : null,
                innerError : ''
            }
        },
        watch : {
            value(){
                this.assignValue();
            },
            error(){
                this.createError();
            }
        },
        mounted(){
            this.assignValue();
            this.createError();
        },
        methods : {
            assignValue(){
                if(this.value){
                    this.innerValue=this.value;
                }else{
                    this.innerValue=[];
                }
            },
            createError(){
                if(this.error){
                    this.innerError=this.errorText;
                }else{
                    this.innerError=null;
                }
            },
            renderError(h){
                if(this.innerError!=''){
                    return h('div',{'class':['input-group','no-margins']},[h('div',{
                        'class' : ['input-group__details']
                    },[h('div',{
                        'class' : ['input-group__messages']
                    },[h('div',{
                        'class' : ['input-group__error']
                    },this.innerError)])])]);
                }else{
                    return null;
                }
            },
            renderNode(h,node,type){
                const data=node.data;
                if(node.componentOptions.hasOwnProperty('propsData'))
                    data['props']=Object.assign({},this.$props,node.componentOptions.propsData);
                else
                    data['props']=Object.assign({},this.$props);

                delete data.props['name'];
                data['class']={'no-margins':true};
                data.props['value']=this.innerValue;
                data['on']={
                    input : (e)=>{
                        this.innerValue=e;
                        this.$emit('input',this.innerValue);
                    }
                };
                return h(type,data)
            }
        },
        inject: ['$validator'],
        render(h){
            const props=Object.assign({},this.$props);

            if(this.$validator!==undefined&&this.name){
                this.innerError=this.validationError;
            }

            const children=[];
            children.push(h('rw-subheader',{props:{trim:true}},this.label));

            if(this.$slots.default){
                this.$slots.default.forEach((node)=> {
                    if (node.tag !== undefined && node.tag.indexOf('rw-checkbox') > -1) {
                        children.push(this.renderNode(h,node,'rw-checkbox'));
                    }else if (node.tag !== undefined && node.tag.indexOf('rw-switch') > -1) {
                        children.push(this.renderNode(h,node,'rw-switch'));
                    }
                });
            }
            children.push(this.renderError(h));
            return h('div',{
                props,
            },children);
        }
    }
</script>
<style>
    .no-margins{
        margin:0!important;
    }
</style>
