<?php

$lists = get_sub_field("lists");
$featured_product_category = get_sub_field("product_category");
$id = $featured_product_category->term_id;
$term_name = get_term( $id )->name;
$term_description = get_term( $id )->description;



?>


<div class="ous landing-featured py-fluid">
 <div class="container container--narrow">  
   <h2 class="category__heading"><?php echo $term_name?></h2>
<p class="category__description"><?php echo $term_description?></p>
   <div class="grid">



      <?php 
      foreach( $lists as $list ): 
         $title = $list["list_title"];
         $products = $list["products"];
         $section_color = $list["section_color"];


      ?>
      <div class="grid__item grid__item--3 share__special">
      <div class="grid-four">
               <div class="ous-table-horizontal table scrollbox pricing__table">
         <table>
            <?php if($title) {?>
            <thead style="border-bottom: 8px solid <?php echo $section_color ?>;">
               <tr>
                  <th style="color:<?php echo $section_color?>"><?php echo $title ?></th>
               </tr>
            </thead>
            <?php } ?>
            <tbody>
               <?php
               foreach( $products as $product ): 
               $id = $product->ID;
               $name = get_the_title($id);
               $raw_price = get_field('price', $id);
               $description = get_field('description', $id);
               $price = rtrim($raw_price, '.0'); 
       		   $raw_member_price = get_field('member_price', $id);
	    	   $member_price = rtrim($raw_member_price, '.0'); 
               ?>
               <tr>
                  <td><span style="color:<?php echo $section_color?>"><?php echo $name ?></span><br><?php echo $raw_price ?><hr>
					  
					  <?php if ($raw_member_price) { ?>
				<p class="member__pricing" style="color:<?php echo $section_color?>;padding: 0 0 1rem;font-weight: 700;letter-spacing: 0;text-transform: uppercase;font-size: 1rem;">
                Member Price <?php echo $raw_member_price; ?>
               </p>
			  <?php }?>
					  
					  <span class="product__description"><?php echo $description?></span></td>
               </tr>
               <?php
               endforeach;
               ?>
            </tbody>
         </table>
       </div>
      </div>
      </div>

      <?php

      endforeach;

      ?>


  </div>
 </div>
</div>








