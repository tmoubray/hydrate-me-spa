<?php

$title = get_the_title();
?>

<?php if( have_rows('faq_section') ):
  while( have_rows('faq_section') ) : the_row();
  $section_title = get_sub_field('section_title');
  $faqs = get_sub_field('faqs');?>
<div class="ous landing-featured py-fluid">
   <div class="landing-lead-in container container--narrow ally-focus-within">
      <h2><?php echo $section_title?></h2>
      <?php 
            if( $faqs ):
            foreach( $faqs as $faq ): 
               $question = $faq->question;
               $answer = $faq->answer;
            ?>
            <button class="accordion"><?php echo $question ?></button>
            <div class="panel">
              <p><?php echo $answer ?></p>
            </div>
            <?php 
            endforeach;
           endif;
         ?>

   </div>
</div>
<?php 
endwhile;
endif;
?>