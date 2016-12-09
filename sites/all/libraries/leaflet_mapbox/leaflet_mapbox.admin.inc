<?php

/**
 * @file
 * Leaflet MapBox module admin file.
 */

/**
 * Admin settings.
 */
function leaflet_mapbox_configuration_form($form, &$form_state) {
  $form['leaflet_mapbox_label'] = array(
    '#type' => 'textfield',
    '#title' => t('Map label'),
    '#required' => TRUE,
    '#default_value' => variable_get('leaflet_mapbox_label', ''),
    '#description' => t('Give your map a name, this will be the name shown on the display options form.'),
  );

  $form['leaflet_mapbox_api_version'] = array(
    '#type' => 'select',
    '#title' => t('API version'),
    '#required' => TRUE,
    '#default_value' => variable_get('leaflet_mapbox_api_version', '3'),
    '#options' => array(
      '3' => t('3 (Mapbox Studio Classic)'),
      '4' => t('4 (Mapbox Studio)'),
    ),
  );

  $form['leaflet_mapbox_code'] = array(
    '#type' => 'textfield',
    '#title' => t('Map code'),
    '#default_value' => variable_get('leaflet_mapbox_code', ''),
    '#description' => t('This code is obtained from MapBox by clicking on the mapbox.js button after publishing your map'),
    '#states' => array(
      'visible' => array(
        ':input[name="leaflet_mapbox_api_version"]' => array('value' => '3'),
      ),
      'required' => array(
        ':input[name="leaflet_mapbox_api_version"]' => array('value' => '3'),
      ),
    ),
  );

  $form['leaflet_mapbox_style_url'] = array(
    '#type' => 'textfield',
    '#title' => t('Style URL'),
    '#default_value' => variable_get('leaflet_mapbox_style_url', ''),
    '#description' => t('Copy and paste the style URL. Example: %url.', array(
      '%url' => 'mapbox://styles/johndoe/erl4zrwto008ob3f2ijepsbszg',
    )),
    '#states' => array(
      'visible' => array(
        ':input[name="leaflet_mapbox_api_version"]' => array('value' => '4'),
      ),
      'required' => array(
        ':input[name="leaflet_mapbox_api_version"]' => array('value' => '4'),
      ),
    ),
  );

  $form['leaflet_mapbox_token'] = array(
    '#type' => 'textfield',
    '#title' => t('Map access token'),
    '#required' => TRUE,
    '#default_value' => variable_get('leaflet_mapbox_token', ''),
    '#description' => t('You will find this in the mapbox user account settings'),
  );

  $form['leaflet_mapbox_zoomlevel'] = array(
    '#type' => 'textfield',
    '#title' => t('Zoom Level'),
    '#required' => TRUE,
    '#default_value' => variable_get('leaflet_mapbox_zoomlevel', 2),
    '#description' => t('You must clear the site caches after changing this value or wait for the caches to expire before this change shows'),
  );

  $form['leaflet_mapbox_description'] = array(
    '#type' => 'textarea',
    '#title' => t('Map description'),
    '#default_value' => variable_get('leaflet_mapbox_description', ''),
  );

  return system_settings_form($form);
}
