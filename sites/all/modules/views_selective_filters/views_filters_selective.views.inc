<?php

/**
 * @file
 * Integration with Views.
 */

/**
 * Implements hook_views_data_alter().
 */
function views_filters_selective_views_data_alter(&$data) {
  foreach ($data as $table_name => $table_info) {
    // Ignore translated, format and delta.
    unset($table_info['delta']);
    $valid_keys = preg_grep('/(_format|_i18n)$/', array_keys($table_info), PREG_GREP_INVERT);
    foreach ($valid_keys as $field_name) {
      $field_info = $table_info[$field_name];
      if (!empty($field_info['filter']['handler']) && $field_info['filter']['handler'] != 'views_handler_filter_selective') {
        // Compute underlying field name ($real_Field).
        $_field_name = isset($field_info['filter']['field_name']) ? $field_info['filter']['field_name'] : NULL;
        $_field_real_field = isset($field_info['filter']['real field']) ? $field_info['filter']['real field'] : NULL;
        $real_field = empty($_field_name) ? (empty($_field_real_field) && !empty($field_info['field']) ? $field_name : $_field_real_field) : $_field_name;
        if (empty($real_field)) {
          // Only allow selective filters on fields that can be added to query.
          continue;
        }
        $selective = $field_info;
        $selective['title'] = (!empty($field_info['filter']['title']) ? $field_info['filter']['title'] : (!empty($field_info['title']) ? $field_info['title'] : $real_field)) . ' (selective)';
        $selective['filter']['handler'] = 'views_handler_filter_selective';
        $selective['filter']['proxy'] = $field_info['filter']['handler'];
        $selective['filter']['field'] = $field_name;
        $selective['filter']['field_base'] = $real_field;
        unset($selective['argument'], $selective['field'], $selective['relationship'], $selective['sort'], $selective['filter']['title']);
        $data[$table_name][$field_name . '_selective'] = $selective;
      }
    }
  }
}
