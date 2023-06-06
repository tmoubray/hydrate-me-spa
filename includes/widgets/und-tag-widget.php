<?php
/**
 * Custom Tag Widget
 */

class und_custom_tag_widget extends WP_Widget {
	function __construct() {
		$widget_ops = array(
			'classname'                   => 'und_taglist_widget',
			'description'                 => __( 'A listing of all tags', 'und' ),
			'customize_selective_refresh' => true,
		);
		$control_ops = array( 'width' => 200, 'height' => 250 );
		parent::__construct( false, $name = __( 'Tag List', 'und-blog' ) , $widget_ops, $control_ops );
	}

	function widget( $args, $instance ) {
		extract( $args );
		extract( $instance );
		$title = empty( $instance[ 'title' ] ) ? 'Tags' : $instance[ 'title' ];
		$tags = get_tags();

		echo '<div class="widget widget_tags">';

		echo $before_widget;

		if ( $title ):
			echo $before_title . $title . $after_title;
		endif;

		foreach ( $tags as $tag ) {
			$tag_link = get_tag_link( $tag->term_id );

			$html .= '<a class="tag" href="' . esc_url( $tag_link ) . '" title="' . esc_attr( $tag->name ) . ' tag"><span class="tag-icon"></span> ';
			$html .= esc_html( $tag->name ) . '</a>';
		}
		echo $html;

		echo $after_widget;

		echo '</div>';
	}
	function update( $new_instance, $old_instance ) {
		$instance = $old_instance;
		$instance['title'] = strip_tags( $new_instance['title'] );

		return $instance;
	}

	function form($instance) {
		$instance = wp_parse_args( ( array ) $instance, array( 'title'=>'Tags' ) );
		$title = esc_attr( $instance[ 'title' ] );
		?>

		<p>
			<label for="<?php echo $this->get_field_id('title'); ?>"><?php _e( 'Title:', 'und-blog' ); ?></label>
			<input id="<?php echo $this->get_field_id('title'); ?>" name="<?php echo $this->get_field_name('title'); ?>" type="text" value="<?php echo $title; ?>" />
		</p>
		<?php
	}
}
