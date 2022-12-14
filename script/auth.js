var email, password;

function signUp() {
  document.getElementById("signup").disabled = true;
  document.getElementById("error-create").style.display = "none";
  redirect = false;
  if (document.getElementById("code").value == 3449) {

    document.getElementById("code-div").style.display = "none";
    document.getElementById("create").style.display = "inline-block";


    var username;
    email_create = document.getElementById("email_create").value;
    password_create = document.getElementById("pass_create").value;
    username = document.getElementById("username").value;

firebase.auth().createUserWithEmailAndPassword(email_create, password_create)
  .then((userCredential) => {

    // Signed in 
    
    var user = userCredential.user;
    user.updateProfile({
      displayName: username
    }).then(() => {
      // Update successful
      console.log("Profile Set Successfully.");
      window.location.href="dashboard.html";
    }).catch((error) => {
      // An error occurred
     console.log(error);
    });  
        
      }).catch((error) => {

    var errorCode = error.code;
    var errorMessage = error.message;
    document.getElementById("signup").disabled = false;
    document.getElementById("error-create").style.display = "block";
    document.getElementById("error-create").innerHTML = '<i class="fas fa-exclamation-circle"></i>' + errorMessage;
  });
} else {
  alert("Entered Access Code is wrong.")
  document.getElementById("signup").disabled = false;
}
}

function signIn() {
  email = document.getElementById("email").value;
    password = document.getElementById("pass").value;
    document.getElementById("error").style.display = "none";

  firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed in

    var user = userCredential.user;
    console.log("Signed In");

    logger("User logged on: " + user.email, 101);



  })
  
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    errorHandler(errorMessage);
    logger("Error while logging on: " + email + "\n" + errorMessage, 201);
  });
  
}

//AUTHCHECK

function authCheck() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      
      document.getElementById("username").innerHTML = '<i class="fas fa-user"></i>' + user.displayName;
      document.getElementById("username").href = "account.html";

    } else {

      console.log("Signed Out!");
      window.location.href = "auth.html";
    }
  });
}

//LOGOUT
function logout() {
firebase.auth().signOut().then(() => {
  // Sign-out successful.
  console.log("Successful logout!");

  logger("User logged out", 101);
  window.location = "auth.html";

}).catch((error) => {

      errorHandler(error);
      logger("Error while logging out", 201);

});
}

//RESETPASS
function reset() {
  var email_pass=document.getElementById("email_reset").value;
  firebase.auth().sendPasswordResetEmail(email_pass)
  .then(() => {

    document.getElementById("error_reset").style.display = "block";
    document.getElementById("error_reset").style.backgroundColor = "#4BB543";
    document.getElementById("error_reset").innerHTML = '<i class="fas fa-check-circle"></i> Password mail sent succcessfully.';

    logger("Password reset mail send successfully: " + email_pass, 101);

  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;

    logger("Error while sending password reset mail on: " + email_pass + "\n" + errorMessage, 201);


    document.getElementById("error_reset").style.display = "block";
  document.getElementById("error_reset").innerHTML = '<i class="fas fa-exclamation-circle"></i>' + errorMessage;
  });
}

//USERINFO

function userInfo() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      
      document.getElementById("name").innerHTML = user.displayName;
      document.getElementById("uid").innerHTML = user.uid;
      document.getElementById("email").innerHTML = user.email;
      document.getElementById("creation-date").innerHTML = new Date(user.metadata.creationTime);
      // ...
      if (user.emailVerified==true) {
        document.getElementById("name").innerHTML = user.displayName + "<i class='fas fa-tools'></i>";
      } 

    } else {
      // User is signed out
      // ...
      console.log("Signed Out!");

    }
  });
}

function errorHandler(text) {
  document.getElementById("error").style.display = "block";
  document.getElementById("error").innerHTML = '<i class="fas fa-exclamation-circle"></i>' + text;
}

function resetPass() {
  document.getElementById("auth").style.display = "none";
  document.getElementById("reset").style.display = "inline-block";

}
function create() {
  document.getElementById("reset").style.display = "none";
  document.getElementById("create").style.display = "inline-block";
  document.getElementById("auth").style.display = "none";
}
function back() {
  document.getElementById("reset").style.display = "none";
  document.getElementById("create").style.display = "none";
  document.getElementById("auth").style.display = "inline-block";
}
function code() {
  document.getElementById("create").style.display = "none";
  document.getElementById("code-div").style.display = "inline-block";
  }


function logger(text, code) {
  var timestamp = new Date().getTime();

  firebase.database().ref('log/' + timestamp).set({
    text: text,
    code: code
  });
}