
<?php

$memberships = get_sub_field("memberships");

?>


<div class="ous landing-featured py-fluid">
 <div class="container container--narrow">  
   <div class="grid">

      <?php 
      foreach( $memberships as $membership ): 

      $id = $membership->ID;
      $title = get_the_title($id);
      $features = get_field("features", $id);
      $raw_price = get_field("price", $id);
      $price = rtrim($raw_price, '.0');  
      $section_color = get_field("section_color", $id);

      ?>
      <div class="grid__item grid__item--3 share__special">
      <div class="grid-four">
      <div class="ous-table-horizontal table scrollbox">
         <table>
            <thead style="border-bottom: 8px solid <?php echo $section_color ?>;">
               <tr>
                  <th><span class="membership__title" style="color:<?php echo $section_color ?>"><?php echo $title ?></span><span class="membership__price">$<?php echo $price ?></span></th>
               </tr>
            </thead>
            <tbody>
               <?php foreach( $features as $feature ): ?>
               <tr class="membership__item">
                  <td class="membership_listing"><?php echo $feature["feature"] ?></td>
               </tr>
               <?php endforeach ?>
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








