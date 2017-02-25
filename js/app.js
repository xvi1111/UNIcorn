function startApp() {


    showHideMenuLinks();

    $("#formLogin").submit(loginUser);
    $("#formRegister").submit(registerUser);

    $("#loadingBox").hide();
    $("#infoBox").hide();
    $("#errorBox").hide();

    function showHideMenuLinks() {
        if (sessionStorage.getItem('authToken')) {
            // We have logged in user
            $("#menuProfile").show();
            $("#menuHome").show();
            $("#menuInfo").show();
            $("#menuSchedule").show();
            $("#menuBooks").show();
            $("#menuRents").show();
            $("#menuEvents").show();
            $("#menuContacts").show();
            $("#menuLogin").hide();
            $("#menuRegister").hide();
        }
        else {
            // No logged in user
            $("#menuProfile").hide();
            $("#menuHome").hide();
            $("#menuInfo").hide();
            $("#menuSchedule").hide();
            $("#menuBooks").hide();
            $("#menuRents").hide();
            $("#menuEvents").hide();
            $("#menuContacts").hide();
            $("#menulogin").show();
            $("#menuRegister").show();
        }
    }

  $("form").submit(function (e) {
        e.preventDefault()
    });

    const kinveyBaseUrl = "https://baas.kinvey.com/";
    const kinveyAppKey = "kid_rkZ6qtPKg";
    const kinveyAppSecret = "02a1f9e33f4d43a1829550f91dd1a4d3";
    const kinveyAppAuthHeaders = {
        'Authorization': "Basic " +
        btoa(kinveyAppKey + ":" + kinveyAppSecret),
    };

    function showInfo(message) {
        $('#infoBox').text(message);
        $('#infoBox').show();
        setTimeout(function() {
            $('#infoBox').fadeOut();
        }, 3000);
    }

    function showError(errorMsg) {
        $('#errorBox').text("Error: " + errorMsg);
        $('#errorBox').show();
    }

    function handleAjaxError(response) {
        let errorMsg = JSON.stringify(response);
        if (response.readyState === 0)
            errorMsg = "Cannot connect due to network error.";
        if (response.responseJSON &&
            response.responseJSON.description)
            errorMsg = response.responseJSON.description;
        showError(errorMsg);
    }


    function loginUser() {

        event.preventDefault();

        let userData = {
            username: $('#formLogin input[name=username]').val(),
            password: $('#formLogin input[name=password]').val()
        };
        $.ajax({
            method: "POST",
            url: kinveyBaseUrl + "user/" + kinveyAppKey + "/login",
            headers: kinveyAppAuthHeaders,
            data: userData,
            success: loginSuccess,
            error: handleAjaxError
        });

        function loginSuccess(userInfo) {
            saveAuthInSession(userInfo);
            showHideMenuLinks();
            showInfo('Login successful.');
            window.setTimeout(function() {
                window.location.href = 'index.html';
            }, 2000);
        }
    }

    function registerUser() {

        event.preventDefault();

        let userData = {
            username: $('#formRegister input[name=username]').val(),
            password: $('#formRegister input[name=password]').val(),
            name: $('#formRegister input[name=fname]').val(),
            sname: $('#formRegister input[name=sname]').val(),
            studentID: $('#formRegister input[name=studentID]').val(),
            email: $('#formRegister input[name=email]').val()
        };
        $.ajax({
            method: "POST",
            url: kinveyBaseUrl + "user/" + kinveyAppKey + "/",
            headers: kinveyAppAuthHeaders,
            data: userData,
            success: registerSuccess,
            error: handleAjaxError
        });
        function registerSuccess(userInfo) {
            showInfo('User registration successful.');
        }
    }

    function saveAuthInSession(userInfo) {
        let userAuth = userInfo._kmd.authtoken;
        sessionStorage.setItem('authToken', userAuth);
        let userId = userInfo._id;
        sessionStorage.setItem('userId', userId);
        let username = userInfo.username;
        sessionStorage.setItem('username', username);
        $('#profile h2').text(
            "Здравей, " + userInfo.name + "");
    }

}