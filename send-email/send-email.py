#TODO: Write python code that sends emails 

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Email credentials
sender_email = r"nolanmmoss@gmail.com"
password = r"emet pnlp sdhm fhpk"  # Use your App Password or Gmail account password
receiver_email = r"s573653@nwmissouri.edu"  # Replace with the recipient's email

# Email content
subject = "Automated Email"
body = """\
Hi,

This is an automated email sent using Python.

Best regards,
Nolan
"""

# Create the email
message = MIMEMultipart()
message["From"] = sender_email
message["To"] = receiver_email
message["Subject"] = subject

# Attach the email body
message.attach(MIMEText(body, "plain"))

# Send the email
try:
    # Connect to the Gmail SMTP server
    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()  # Upgrade the connection to a secure encrypted SSL/TLS connection
        server.login(sender_email, password)  # Log in to your Gmail account
        server.sendmail(sender_email, receiver_email, message.as_string())  # Send the email
        print("Email sent successfully!")
except Exception as e:
    print(f"Error sending email: {e}")
