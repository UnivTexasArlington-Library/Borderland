<div class="<?php print $classes ?> container-fluid" <?php if (!empty($css_id)) { print "id=\"$css_id\""; } ?>>
  <div class="row">
    <?php print $content['top']; ?>
  </div>
  <div class="row">
    <?php print $content['left col-md-3']; ?>
    <?php print $content['right col-md-9']; ?>
  </div>
  <div class="row">
    <?php print $content['bottom']; ?>
  </div>
</div>
