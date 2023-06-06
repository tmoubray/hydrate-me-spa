<?php
get_header();
global $wp_query;
?>


    <div class="main">
      <div class="ous landing-featured py-fluid">
        <div class="landing-lead-in container container--narrow ally-focus-within">

          <section class="recent-news">
            <h1 class="search-title"> <?php echo $wp_query->found_posts; ?>
              <?php _e( 'Search Results Found For', 'locale' ); ?>: "<?php the_search_query(); ?>" </h1>

              <?php if ( have_posts() ) { ?>

                  <?php while ( have_posts() ) { the_post(); ?>

                     <article class="excerpt">
                      <?php if ( has_post_thumbnail() ) : ?>
                        <figure class="excerpt__image">
                          <?php the_post_thumbnail( 'medium' ); ?>
                        </figure>
                      <?php endif; ?>
                       <div class="excerpt__body">
                      <div class="excerpt__head">
                        <a href="<?php the_permalink(); ?>"><?php the_title( '<h2 class="h3">', '</h2>', true ); ?></a>
                      </div>
                      <?php the_excerpt(); ?>
                     </div>
                     
                     </article>

                  <?php } ?>
                  </section>
                 <?php get_template_part('pagination'); ?>

              <?php } ?>

   
          <?php get_sidebar( ); ?>
       </div>
       </div>
        </div>
<?php get_footer(); ?>