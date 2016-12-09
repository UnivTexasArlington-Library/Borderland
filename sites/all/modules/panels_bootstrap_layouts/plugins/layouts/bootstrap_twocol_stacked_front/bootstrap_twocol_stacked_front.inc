<?php

/**
 * Implements hook_panels_layouts().
 */
// Plugin definition
$plugin = array(
  'title' => t('Bootstrap Custom Front Page'),
  'category' => t('Bootstrap'),
  'icon' => 'bootstrap_twocol_stacked_front.png',
  'theme' => 'bootstrap_twocol_stacked_front',
  'admin css' => '../panels-bootstrap-layouts-admin.css',
  'regions' => array(
    'top' => t('Top'),
    'left' => t('Left'),
    'right' => t('Right'),
    'bottom' => t('Bottom'),
  ),
);
