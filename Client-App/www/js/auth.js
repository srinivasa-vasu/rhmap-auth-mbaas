document.getElementById('login').onclick = function () {
  document.getElementById('cloudResponse').innerHTML = "<p>Calling Cloud for Auth...</p>";
    var appId = $fh.getFHParams()["appid"];
    $fh.auth({
        "policyId": "SV-Auth-UP",
        "clientToken": appId,
        "params": {
            "userId": document.getElementById('user').value,
            "password": document.getElementById('pass').value
        }
    }, function(res) {
        token = res.token;
        var loginEl = document.getElementById("count");
        loginEl.style.visibility = 'hidden';
        var el = document.getElementById("loggedIn");
        el.style.visibility = 'visible';
    }, function(msg, err) {
        console.log(msg, err);
        alert("Authentication failed - " + err.status + " " + err.message);
    });

};