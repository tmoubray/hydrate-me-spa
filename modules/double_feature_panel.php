<?php 

$feature_one = get_sub_field('feature_one');
$feature_one_media = $feature_one["featured_media"];
$feature_one_link = $feature_one["link"];
$feature_two = get_sub_field('feature_two');
$feature_two_media = $feature_two["featured_media"];
$feature_two_link = $feature_two["link"];
$background_color = get_sub_field('background_color');

?> 

<div class="ous landing-featured py-fluid module--arrows-gray" style="background-color:<?php echo $background_color?>">
  <div class="container container--narrow">
    <div class="grid grid--vcenter">
       <div class="grid__item grid__item--2">
             <div class="landing-featured__media media">
       

                <?php if($feature_one_media["type"] == "video" ) { ?>

                <a class="feature__link" href="<?php echo $feature_one_link["url"] ?>">
                <video style="display:flex;width:100%" class="feature__video__los" autoplay loop muted playsinline>
                  <source data-src="<?php echo $feature_one_media['url']?>" type="video/mp4" src="<?php echo $feature_one_media['url']?>">
                </video>
                </a>

              <?php } else {?>

                <?php if($feature_one_media["type"] == "image") { ?>
                 <a class="feature__link" href="<?php echo $feature_one_link["url"] ?>"><?php echo wp_get_attachment_image( $feature_one_media["id"], "cross-sell" );?></a>
                 <?php }?>
               
               <?php }?>

               <span class="cross__sell__under__title"><a class="feature__link menu__link" href="<?php echo $feature_one_link["url"] ?>" target="<?php echo $feature_one_link["target"] ?>"><?php echo $feature_one_link["title"] ?></a></span>
             </div>
        </div>
        <div class="grid__item grid__item--2">
          <div class="landing-featured__media media">
            

            <?php if($feature_two_media["type"] == "video" ) { ?>
                <a class="feature__link" href="<?php echo $feature_two_link["url"] ?>">
                <video style="display:flex;width:100%" class="size-cross-sell feature__video__los" autoplay loop muted playsinline>
                  <source data-src="<?php echo $feature_two_media['url']?>" type="video/mp4" src="<?php echo $feature_two_media['url']?>">
                </video>
                </a>

              <?php } else {?>

                <?php if($feature_two_media["type"] == "image") { ?>
                 <a class="feature__link" href="<?php echo $feature_two_link["url"] ?>"><?php echo wp_get_attachment_image( $feature_two_media["id"], "cross-sell" );?></a>
                 <?php }?>
               
               <?php }?>


             <?php if ($feature_two_link) { ?>  
            <?php $link_title = $feature_two_link["title"] ?>
            <span class="cross__sell__under__title"><a class="feature__link menu__link"  target="<?php echo $feature_one_link["target"] ?>" href="<?php echo $feature_two_link["url"] ?>">

              <?php if($link_title) { ?>

              <?php echo $link_title; ?>

            <?php } ?>
            <?php } ?>
                

              </a></span>
          </div>
        </div>
      </div>
   </div>
</div>


