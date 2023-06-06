<?php
/**
 * Module partial used to display content for social buttons.
 *
 */

// Check rows exists.
if( have_rows('social_buttons', 'options') ):
?>
    <ul class="social__list">
    <?php
    // Loop through rows.
    while( have_rows('social_buttons', 'options') ) : the_row();
        $social_title = get_sub_field( 'social_title' );
        $social_link  = get_sub_field( 'social_link' );
        if( $social_link ): 
            $link_url    = $social_link['url'];
            $link_title  = $social_link['title'];
            $link_target = $social_link['target'];
    ?>
            <li class="social__item">
                <a class="social__link" href="<?php echo esc_url( $link_url ); ?>" target="<?php echo esc_attr( $link_target ); ?>">
                <?php if ( $link_title ) : ?>
                    <span class="svgstore svgstore--social-<?php echo strtolower( esc_html( $link_title ) ); ?>">
                        <svg>
                            <title><?php echo esc_html( $link_title ); ?></title>
                            <use xlink:href="#svgstore--social-<?php echo strtolower( esc_html( $link_title ) ); ?>"></use>
                        </svg>
                    </span>
                <?php elseif ( $social_title ): ?>
                    <span class="svgstore svgstore--social-<?php echo strtolower( esc_html( $social_title ) ); ?>">
                        <svg>
                            <title><?php echo esc_html( $social_title ); ?></title>
                            <use xlink:href="#svgstore--social-<?php echo strtolower( esc_html( $social_title ) ); ?>"></use>
                        </svg>
                    </span>
                <?php endif; ?>
                </a>
            </li>
<?php
        // End Link if statement.
        endif;
    // End loop.
    endwhile;
    echo '</ul>';
// End Social Buttons Row.
endif;
