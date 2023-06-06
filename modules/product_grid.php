
<div class="ous landing-featured py-fluid">
 <div class="container container--narrow">

      <?php 
         $featured_product_category = get_sub_field("featured_product_category");
         $id = $featured_product_category->term_id;
         $term_name = get_term( $id )->name;
         $term_description = get_term( $id )->description;
         $display_title = get_sub_field("display_title");
         $display_description = get_sub_field("display_description");
         $tall_image = get_sub_field("tall_image");
         $section_color = get_sub_field("section_color");

      ?>
   <?php if ($display_title) { ?>
   <h2 class="category__heading" style="color:<?php echo $section_color?>"><?php echo $term_name; ?></h2>   
  <?php }?>
  <?php if ($display_description) { ?>
   <p class="category__description"><?php echo $term_description; ?></p>   
   <?php }?>
   <div class="grid" style="padding-top:1.5rem;">

      <?php

        $products = new WP_Query( array(
            'post_type' => 'products',          // name of post type.
            'tax_query' => array(
                array(
                    'taxonomy' => 'product_categories',   // taxonomy name
                    'field' => 'term_id',           // term_id, slug or name
                    'terms' => $id,                  // term id, term slug or term name
                )
            )
        ) );

       ?>

       

       <?php while ( $products->have_posts() ) : $products->the_post();

        $product_id = get_the_id();
        $featured_image = get_the_post_thumbnail_url($product_id);
        $title = get_the_title($product_id);
        $product_description = get_field('description', $product_id);
        $benefit = get_field('benefit', $product_id);
        $nutrition = get_field('nutrition', $product_id);
        $raw_price = get_field('price', $product_id);
	   	$raw_member_price = get_field('member_price', $product_id);
        $price = rtrim($raw_price, '.0'); 
	    $member_price = rtrim($raw_member_price, '.0'); 
        $image = get_field('image', $product_id);
        $tall = "";

        if ($tall_image) {
          $tall = 'tall__image';
        }
       ?>


   <div class="grid__item grid__item--3 share__special">
      <div class="grid-four">
         <div class="share__half">
            <div class="share__half__img">
               <?php if($image) { ?>
                  <?php echo wp_get_attachment_image( $image, 'product', "", ["class" => $tall,"alt"=>"Hydrate Me"]); ?>
                <?php }?>
            </div>
            <div class="share__half__text module--white">
              <h5 class="product__heading" ><span style="color:<?php echo $section_color?>"><?php the_title() ?></span><br><?php echo $raw_price?></h5>
              <hr>
			  <?php if ($raw_member_price) { ?>
				<p class="member__pricing" style="color:<?php echo $section_color?>;padding: 0 0 1rem;font-weight: 700;letter-spacing: 0;text-transform: uppercase;font-size: 1rem;">
                Member Price <?php echo $raw_member_price; ?>
               </p>
			  <?php }?>
              <?php if ($benefit) { ?>
               <p class="product__benefit" style="color:<?php echo $section_color?>">
                Benefit
               </p>
               <p class="">
                <?php echo $benefit;?>
               </p>
               <br>
               <?php } ?>
               <?php if ($nutrition) { ?>
               <p class="product__benefit"  style="color:<?php echo $section_color?>">
                Nutrients
               </p> 
               <p class="">
                <?php echo $nutrition;?>
               </p>
             <?php } ?>
            </div>
         </div>
      </div>
   </div>


   <?php endwhile;  ?>
   <?php wp_reset_query();?>

   <hr class="grid__divider">

  </div>
 </div>
</div>




