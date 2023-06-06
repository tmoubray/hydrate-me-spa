

<?php

  $introduction = get_sub_field('introduction');
  $featured_professionals = get_sub_field('featured_professional');
  $background_image = get_sub_field('background_image');
  $intro_title = get_sub_field('introduction_title');
  $intro = get_sub_field('introduction');
  $background_color = get_sub_field('background_color');
  ?>
<h2 class="category__heading"><?php echo $intro_title ?></h2>
<p class="category__description"><?php echo $intro ?></p>
   <div class="ous landing-featured py-fluid">
    <div class="pt-fluid pb-sm-fluid">
      <div class="program__split" style="background:<?php echo $background_color ?>">
                  <div class="container container--narrow">
                  <div class="grid grid--vcenter bio__grid" style="">
                        <?php 
                        foreach( $featured_professionals as $prof ): 
                        $id = $prof->ID;
                        $featured_image = get_field( 'image', $id );
                        $title = get_the_title($id);
                        $job_title = get_field( 'job_title', $id );
                        $bio = get_field( 'biography', $id );
                        $size = 'staff';
                        $link = get_the_permalink($id);
                        ?>

                        <div class="grid__item grid__item--2 bio__grid__image" style="">
                            <div class="landing-featured__media media bio__image__container">
                              
                                <?php if($featured_image) { ?>
                                 <?php echo wp_get_attachment_image( $featured_image, $size );?>
                                <?php }?>
                                
                              <div>
                                <p class="bio__title"><?php echo $title?></p>
                                <p class="bio__job__title"><?php echo $job_title?></p>
                              </div>
                            </div>
                        </div>
                        
                        <?php
                         endforeach;
                         ?>
                  </div>
                </div>
               </div>
            </div>
          </div>