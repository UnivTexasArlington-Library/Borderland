<?php

/**
 * @file
 * CTools plugin 'description_display' for socialfield.module.
 */

$plugin = array(
  'callback' => 'fel_field_socialfield_description_display_process',
);

/**
 * Plugin callback.
 */
function fel_field_socialfield_description_display_process($field, $instance, &$form) {
  $form['social_buttons']['#theme'] = 'fel_fields_socialfield_drag_components';
  // No need to have the description as a child element.
  unset($form['social_buttons']['description']);
  if (!empty($instance['description'])) {
    $form['social_buttons']['#description'] = $instance['description'];
  }
  return array('social_buttons');
}
