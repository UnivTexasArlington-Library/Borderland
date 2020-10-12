<?php

/**
 * @file
 * API documentation for the Views Selective Exposed Filters module.
 */

/**
 * Alter the order of a filter options here.
 *
 * @param array $oids
 *   An array of options for a filter.
 * @param object $handler
 *   An instance of the views_handler_filter_selective class.
 */
function hook_views_filters_selective_sort_alter(array &$oids, $handler) {
  if ($handler->view->name == 'SOME_VIEW_NAME'
      && $handler->real_field == 'SOME_FIELD_NAME') {
    // Re-order $oids here.
  }
}
