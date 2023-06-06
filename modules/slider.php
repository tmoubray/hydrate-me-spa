<?php
/**
 * Module partial used to display content for the slider.
 *
 */
$auto_featured_posts = get_field( 'turn_on_automatic_featured_posts', 'options' );
$featured_slides = get_field( 'featured_posts', 'options' );


if( $auto_featured_posts ) :

    $featured_args = array(
        'post_type'      => 'post',
        'post_status'    => 'publish',
        'posts_per_page' => 4,
        'meta_query' => array(
            array(
             'key' => '_thumbnail_id',
             'compare' => 'EXISTS'
            ),
        ),
        'orderby'        => 'date',
    );

	global $wp_query;

    $wp_query = new WP_Query( $featured_args );
	if( $wp_query->have_posts() ): ?>
            <div class="splash">
                <div class="container">
                    <div class="splash__nav">
                        <?php while( $wp_query->have_posts() ): $wp_query->the_post(); global $post; ?>
                            <?php if( has_post_thumbnail() ) : ?>
                                <a href="<?php the_permalink(); ?>" class="splash__button"><?php the_title(); ?></a>
                            <?php endif; ?>
                        <?php endwhile; ?>
                    </div>
                    <div class="splash__slides">
                        <?php while( $wp_query->have_posts() ): $wp_query->the_post(); global $post; ?>
                            <?php if( has_post_thumbnail() ) : ?>
                                <div class="splash__slide">
                                    <div class="splash__media">
                                        <?php the_post_thumbnail( 'slider' ); ?>
                                    </div>
                                    <div class="splash__content">
                                        <div class="h2 splash__headline">
                                            <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                                        </div>
                                        <p class="splash__date"><?php echo get_the_date(); ?></p>
                                    </div>
                                </div>
                            <?php endif; ?>
                        <?php endwhile; ?> 
                    </div>
                </div>
            </div>
    <?php endif; ?>
    <?php wp_reset_postdata(); ?>
<?php elseif ( $featured_slides ) : ?>
    <div class="splash">
        <div class="container">
            <div class="splash__nav">
                <?php foreach( $featured_slides as $post ): ?>
                    <?php if( has_post_thumbnail() ) : ?>
                        <a href="<?php the_permalink(); ?>" class="splash__button"><?php the_title(); ?></a>
                    <?php endif; ?>
                <?php endforeach; ?>
            </div>
            <div class="splash__slides">
                <?php foreach( $featured_slides as $post ): ?>
                    <?php if( has_post_thumbnail() ) : ?>
                        <div class="splash__slide">
                            <div class="splash__media">
                                <?php the_post_thumbnail( 'slider' ); ?>
                            </div>
                            <div class="splash__content">
                                <div class="h2 splash__headline">
                                    <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                                </div>
                                <p class="splash__date"><?php echo get_the_date(); ?></p>
                            </div>
                        </div>
                    <?php endif; ?>
                <?php endforeach; ?> 
            </div>
        </div>
    </div>
<?php endif; ?>
