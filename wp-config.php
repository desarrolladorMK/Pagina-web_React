<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * Localized language
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'dbsxsa8mutnenq' );

/** Database username */
define( 'DB_USER', 'u31ujkpjmickx' );

/** Database password */
define( 'DB_PASSWORD', 'rueq3gxlakqp' );

/** Database hostname */
define( 'DB_HOST', '127.0.0.1' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',          '-wK|!}Z$PM}:xYs^%Lm4]4J}0B/|N}T%y,(g&BVuJ6&7j@@59m:rk/W!z0=&~_~w' );
define( 'SECURE_AUTH_KEY',   'S{c8<#1 99Sp!aT%AVS5GbPzVJ}}VTT{5q?PjdqFd;Q*!FGX(2+E% z7.dqGB74:' );
define( 'LOGGED_IN_KEY',     'vRCFF[<eb!kDxp1Z6rN4cFrlnPxpdv 1J67JC(-l~V?|QtL|qqbqESJ`zGG9|FyD' );
define( 'NONCE_KEY',         '0_3^<irW~;wP&k+B4o0}H,}x-+fyt5<R*eUG,e^rL{Q~qJL1js_F@4M/X2lzK_BH' );
define( 'AUTH_SALT',         '!/n89<d6(wZrWZI`mFSTBre|`$%)%*^VbdGT>95]$+:q6]+{.g~-Bf}>Cn$){/07' );
define( 'SECURE_AUTH_SALT',  'hf|gHQ-F@|R=JzJ?fLi&@nylN2|&NdL&+QvyXQOPwKHQr3M=+E_<DixbUZE~f7:u' );
define( 'LOGGED_IN_SALT',    '@cISytx|{!gF(T=J_K]|>p2`X(K?QhuD5ASH|t^Z?0r(Q,KpQOD/H#mc4N sY5gw' );
define( 'NONCE_SALT',        'h.GI&Nla-)tK>e`G k.o,{MFT$pB|(o_)F)BMD/p8,iduZel&;}><@msWP{z>3hF' );
define( 'WP_CACHE_KEY_SALT', '[od<Y}mBMy7.1D<*l_PZ`bc/0LG9GV_y@D_d6uF&fO@PI-?0+4Upu/6=4uf<u[D!' );


/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'huv_';


/* Add any custom values between this line and the "stop editing" line. */



/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
if ( ! defined( 'WP_DEBUG' ) ) {
	define( 'WP_DEBUG', false );
}

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
@include_once('/var/lib/sec/wp-settings-pre.php'); // Added by SiteGround WordPress management system
require_once ABSPATH . 'wp-settings.php';
@include_once('/var/lib/sec/wp-settings.php'); // Added by SiteGround WordPress management system
