import streamlit as st
import base64
import streamlit.components.v1 as components

st.set_page_config(page_title="Nutrilife", layout="wide")


# ---------- LOAD THE HOMEPAGE IMAGE ----------

def homepage_image(image_file):
    with open(image_file, "rb") as f:
        data = f.read()
    return base64.b64encode(data).decode()

image = homepage_image("assets/plate.png")
adobo = homepage_image("assets/adobo.png")
saging = homepage_image("assets/saging.png")
tinola = homepage_image("assets/tinola.png")



# ---------- LOAD THE CSS ----------
def homepage_css(file_css):
    with open(file_css) as f:
        st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

homepage_css("style/homepage.css")
homepage_css("style/mobileView.css")


# ------------ LOAD HTML -------------
def homepage_html(file_html, **kwargs):
    with open(file_html, "r") as f:
        html = f.read()
    if kwargs:
        html = html.format(**kwargs)
    st.markdown(html, unsafe_allow_html=True)

homepage_html("html/homepage.html", image=image, adobo=adobo, saging=saging, tinola=tinola)
