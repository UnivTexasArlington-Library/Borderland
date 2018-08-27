<?php

/**
 * @file
 * CTools plugin 'description_display' for matrix.module.
 */

$plugin = array(
  'callback' => 'fel_field_matrix_description_display_process',
);

/**
 * Plugin callback.
 */
function fel_field_matrix_description_display_process($field, $instance, &$form) {
  $form['#theme'] = 'fel_fields_matrix_table';
}
