# 🎓 Scholars - Frontend

A fully-featured scholarship management system frontend built with React.js. This platform allows students to explore universities, apply for scholarships, and share reviews. It supports multiple user roles—User, Moderator, and Admin—with dedicated dashboards and permissions.

## 🌐 Live Site

[Visit Scholars](https://scholars-6f085.web.app)

## 🚀 Purpose

To help students easily browse, apply, and track university scholarships globally, while providing moderators and admins control over scholarship postings, user applications, and reviews.

## 🔑 Key Features

- 🔐 Authentication (Email/password + Google login)
- 🎯 Role-based dashboards: User, Moderator, Admin
- 🧾 Apply for scholarships (with form + payment)
- ⭐ Leave/edit/delete reviews with ratings
- 📥 JWT token with `httpOnly` cookie authentication
- 🧠 Protected routes and error handling
- 🔍 Search and filter on the All Scholarship page
- 📱 Fully responsive design
- 📊 Optional Chart page for Admin analytics
- 🧾 Pagination, sorting, and filtering (Challenge tasks)
- 📷 Image upload via **imgbb** for logos/photos

## 🧰 Tech Stack

- React.js
- React Router DOM
- TailwindCSS + DaisyUI
- Firebase Auth
- Axios + Axios Interceptor
- React Hook Form + Yup
- React Query (TanStack)
- SweetAlert2
- Swiper.js
- JWT (with Secure Cookie)
- Stripe (for payment)

## 📁 Folder Structure

- `/src/components` – Reusable UI components
- `/src/pages` – Screens for different routes
- `/src/hooks` – Custom hooks (`useAuth`, `useAxiosSecure`)
- `/src/routes` – Private/Admin/Moderator route handling

## 🔐 Environment Variables


---

### 🔗 GitHub Repo

[Frontend GitHub Repo](https://github.com/shahedul-alam/scholars-client)
