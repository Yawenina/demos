

new Vue({
	el:'.container',
	data:{
		tags:[
			{name:'HTML',color:'olive'},
			{name:'CSS',color:'green'},
			{name:'JavaScript',color:'yellow'}
		],
		demos:null,
		text:''
	},
	ready:function () {
		let that = this
		firebase.database().ref('demos').on('value',function(snapshot){
			that.demos = snapshot.val()
		})
	}
})