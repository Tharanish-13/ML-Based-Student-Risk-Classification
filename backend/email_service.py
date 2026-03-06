import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def send_email(to_email: str, subject: str, content: str):
    """
    Mock send email function.
    In a real application, this would use smtplib or an email provider API.
    """
    logger.info(f"--- Sending Email ---")
    logger.info(f"To: {to_email}")
    logger.info(f"Subject: {subject}")
    logger.info(f"Content: {content}")
    logger.info(f"---------------------")
    
    return True
