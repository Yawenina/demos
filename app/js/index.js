
// TODO:1.根据tag设置label颜色的class;2.没有数据时的消息框
new Vue({
	el:'.container',
	data:{
		tags:[
			{name:'All',color:'teal'},
			{name:'HTML',color:'olive'},
			{name:'CSS',color:'green'},
			{name:'JavaScript',color:'yellow'}
		],
		demos:null,
		text:''
	},
	methods:{
		showdemo (demo) {
			console.log(demo)
		}
	},
	ready:function () {
		let that = this
		firebase.database().ref('demos').on('value',function(snapshot){
			that.demos = snapshot.val()
		})
	}
})