import sys
import urllib.parse
import webbrowser


def open_gmail_compose(email_id, message=""):
    """
    Opens the default web browser to a new Gmail compose window
    pre-filled with the provided email address and body message.
    """
    # Clean up the email just in case there's extra whitespace
    clean_email = email_id.strip()

    # Construct the Gmail compose URL
    # view=cm: Compose message
    # fs=1: Full screen (optional but often looks better)
    # to=: The recipient email address
    # body=: The email body content
    encoded_message = urllib.parse.quote(message)
    url = f"https://mail.google.com/mail/?view=cm&fs=1&to={clean_email}&body={encoded_message}"

    print(f"Opening Gmail to compose an email to: {clean_email}")

    # Open the constructed URL in the default browser
    webbrowser.open(url)

    print("Email automation complete. Browser should be open.")


if __name__ == "__main__":
    # Check if an email address was passed as a command-line argument
    if len(sys.argv) > 1:
        target_email = sys.argv[1]
        if len(sys.argv) > 2:
            open_gmail_compose(target_email, sys.argv[2])
        else:
            open_gmail_compose(target_email)
    else:
        print("Error: No email address provided.")
        print("Usage: python email_automation.py <email_address> [message]")
