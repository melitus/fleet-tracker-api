const registration = function(companyLogo, verificationUrl) {
	return (
		`
			<mjml>
			  <mj-body>
			    <mj-section background-color="#f0f0f0">
			      <mj-column>
			        <mj-image width="200"
              src=${companyLogo} />
 			      </mj-column>
			    </mj-section>
			    <mj-section>
			    	<mj-text>
			    		Hi, thank you for registering. We are happy to have you on-board. Please click on the button below to verify your account
			    	</mj-text>
			    </mj-section>
			    <mj-section>
			    	<mj-button href=${verificationUrl} background-color="#F45E43"> Verify </mj-button>
			    </mj-section>
			  </mj-body>
			</mjml>
		`
	);
};

module.exports = registration;