# README = """

# Ibento

# ======

# 

# Ibento is a role-based event photo and information sharing platform designed for

# private events such as weddings, parties, or celebrations.

# 

# Guests can upload photos via a QR link, admins manage users and event content,

# and superadmins control the entire system.

# 

# ------------------------------------------------------------

# FEATURES

# ------------------------------------------------------------

# 

# USER ROLES

# 

# Guest

# \- Login via QR

# \- Upload photos

# \- View event menu

# \- View directions

# 

# Admin

# \- Create guest users

# \- Upload and manage event menu

# \- View photos uploaded by their own guests

# \- Download guest photos

# 

# Super Admin

# \- Create admins and guests

# \- View all users

# \- Promote / demote admins

# \- Delete users

# \- View and download all photos

# \- Manage menus

# 

# ------------------------------------------------------------

# CORE FUNCTIONALITIES

# ------------------------------------------------------------

# 

# PHOTO UPLOAD (QR PAGE)

# \- Guests upload multiple photos

# \- Images are stored in MongoDB as Base64

# \- Photos are linked to the uploading user

# \- Admins \& superadmins can view and download them

# 

# EVENT MENU

# \- Admin enters menu as free text

# \- Menu is stored in database

# \- Guests can view the menu from the QR page

# \- Always shows the latest saved menu

# 

# DIRECTIONS

# \- Static directions section

# \- Easily extendable to Google Maps

# 

# AUTHENTICATION

# \- Login system with role-based redirects

# \- Session stored using localStorage

# \- Automatic routing based on role

# 

# ------------------------------------------------------------

# TECH STACK

# ------------------------------------------------------------

# 

# FRONTEND

# \- HTML5

# \- CSS3 (HTML5 UP Template)

# \- Vanilla JavaScript

# \- LocalStorage for session handling

# 

# BACKEND

# \- Node.js

# \- Express.js

# \- MongoDB

# \- Mongoose

# 

# ------------------------------------------------------------

# PROJECT STRUCTURE

# ------------------------------------------------------------

# 

# project-root/

# |

# |-- backend/

# |   |-- models/

# |   |   |-- User.js

# |   |

# |   |-- routes/

# |   |   |-- users.js

# |   |   |-- auth.js

# |   |   |-- photos.js

# |   |   |-- menu.js

# |   |

# |   |-- server.js

# |

# |-- admins/

# |   |-- admin/

# |   |   |-- admin\_dashboard.html

# |   |   |-- superadmin\_dashboard.html

# |   |   |-- assets/

# |   |       |-- admin.js

# |   |       |-- superadmin.js

# |

# |-- QR/

# |   |-- qr page/

# |       |-- qr\_login.html

# |       |-- qr\_main.html

# |

# |-- README.md

# 

# ------------------------------------------------------------

# SETUP INSTRUCTIONS

# ------------------------------------------------------------

# 

# 1\. Clone the repository

# 

# git clone <your-repo-url>

# cd ibento

# 

# 2\. Install backend dependencies

# 

# cd backend

# npm install

# 

# 3\. Start MongoDB

# 

# Make sure MongoDB is running locally:

# mongod

# 

# 4\. Start backend server

# 

# node server.js

# 

# Backend runs at:

# http://localhost:5000

# 

# ------------------------------------------------------------

# DEFAULT FLOW

# ------------------------------------------------------------

# 

# 1\. Superadmin creates Admin

# 2\. Admin creates Guests

# 3\. Guest logs in via QR Login page

# 4\. Guest uploads photos and views menu

# 5\. Admin views and downloads guest photos

# 6\. Superadmin oversees everything

# 

# ------------------------------------------------------------

# API OVERVIEW

# ------------------------------------------------------------

# 

# Authentication

# \- POST /api/auth/login

# 

# Users

# \- GET /api/users

# \- POST /api/users

# \- PATCH /api/users/:id/role

# \- DELETE /api/users/:id

# 

# Photos

# \- POST /api/photos/upload

# 

# Menu

# \- GET /api/menu

# \- POST /api/menu

# 

# All routes are role-protected using headers:

# x-user-id

# x-user-role

# 

# ------------------------------------------------------------

# NOTES \& LIMITATIONS

# ------------------------------------------------------------

# 

# \- Passwords are stored in plain text (demo purpose only)

# \- No JWT authentication yet

# \- Images stored as Base64

# \- No email verification

# 

# ------------------------------------------------------------

# FUTURE IMPROVEMENTS

# ------------------------------------------------------------

# 

# \- JWT authentication

# \- Password hashing with bcrypt

# \- Image storage using S3 / Cloudinary

# \- Admin analytics dashboard

# \- Menu formatting with sections and prices

# \- Multi-event support

# 

# ------------------------------------------------------------

# AI TOOLS USED

# ------------------------------------------------------------

# 

# ChatGPT

# \- Backend logic design

# \- Role-based access control

# \- Debugging MongoDB \& Express issues

# \- UI behavior fixes

# \- Documentation generation

# 

# ------------------------------------------------------------

# LICENSE

# ------------------------------------------------------------

# 

# This project is intended for educational and internal event usage.

# 

# ------------------------------------------------------------

# ACKNOWLEDGEMENTS

# ------------------------------------------------------------

# 

# HTML5 UP (UI Template)

# MongoDB \& Express community

# Event guests who upload memories

# """

# 

