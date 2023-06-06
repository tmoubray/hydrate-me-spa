<?php
/**
 * Module partial used to display content for the banner.
 *
 */

$site_title         = get_bloginfo( 'name' );
$site_description   = get_bloginfo( 'description' );
$tagline_check      = get_field( 'site_billboard_tagline_check', 'options' );
$desktop_image      = get_field( 'site_billboard_desktop_image', 'options' );
$desktop_image_attr  = wp_get_attachment_image_src( $desktop_image, $desktop_image_size, false);
$desktop_image_size = 'desktop-billboard';
$mobile_image       = get_field( 'site_billboard_mobile_image', 'options' );
$mobile_image_size  = 'mobile-billboard';
$image_alt          = array( 'alt' => $site_title );
$style_options      = get_field( 'site_billboard_style_options', 'options' );

if( 'text-only' === $style_options ) : ?>
    <div class="billboard--arrow py-sm">
        <div class="container">
            <?php if( is_front_page() ) : ?>
                <h1 class="mt-none caps">
            <?php else : ?>
                <div class="h1 mt-none caps">
            <?php endif; ?>
                <a href="<?php echo esc_url( home_url() ); ?>" alt="home">
                    <span class="text-white">
                        <?php echo esc_html( $site_title ); ?>
                    </span>
                </a>
            <?php if( is_front_page() ) : ?>
                </h1>
            <?php else : ?>
                </div>
            <?php endif; ?>
            <?php if( $tagline_check ): ?>
                <p class="serif-xlarge-alt">
                    <?php echo esc_html( $site_description ); ?>
                </p> 
            <?php endif; ?>
        </div>
    </div>
<?php elseif( 'custom-image-only' === $style_options ) : ?>
    <div class="billboard--img">
        <picture>
            <source srcset="<?php echo $desktop_image_attr[0]; ?>" media="(min-width: 48em)">
            <?php echo wp_get_attachment_image( $mobile_image, $mobile_image_size, false, $image_alt ); ?>
        </picture>
        
        <!-- TODO: Different viewport images -->

        <!-- <p class="screenreader">
            <?php //echo esc_html( $site_title ); ?>
            <?php //echo esc_html( $site_description ); ?>
            TODO: screenreader text only
        </p>  -->
    </div>
<?php elseif( 'custom-image-with-text' === $style_options ) : ?>
    <div class="billboard--img">
        <div class="hero__gradient"></div>
        <picture>
            <source srcset="<?php echo $desktop_image_attr[0]; ?>" media="(min-width: 48em)">
            <?php echo wp_get_attachment_image( $mobile_image, $mobile_image_size, false, $image_alt ); ?>
        </picture>
        <div>
            <div class="container">
                <?php if( is_front_page() ) : ?>
                    <h1 class="billboard__text">
                <?php else : ?>
                    <div class="billboard__text">
                <?php endif; ?>
                    <a href="<?php echo esc_url( home_url() ); ?>" alt="home">
                        <?php echo esc_html( $site_title ); ?>
                    </a>
                <?php if( is_front_page() ) : ?>
                    </h1>
                <?php else : ?>
                    </div>
                <?php endif; ?>
                <?php if( $tagline_check ): ?>
                    <p class="serif-xlarge-alt">
                        <?php echo esc_html( $site_description ); ?>
                    </p> 
                <?php endif; ?>
            </div>
        </div>
    </div>
<?php endif; ?>