
//add component
Vue.component('add',{
	template:'#add',
	data:function(){
		return {
			demo:{
				name:'',
				date:'',
				description:'',
				github:'',
				tag:''
			},
		}
	},
	methods:{
		'addDemo':function(){
			firebase.database().ref().child('demos').push(this.demo)
		}
	}
})
// var demos = firebase.database().ref().child('demos')
new Vue({
	el:'.container',
	data:{
		currentView:'add'
	}
})