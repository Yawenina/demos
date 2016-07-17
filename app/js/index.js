
Vue.config.devtools = true
Vue.component('add',{
	template:'#add',
	data:function(){
		return {
			demo:{name}
		}
	},
	methods:{
		addDemo:function(){
			this.$dispatch('add',this.demo)
		}
	}
})


new Vue({
	el:'.container',
	data:{
		tags:[
			{name:'HTML',color:'olive'},
			{name:'CSS',color:'green'},
			{name:'JavaScript',color:'yellow'}
		],
		// demo:{
		// 	tag,title,date,description,github,likes
		// },
		demos:[],
	},
	events:{
		'add':function(demo){
			this.demos.push(demo)
		}
	}
})