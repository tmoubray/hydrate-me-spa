<?php
/**
 * Module partial used to display content for the slider.
 *
 */

$footer_contact_title = get_field('footer_contact_title', 'options'); 
$footer_contact_info  = get_field('footer_contact_info', 'options');
$phone_number  = get_field('phone_number', 'options');
$address  = get_field('address', 'options');
$email_address = get_field('email_address', 'options');
$hours = get_field('hours', 'options');
$walk_in = get_field('walk_in_note', 'options');
?>

<footer>
    

    <div class="pre-footer tint-black pre-footer--college">
     <div class="landing-lead-in container container--narrow">

            <div class="grid">
                <div class="grid__item grid__item--3 grid__item--break-to-half">

                        <h2 class="h3 phone__slot"><a href="tel:<?php echo $phone_number; ?>" class="ally-focus-within"><?php echo $phone_number; ?></a></h2>
                        <p class="serif-large"><?php echo $address ?></p>
                        <br>
                        <p><a class="pre-footer__link " href="mailto:<?php echo $email_address; ?>" target=""><?php echo $email_address ?></a></p>
                    <?php if ( have_rows('social_buttons', 'options') ): ?>
                    <div class="grid__item grid__item--3">
                
                    <?php get_template_part('modules/social'); ?>
                    </div>
                <?php endif; ?>
                </div>
                
                    <div class="grid__item grid__item--3 grid__item--break-to-half footer__center">
                        <h3>Hours</h3>
                            <p>Mon-Fri / <?php echo $hours["monday_friday_open"] . " - " .  $hours["monday_to_friday_close"]?><br>
                            Sat / <?php echo $hours["saturday_open"] . " - " .  $hours["saturday_close"]?><br>
                            Sun / <?php echo $hours["sunday_open"] . " - " .  $hours["sunday_close"]?><br>
                            <span class="walk__in__notice"><?php echo $walk_in ?></span>
                        </p>
                    
                     </div>

                
                <?php
                $location = 'footer_submenu_2';
                if ( has_nav_menu( $location ) ) :
                    $menu_name = wp_get_nav_menu_name( 'footer_submenu_2' ); ?>
                    <div class="grid__item grid__item--3 grid__item--break-to-half footer__right">
                 
                        <?php
                        wp_nav_menu([
                            'theme_location' => $location,
                            'menu_class'     => 'pre-footer__list',
                            'link_class'     => 'pre-footer__link',
                            'container'      => '',
                            'depth'          => 1,
                        ]);
                        ?>
                     </div>
                <?php endif; ?>
        
            </div>
        </div>

    </div>
    <div class="footer">

        
        <div class="footer__bottom tint-blackish">
            <div class="container copy-container">
                <nav class="footer__nav" aria-label="Compliance and Disclosures">
                    <?php
                    if ( has_nav_menu( 'legal' ) ) {
                        wp_nav_menu([
                            'theme_location' => 'legal',
                            'menu_class'     => 'footer__list',
                            'link_class'     => 'footer__link',
                            'li_class'       => 'footer__item',
                            'container'      => ''
                        ]);
                    }
                    ?>
                </nav>
                <p class="footer__right footer__copyright">©2021 Hydrate Me</p>
            </div>
        </div> 
    </div>
    <button class="back-to-top">
        <?php echo svgstore('back-to-top', 'Back to Top'); ?>
    </button>

</footer>
