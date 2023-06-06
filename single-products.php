<?php
/**
 * Template for single product
 *
 */

get_header(); ?>


<?php

$headline_text = get_sub_field('headline_text');
$featured_image = get_field('image');
$size = 'feature';
$description = get_field('description');
$benefit = get_field('benefit');
$nutrition = get_field('nutrition');
$purchase_link = get_field('purchase_link');
$container_type = "";



if ($narrow) {
  $container_type = "ous callout-full-width callout-full-width--img container container--slim container--clear my-fluid";
}else{
  $container_type = "ous callout-full-width callout-full-width--img container container--clear my-fluid";
}
?>

<div class="<?php echo $container_type ?>" style="margin-bottom:0 !important;">
  <div class="grid grid--vcenter non__aligned">
         <div class="callout-full-width__text grid__item grid__item--2 mt-xs mt-sm-none zero">
             <span class="headline_text">
                  <?php echo $headline_text; ?>
               </span>
               <div class="landing-featured__media media" style="margin-top:3rem;">
                <?php if($featured_image) { ?>
               <?php echo wp_get_attachment_image( $featured_image, $size );?>
              <?php }?>
              </div>
          </div>
          <div class="callout-full-width__media grid__item grid__item--2">

           
          	 <h1 class="service__title">
              <?php 
                if ( !is_front_page() ) :
                  the_title();
                endif;
              ?>
             </h1>
     
            <p class="product__benefit">
                Benefit
               </p>
               <p class="">
                <?php echo $benefit;?>
               </p>
               <br>
               <p class="product__benefit">
                Nutrients
               </p>
               <p class="">
                <?php echo $nutrition;?>
               </p>
            <?php if($purchase_link) {?>
            <ul class="button-group my-fluid ally-focus-within">

               <li><a href="<?php echo $purchase_link["url"];?>" class="button ally-focus-within"><?php echo $purchase_link["title"];?></a></li>

              </ul>
            <?php }?>
        </div>
    </div>
</div>



<?php
wp_reset_postdata();
get_footer();