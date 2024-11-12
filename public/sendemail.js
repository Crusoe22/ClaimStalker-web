function sendMail() {
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

  const serviceID = "service_y39lgic";
  const templateID = "template_4xdsmtr";

  emailjs.send(serviceID, templateID, params)
      .then(res => {
          document.getElementById("email").value = "";
          document.getElementById("name").value = "";
          document.getElementById("policyNumber").value = "";
          document.getElementById("insuranceCompany").value = "";
          document.getElementById("claimDate").value = "";
          document.getElementById("autoLoss").value = "";
          document.getElementById("propertyLoss").value = "";
          document.getElementById("location").value = "";
          document.getElementById("description").value = "";
          document.getElementById("phone").value = "";
          console.log(res);
          alert("Your claim was sent successfully!");
      })
      .catch(err => console.log(err));
}
