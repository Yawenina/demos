//add component
Vue.component('add', {
    template: '#add',
    props: ['email'],
    data: function () {
        return {
            demo: {
                name: '',
                date: '',
                description: '',
                github: '',
                tag: '',
                imgUrl: 'https://firebasestorage.googleapis.com/v0/b/demos-68bf2.appspot.com/o/images%2Fpexels-photo.jpg?alt=media&token=b2f8b01b-6f80-4b30-80c4-96e5241d66cc',
                src: '',
                edit: false
            },
            val: 0
        }
    },
    methods: {
        //上传图片
        sendImg: function (e) {
            let that = this
            let file = e.target.files[0]
            //检查上传文件格式
            if (file.name.match(/[$.jpg | .png | .gif]/)) {
                //上传文件
                let uploadTask = firebase.storage().ref().child('images/' + file.name).put(file)
                //监测上传进度
                uploadTask.on('state_changed', function (snapshot) {
                    //设置进度条
                    let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    that.val = parseInt(progress)
                }, function (error) {
                    console.log(error.message)
                }, function () {
                    //成功后设置图片的url地址
                    that.demo.imgUrl = uploadTask.snapshot.downloadURL
                    file = null
                })
            } else {
                alert('只支持上传png/jpg/gif格式的文件！')
            }
        },
        //上传数据
        'addDemo': function () {
            let that = this
            //检查是否登录
            if (this.email) {
                //检测是否填充必要数据
                if (this.demo.name && this.demo.description && this.demo.tag && this.demo.github && this.demo.src) {
                    //上传数据
                    firebase.database().ref().child('demos').push(this.demo).then(function () {
                        alert('上传成功！')
                        //清空已填内容
                        for (let key in that.demo) {
                            that.demo[key] = ''
                        }
                        that.demo['tag'] = 'HTML'
                        that.demo['imgUrl'] = 'https://firebasestorage.googleapis.com/v0/b/demos-68bf2.appspot.com/o/images%2Fpexels-photo.jpg?alt=media&token=b2f8b01b-6f80-4b30-80c4-96e5241d66cc'
                        that.val = 0
                    }).catch(function (error) {
                        console.log(error)
                    })
                } else {
                    alert('请完善必填项目')
                }
            } else {
                alert('请先登录')
            }
        }
    }
})

//manage component
Vue.component('manage', {
    template: '#manage',
    props: ['email'],
    data: function () {
        return {
            demos: null,
            status: true,
            details: false
        }
    },
    methods: {
        deleteDemo: function (key) {
            firebase.database().ref('demos/' + key).remove().then(function () {
                alert('删除成功！')
            })
        },
        updateDemo: function (key, demo) {
            demo.edit = false
            let that = this
            firebase.database().ref('demos/' + key).update(demo).then(function () {
                alert('更新成功！')
            })
        }

    },
    ready: function () {
        if (this.email) {
            let that = this
            firebase.database().ref().child('demos').on('value', function (snapshot) {
                that.demos = snapshot.val()
                that.status = false
            })
        }
    }
})

var vm = new Vue({
    el: 'body',
    data: {
        currentView: 'add',
        email: ''
    },
    methods: {
        //用户登录
        login: function () {
            //绑定this
            let that = this
            //绑定Google登录
            let provider = new firebase.auth.GoogleAuthProvider()
            firebase.auth().signInWithPopup(provider).then(function (result) {
                //若为管理员登录则赋值email，否则退出
                if (result.user.email == 'yawenina@gmail.com') {
                    that.email = result.user.email
                } else {
                    that.logout()
                }
            }).catch(function (error) {
                console.log(error.message)
            })
        },
        //用户退出
        logout: function () {
            let that = this
            firebase.auth().signOut().then(function () {
                that.email = ''
                alert('您已成功退出！')
            })
        }
    },
    ready: function () {
        //ready时检测是否已用管理员身份登录
        let that = this
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                if (user.email == 'yawenina@gmail.com') {
                    that.email = user.email
                } else {
                    alert('请使用管理员登录')
                    that.logout()
                }
            }
        })
    }
})
