<?php
/**
 * Theme functions
 */

// theme settings
function theme_settings() {
  add_theme_support('title-tag');
  add_theme_support('post-thumbnails');
  add_editor_style(['https://cloud.typography.com/7879216/6217192/css/fonts.css', get_theme_file_uri('/dist/css/style.css')]);
  register_nav_menus([
    'header' => 'Header',
    'legal'  => 'Legal',
  ]);
  add_image_size( 'desktop-billboard', 1920, 400, true );
  add_image_size( 'mobile-billboard', 768, 160, true );
  add_image_size( 'headlines', 768, 512, true );
  add_image_size( 'profiles', 360, 360, true );
  add_image_size( 'feature', 630, 420, true );
  add_image_size( 'cross-sell', 442, 315, true );
  add_image_size( 'staff', 300, 375, true );
  add_image_size( 'featured-service', 280, 350, true );
  add_image_size( 'slider', 1024, 683, array( 'center', 'center' ) );
  add_image_size( 'product', 157, 280, true );
  add_image_size( 'gallery', 260, 260, true );
  if (function_exists('acf_add_options_page')) {
    acf_add_options_page(array(
      'page_title' 	=> 'Site Options',
      'menu_title'	=> 'Site Options',
      'redirect'		=> false
    )
    );
  }
}
add_action('after_setup_theme', 'theme_settings');
  
  
require_once __DIR__ . '/includes/widgets/und-tag-widget.php';
require_once __DIR__ . '/includes/widgets/social-widget.php';



/**
 * Enque CSS.
 */
function theme_css() {
  wp_enqueue_style( 'theme-fonts', 'https://cloud.typography.com/7879216/6217192/css/fonts.css', [], null, 'screen' );
  wp_enqueue_style( 'theme-main', get_theme_file_uri( '/dist/css/style.css' ), [], null, 'screen' );
}
add_action( 'wp_enqueue_scripts', 'theme_css' );
  
/**
 * Enque JS.
 */
function theme_js() {

  wp_enqueue_script( 'cdn-polyfill', 'https://cdn.polyfill.io/v2/polyfill.min.js', [], null, true );
  wp_enqueue_script( 'jquery', 'https://code.jquery.com/jquery-2.2.4.min.js', [], null, true );
  wp_enqueue_script( 'theme-main', get_theme_file_uri( '/dist/js/script.js' ), [], null, true );
  wp_enqueue_script( 'cdn-cloudflare', 'https://cdnjs.cloudflare.com/ajax/libs/chosen/1.8.5/chosen.jquery.min.js', [], null, true );
  wp_enqueue_script( 'custom', get_theme_file_uri( '/js/custom.js' ), [], null, true );

  if ( ( ! is_admin() ) && is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'theme_js' );



/**
 * add custom mce style formats
 */
function custom_mce_before_init($settings)
{
  $style_formats = [
    [
      'title'    => '(Link) Button Underline',
      'selector' => 'a',
      'classes'  => 'button--link'
    ],
    [
      'title'    => '(Link) Button Square',
      'selector' => 'a',
      'classes'  => 'button'
    ],
    [
      'title'    => '(Link) Button Square Full Width',
      'selector' => 'a',
      'classes'  => 'button button--icon'
    ],
    [
      'title'    => 'Serif Font',
      'selector' => 'p',
      'classes'  => 'serif-large'
    ],
  ];
  $settings['style_formats'] = json_encode($style_formats);
  $settings['block_formats'] = "Paragraph=p; Heading 2=h2; Heading 3=h3; Heading 4=h4; Heading 5=h5; Heading 6=h6;Preformatted=pre";
  return $settings;
  
}
add_filter('tiny_mce_before_init', 'custom_mce_before_init');

/**
 * Register main sidebar.
 */
function register_main_sidebar() {
	register_sidebar(
		array (
			'name'          => __( 'Main Sidebar', 'und-blog' ),
			'id'            => 'main-sidebar',
			'description'   => __( 'Widgets in this area will be shown on all posts and pages.', 'und-blog' ),
			'before_widget' => '<div class="widget %2$s"><div class="widget-content">',
			'after_widget'  => "</div></div>",
			'before_title'  => '<h2 class="widget-title subheading heading-size-3">',
			'after_title'   => '</h2>',
		)
  );
}
add_action( 'widgets_init', 'register_main_sidebar' );

function remove_editor() {
  remove_post_type_support('page', 'editor');
}
add_action('admin_init', 'remove_editor');

/**
 * Register custom widgets.
 */
function register_widgets_sidebar() {
  register_widget( 'und_custom_tag_widget' );
  register_widget( 'und_social_widget' );
}
add_action( 'widgets_init', 'register_widgets_sidebar' );


/**
 * Register custom footer menus.
 */
function register_footer_menus() {
  register_nav_menu( 'footer_submenu_1',__( 'Footer Menu 1' ) );
  register_nav_menu( 'footer_submenu_2',__( 'Footer Menu 2' ) );
}
add_action( 'init', 'register_footer_menus' );

/**
 * Show ACF Menu on Local Dev only.
 */
function hide_acf_menu_item() {
  return !( ( strpos( get_bloginfo('url'), 'lndo' ) === false ) && ( strpos( get_bloginfo( 'url' ), 'edu.und' ) === false ) );
}
//add_filter( 'acf/settings/show_admin', 'hide_acf_menu_item' );

/**
 * Add link target if it exists.
 */
function link_target( $link ) {
  $target = $link['target'];
  echo $target ? "target='$target'" : '';
}


//shortcode for google reviews

function get_google_reviews() {
  $url = "https://maps.googleapis.com/maps/api/place/details/json?key=AIzaSyAU1shg1tZLobdifdMC3jEuaUQykd65irk&placeid=ChIJr-dLRfeOOIgRbhQgGLK7Pq0";
  $ch = curl_init();
  curl_setopt ($ch, CURLOPT_URL, $url);
  curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
  $result = curl_exec ($ch);
  $res        = json_decode($result,true);
  $reviews    = $res['result']['reviews'];
  $results = "";
  

    foreach($reviews  as $review) {

    $ratings = "";


    for ($i = 0; $i < 5; $i++){

      $ratings .= '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
         viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
      <g>
        <g>
        <polygon points="512,197.816 325.961,185.585 255.898,9.569 185.835,185.585 0,197.816 142.534,318.842 95.762,502.431 255.898,401.21 416.035,502.431 369.263,318.842"/>
        </g>
      </g>
      </svg>';

    }   

    $template = '<div class="splash__slide">
        <div class="splash__media">
       <h2 class="google_review_heading">Google Reviews</h2>

       <div class="star__box">' 
      
       . $ratings .
      
     '</div>
       <p class="google__review">' . $review["text"] .'</span>  
       <span class="googe__review__attribution">~ ' .  $review["author_name"]  . '</span>  
        </div>
       </div>';

    $results .= $template;
  }
  return $results;
  }

add_shortcode('google_reviews', 'get_google_reviews');
  
/**
 * Get root id.
 */
function get_root_id( $current ) {
  $parent = wp_get_post_parent_id( $current );
  return $parent ? get_root_id( $parent ) : $current;
}

function add_menu_link_class( $atts, $item, $args ) {
  if ( property_exists($args, 'link_class') ) {
    $atts['class'] = $args->link_class;
  }
  return $atts;
}
add_filter( 'nav_menu_link_attributes', 'add_menu_link_class', 1, 3 );

/**
 * Inline svg function.
 */
function svgstore( $svg, $title ) {
  $output = '<span class="svgstore svgstore--'. $svg . '">
    <svg>
      ' . ($title ? '<title>' . $title . '</title>' : '' ) . '
      <use xlink:href="#svgstore--' . $svg . '"></use>
    </svg>
  </span>';
  return $output;
}

/**
 * Filter the output of Yoast breadcrumbs so each item is an <li> with schema markup
 * @param $link_output
 * @param $link
 *
 * @return string
 */
function filter_yoast_breadcrumb_items( $link_output, $link ) {

  if(strpos( $link_output, 'breadcrumb_last' ) !== false ) {
    $new_link_output = '<li class="breadcrumb__item current">' . $link['text'] . '</li>';
  }
  else {
    $new_link_output = '<li class="breadcrumb__item"><a href="' . $link['url'] . '" class="breadcrumb__link">' . $link['text'] . '</a></li>';
  }

	return $new_link_output;
}
add_filter( 'wpseo_breadcrumb_single_link', 'filter_yoast_breadcrumb_items', 10, 2 );


/**
 * Filter the output of Yoast breadcrumbs to remove <span> tags added by the plugin
 * @param $output
 *
 * @return mixed
 */
function filter_yoast_breadcrumb_output( $output ){

	$from = '<span>';
	$to = '</span>';
	$output = str_replace( $from, $to, $output );

	return $output;
}
add_filter( 'wpseo_breadcrumb_output', 'filter_yoast_breadcrumb_output' );


/**
 * Shortcut function to output Yoast breadcrumbs
 * wrapped in the appropriate markup
 */
function breadcrumbs() {
	if ( function_exists('yoast_breadcrumb') ) {
        yoast_breadcrumb('<ul class="breadcrumb__list">', '</ul>');
	}
}

function author_meta() {
  $display_author  = get_field( 'display_author', 'options' );
  $author_per_post = get_field( 'display_author' );
  $author_name     = get_the_author_meta( 'display_name', get_the_author_meta('ID') );

  if ( is_single() && ( ! empty( $display_author ) ) || ( "show" === $author_per_post ) ) { 
    echo '<meta name="author" content="' . esc_html( $author_name ) .'" />';
  }
}
add_action('wp_head', 'author_meta');

/**
 * Custom walker class.
 */
class Header_Nav_Menu extends Walker_Nav_Menu {
  
  /**
   * Starts the list before the elements are added.
   *
   * Adds classes to the unordered list sub-menus.
   *
   * @param string $output Passed by reference. Used to append additional content.
   * @param int    $depth  Depth of menu item. Used for padding.
   * @param array  $args   An array of arguments. @see wp_nav_menu()
   */
  function start_lvl( &$output, $depth = 0, $args = array() ) {
      // Depth-dependent classes.
      $indent = ( $depth > 0  ? str_repeat( "\t", $depth ) : '' ); // code indent
      $display_depth = ( $depth + 1); // because it counts the first submenu as 0
      
      $classes = array(
          ( $display_depth % 2  ? 'menu__list--sub' : 'nav__list--sub' ),
          ( $display_depth >=2 ? 'menu__list--sub' : 'nav__list--sub' ),
      );
      

      $class_names = implode( ' ', $classes );

      // Build HTML for output.
      if ($display_depth >= 1) {
        $output .= "<button class='menu__link--toggle' tabindex='-1'><span class='hide'>Toggle Menu</span></button>" . "\n" . $indent . '<ul class="' . $class_names . '">' . "\n";
      } else {
        $output .= "\n" . $indent . '<ul class="' . $class_names . '">' . "\n";
      }
      
  }

  /**
   * Start the element output.
   *
   * Adds main/sub-classes to the list items and links.
   *
   * @param string $output Passed by reference. Used to append additional content.
   * @param object $item   Menu item data object.
   * @param int    $depth  Depth of menu item. Used for padding.
   * @param array  $args   An array of arguments. @see wp_nav_menu()
   * @param int    $id     Current item ID.
   */
  function start_el( &$output, $item, $depth = 0, $args = array(), $id = 0 ) {
      global $wp_query;
      $indent = ( $depth > 0 ? str_repeat( "\t", $depth ) : '' ); // code indent

      // Depth-dependent classes.
      $depth_classes = array(
          ( $depth == 0 ? 'menu__item' : 'menu__item--sub' ),
          ( $depth >=2 ? 'menu__item--sub' : '' ),
      );
      $depth_class_names = esc_attr( implode( ' ', $depth_classes ) );

      // Build HTML.
      $output .= $indent . '<li class="' . $depth_class_names . '">';

      // Link attributes.
      $attributes  = ! empty( $item->attr_title ) ? ' title="'  . esc_attr( $item->attr_title ) .'"' : '';
      $attributes .= ! empty( $item->target )     ? ' target="' . esc_attr( $item->target     ) .'"' : '';
      $attributes .= ! empty( $item->xfn )        ? ' rel="'    . esc_attr( $item->xfn        ) .'"' : '';
      $attributes .= ! empty( $item->url )        ? ' href="'   . esc_attr( $item->url        ) .'"' : '';

      $isbutton = in_array("button--icon", $item->classes, TRUE) || in_array("button", $item->classes, TRUE);
      
      $attributes .= ! empty( $isbutton )        ? ' class="button button--icon"' : ' class="menu__link"' ;
      
      
      // Build HTML output and pass through the proper filter.
      $item_output = sprintf( '%1$s<a%2$s>%3$s%4$s%5$s</a>%6$s',
          $args->before,
          $attributes,
          $args->link_before,
          apply_filters( 'the_title', $item->title, $item->ID ),
          $args->link_after,
          $args->after
      );
      $output .= apply_filters( 'walker_nav_menu_start_el', $item_output, $item, $depth, $args );
  }
}



// services
function create_services_post_type() {
 
    register_post_type( 'Services',
    // CPT Options
        array(
            'labels' => array(
                'name' => __( 'Services' ),
                'singular_name' => __( 'Service' )
            ),
            'public' => true,
            'supports' => array('title', 'thumbnail'),
            'show_in_rest' => true,
            'menu_icon' => 'dashicons-cart',
            'has_archive' => false,
 
        )

    );
}
// Hooking up our function to theme setup
add_action( 'init', 'create_services_post_type' );


// services
function create_faqs_post_type() {
 
    register_post_type( 'FAQs',
    // CPT Options
        array(
            'labels' => array(
                'name' => __( 'FAQs' ),
                'singular_name' => __( 'FAQ' )
            ),
            'public' => true,
            'has_archive' => true,
            'rewrite' => array('with_front' => false, 'slug' => 'faq'),
            'supports' => array('title', 'thumbnail', 'menu'),
            'show_in_rest' => true,
            'menu_icon' => 'dashicons-media-text',
            'exclude_from_search' => true

        )

    );
}
// Hooking up our function to theme setup
add_action( 'init', 'create_faqs_post_type' );


// products
function create_products_post_type() {
 
    register_post_type( 'Products',
    // CPT Options
        array(
            'labels' => array(
                'name' => __( 'Products' ),
                'singular_name' => __( 'Product' )
            ),
            'public' => true,
            'publicly_queryable'  => false,
            'has_archive' => false,
            'has_single' => false,
            'supports' => array('title', 'thumbnail'),
            'show_in_rest' => true,
            'menu_icon' => 'dashicons-products',
            'exclude_from_search' => true

 
        )

    );
}
// Hooking up our function to theme setup
add_action( 'init', 'create_products_post_type' );



// memberships
function create_member_ship_post_type() {
 
    register_post_type( 'Memberships',
    // CPT Options
        array(
            'labels' => array(
                'name' => __( 'Memberships' ),
                'singular_name' => __( 'Membership' )
            ),
            'public' => true,
            'has_archive' => true,
            'rewrite' => array('with_front' => false, 'slug' => 'memberships'),
            'supports' => array('title', 'thumbnail'),
            'show_in_rest' => true,
            'menu_icon' => 'dashicons-tickets-alt',
 
        )

    );
}
// Hooking up our function to theme setup
add_action( 'init', 'create_member_ship_post_type' );


// staff
function create_staff_post_type() {
 
    register_post_type( 'Staff',
    // CPT Options
        array(
            'labels' => array(
                'name' => __( 'Staff' ),
                'singular_name' => __( 'Staff' )
            ),
            'public' => true,
            'has_archive' => false,
            'rewrite' => array('with_front' => false, 'slug' => 'staff'),
            'supports' => array('title', 'thumbnail'),
            'show_in_rest' => true,
            'menu_icon' => 'dashicons-groups',
 
        )

    );
}
// Hooking up our function to theme setup
add_action( 'init', 'create_staff_post_type' );


//hook into the init action and call create_book_taxonomies when it fires
 
add_action( 'init', 'create_subjects_hierarchical_taxonomy', 0 );
 
//create a custom taxonomy name it subjects for your posts
 
function create_subjects_hierarchical_taxonomy() {
 
// Add new taxonomy, make it hierarchical like categories
//first do the translations part for GUI
 
  $labels = array(
    'name' => _x( 'Product Category', 'product category' ),
    'singular_name' => _x( 'Product Category', 'product category' ),
    'search_items' =>  __( 'Search Product Categories' ),
    'all_items' => __( 'All Product Categories' ),
    'parent_item' => __( 'Parent Category' ),
    'parent_item_colon' => __( 'Parent Category:' ),
    'edit_item' => __( 'Edit Category' ), 
    'update_item' => __( 'Update Category' ),
    'add_new_item' => __( 'Add New Category' ),
    'new_item_name' => __( 'New Category Name' ),
    'menu_name' => __( 'Categories' ),
  );    
 
// Now register the taxonomy
  register_taxonomy('product_categories',array('products'), array(
    'hierarchical' => false,
    'labels' => $labels,
    'show_ui' => true,
    'show_in_rest' => true,
    'show_admin_column' => true,
    'query_var' => true
  ));
 
}

/**
 * Custom li class.
 */
function wp_nav_menu_custom_li_class( $classes, $item, $args ) {
  if( isset( $args->li_class ) ) {
      $classes[] = $args->li_class;
  }
  return $classes;
}
add_filter('nav_menu_css_class', 'wp_nav_menu_custom_li_class', 1, 3);

// load custom theme classes
require_once('classes/class-und-walker-comment.php');

function move_yoast_to_bottom() {
    return 'low';
}
add_filter( 'wpseo_metabox_prio', 'move_yoast_to_bottom');

/**
 * Child theme support for acf-json
 * This will load acf-json from the parent theme first.
 * That way if a child theme's acf-json folder contains a .json
 * file with the same name as the parent, it will get loaded second
 */
add_filter('acf/settings/save_json', function() {
  return get_stylesheet_directory() . '/acf-json';
});

add_filter('acf/settings/load_json', function($paths) {
  // $paths will already include the result of get_stylesheet_directory ie. parent theme's acf-json
  if(is_child_theme()) {
    $paths[] = get_template_directory() . '/acf-json';
  }
  return $paths;
});