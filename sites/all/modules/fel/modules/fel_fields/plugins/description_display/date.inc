<?php

/**
 * @file
 * CTools plugin 'description_display' for date.module.
 */

$plugin = array(
  'callback' => 'fel_fields_date_process_description_display',
);

/**
 * Plugin callback.
 *
 * Replace the theme wrapper 'date_combo' with our own where needed.
 */
function fel_fields_date_process_description_display($field, $instance, &$form) {
  if (empty($field['settings']['repeat']) && ($field['cardinality'] > 1 or $field['cardinality'] == FIELD_CARDINALITY_UNLIMITED)) {
    return;
  }
  if (!empty($field['settings']['repeat'])) {
    if (!empty($form['#description'])) {
      // Date repeat fields are special. They are always multi-value, and as
      // such, the field's description resides in the $form root. The FEL
      // specific attributes will also need to be attached here for the same
      // reason.
      fel_wrapper_replace('date_combo', 'fel_date_combo', $form[0]);
      $form[0]['#description'] = $form['#description'];
      _fel_fields_add_attributes($form[0], $instance);
    }
  }
  elseif (!empty($form[0]['#description'])) {
    fel_wrapper_replace('date_combo', 'fel_date_combo', $form[0]);
    $form[0]['#fieldset_description'] = $form[0]['#description'];
    if (empty($field['settings']['todate'])) {
      unset($form[0]['#description']);
    }
  }
}
