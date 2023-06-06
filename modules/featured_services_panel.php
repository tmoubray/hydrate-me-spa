<div class="ous landing-featured py-fluid">
<?php
$services = get_sub_field('featured_services');

if( $services ):?>
  <div class="landing-lead-in container container--narrow ally-focus-within">
    <div class="ous grid-blocks ally-focus-within" data-siteimprove="v2">
     <div class="grid ally-focus-within">
        <?php
         foreach( $services as $service ): 
           $id = $service->ID;
           $featured_image = get_the_post_thumbnail($id, "featured-service");
           $featured_video = get_field("featured_video", $id);
           $title = get_the_title($id);
           $permalink = get_the_permalink($id);
           $size = "featured-service";

          
          
           ?>


           <div class="grid__item grid__item--4-alt ally-focus-within service__panel__listing">
              <div class="grid-block__item zero ally-focus-within">
                <a href="<?php echo $permalink?>" class="grid-block__link ally-focus-within" style="position: relative;display:block;">
                    <span class="overlay_text"><?php echo $title ?></span>
                    <?php if($featured_video) { ?>
                      <video class="feature__video__los"  autoplay loop muted playsinline style="display:flex;width:100%">
                      <source data-src="<?php echo $featured_video['url']?>" type="video/mp4" src="<?php echo $featured_video['url']?>">
                      </video>
                     <?php }else {?>
                      <?php echo $featured_image; ?>
                      <?php } ?>
                 </a>
                </div>
            </div>
                    
         <?php endforeach; ?>
       </div>
      </div>
     </div>
    <?php

  wp_reset_postdata(); 
endif;?>
</div>