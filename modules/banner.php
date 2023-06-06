
<?php 

$media = get_field("banner_media");
$type = $media["type"];
$url = $media["url"];


if ( is_front_page()|| is_home() ) {
	$tall = "tall";
}

?>



 <?php if ($media)	{?>
	  
	  <div class="billboard--img">
		  	<?php if ($type === "video") {?>

			<video class="banner__video <?php echo $tall?>" autoplay loop muted playsinline>
			   <source data-src="<?php echo $media['url']?>#t=0.001" type="video/mp4" src="<?php echo $media['url']?>">
			</video>
	
			<?php } ?>
			<?php if ($type === "image") {?>
 			<picture>
		     	<source srcset="<?php echo $media['url'] ?>" media="(min-width: 48em)">
		      	<img class="<?php echo $tall?>" src="<?php echo $media['url'] ?>">
	 		</picture>
			<?php } ?>
	  </div>

 <?php } ?>

