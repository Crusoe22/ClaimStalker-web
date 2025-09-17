function sendMail(event) {
    console.log("sendMail function is called");
    var params = {
      email: document.getElementById("email").value,
      name: document.getElementById("name").value,
      policyNumber: document.getElementById("policyNumber").value,
      insuranceCompany: document.getElementById("insuranceCompany").value,
      claimDate: document.getElementById("claimDate").value,
      autoLoss: document.getElementById("autoLoss").value,
      propertyLoss: document.getElementById("propertyLoss").value,
      location: document.getElementById("location").value,
      description: document.getElementById("description").value,
      phone: document.getElementById("phone").value
    }; 
  
    fetch('/sendtest-email', {   // relative path (works on Render)
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("Your claim was submitted successfully!");
      } else {
        alert("Failed to send the email. Please try again.");
      }
    })
    .catch(err => console.error(err));
}
