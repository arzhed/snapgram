(function() {
	$(function(){
		var signInSection, signUpSection, initElements,
			buttonOptSignUp, buttonOptSignIn,
			toggleSignIn, toggleSignUp;

		signInSection = $("#signin");
		signUpSection = $("#signup");
		buttonOptSignUp = $("#btnOptSignUp");
		buttonOptSignIn = $("#btnOptSignIn");

		initElements = function() {
			signInSection.show();
			signUpSection.hide();
		}

		toggleSignUp = function() {
			return buttonOptSignUp.on("click", function () {
				signInSection.hide();
				signUpSection.fadeIn("slow");
			});
		};

		toggleSignIn = function() {
			return buttonOptSignIn.on("click", function () {
				signUpSection.hide();
				signInSection.fadeIn("slow");
			});
		};

		initElements();
		toggleSignUp();
		toggleSignIn();

	});
}).call(this);
