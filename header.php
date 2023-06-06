<?php
/**
 * Template partial for the header.
 *
 */

?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1">
  
  <link href="https://cloud.typography.com/7879216/6217192/css/fonts.css" rel="stylesheet">


  <?php wp_head(); ?>

</head>
<?php $class_name = get_field('theme_color', 'options'); ?>

<body class="t-universal s-global <?php echo esc_attr( $class_name ); ?>">
    <script id="__bs_script__">
    //<![CDATA[
        document.write("<script async src='/browser-sync/browser-sync-client.js?v=2.26.3'><\/script>".replace("HOST", location.hostname));
        
    //]]>
    </script>

  <div class="skip" role="navigation" aria-label="Skip to Main Content">
    <a href="#main-content">Skip to main content</a>
  </div>

  <div id="campus-communications"></div>


  <div class="canvas">

  <?php get_template_part('modules/header'); ?>
