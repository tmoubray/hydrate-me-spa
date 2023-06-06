<?php
/*
* Template for 404 page.
*
*/

get_header(); ?>

	<div class="container container--clear">
        <?php get_template_part('breadcrumbs'); ?>
    </div>
    <div class="main">
        <div class="container container--clear main__container">
            <div class="main__content main__content--left">
				<?php if ( have_posts() ) 	the_post(); ?>
				
				<h1><?php esc_html_e('Error 404 - Nothing Found', 'und-blog'); ?></h1>
				
				<h3><?php esc_html_e('The page you are looking for could not be found.', 'und-blog');?></h3>
			</div>
			<?php get_sidebar(); ?>
		</div>
	</div> 			
</div>
<?php get_footer(); ?> 