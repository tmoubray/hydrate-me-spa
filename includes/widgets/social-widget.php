<?php
/**
 * Custom Tag Widget
 */

class und_social_widget extends WP_Widget {
	function __construct() {
		$widget_ops = array(
			'classname'                   => 'social_widget',
			'description'                 => __( 'Displays all social buttons.', 'und' ),
			'customize_selective_refresh' => true,
		);
		$control_ops = array( 'width' => 200, 'height' => 250 );
		parent::__construct( false, $name = __( 'Social Buttons', 'und-blog' ) , $widget_ops, $control_ops );
	}

	function widget( $args, $instance ) {
		extract( $args );
		extract( $instance );
		$title = empty( $instance[ 'title' ] ) ? '' : $instance[ 'title' ];
		$tags = get_tags();
			
		echo $before_widget;

		if ( $title ):
			echo $before_title . $title . $after_title;
		endif;
		
		get_template_part('modules/social');

		echo $after_widget;
		
	}
	function update( $new_instance, $old_instance ) {
		$instance = $old_instance;
		$instance['title'] = strip_tags( $new_instance['title'] );

		return $instance;
	}

	function form($instance) {
		$instance = wp_parse_args( ( array ) $instance, array() );
		$title = esc_attr( $instance[ 'title' ] );
		?>

		<p>
			<label for="<?php echo $this->get_field_id('title'); ?>"><?php _e( 'Title:', 'und-blog' ); ?></label>
			<input id="<?php echo $this->get_field_id('title'); ?>" name="<?php echo $this->get_field_name('title'); ?>" type="text" value="<?php echo $title; ?>" />
		</p>
		<?php
	}
}
