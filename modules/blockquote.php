<?php 

$quote = get_sub_field('quote'); 
$citename = get_sub_field('cite_name'); 
$citetitle = get_sub_field('cite_title'); 
?>

<?php if ( $quote ) : ?>

<blockquote>
	<q><?php echo $quote; ?></q>
	<?php if ( $citename || $citetitle ) : ?>
		<cite>
			<?php if ( $citename ) : ?>
				<span class="blockquote__cite__name"><?php echo $citename; ?></span>
			<?php endif; ?>
			<?php if ( $citetitle ) : ?>
				<span class="blockquote__cite__title"><?php echo $citetitle; ?></span>
			<?php endif; ?>
		</cite>
	<?php endif; ?>
</blockquote>

<?php endif; ?>
