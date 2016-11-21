<?php
/**
 * @file
 * The primary PHP file for this theme.
 */
/**
 * Implements template_preprocess_views_view().
 */
function bootstrap_preprocess_views_view(&$vars) {//replace YOUR_THEME by your theme name
  $view = $vars['view'];
  switch($view->name) {      
    case 'leaflet' : //replace YOUR_VIEW by your view name

      drupal_add_library('system','ui.slider');
      drupal_add_css('/misc/ui/jquery.ui.slider.css');
      break;
  } 
}