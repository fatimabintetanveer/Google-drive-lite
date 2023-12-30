// Navbar.jsx

import AuthContext from "@/contexts/AuthContext";
import Link from "next/link";
import React, { useContext } from "react";
import styles from "@/styles/NavbarStyles.module.css";

export default function Navbar() {
  const { user, logoutUser } = useContext(AuthContext);

  return (
    <div className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/cloud">
          <h1>Google Drive Lite</h1>
        </Link>
      </div>
      <div className={styles.links}>
        <Link href="/cloud">
          <h1 className={styles.navLink}>Home</h1>
        </Link>
        {/* Add more navigation links as needed */}
      </div>
      <div className={styles.actions}>
        {user ? (
          <div className={styles.userActions}>
            <div className={styles.action}>{user.username}</div>
            <div className={`${styles.action} ${styles.red}`} onClick={logoutUser}>
              Logout
            </div>
          </div>
        ) : (
          <Link href="/cloud/login">
            <h1 className={styles.navLink}>Login</h1>
          </Link>
        )}
      </div>
    </div>
  );
}
