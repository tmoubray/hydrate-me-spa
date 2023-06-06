<?php
/**
 * Template for single service
 *
 */
get_header(); ?>


<?php
// Check value exists.
if (get_field('banner_media')):
    echo get_template_part('modules/banner');
endif;
if (have_rows('modules')):
    // Loop through rows.
    while (have_rows('modules')):
        the_row();
        // Case: Paragraph layout.
        if (get_row_layout() == 'feature_panel'):
            get_template_part('modules/feature_panel');
            // Case: Download layout.
            elseif (get_row_layout() == 'featured_services_panel'):
                get_template_part('modules/featured_services_panel');
            elseif (get_row_layout() == 'double_feature_panel'):
                get_template_part('modules/double_feature_panel');
            elseif (get_row_layout() == 'social_media_grid'):
                get_template_part('modules/social_media_grid');
            elseif (get_row_layout() == 'google_reviews'):
                get_template_part('modules/google_reviews');
            elseif (get_row_layout() == 'product_grid'):
                get_template_part('modules/product_grid');
            elseif (get_row_layout() == 'product_listing'):
                get_template_part('modules/product_listing');
            elseif (get_row_layout() == 'membership_panel'):
                get_template_part('modules/membership_panel');
            elseif (get_row_layout() == 'cross_sell'):
                get_template_part('modules/cross_sell');
            elseif (get_row_layout() == 'simple_paragraph'):
                get_template_part('modules/simple_paragraph');
            elseif (get_row_layout() == 'faqs'):
                get_template_part('modules/faqs');    
            endif;
            // End loop.
            
        endwhile;
    endif;
    wp_reset_postdata();
    get_footer();
    