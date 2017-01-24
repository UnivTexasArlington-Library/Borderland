<div class="<?php print $classes ?> container-fluid" <?php if (!empty($css_id)) { print "id=\"$css_id\""; } ?>>
  <div class="row">
    <?php print $content['top']; ?>
  </div>
  <div class="row">
    <div class="col-lg-2 col-md-2 col-sm-2 hidden-xs">
    <?php print $content['left']; ?>
    </div>
    <div class="col-lg-10 col-md-10 col-sm-10 col-xs-12">
    <?php print $content['right']; ?>
    </div>
  </div>
  <div class="row">
    <?php print $content['bottom']; ?>
  </div>
</div>
