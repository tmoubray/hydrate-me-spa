<div class="ous landing-featured py-fluid">
 <div class="container container--narrow">
   <div class="grid grid--vcenter top__align">

    <?php while ( have_rows('featured_products') ) : the_row(); 
        $product = get_sub_field("product");
        $id = $product->ID;
        $featured_image = get_the_post_thumbnail_url($id);
        $title = get_the_title($id);
        $cross_sell_promotion = get_field('cross_sell_promotion', $id);
        $featured_media = $cross_sell_promotion["featured_media"];
        $use_video = get_field('use_video_for_cross_sell_promotion' ,$id);
        $links = $cross_sell_promotion["featured_links"];
        $featured_text = $cross_sell_promotion["featured_text"];
        $size = "cross-sell";




        ?>

        <div class="grid__item grid__item--3-alt ally-focus-within">
        <div class="grid-block__item zero ally-focus-within">
        <div class="grid-block__link">


            <?php if($featured_media["type"] == "video" ) { ?>

              <video width="442" width="315" class="" controls autoplay loop muted="" playsinline="playsinline">
                <source data-src="<?php echo $featured_media['url']?>" type="video/mp4" src="<?php echo $featured_media['url']?>">
              </video>

            <?php } else {?>

              <?php if($featured_media) { ?>
                 <?php echo wp_get_attachment_image( $featured_media["id"], $size );?>
               <?php }?>
             
             <?php }?>
            <span class="cross__sell__under__title"><a><?php echo $featured_text; ?></a></span>



            <?php // Check rows exists.
              if( $links ) {
                foreach( $links as $link ) {?>
                  <a class="cross__sell__link" href='<?php echo $link["link"]["url"]?>'><?php echo $link["link"]["title"]?></a>
              <?php }
              }
            ?>
         </div>
        </div>
        </div>

   <?php endwhile;?>

  </div>
 </div>
</div>




