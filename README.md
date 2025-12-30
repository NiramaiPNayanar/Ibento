# Ibento

Ibento is a role-based event photo and information sharing platform designed for private events such as weddings, parties, and celebrations.

Guests upload photos via a QR page, admins manage users and event content, and superadmins oversee the entire system.

---

## Features

### User Roles

**Guest**
- Login via QR
- Upload photos
- View event menu
- View directions

**Admin**
- Create guest users
- Create and update event menu
- View photos uploaded by their own guests
- Download guest photos

**Super Admin**
- Create admins and guests
- View all users
- Promote or demote admins
- Delete users
- View and download all photos
- Manage menus

---

## Core Functionalities

### Photo Upload (QR Page)
- Guests can upload multiple images
- Images are stored in MongoDB as Base64
- Photos are linked to the uploading user
- Admins and superadmins can view and download them

### Event Menu
- Admin enters menu as free text
- Menu is stored in the database
- Guests can view the menu from the QR page
- Always displays the latest saved menu

### Directions
- Static directions section
- Easily extendable to Google Maps

### Authentication
- Login system with role-based redirects
- Session handled using localStorage
- Automatic routing based on user role

---

## Tech Stack

### Frontend
- HTML5
- CSS3 (HTML5 UP template)
- Vanilla JavaScript
- LocalStorage for session handling

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

---

## Project Structure

project-root  
backend  
├── models  
│   └── User.js  
├── routes  
│   ├── auth.js  
│   ├── users.js  
│   ├── photos.js  
│   └── menu.js  
└── server.js  

admins  
└── admin  
    ├── admin_dashboard.html  
    ├── superadmin_dashboard.html  
    └── assets  
        ├── admin.js  
        └── superadmin.js  

QR  
└── qr page  
    ├── qr_login.html  
    └── qr_main.html  

README.md  

---

## Setup Instructions

### 1. Clone the repository

git clone <your-repository-url>  
cd ibento  

### 2. Install backend dependencies

cd backend  
npm install  

### 3. Start MongoDB

Make sure MongoDB is running locally:

mongod  

### 4. Start backend server

node server.js  

Backend runs at:

http://localhost:5000  

---

## Default Application Flow

1. Superadmin creates admin accounts  
2. Admin creates guest users  
3. Guest logs in via QR login page  
4. Guest uploads photos and views menu  
5. Admin views and downloads guest photos  
6. Superadmin manages everything  

---

## API Overview

### Authentication
POST /api/auth/login  

### Users
GET /api/users  
POST /api/users  
PATCH /api/users/:id/role  
DELETE /api/users/:id  

### Photos
POST /api/photos/upload  

### Menu
GET /api/menu  
POST /api/menu  

Protected routes require headers:

x-user-id  
x-user-role  

