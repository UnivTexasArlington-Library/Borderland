<?php

/**
 * @file
 * CTools plugin 'description_display' for select_or_other.module.
 */

$plugin = array(
  'callback' => 'fel_fields_select_or_other_handler',
);

/**
 * Plugin callback handler.
 *
 * Add some additional processing of this field not otherwise catched by the
 * default fel_field mechanism.
 */
function fel_fields_select_or_other_handler($field, $instance, &$form) {
  $form['#pre_render'][] = 'fel_fields_select_or_other_pre_render';
}
