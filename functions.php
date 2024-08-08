<?php

function update_wp_site_url_in_env() {
    $env_file_path = __DIR__ . '/.env';

    if (!file_exists($env_file_path)) {
        return;
    }

    $env_content = file_get_contents($env_file_path);
    preg_match('/^WP_SITE_URL=(.*)$/m', $env_content, $matches);
    $current_env_url = isset($matches[1]) ? trim($matches[1]) : '';
    $current_site_url = get_site_url();

    if ($current_env_url !== $current_site_url) {
        $new_env_content = preg_replace('/^WP_SITE_URL=.*$/m', 'WP_SITE_URL=' . $current_site_url, $env_content);
        file_put_contents($env_file_path, $new_env_content);
    }
}

add_action('init', 'update_wp_site_url_in_env');
function theme_builder()
{
    wp_enqueue_style('css', get_template_directory_uri() . '/assets/bundle.min.css', 1.0);
    wp_enqueue_script('js', get_template_directory_uri() . '/assets/bundle.min.js', ['jquery'], 1.0, true);
}

add_action('wp_enqueue_scripts', 'theme_builder');

add_theme_support('post-thumbnails');


// menus
register_nav_menus([
    'nav_main' => __('Menu principal'),
    'nav_footer' => __('Menu footer'),
]);


function custom_excerpt_more($more)
{
    return '...';
}
add_filter('excerpt_more', 'custom_excerpt_more');

function custom_excerpt_length($length)
{
    return 20; // Установите желаемую длину отрывка
}
add_filter('excerpt_length', 'custom_excerpt_length', 999);


