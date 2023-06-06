<?php
/**
 * Template partial for pagination.
 *
 */

?>

<nav id="pagination" role="navigation" aria-label="Pagination Navigation"><?php
    $big = 999999999; // need an unlikely integer

    echo paginate_links( array(
        'base'      => str_replace( $big, '%#%', get_pagenum_link( $big ) ),
        'format'    => '?paged=%#%',
        'current'   => max( 1, get_query_var('paged') ),
        'total'     => $wp_query->max_num_pages,
        'type'      => 'list',
        'before_page_number' => '<span class="screen-reader-text">' . __( 'Page', 'und-blog' ) . '</span> ',
        'prev_text' => 'Previous<span class="screen-reader-text">' . __( 'page', 'und-blog' ) . '</span>',
        'next_text' => 'Next<span class="screen-reader-text">' . __( 'page', 'und-blog' ) . '</span>',
        ) );   
?></nav>

