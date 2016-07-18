
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
				tag:'HTML',
				imgUrl:''
			},
			val:0
		}
	},
	methods:{
		//上传图片
		sendImg:function(e){
			let that = this
			let file = e.target.files[0]
			//检查上传文件格式
			if(file.name.match(/[$.jpg | .png | .gif]/)){
				//上传文件
				let uploadTask = firebase.storage().ref().child('images/'+file.name).put(file)
				//监测上传进度
				uploadTask.on('state_changed',function(snapshot){
					//设置进度条
                    let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
					that.val = parseInt(progress)
				},function(error){
					console.log(error.message)
				},function(){
					//成功后设置图片的url地址
					that.demo.imgUrl = uploadTask.snapshot.downloadURL
                    file = null
				})
			}else{
				alert('只支持上传png/jpg/gif格式的文件！')
			}
		},
        //上传数据
        'addDemo':function(){
            let that = this
            //检测是否填充必要数据
            if(this.demo.name && this.demo.description && this.demo.tag && this.demo.github && this.demo.imgUrl){
                //上传数据
                firebase.database().ref().child('demos').push(this.demo).then(function(){
                    alert('上传成功！')
                    //清空已填内容
                    for(let key in that.demo){
                        that.demo[key] = ''
                    }
                    that.val = 0
                }).catch(function(error){
                    console.log(error)
                })
            }else{
                alert('请完善必填项目')
            }
        }
	}
})


var vm = new Vue({
	el:'body',
	data:{
		currentView:'add',
        email:''
	},
	methods:{
		//用户登录
		login:function(){
			//绑定this
			let that = this
			//绑定Google登录
			let provider = new firebase.auth.GoogleAuthProvider()
			firebase.auth().signInWithPopup(provider).then(function(result){
                //若为管理员登录则赋值email，否则退出
				if(result.user.email == 'yawenina@gmail.com'){
                    that.email = result.user.email
                }else{
                    that.logout()
                }
			}).catch(function(error){
				console.log(error.message)
			})
		},
		//用户退出
		logout:function(){
            let that = this
			firebase.auth().signOut().then(function () {
                that.email = ''
				alert('您已成功退出！')
			})
		},
        currentUser:function(){
            let user = firebase.auth().currentUser
            console.log(user)
            //检查用户是否已登录,已登录则给email赋值，否则登录
            if(user != null && user.email == 'yawenina@google.com'){
                this.email = user.email
            }
            console.log('hi')
        }
	},
    ready:function(){
        //ready时检测是否用户已登录
        let that = this
        firebase.auth().onAuthStateChanged(function(user){
            if(user){
                that.email = user.email
            }
        })
    }
})
