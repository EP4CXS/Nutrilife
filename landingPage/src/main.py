import streamlit as st
import os, base64

st.set_page_config(page_title="NutriLife", layout="wide")

# ---------- State ----------
if "page" not in st.session_state:
    st.session_state.page = "home"

def navigate(page_name):
    st.session_state.page = page_name

# ---------- Helpers ----------
def file_to_base64(path):
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode()

def set_background_image(image_path):
    if not os.path.exists(image_path):
        st.error(f"Background not found: {image_path}")
        return

    ext = os.path.splitext(image_path)[1].lower().lstrip(".")
    mime = "jpeg" if ext in ("jpg", "jpeg") else ext
    b64 = file_to_base64(image_path)
    css = f"""
    <style>
    .stApp {{
      background-image: url("data:image/{mime};base64,{b64}");
      background-size: cover;
      background-position: center center;
      background-repeat: no-repeat;
      background-attachment: fixed;
    }}
    .block-container {{
      background: transparent !important;
      padding-top: 2rem;
      padding-left: 4rem;
      padding-right: 4rem;
    }}
    header, footer {{visibility: hidden; height: 0;}}
    </style>
    """
    st.markdown(css, unsafe_allow_html=True)

# ---------- Paths ----------
BASE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(BASE)   # go up one level (landingPage)

BG = os.path.join(ROOT, "assets", "bg.jpg")
LOGO = os.path.join(ROOT, "assets", "Nlogo.png")
SALADS = [
    os.path.join(ROOT, "assets", "salad1.png"),
    os.path.join(ROOT, "assets", "salad2.png"),
    os.path.join(ROOT, "assets", "salad3.png"),
]


# ---------- Apply background ----------
set_background_image(BG)

# ---------- Navbar ----------
if os.path.exists(LOGO):
    logo_b64 = file_to_base64(LOGO)

else:
    logo_html = "<b style='color:white; font-size:22px;'>NutriLife</b>"

st.markdown(
    f"""
    <style>
    .navbar {{
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: linear-gradient(90deg, #a4dc3e, #047c46);
        padding: 30px 40px;
        border-radius: 40px;
        margin-bottom: 40px;
        margin: 40px auto;
        position: absolute;
        margin-left: 450px;
        z-index: 10000;
        width: 600px;
        height: 70px;
    }}
    .navbar-links {{
        display: flex;
        gap: 60px;
        font-size: 18px;
    }}
    .navbar-links a {{
        color: white;
        text-decoration: none;
        transition: 0.3s;
    }}
    .navbar-links a:hover {{
        transform: scale(1.05);
        text-shadow: 0 2px 6px rgba(51,0,0,);
    }}

    .navbar-login button {{
        background: linear-gradient(90deg, #29c46a, #22a85a);
        color: white !important;
        font-size: 18px;
        padding: 8px 20px;
        border: none;
        border-radius: 30px;
        cursor: pointer;
        transition: all 0.3s ease;
        width: 130px;
        height: 60px;
        margin-left: 200px;
        position: sticky;
        top: 100px
    }}
    .navbar-login button:hover {{
        background: linear-gradient(90deg, #22a85a, #29c46a);
        transform: scale(1.05);
        box-shadow: 0 6px 15px rgba(41,196,106,0.4);
    }}

    .navbar-logo img {{
        position: absolute;
        width: 300px; 
        height: 60px !important;         
        margin-left: 30px;
        margin-top: 50px;
    }}

    </style>

     <div class="navbar-logo">
        <img src="data:image/png;base64,{logo_b64}" alt="NutriLife Logo" style="height:40px; margin-right:20px;">
    </div>

    <div class="navbar">
        <div class="navbar-links">
            <a href="?nav=home">Home</a>
            <a href="?nav=menu">Menu</a>
            <a href="?nav=services">Services</a>
            <a href="?nav=offers">Offers</a>
            <a href="?nav=contacts">Contacts</a>
        </div>
        
    <div class="navbar-login">
        <form method="get">
            <button type="submit" name="nav" value="login">Log In</button>
        </form>
    </div>

    </div>
    """,
    unsafe_allow_html=True,
)
# ---------- Catch Navbar Clicks ----------
params = st.query_params
if "nav" in params:
    st.session_state.page = params["nav"][0]
    st.rerun()   # <- ensures page reload

def home_page():
    left, right = st.columns([0.6, 0.4])

    with left:
        st.markdown(
            """
            <div style="max-width:700px; margin-top:170px;">
              <h1 style="font-size:84px; line-height:0.95; margin:0; color:white; font-weight:800; margin-left: 50px;">
                Your path<br>to better <span style="color:#FFFFFF">meals.</span>
              </h1>
              <p style="font-size:20px; color:#e6e6e6; margin-top: 32px; margin-left: 50px; margin-bottom: 50px;">
                Personalized nutrition planning with an AI-powered meal generator, helping you make choices that match your goals, energy needs, and daily routine.
              </p>
            </div>
            """,
            unsafe_allow_html=True,
        )

                # Add this right before your Get Started button
        st.markdown("""
            <style>
            div.stButton > button:first-child {
                background: linear-gradient(90deg, #29c46a, #22a85a);
                color: white !important;
                font-size: 20px;
                width: 200px;
                height: 70px;
                padding: 14px 40px;
                border: none;
                border-radius: 40px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-family: Poppins;
            }
            div.stButton > button:first-child:hover {
                background: linear-gradient(90deg, #22a85a, #29c46a);
                transform: scale(1.05);
                box-shadow: 0 6px 20px rgba(41,196,106,0.4);
            }
            </style>
            """, unsafe_allow_html=True)

        col1, col2, col3 = st.columns([0.2, 3, 2]) 
        with col2:
            if st.button("Get Started",key="get_started"):
                navigate("login")


    with right:
        encoded_imgs = []
        for img in SALADS:
            if os.path.exists(img):
                encoded_imgs.append("data:image/png;base64," + file_to_base64(img))

    if encoded_imgs:
        st.markdown(
        f"""
        <style>
        .slideshow-container {{
            position: absolute;
            top: -500px;
            right: 10px;
            width: 700px;  
            height: auto;
            animation: slideInOut 5s ease-in-out infinite;
            z-index: 10;
        }}

        @keyframes slideInOut {{
            0% {{ transform: translateX(120%); opacity: 0; }}
            15% {{ transform: translateX(0); opacity: 1; }}
            70% {{ transform: translateX(0); opacity: 1; }}
            85% {{ transform: translateX(120%); opacity: 0; }}
            100% {{ transform: translateX(120%); opacity: 0; }}
        }}
        </style>

        <img id="saladImg" src="{encoded_imgs[0]}" class="slideshow-container"/>

        <script>
        var saladImgs = {encoded_imgs};
        var index = 0;
        setInterval(function(){{
            index = (index + 1) % saladImgs.length;
            document.getElementById("saladImg").src = saladImgs[index];
        }}, 5000);
        </script>
        """,
        unsafe_allow_html=True,
    )


def login_page():
    st.markdown("<h2 style='color:white'>🔐 Log In</h2>", unsafe_allow_html=True)
    
    with st.form("login_form", clear_on_submit=True):
        username = st.text_input("Username")
        password = st.text_input("Password", type="password")
        submitted = st.form_submit_button("Submit")
        
        if submitted:
            st.success(f"Welcome, {username}!")

    if st.button("Back to Home"):
        navigate("home")
        st.rerun()  # force re-render so inputs disappear


def menu_page():
    st.markdown("<h2 style='color:white'>🍽 Menu</h2>", unsafe_allow_html=True)

def services_page():
    st.markdown("<h2 style='color:white'>🛠 Services</h2>", unsafe_allow_html=True)

def offers_page():
    st.markdown("<h2 style='color:white'>🎉 Offers</h2>", unsafe_allow_html=True)

def contacts_page():
    st.markdown("<h2 style='color:white'>📞 Contacts</h2>", unsafe_allow_html=True)

# ---------- Router ----------
if st.session_state.page == "home":
    home_page()
elif st.session_state.page == "login":
    login_page()
elif st.session_state.page == "menu":
    menu_page()
elif st.session_state.page == "services":
    services_page()
elif st.session_state.page == "offers":
    offers_page()
elif st.session_state.page == "contacts":
    contacts_page()
