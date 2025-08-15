import os
from app import create_app

app = create_app()

if __name__ == "__main__":
    # Useful to allow a PORT env var when testing or containerizing
    port = int(os.getenv("PORT", 5000))
    app.run(debug=True, host="127.0.0.1", port=port)
