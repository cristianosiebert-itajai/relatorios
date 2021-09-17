<template>
    <div class="login_wrapper">
        <div class="login_text">
            <v-icon></v-icon>
            <strong>LabReport</strong> <br /> <small>Sistema de relatórios para instrutores de informática</small>
        </div>
        <v-btn color="blue lighten-5" class="google-signup login-btn" @click.prevent="loginWithGoogle()">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><title>Google</title><g fill="none" fill-rule="evenodd"><path fill="#4285F4" d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2581h2.9087c1.7018-1.5668 2.6836-3.874 2.6836-6.615z"></path><path fill="#34A853" d="M9 18c2.43 0 4.4673-.806 5.9564-2.1805l-2.9087-2.2581c-.8059.54-1.8368.859-3.0477.859-2.344 0-4.3282-1.5831-5.036-3.7104H.9574v2.3318C2.4382 15.9832 5.4818 18 9 18z"></path><path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.2822-1.1168-.2822-1.71s.1023-1.17.2823-1.71V4.9582H.9573A8.9965 8.9965 0 0 0 0 9c0 1.4523.3477 2.8268.9573 4.0418L3.964 10.71z"></path><path fill="#EA4335" d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5813-2.5814C13.4632.8918 11.426 0 9 0 5.4818 0 2.4382 2.0168.9573 4.9582L3.964 7.29C4.6718 5.1627 6.6559 3.5795 9 3.5795z"></path></g></svg>
            &nbsp; Login com Google
        </v-btn>
    </div>
</template>

<script>
  export default {
    name: 'LoginBtn',
    methods: {
        loginWithGoogle: function loginWithGoogle() { 
            var promise = this.$gAuth.signIn();
            promise.then((googleUser) => {
                let profile = googleUser.getBasicProfile();
                sessionStorage.setItem('is_logged',this.$gAuth.isAuthorized);
                sessionStorage.setItem('email',profile.getEmail());
                sessionStorage.setItem('name',profile.getName());
                sessionStorage.setItem('google_id',profile.getId());
                sessionStorage.setItem('avatar',profile.getImageUrl());
                sessionStorage.setItem('current_month',new Date().toISOString().substr(0, 7));
                sessionStorage.setItem('num_columns',3);
                this.$http.get('http://localhost:3000/usuarios/email/'+profile.getEmail())
                .then((result) => { 
                    if (result.data.length > 0) {
                        console.log("PUT");
                        if (result.data[0].foto != profile.getImageUrl()) {
                            promise = this.$http.put('http://localhost:3000/usuarios/'+result.data[0].id,{foto: profile.getImageUrl()});
                            promise.then(() => {
                                sessionStorage.setItem('id',result.data[0].id);
                                sessionStorage.setItem('permissao',result.data[0].permissao);
                                
                            });
                        } else {
                            sessionStorage.setItem('id',result.data[0].id);
                            sessionStorage.setItem('permissao',result.data[0].permissao);
                            this.$router.go();
                        }
                    } else {
                        console.log("POST");
                        let user = {google_id: profile.getId(), nome: profile.getName(), foto: profile.getImageUrl(), email: profile.getEmail(), permissao:result.data[0].permissao, createdBy:0, updatedBy:0, ativo:1};
                        promise = this.$http.post('http://localhost:3000/usuarios',user);
                        promise.then((user) => {
                            sessionStorage.setItem('id',user.data[0].id);
                            sessionStorage.setItem('permissao',user.data[0].permissao);
                            this.$router.go();
                        });
                    }
                });
            });
        },
    }
  }
</script>

<style>
    .login_wrapper {
        position: absolute;
        width: 100%;
        height: 100%;
    }
    .login_text {
        position: absolute;
        width: 376px;
        left: 50%;
        margin-left: -188px;
        top: 35%;
        margin-top: -18px;
        text-align: center;
    }
    .login-btn {
        left: 50%;
        margin-left: -106px;
        top: 50%;
        margin-top: -18px;
    }
</style>