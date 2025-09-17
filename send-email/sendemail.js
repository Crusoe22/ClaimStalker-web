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
  
    fetch('/submit-and-send-email', {   // ✅ match your backend route
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    })
    .then(res => res.text())
    .then(message => {
      alert(message);
    })
    .catch(err => console.error(err));
}
