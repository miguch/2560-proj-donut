<template>
  <div id="mytask-layout" class="theme-indigo">
    <!-- sidebar -->
    <sidebar></sidebar>
    <!-- main body area -->
    <div class="main px-lg-4 px-md-4">
      <!-- Body:Header -->
      <main_header></main_header>
      <main_body></main_body>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import main_body from "../components/main_body.vue";
import main_header from "../components/main_header.vue";
import sidebar from "../components/sidebar.vue";

export default {
  name: "Home",
  components: {
    main_body,
    main_header,
    sidebar
  }
};
</script>
