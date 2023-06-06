<?php
/**
 * Module partial used to display content in the menu.
 *
 */

?>

<div class="menu menu--desktop">
  <div class="container">
    <ul class="menu__list">
      <li>937-524-6927</li>
      <li>test</li>
    </ul>
      <?php
      if ( has_nav_menu( 'header' ) ) {
        wp_nav_menu([
            'theme_location' => 'header',
            'menu_class'     => 'menu__list',
            'link_class'     => 'menu__link',
            'li_class'       => 'menu__item',
            'container'      => '',
            'depth'          => 2,
            'walker'         => new Header_Nav_Menu(),
        ]);
      }
    ?>
  </div>
</div>