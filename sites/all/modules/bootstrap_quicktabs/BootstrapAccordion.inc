<?php

/**
 * Renders the content using the Bootstrap Accordion widget.
 */
class BootstrapAccordion extends QuickRenderer {

  /**
   * Build render array.
   */
  public function render() {
    $quickset = $this->quickset;
    $content = $quickset->getContents();
    $qsid = 'quickset-' . $quickset->getName();
    // Build our render array.
    $render_array = array();
    $render_array['content'] = array(
      '#theme' => 'bootstrap_accordion',
      '#prefix' => '<div id="panel-group-' . $qsid . '" class="panel-group">',
      '#suffix' => '</div>',
      'divs' => array(),
    );
    $active_tab = $this->quickset->getActiveTab();

    // Render all tab content.
    foreach ($content as $key => $item) {
      if (!empty($item)) {
        $classes = array(
          'panel-collapse',
          'collapse',
        );
        if ($active_tab == $key) {
          $classes[] = 'in';
        }

        $render_array['content']['divs'][] = array(
          '#prefix' => '<div class="panel panel-default"><div class="panel-heading" role="tab" id="heading-' . $qsid . '-' . $key . '">
<h4 class="pane-title"><a role="button" data-toggle="collapse" data-parent="#panel-group-' . $qsid . '" href= "#' . $qsid . '-' .$key . '" aria-expanded="true" aria-controls="' . $qsid . '-' .$key . '">' . check_plain($quickset->translateString($item->getTitle(), 'tab', $key)) . '</a></h4>
</div><div id="' . $qsid . '-' .$key . '" class="' . implode(" ", $classes) . '" role="tabpanel" aria-labelledby="heading-' . $qsid . '-' .$key . '"><div class="panel-body">',
          '#suffix' => '</div></div></div>',
          'content' => $item->render(),
        );
      }
    }
    return $render_array;
  }

}
