<template>
  <footer class="footer">
    <div class="content">
      <span>Made with
        <font-awesome-icon class="text-secondary" icon='heart'/>
        by
        <a href="https://github.com/rollingflamingo">rollingflamingo</a>
      </span>
    </div>
  </footer>
</template>

<script>

export default {
  name: 'Footer'
}
</script>

<style scoped lang="scss">
@import '../styles/variables';

.footer {
  width: 100%;
  .content {
    font-size: .8rem;
    padding: 2rem 3rem;
    color: lighten($dark, 50);

    a {
      text-decoration: none;
      color: $primary;
      font-weight: bold;
    }
  }
}
</style>
