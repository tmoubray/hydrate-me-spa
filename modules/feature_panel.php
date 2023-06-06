<?php

$headline_text = get_sub_field('headline_text');
$featured_media = get_sub_field('featured_media');
$size = 'feature';
$description = get_sub_field('description');
$links = get_sub_field('links');
$narrow = get_sub_field('narrow_width');
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
               <div class="landing-featured__media media" style="">
                
                <?php if($featured_media["type"] == "video" ) { ?>

                <video class="feature__video__los" style="display:flex;width:100%" autoplay loop muted playsinline>
                  <source data-src="<?php echo $featured_media['url']?>#t=0.001" type="video/mp4" src="<?php echo $featured_media['url']?>">
                </video>

              <?php } else {?>

                <?php if($featured_media["type"] == "image") { ?>
                   <?php echo wp_get_attachment_image( $featured_media["id"], "feature" );?>
                 <?php }?>
               
               <?php }?>

              </div>
          </div>
          <div class="callout-full-width__media grid__item grid__item--2">


          <?php 
                if ( !is_front_page() ) :?>
           
          	 <h1 class="service__title">
              <?php the_title();?>
             </h1>
             
           <?php endif ?>

     
            <?php echo $description; ?>
            <ul class="button-group my-fluid ally-focus-within">
              <?php 
                foreach( $links as $link ) {?>
                    <li><a href="<?php echo $link["featured_link"]["url"];?>" target="<?php echo $link["featured_link"]["target"]; ?>"class="button ally-focus-within"><?php echo $link["featured_link"]["title"];?></a></li>

               <?php     
                  }
                ?>
                
              </ul>
        </div>
    </div>
</div>
