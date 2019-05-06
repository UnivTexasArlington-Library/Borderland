<?php

/**
 * @file
 * Extends Quicktabs module's core functions.
 */

/**
 * Renders the content using the Bootstrap Tabs widget.
 */
class BootstrapQuickTabs extends QuickRenderer {

  /**
   * Build admin form.
   */
  public static function optionsForm($qt) {
    $form = array();
    $form['tabstyle'] = array(
      '#default_value' => (isset($qt->renderer) && $qt->renderer == 'bootstrap_tabs' && isset($qt->options['tabstyle']) && $qt->options['tabstyle']) ? $qt->options['tabstyle'] : 'tabs',
      '#description' => t('Choose the style of tab to use from %bootstrap', array('%bootstrap' => l(t('Bootstrap'), 'https://getbootstrap.com/docs/3.3/components/#nav'))),
      '#options' => array(
        'tabs' => t('Tabs'),
        'pills' => t('Pills'),
      ),
      '#title' => t('Style of tabs'),
      '#type' => 'radios',
    );
    $form['tabposition'] = array(
      '#default_value' => (isset($qt->renderer) && $qt->renderer == 'bootstrap_tabs' && isset($qt->options['tabposition']) && $qt->options['tabposition']) ? $qt->options['tabposition'] : 'basic',
      '#description' => t('Choose the position of tab to use from %bootstrap', array('%bootstrap' => l(t('Bootstrap'), 'https://getbootstrap.com/docs/3.3/components/#nav'))),
      '#options' => array(
        'basic' => t('Tabs/pills on the top'),
        'left' => t('Tabs/pills on the left'),
        'right' => t('Tabs /pills on the right'),
        'below' => t('Tabs/pills on the bottom'),
        'justified' => t('Tabs/pills justified on the top'),
        'stacked' => t('Tabs/pills stacked'),
      ),
      '#title' => t('Position of tabs'),
      '#type' => 'radios',
    );
    $default_effects = [];
    if (isset($qt->renderer) && $qt->renderer == 'bootstrap_tabs' && isset($qt->options['tabeffects']) && $qt->options['tabeffects']) {
      $default_effects[] = 'fade';
    }
    $form['tabeffects'] = array(
      '#default_value' => $default_effects,
      '#description' => t('Select fade effect on or off %bootstrap', array('%bootstrap' => l(t('Bootstrap'), 'https://getbootstrap.com/docs/3.3/javascript/#tabs'))),
      '#options' => array(
        'fade' => t('Fade'),
      ),
      '#title' => t('Effect of tabs'),
      '#type' => 'checkboxes',
    );
    return $form;
  }

  /**
   * Build render array.
   */
  public function render() {
    $quickset = $this->quickset;
    $settings = $this->quickset->getSettings();
    $options = $settings['options'];
    $active_tab = $quickset->getActiveTab();
    $tabs = $this->buildTabLinks($active_tab);
    $qt_name = $quickset->getName();
    $render_array = array(
      'content' => array(
        '#theme' => 'bootstrap_tabs',
        '#options' => array(
          'attributes' => array(
            'id' => 'quicktabs-' . $qt_name,
            'class' => 'tabbable' . ($options['tabposition'] != 'basic' && $options['tabposition'] != 'stacked' && $options['tabposition'] != 'justified' ? ' tabs-' . $options['tabposition'] : ''),
          ),
        ),
        'tabs' => array(
          '#theme' => 'bootstrap_tabs_tabset',
          '#options' => array(
            'active' => $active_tab,
            'style' => $options['tabstyle'],
            'position' => $options['tabposition'],
            'effects' => $options['tabeffects'],
          ),
          'tablinks' => $tabs,
        ),
        'panes' => array(),
      ),
    );
    $count = 1;
    foreach ($quickset->getContents() as $key => $tab) {
      if (!empty($tab)) {
        $attribs = array(
          'id' => 'quicktabs-' . $qt_name . $count,
        );
        $attribs['class'][] = 'tab-pane';
        if ($key == $active_tab) {
          $attribs['class'][] = 'active';
        }
        if (isset($options['tabeffects']) && in_array('fade', $options['tabeffects'], TRUE)) {
          $attribs['class'][] = 'fade';
          if ($key == $active_tab) {
            $attribs['class'][] = 'in';
          }
        }
        $render_array['content']['panes'][] = array(
          '#prefix' => '<div role="tabpanel" ' . drupal_attributes($attribs) . '>',
          '#suffix' => '</div>',
          'content' => $tab->render(),
        );
        $count++;
      }
    }

    return $render_array;
  }

  /**
   * Build the actual tab links, with appropriate href, title and attributes.
   *
   * @param int $active_tab
   *   The index of the active tab.
   *
   * @return array
   *   Tab array.
   */
  protected function buildTabLinks($active_tab) {
    $tabs = array();
    $qt_name = $this->quickset->getName();
    $count = 1;
    foreach ($this->quickset->getContents() as $i => $tab) {
      if (!empty($tab)) {
        $attributes = array(
          'href' => '#quicktabs-' . $qt_name . $count,
          'data-toggle' => 'tab',
          'class' => drupal_html_class($tab->getTitle()),
        );
        $markup = '<a ' . drupal_attributes($attributes) . '>' . check_plain($this->quickset->translateString($tab->getTitle(), 'tab', $i)) . '</a>';
        $tablink = array(
          '#markup' => $markup,
        );
        $tabs[$i] = $tablink;
        $count++;
      }
    }
    return $tabs;
  }

}
