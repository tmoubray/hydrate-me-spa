
 <?php 
$images = get_sub_field('gallery');
$size = 'thumbnail';

?>


<div class="ous featurettes py-fluid module--arrows-gray">
   <div class="featurettes__body container container--narrow container--clear mt-sm">
      <div class="grid">
      	<?php if( $images ): ?>
      	<?php foreach( $images as $image_id ): ?>
        <div class="grid__item grid__item--5">
          <div class="featurettes__card">
           <?php echo wp_get_attachment_image( $image_id["id"], "full" ); ?>
          </div>
        </div>
        <?php endforeach; ?>
        <?php endif; ?>
      </div>
   </div>
 </div>

