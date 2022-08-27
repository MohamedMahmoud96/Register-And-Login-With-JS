var storge = window.localStorage;
var curentUser = [];
var loginForm = document.getElementById('LoginForm')
var RegisterForm = document.getElementById('registerForm')
var adminLoginForm = document.getElementById('adminLoginForm')

/////////////////////////////////////////////////////////////////////////////////
                    ////////////////Register///////////
///////////////////////////////////////////////////////////////////////////////

if(RegisterForm)
{
    document.getElementById('registerSubmit').addEventListener('click', function()
    {
            var name = document.getElementById('name').value;
            var email = document.getElementById('email').value;
            var password = document.getElementById('password').value;
            var confirPassword = document.getElementById('confirPassword').value;
            var gender = document.getElementsByName('gender'); 

            createUser(name, email, password,confirPassword, gender);
    })
}

function createUser(name, email, password,confirPassword, gender)
{   
    resetError();
    if(registerValidation(name, email, password, confirPassword,gender))
    {
 
        gender = gender[0] ? 'male' : 'female';
        var role = 0
        var id = hasUsers() ? id = allUser().length + 1 : id = 1 ;
        role  = id == 1 ? role =1 : role =0; 
            var user = [
            {   'id':id,
                'name':name ,
                'email': email ,
                'password': password,
                'gender':gender,
                'data': Date(),
                'role':role,
                'token': "",
                }]
            setUser(user);
            setCurrentUser(id,email, name, gender,Date())
            setCookie('email' , user[0].email, './');
            window.location.assign("./");
    }
}
function isUniqeEmail(userEmail)
{
    if(hasUsers())
    {
        var users = allUser();
         for(var i=0 ; i < users.length; i++)
         {
             if(users[i].email === userEmail)
             {
                 return false;
                 break;
             }  
         }
    }
   
  return true;
}

function registerValidation(name , email, password ,confirPassword, gender)
{
    var nameReg = /^[A-Za-z0-9 ]{3,20}$/;
    var emailReg = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    var passwordReg = /^[A-Za-z0-9!@#$%^&*()_]{8,20}$/;
    var isGender = gender[0].checked ||gender[1].checked ? true : false;
    if(name.match(nameReg) && email.match(emailReg) && isUniqeEmail(email) && password.match(passwordReg) && isGender)
    { 
        return true;
      
    }else{
        if(!name.match(nameReg))
        {
         document.getElementsByClassName('valid-name')[0].setAttribute('style', 'display:block;color:red')
         
        }else if(!email.match(emailReg)){
            document.getElementsByClassName('valid-email')[0].setAttribute('style', 'display:block;color:red')
        }
        else if(!isUniqeEmail(email)){
            document.getElementsByClassName('repeat-email')[0].setAttribute('style', 'display:block;color:red')
        }
        else if(!password.match(passwordReg)) {
            document.getElementsByClassName('valid-password')[0].setAttribute('style', 'display:block;color:red')      
         }
         else if(confirPassword != password)
         {
            document.getElementsByClassName('valid-confirPassword')[0].setAttribute('style', 'display:block;color:red')      
        }
        else if(!isGender ){
            document.getElementsByClassName('valid-gender')[0].setAttribute('style', 'display:block;color:red')        
        }
        return false;
    }
}

function resetError()
{
    var span = document.getElementsByClassName('valid');

    for(var i =0; i< span.length ; i++)
    {

        span[i].setAttribute('style', 'display:none');
    }
    
}


/////////////////////////////////////////////////////////////////////////////////
                    ////////////////Login///////////
///////////////////////////////////////////////////////////////////////////////

if(loginForm)
{
 document.getElementById('loginSubmit').addEventListener('click', function()
 {
         var email = document.getElementById('email').value;
         var password = document.getElementById('password').value;
         if(loginValidation(email, password))
         {
            setCookie('email', email, './')
            window.location.assign("./");
         }else{
            document.getElementsByClassName('valid-data')[0].setAttribute('style', 'display:block;color:red; text-align: center;')

         }
 })
 
}
 function loginValidation(email, pass)
 {
   var users = allUser();
    for(var i=0 ; i < users.length; i++)
    {
        if(users[i].email === email && users[i].password === pass)
        {
           setCurrentUser(users[i].id,users[i].email, users[i].name, users[i].gender,users[i].data)
            return true;
            break;
        }  

    }
    return false;
}



//////////////////////////////////////
///////////////////localStorage/////////////////

function setUser(user)
{
  if(hasUsers())
    {
     var users =  allUser();
     users.push(user)
     storge.setItem('users', JSON.stringify(users))
    }else {
      storge.setItem('users', JSON.stringify(user))
    }
}
function allUser()
{ 
    if(hasUsers())
    {  
        return JSON.parse(storge.getItem('users'));
    }
}

function hasUsers()
{
    return storge.getItem('users') != undefined ? true : false
   
}

////////////////////////////////////////
////////////////////Set & GET CURRENT USER/////////////////////
function setCurrentUser(id , email , name ,gender, data)
{
   
    curentUser = [
        {
            'id': id,
            'email': email,
            'name': name,
            'gender': gender,
            'data': data
         }
    ]

}
function getCurrentUser()
{
    return curentUser;
}
 ///////////////////////////////////////////////////////
 /////////////////////Cooki///////////////////////////////
var all= document.cookie.split(';')
function hasCookie(key)
{
    for(var i =0; i< all.length; i++)
    { 
      if(all[i].trim().startsWith(key))
      {
        return true;
        break;
        // stop loop
      }
    }
    return false
}

function setCookie(key, value, path){

    var date= new Date();
    date.setDate(date.getDate() + 3);
   var expire = "expires="+date.toUTCString()+";"
    document.cookie = key +'='+ value +';'+ expire + "path="+ path +";";
   
}
function checkCookies()
{   
    if(hasCookie('email'))
    {   
        window.location.assign("./");
    }

}
function removeCooki(email)
{
   if(hasCookie(email))
   {
         var date= new Date();
         date.setDate(date.getDate() -7);
        var expire = "expires=" + date.toUTCString()+";"
        document.cookie = "email=;" +expire+ "path=./;"
        
       
   }
}

function logOut()
{   
    removeCooki('email');
    return;
}

///////////////////////////////////////////////
/////////////////////////Admin Login///////////////////////
if(adminLoginForm)
{
 document.getElementById('AdminLoginSubmit').addEventListener('click', function()
 {
         var email = document.getElementById('adminEmail').value;
         var password = document.getElementById('adminPassword').value;
         if(loginValidation(email, password))
         {
            setCookie('email', email , './')
            setCookie('role', 1, './')
            document.location = './';
         }else{
            document.getElementsByClassName('valid-data')[0].setAttribute('style', 'display:block;color:red; text-align: center;')

         }
 })
 
}

 function loginValidation(email, pass)
 {
   var users = allUser();
    for(var i=0 ; i < users.length; i++)
    {   console.log(users[i].role);
        if(users[i].email === email && users[i].password === pass && users[i].role == 1)
        {
           setCurrentUser(users[i].id,users[i].email, users[i].name, users[i].gender,users[i].data)
            return true;
            break;
        }  

    }
    return false;
}

////////////////////////
////////////admin Cooki//////////////
function checkAdminCookies()
{   
    if(!hasCookie('role'))
    {  
       document.location  = './login.html'      
    }
    
}
function isAdminLogin()
{
    if(hasCookie('role'))
    {  
       document.location  = './'      
    }
    
} 