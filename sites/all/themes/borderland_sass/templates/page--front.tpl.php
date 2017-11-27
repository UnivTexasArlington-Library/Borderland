<header id="navbar" role="banner" class="<?php print $navbar_classes; ?>">
  <div class="<?php print $container_class; ?>">
    <div class="navbar-header">
      <div class="owners">
        <?php if ($logo): ?>
          <div>
          <a class="logo navbar-btn" href="http://uta.edu" title="<?php print t('University of Texas at Arlington'); ?>">
            <img src="<?php print $logo; ?>" alt="<?php print t('University of Texas at Arlington'); ?>" />
          </a></div>
          <div class="clear">
          <p class="hidden-sm hidden-xs">
            <a class="southwestern" href="http://www.uta.edu/southwesternstudies/" title="<?php print t('UTA Center for Greater Southwestern Studies'); ?>">CENTER FOR GREATER SOUTHWESTERN STUDIES</a>
            
            <a class="library" href="http://library.uta.edu" title="<?php print t('UTA Libraries'); ?>">UTA LIBRARIES</a>
          </p>
        </div>
        <?php endif; ?>
      </div>

      <?php if (!empty($site_name)): ?>
        <a class="name navbar-brand" href="<?php print $front_page; ?>" title="<?php print t('Home'); ?>"><?php print $site_name; ?></a>
      <?php endif; ?>
    </div>
  </div>
</header>

<div class="main-container <?php print $container_class; ?>">

  <header role="banner" id="top-bar">
    <?php if (!empty($site_slogan)): ?>
      <p class="lead"><?php print $site_slogan; ?></p>
    <?php endif; ?>
    <div class="row">
      <div class="col-md-3 col-sm-6 col-xs-9">
        <?php print render($page['search']); ?>
      </div>
      <div class="col-md-3 col-sm-1 col-col-xs-1">
        <?php print render($page['timeline']); ?>
      </div>
      <div class="col-md-6 col-sm-5 col-xs-2">
        <?php print render($page['menu']); ?>
      </div>
    </div>
  </header> <!-- /#page-header -->

  <div class="row">

    <?php if (!empty($page['sidebar_first'])): ?>
      <aside class="col-md-3 hidden-sm hidden-xs" role="complementary">
        <?php print render($page['sidebar_first']); ?>
      </aside>  <!-- /#sidebar-first -->
    <?php endif; ?>

    <section<?php print $content_column_class; ?>>
      <?php if (!empty($page['highlighted'])): ?>
        <div class="highlighted jumbotron"><?php print render($page['highlighted']); ?></div>
      <?php endif; ?>
      <?php if (!empty($breadcrumb)): print $breadcrumb; endif;?>
      <a id="main-content"></a>
      <?php print render($title_prefix); ?>
      <?php if (!empty($title)): ?>
        <h1 class="page-header"><?php print $title; ?></h1>
      <?php endif; ?>
      <?php print render($title_suffix); ?>
      <?php print $messages; ?>
      <?php if (!empty($tabs)): ?>
        <?php print render($tabs); ?>
      <?php endif; ?>
      <?php if (!empty($page['help'])): ?>
        <?php print render($page['help']); ?>
      <?php endif; ?>
      <?php if (!empty($action_links)): ?>
        <ul class="action-links"><?php print render($action_links); ?></ul>
      <?php endif; ?>
      <div id="front"><?php print render($page['content']); ?></div>
    </section>

    <?php if (!empty($page['sidebar_second'])): ?>
      <aside class="col-md-3" role="complementary">
        <?php print render($page['sidebar_second']); ?>
      </aside>  <!-- /#sidebar-second -->
    <?php endif; ?>

  </div>
</div>

<?php if (!empty($page['footer'])): ?>
  <footer class="footer <?php print $container_class; ?>">
    <?php print render($page['footer']); ?>
  </footer>
<?php endif; ?>
