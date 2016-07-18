//admin component
Vue.component('admin',{
	template:'#admin',
	data:function(){
		return {
			email:'',
			password:'',
			username:'',
		}
	},
	computed:{
		status:function(){
			return this.username == '' ? false : true
		}
	},
	methods:{
		login:function(){
			let provider = new firebase.auth.GoogleAuthProvider()
			let that = this
			firebase.auth().signInWithPopup(provider).then(function(result){
				that.status = true
				that.username = result.user.email
				that.$emit('onAuthStateChanged')
			}).catch(function(error){
				alert(error.message)
			})
		},
		logout:function(){
			let that = this
			firebase.auth().signOut().then(function(){
				alert('你已成功退出！')
				that.status = false
			})
		}
	},
	events:{
		onAuthStateChanged:function(user){
			if(user){
				if(user.email != 'yawenina@google.com'){
					firebase.auth().signOut()
					alert('请登录正确用户！')
					this.status = false
				}
			}
		}
	}
})


//add component
Vue.component('add',{
	template:'#add',
	data:function(){
		return {
			demo:{
				name:'hi',
				date:'',
				description:'',
				github:'',
				tag:'',
				imgUrl:''
			},
			val:0
		}
	},
	methods:{
		//上传数据
		'addDemo':function(){
			//检测用户是否为管理员登录
			if(firebase.auth().currentUser.email == 'yawenina@gmail.com'){
				//检测是否填充必要数据
				if(this.demo.name && this.demo.description && this.demo.tag && this.demo.github){
					//上传数据
					firebase.database().ref().child('demos').push(this.demo).then(function(){
						alert('上传成功！')
					})
					.catch(function(error){
						console.log(error)
					})
				}
			}else{
				alert('请使用管理员登录！')
			}
			
		},
		//上传图片
		sendImg:function(e){
			let that = this
			let file = e.target.files[0]
			//检查上传文件格式
			if(file.name.match(/[$jpg | png | gif]/)){
				//上传文件
				let uploadTask = firebase.storage().ref().child('images/'+file.name).put(file)
				//监测上传进度
				uploadTask.on('state_changed',function(snapshot){
					//设置进度条
					that.val = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
					console.log('Upload is' + that.val + '% done')
				},function(error){
					console.log(error.message)
				},function(){
					//成功后设置图片的url地址
					that.demo.imgUrl = uploadTask.snapshot.downloadURL
				})
			}else{
				alert('只支持上传png/jpg/gif格式的文件！')
			}
			
		}
	}
})


// var demos = firebase.database().ref().child('demos')
new Vue({
	el:'.container',
	data:{
		currentView:'add',
	},
})